// Maintenance script: extract every Markdown link from the repo's *.md files and report
// them. Run with `node scripts/link-check.mjs`.
//
// Network checking is opt-in (set CHECK_LINKS=1) so the default `npm test` stays fast and
// offline-friendly; in that mode the script validates that links are well-formed http(s) URLs.
// The weekly workflow (.github/workflows/links.yml) runs the network check.
//
// Network mode settings (environment variables):
//   MAX_INCONCLUSIVE  largest tolerated share of links that could not be verified (default 0.1)
//   LINK_REPORT       path to write a Markdown report of dead and inconclusive links
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";

// One line per event; warnings and errors go to stderr.
const fmt = (fields, msg) =>
  Object.keys(fields).length ? `${msg} ${JSON.stringify(fields)}` : msg;
const log = {
  info: (fields, msg) => console.log(fmt(fields, msg)),
  warn: (fields, msg) => console.warn(`warning: ${fmt(fields, msg)}`),
  error: (fields, msg) => console.error(`error: ${fmt(fields, msg)}`),
};

const ROOT = process.cwd();
const IGNORE_DIRS = new Set([
  "node_modules",
  ".git",
  "agents",
  "skills",
  "hooks",
  "instructions",
  "plugins",
  "workflows",
  "reports",
]);
const LINK_RE = /\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/g;

/** Recursively collect Markdown files, skipping ignored directories. */
async function collectMarkdown(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      files.push(...(await collectMarkdown(join(dir, entry.name))));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(join(dir, entry.name));
    }
  }
  return files;
}

const files = await collectMarkdown(ROOT);
let total = 0;
let malformed = 0;
const urls = new Map(); // url -> first file seen in

for (const file of files) {
  const content = await readFile(file, "utf8");
  for (const match of content.matchAll(LINK_RE)) {
    total += 1;
    const url = match[1];
    try {
      // eslint-disable-next-line no-new
      new URL(url);
      if (!urls.has(url)) urls.set(url, relative(ROOT, file));
    } catch {
      malformed += 1;
      log.warn({ file: relative(ROOT, file), url }, "malformed link");
    }
  }
}

log.info({ files: files.length, links: total, malformed }, "link extraction complete");

if (malformed > 0) {
  log.error({ malformed }, "found malformed links");
  process.exit(1);
}

if (process.env.CHECK_LINKS === "1") {
  // Some hosts (publishers, CDNs) block unattended clients with 403/405; those are
  // inconclusive rather than dead. 429 and 5xx responses and network errors are retried
  // first, and count as inconclusive if they persist. A run that verifies too few links
  // fails instead of passing on the links it could reach.
  const BLOCKED = new Set([403, 405]);
  const RETRY_DELAYS_MS = [2000, 8000];
  const CONCURRENCY = 4;
  const TIMEOUT_MS = 20000;
  const maxInconclusive = Number(process.env.MAX_INCONCLUSIVE ?? 0.1);
  const dead = [];
  const inconclusive = [];
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  /** Fetch once; returns { status } or { error }. */
  async function probe(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: {
          "user-agent":
            "Mozilla/5.0 (compatible; awesome-list-link-check; +https://github.com/natnew/awesome-recursive-self-improvement)",
        },
      });
      await res.body?.cancel();
      return { status: res.status };
    } catch (err) {
      return { error: err.cause?.code ?? err.message };
    } finally {
      clearTimeout(timer);
    }
  }

  async function checkUrl(url, file) {
    let result = await probe(url);
    for (const delay of RETRY_DELAYS_MS) {
      const transient = result.error || result.status === 429 || result.status >= 500;
      if (!transient) break;
      await sleep(delay);
      result = await probe(url);
    }
    const { status, error } = result;
    if (status >= 200 && status < 400) return;
    if (BLOCKED.has(status) || status === 429 || status >= 500 || error) {
      inconclusive.push({ url, file, reason: error ?? `HTTP ${status}` });
      log.warn({ url, file, status, error }, "inconclusive");
    } else {
      dead.push({ url, file, reason: `HTTP ${status}` });
      log.error({ url, file, status }, "dead link");
    }
  }

  const queue = [...urls.entries()];
  log.info({ urls: queue.length }, "network check starting");
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (queue.length > 0) {
        const [url, file] = queue.shift();
        await checkUrl(url, file);
      }
    }),
  );

  const share = urls.size ? inconclusive.length / urls.size : 0;
  const tooManyInconclusive = share > maxInconclusive;
  log.info(
    { checked: urls.size, dead: dead.length, inconclusive: inconclusive.length, maxInconclusive },
    "network check complete",
  );

  if (process.env.LINK_REPORT) {
    const rows = (items) => items.map((i) => `| ${i.url} | ${i.file} | ${i.reason} |`).join("\n");
    const table = (title, items) =>
      items.length
        ? `\n### ${title}\n\n| URL | File | Result |\n| --- | --- | --- |\n${rows(items)}\n`
        : "";
    const report = [
      `Checked ${urls.size} unique links: ${dead.length} dead, ${inconclusive.length} inconclusive ` +
        `(${Math.round(share * 100)}% unverified; the limit is ${Math.round(maxInconclusive * 100)}%).`,
      table("Dead links", dead),
      table("Inconclusive links", inconclusive),
      "\nReplace dead links with the canonical source, or remove the entry if none exists " +
        "(see the broken-link workflow in AGENTS.md). Inconclusive links usually mean the host " +
        "blocked the checker; spot-check them in a browser.",
    ].join("\n");
    await writeFile(process.env.LINK_REPORT, `${report}\n`);
  }

  if (dead.length > 0) log.error({ dead: dead.length }, "found dead links");
  if (tooManyInconclusive) {
    log.error(
      { unverified: `${Math.round(share * 100)}%`, limit: `${Math.round(maxInconclusive * 100)}%` },
      "too many links could not be verified",
    );
  }
  if (dead.length > 0 || tooManyInconclusive) process.exit(1);
}
