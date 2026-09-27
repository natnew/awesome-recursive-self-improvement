// Offline linter for README.md: checks every list entry against the entry rules in
// CONTRIBUTING.md and checks that the README's navigation (Contents, Field Map, Reading
// Paths) matches its sections. Run with `node scripts/lint-list.mjs [file]`.
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

// Sections holding maintained tools or other lists rather than dated papers.
const UNDATED_SECTIONS = new Set(["Frameworks and Implementations", "Related Awesome Lists"]);
// Headings that are README scaffolding rather than list sections.
const NON_LIST_HEADINGS = new Set(["Contents", "Field Map", "Reading Paths", "Contributing"]);
// The Foundations section is closed: it holds exactly this many pre-2022 landmarks.
const FOUNDATIONS = { name: "Foundations", size: 5 };
const RECENCY_YEAR = 2022;
const REPO_HOSTS = new Set(["github.com", "gitlab.com", "codeberg.org"]);
const SHORTENER_HOSTS = new Set(["bit.ly", "t.co", "tinyurl.com", "goo.gl", "ow.ly", "buff.ly"]);
const TRACKING_PARAM = /^(utm_\w+|fbclid|gclid|ref|ref_src)$/i;
const HYPE = /\b(groundbreaking|state-of-the-art|must-read|revolutionary|cutting-edge|world-class|best-in-class)\b/i;

const ENTRY =
  /^- \[(?<name>[^\]]+)\]\((?<url>[^)\s]+)\)(?: \((?<venue>[^()]+) (?<year>\d{4})\))?(?: \\\[\[code\]\((?<code>[^)\s]+)\)\\\])? - (?<desc>.+)$/;
const ARXIV_ID = /arxiv\.org\/(?:abs|pdf)\/([a-z-]*\/?\d{4}\.?\d{4,5})/i;

/** Lowercase host, drop "www.", fragment, and trailing slash, for duplicate detection. */
function normaliseUrl(url) {
  const u = new URL(url);
  const path = u.pathname.replace(/\/+$/, "");
  return `${u.hostname.replace(/^www\./, "").toLowerCase()}${path}${u.search}`.toLowerCase();
}

