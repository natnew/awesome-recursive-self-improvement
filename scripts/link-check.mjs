// Maintenance script: extract every Markdown link from the repo's *.md files and report
// them. Run with `node scripts/link-check.mjs`.
//
// Network checking is opt-in (set CHECK_LINKS=1) so the default `npm test` stays fast and
// offline-friendly; in that mode the script validates that links are well-formed http(s) URLs.
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

/** One JSON line per event, so CI logs stay greppable without a logging dependency. */
const log = Object.fromEntries(
  ["info", "warn", "error"].map((level) => [
    level,
    (fields, msg) =>
      console[level === "info" ? "log" : level](JSON.stringify({ level, msg, ...fields })),
  ]),
);

const ROOT = process.cwd();
// Skipped at any depth.
const IGNORE_ANYWHERE = new Set(["node_modules", ".git"]);
// The maintainer's git-ignored local AI-tooling folders. Skipped only at the repository root,
// so the committed .github/agents/ and .github/skills/ are still checked.
const IGNORE_AT_ROOT = new Set([
  "agents",
  "skills",
  "hooks",
  "instructions",
  "plugins",
  "workflows",
]);
const LINK_RE = /\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/g;

/** Recursively collect Markdown files, skipping ignored directories. */
async function collectMarkdown(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (IGNORE_ANYWHERE.has(entry.name)) continue;
      if (dir === ROOT && IGNORE_AT_ROOT.has(entry.name)) continue;
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
  // Some hosts (publishers, CDNs) block unattended clients with 403/405/429;
  // those are logged as inconclusive rather than failed.
  const INCONCLUSIVE = new Set([403, 405, 429]);
  const CONCURRENCY = 5;
  let dead = 0;
  let inconclusive = 0;

  async function checkUrl(url, file) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: { "user-agent": "awesome-list-link-check" },
      });
      if (res.ok) return;
      if (INCONCLUSIVE.has(res.status)) {
        inconclusive += 1;
        log.warn({ url, file, status: res.status }, "inconclusive (likely bot blocking)");
        return;
      }
      dead += 1;
      log.error({ url, file, status: res.status }, "dead link");
    } catch (err) {
      dead += 1;
      log.error({ url, file, err: err.message }, "unreachable link");
    } finally {
      clearTimeout(timer);
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

  log.info({ checked: urls.size, dead, inconclusive }, "network check complete");
  if (dead > 0) {
    log.error({ dead }, "found dead links");
    process.exit(1);
  }
}
