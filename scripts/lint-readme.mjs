// Entry-contract linter for README.md. It enforces the rules in CONTRIBUTING.md and AGENTS.md
// that can be checked deterministically: entry format, recency, the closed Foundations
// section, link hygiene, duplicates, and the integrity of Contents, the Field Map, and the
// Reading Paths. Judgement calls (scope, neutrality, source fidelity) stay with reviewers.
//
// Run with `node scripts/lint-readme.mjs [file]`; exits 1 and prints one line per problem.
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/** Sections that are navigation or meta, not lists of resources. */
const NON_CONTENT = new Set(["Contents", "Field Map", "Reading Paths", "Contributing"]);
/** Foundations is closed; changing this number needs maintainer approval. */
const FOUNDATIONS_SIZE = 5;
const MIN_YEAR = 2022;

const ENTRY_RE =
  /^- \[(?<name>[^\]]+)\]\((?<url>[^)\s]+)\)(?: \((?<venue>[^()]+?) (?<year>\d{4})\))?(?<code> \\\[\[code\]\((?<codeUrl>[^)\s]+)\)\\\])? - (?<desc>.+)$/;
const SHORTENERS = /^(?:bit\.ly|t\.co|tinyurl\.com|goo\.gl|ow\.ly|buff\.ly|lnkd\.in)$/;
const HYPE =
  /\b(?:groundbreaking|state-of-the-art|must-read|revolutionary|cutting-edge|best|latest|leading|fastest|most advanced)\b/i;

/** GitHub's heading-anchor slug: lowercase, drop punctuation, spaces to hyphens. */
export function slug(heading) {
  return heading
    .toLowerCase()
    .replace(/[^\p{L}\p{N} -]/gu, "")
    .replace(/ /g, "-");
}