/** Check one URL for scheme, arXiv form, tracking parameters, and shorteners. */
function urlProblems(url) {
  let u;
  try {
    u = new URL(url);
  } catch {
    return [`malformed URL ${url}`];
  }
  const problems = [];
  if (u.protocol !== "https:") problems.push(`use HTTPS: ${url}`);
  if (/arxiv\.org\/pdf\//i.test(url)) problems.push(`link the arXiv abs/ page, not the PDF: ${url}`);
  if (SHORTENER_HOSTS.has(u.hostname)) problems.push(`URL shortener: ${url}`);
  for (const key of u.searchParams.keys()) {
    if (TRACKING_PARAM.test(key)) problems.push(`tracking parameter "${key}": ${url}`);
  }
  return problems;
}

/** Split the README into `## ` sections with their starting line numbers. */
function parseSections(lines) {
  const sections = [];
  lines.forEach((text, i) => {
    const heading = /^## (.+)$/.exec(text);
    if (heading) sections.push({ name: heading[1], line: i + 1, lines: [] });
    else if (sections.length) sections.at(-1).lines.push({ text, line: i + 1 });
  });
  return sections;
}

/** GitHub-style anchor for a heading. */
const anchor = (heading) =>
  heading
    .toLowerCase()
    .replace(/[^\p{L}\p{N} -]/gu, "")
    .replace(/ /g, "-");

/** Lint README text. Returns a list of { line, message } problems; empty means clean. */
export function lint(markdown) {
  const problems = [];
  const report = (line, message) => problems.push({ line, message });
  const lines = markdown.split("\n");
  const sections = parseSections(lines);
  const listSections = sections.filter((s) => !NON_LIST_HEADINGS.has(s.name));

  const seenUrls = new Map();
  const seenArxiv = new Map();
  const seenNames = new Map();
  const entriesBySection = new Map();
  const frameworkRepos = [];
  const codeRepos = new Map();

  for (const section of listSections) {
    const names = new Set();
    entriesBySection.set(section.name, names);
    const entries = section.lines.filter((l) => l.text.startsWith("- "));
    const undated = UNDATED_SECTIONS.has(section.name);

    if (section.name === FOUNDATIONS.name && entries.length !== FOUNDATIONS.size) {
      report(
        section.line,
        `Foundations is closed and holds exactly ${FOUNDATIONS.size} entries; found ${entries.length}`,
      );
    }

    for (const { text, line } of entries) {
      const m = ENTRY.exec(text);
      if (!m) {
        report(line, "entry does not match `- [Name](URL) (Venue Year) \\[[code](URL)\\] - Description.`");
        continue;
      }
      const { name, url, venue, year, code, desc } = m.groups;
      names.add(name);

      for (const p of urlProblems(url)) report(line, p);
      if (code) for (const p of urlProblems(code)) report(line, `code link: ${p}`);

      if (undated && (venue || code)) {
        report(line, `entries in "${section.name}" take no venue tag or code link`);
      }
      if (section.name === "Frameworks and Implementations" && !REPO_HOSTS.has(new URL(url).hostname)) {
        report(line, "Frameworks and Implementations entries link the project's repository");
      }
      if (!undated && !venue && /arxiv\.org|openreview\.net|aclanthology\.org|nature\.com/.test(url)) {
        report(line, "dated source needs a (Venue Year) tag");
      }
      if (year) {
        const y = Number(year);
        if (section.name === FOUNDATIONS.name && y >= RECENCY_YEAR) {
          report(line, `Foundations holds pre-${RECENCY_YEAR} landmarks only`);
        } else if (section.name !== FOUNDATIONS.name && y < RECENCY_YEAR) {
          report(line, `resources must be from ${RECENCY_YEAR} onwards (Foundations is closed)`);
        }
      }

      if (!/^[A-Z]/.test(desc)) report(line, "description must start with a capital letter");
      if (!desc.endsWith(".")) report(line, "description must end with a full stop");
      if (/[.!?]\s+[A-Z]/.test(desc.slice(0, -1))) report(line, "description must be one sentence");
      const hype = HYPE.exec(desc);
      if (hype) report(line, `avoid promotional wording: "${hype[0]}"`);

      const key = normaliseUrl(url);
      if (seenUrls.has(key)) report(line, `duplicate URL (also on line ${seenUrls.get(key)})`);
      else seenUrls.set(key, line);
      if (seenNames.has(name)) report(line, `duplicate entry name (also on line ${seenNames.get(name)})`);
      else seenNames.set(name, line);
      for (const link of [url, code].filter(Boolean)) {
        const id = ARXIV_ID.exec(link)?.[1];
        if (!id) continue;
        if (seenArxiv.has(id)) report(line, `duplicate arXiv ID ${id} (also on line ${seenArxiv.get(id)})`);
        else seenArxiv.set(id, line);
      }
      if (section.name === "Frameworks and Implementations") frameworkRepos.push({ key, line });
      if (code) codeRepos.set(normaliseUrl(code), line);
    }
  }

  for (const { key, line } of frameworkRepos) {
    if (codeRepos.has(key)) {
      report(line, `repository is already linked as [code] on line ${codeRepos.get(key)}`);
    }
  }

  // Contents lists every section heading after it, in order, with the right anchors.
  const contents = sections.find((s) => s.name === "Contents");
  if (!contents) {
    report(1, "missing ## Contents section");
  } else {
    const expected = sections.filter((s) => s.line > contents.line && s.name !== "Contributing");
    const items = contents.lines
      .map(({ text, line }) => ({ m: /^- \[(.+)\]\(#(.+)\)$/.exec(text), line }))
      .filter(({ m }) => m);
    const listed = items.map(({ m }) => m[1]);
    if (listed.join("\n") !== expected.map((s) => s.name).join("\n")) {
      report(contents.line, `Contents must list, in order: ${expected.map((s) => s.name).join(", ")}`);
    }
    for (const { m, line } of items) {
      if (m[2] !== anchor(m[1])) report(line, `Contents anchor for "${m[1]}" should be #${anchor(m[1])}`);
    }
  }

  // The Field Map names every list section exactly once.
  const mermaid = /```mermaid\n([\s\S]*?)```/.exec(markdown)?.[1];
  const fieldMap = sections.find((s) => s.name === "Field Map");
  if (!mermaid) {
    report(fieldMap?.line ?? 1, "missing Field Map mermaid diagram");
  } else {
    const labels = [...mermaid.matchAll(/\["([^"]*)"\]/g)].flatMap((l) =>
      l[1].split("<br/>").map((s) => s.trim()),
    );
    for (const section of listSections.filter((s) => s.name !== "Related Awesome Lists")) {
      const count = labels.filter((l) => l === section.name).length;
      if (count !== 1) report(fieldMap.line, `Field Map must name "${section.name}" once; found ${count}`);
    }
  }

  // Reading Paths name entries that exist in the stated section.
  const paths = sections.find((s) => s.name === "Reading Paths");
  for (const { text, line } of paths?.lines ?? []) {
    const row = /^\| (\d+)\s+\| (.+?)\s+\| (.+?)\s+\| .+ \|$/.exec(text);
    if (!row) continue;
    const [, , entry, section] = row;
    if (!entriesBySection.has(section)) report(line, `Reading Paths: no section "${section}"`);
    else if (!entriesBySection.get(section).has(entry)) {
      report(line, `Reading Paths: "${entry}" is not an entry in "${section}"`);
    }
  }

  return problems.sort((a, b) => a.line - b.line);
}

// CLI: lint the given file (default README.md) and exit non-zero on problems.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const file = process.argv[2] ?? "README.md";
  const problems = lint(await readFile(file, "utf8"));
  for (const { line, message } of problems) console.error(`${file}:${line}: ${message}`);
  if (problems.length) {
    console.error(`\n${problems.length} problem(s). The rules are in CONTRIBUTING.md.`);
    process.exit(1);
  }
  console.log(`${file}: list lint passed`);
}