/** Normalise an arXiv URL to its bare ID so abs/, pdf/, html/ and vN forms collide. */
function arxivId(url) {
  const m = url.match(/arxiv\.org\/(?:abs|pdf|html)\/([^?#]+?)(?:v\d+)?(?:\.pdf)?(?:[?#].*)?$/);
  return m ? m[1] : null;
}

function checkUrl(url, where, report) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    report(where, `malformed URL ${url}`);
    return;
  }
  if (parsed.protocol !== "https:") report(where, `use HTTPS: ${url}`);
  if (SHORTENERS.test(parsed.hostname)) report(where, `URL shortener: ${url}`);
  for (const key of parsed.searchParams.keys()) {
    if (/^utm_|^fbclid$|^ref$/.test(key)) report(where, `tracking parameter "${key}": ${url}`);
  }
  if (/arxiv\.org\/pdf\//.test(url)) report(where, `link the arXiv abs/ page, not the PDF: ${url}`);
}

/**
 * Lint README text. `fileExists` resolves relative links; it defaults to "everything exists"
 * so the function stays pure for tests.
 * @param {string} text
 * @param {{ fileExists?: (path: string) => boolean }} [options]
 * @returns {string[]} problems, each prefixed with its line number
 */
export function lintReadme(text, { fileExists = () => true } = {}) {
  const problems = [];
  const report = (line, msg) => problems.push(`line ${line}: ${msg}`);
  const lines = text.split("\n");

  // Pass 1: headings and the body of each level-2 section.
  const sections = []; // { title, line, body: [{ n, text }] }
  let current = null;
  let inFence = false;
  lines.forEach((raw, i) => {
    const n = i + 1;
    if (raw.startsWith("```")) inFence = !inFence;
    const h2 = !inFence && raw.match(/^## (.+)$/);
    if (h2) {
      current = { title: h2[1], line: n, body: [] };
      sections.push(current);
    } else if (current) {
      current.body.push({ n, text: raw });
    }
  });
  const titles = sections.map((s) => s.title);
  const content = sections.filter((s) => !NON_CONTENT.has(s.title));

  // Contents must list every other level-2 heading, in order, with the right anchor.
  const contents = sections.find((s) => s.title === "Contents");
  if (!contents) {
    report(1, "missing ## Contents");
  } else {
    const items = contents.body
      .map(({ n, text }) => ({ n, m: text.match(/^- \[([^\]]+)\]\(#([^)]+)\)$/) }))
      .filter(({ m }) => m);
    const expected = titles.filter((t) => t !== "Contents" && t !== "Contributing");
    const listed = items.map(({ m }) => m[1]);
    if (listed.join("\n") !== expected.join("\n")) {
      report(contents.line, `Contents must list, in order: ${expected.join(" | ")}`);
    }
    for (const { n, m } of items) {
      if (m[2] !== slug(m[1])) report(n, `Contents anchor #${m[2]} should be #${slug(m[1])}`);
    }
  }

  // Entries: format, recency, venue rules, link hygiene, and duplicates.
  const entriesBySection = new Map();
  const seenUrl = new Map();
  const seenArxiv = new Map();
  for (const section of content) {
    const names = new Set();
    entriesBySection.set(section.title, names);
    let count = 0;
    for (const { n, text: line } of section.body) {
      if (!line.startsWith("- ")) continue;
      count += 1;
      if (/(?<!\\)\[\[code\]\(/.test(line)) {
        report(n, "escape the code link as \\[[code](URL)\\] so awesome-lint passes");
        continue;
      }
      const m = line.match(ENTRY_RE);
      if (!m) {
        report(n, "entry does not match `- [Name](URL) (Venue Year) \\[[code](URL)\\] - Description.`");
        continue;
      }
      const { name, url, venue, year, codeUrl, desc } = m.groups;
      names.add(name);

      const bare = section.title === "Frameworks and Implementations" || section.title === "Related Awesome Lists";
      if (bare && venue) report(n, `${section.title} entries take no (Venue Year) tag`);
      if (bare && codeUrl) report(n, `${section.title} entries link the repository directly, not as [code]`);
      if (section.title === "Frameworks and Implementations" && !url.startsWith("https://github.com/")) {
        report(n, "Frameworks and Implementations entries link the GitHub repository");
      }
      if (year) {
        const y = Number(year);
        if (section.title === "Foundations" && y >= MIN_YEAR) report(n, `Foundations holds pre-${MIN_YEAR} work only`);
        if (section.title !== "Foundations" && y < MIN_YEAR) report(n, `resources must be from ${MIN_YEAR} onwards (got ${y})`);
      }
      if (codeUrl && !/^https:\/\/(github\.com|gitlab\.com)\//.test(codeUrl)) {
        report(n, `code link should point to the official repository: ${codeUrl}`);
      }

      if (!/^[A-Z]/.test(desc)) report(n, "description starts with a capital letter");
      if (!desc.endsWith(".")) report(n, "description ends with a full stop");
      if (/[.!?] [A-Z]/.test(desc.slice(0, -1))) report(n, "description is one sentence");
      const hype = desc.match(HYPE);
      if (hype) report(n, `promotional or time-sensitive wording: "${hype[0]}"`);

      for (const u of [url, codeUrl].filter(Boolean)) {
        checkUrl(u, n, report);
        const key = u.replace(/\/+$/, "").toLowerCase();
        if (seenUrl.has(key)) report(n, `duplicate URL, also on line ${seenUrl.get(key)}: ${u}`);
        else seenUrl.set(key, n);
      }
      const id = arxivId(url);
      if (id) {
        if (seenArxiv.has(id)) report(n, `duplicate arXiv ID ${id}, also on line ${seenArxiv.get(id)}`);
        else seenArxiv.set(id, n);
      }
    }
    if (section.title === "Foundations" && count !== FOUNDATIONS_SIZE) {
      report(section.line, `Foundations is closed at ${FOUNDATIONS_SIZE} entries (found ${count})`);
    }
  }

  // Field Map: every content section except Related Awesome Lists appears exactly once.
  const mapSection = sections.find((s) => s.title === "Field Map");
  const mermaid = mapSection
    ? mapSection.body
        .map((l) => l.text)
        .join("\n")
        .match(/```mermaid\n([\s\S]*?)```/)
    : null;
  if (!mermaid) {
    report(mapSection?.line ?? 1, "Field Map must contain a mermaid block");
  } else {
    const labels = [...mermaid[1].matchAll(/"([^"]*)"/g)].flatMap((m) => m[1].split("<br/>"));
    for (const s of content) {
      if (s.title === "Related Awesome Lists") continue;
      const hits = labels.filter((l) => l === s.title).length;
      if (hits !== 1) report(mapSection.line, `Field Map must name "${s.title}" exactly once (found ${hits})`);
    }
  }

  // Reading Paths: each table row names an entry that exists in the named section.
  const paths = sections.find((s) => s.title === "Reading Paths");
  if (paths) {
    for (const { n, text: line } of paths.body) {
      const cells = line.match(/^\| *(\d+) *\| *(.+?) *\| *(.+?) *\| *(.+?) *\|$/);
      if (!cells) continue;
      const [, , entry, section] = cells;
      const names = entriesBySection.get(section);
      if (!names) report(n, `Reading Paths names unknown section "${section}"`);
      else if (!names.has(entry)) report(n, `Reading Paths entry "${entry}" is not listed under ${section}`);
    }
  }

  // Relative links (badges, guide links) must resolve to files in the repository.
  lines.forEach((line, i) => {
    for (const m of line.matchAll(/\]\((?!https?:|#|mailto:)([^)#\s]+)(?:#[^)]*)?\)/g)) {
      if (!fileExists(m[1])) report(i + 1, `relative link to missing file ${m[1]}`);
    }
  });

  return problems;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const file = resolve(process.argv[2] ?? "README.md");
  const problems = lintReadme(readFileSync(file, "utf8"), {
    fileExists: (p) => existsSync(resolve(dirname(file), p)),
  });
  for (const p of problems) console.error(`${file}: ${p}`);
  if (problems.length > 0) {
    console.error(`lint-readme: ${problems.length} problem(s)`);
    process.exit(1);
  }
  console.log("lint-readme: README.md follows the entry contract");
}
