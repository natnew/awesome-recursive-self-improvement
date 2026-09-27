// Tests for lint-list.mjs: the real README must pass, and each rule must catch a
// targeted mutation of it. Run with `node --test scripts/lint-list.test.mjs`.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { lint, lintIssueForm } from "./lint-list.mjs";

const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");
const form = await readFile(
  new URL("../.github/ISSUE_TEMPLATE/suggest-resource.yml", import.meta.url),
  "utf8",
);

test("the suggestion form's section dropdown matches the README", () => {
  assert.deepEqual(lintIssueForm(readme, form), []);
  const renamed = readme.replace("## Self-Evolving Agents", "## Self-Evolving Agent Systems");
  assert.match(lintIssueForm(renamed, form)[0].message, /section options must be/);
  const withFoundations = form.replace(
    "        - Surveys and Overviews",
    "        - Foundations\n        - Surveys and Overviews",
  );
  assert.match(lintIssueForm(readme, withFoundations)[0].message, /section options must be/);
});

/** Replace the first occurrence of `from` and assert it existed. */
function mutate(from, to) {
  assert.ok(readme.includes(from), `fixture text not found: ${from}`);
  return readme.replace(from, to);
}

/** Assert that linting `markdown` reports a problem matching `pattern`. */
function assertFlags(markdown, pattern) {
  const messages = lint(markdown).map((p) => p.message);
  assert.ok(
    messages.some((m) => pattern.test(m)),
    `expected a problem matching ${pattern}, got: ${JSON.stringify(messages)}`,
  );
}

const SELF_REFINE =
  "- [Self-Refine: Iterative Refinement with Self-Feedback](https://arxiv.org/abs/2303.17651)";

test("the README passes", () => {
  assert.deepEqual(lint(readme), []);
});

test("entry format", () => {
  assertFlags(
    mutate(SELF_REFINE, "- Self-Refine https://arxiv.org/abs/2303.17651"),
    /does not match/,
  );
});

test("description is one capitalised sentence with a full stop", () => {
  const line =
    "Introduces an iterative self-feedback method for improving model outputs without additional training.";
  assertFlags(mutate(line, line.slice(0, -1)), /full stop/);
  assertFlags(mutate(line, `introduces${line.slice(10)}`), /capital letter/);
  assertFlags(mutate(line, `${line} It also refines code.`), /one sentence/);
  assertFlags(mutate(line, line.replace("iterative", "groundbreaking")), /promotional/);
});

test("URLs are canonical", () => {
  assertFlags(
    mutate("https://arxiv.org/abs/2303.17651", "https://arxiv.org/pdf/2303.17651"),
    /abs\/ page/,
  );
  assertFlags(
    mutate("https://arxiv.org/abs/2303.17651", "http://arxiv.org/abs/2303.17651"),
    /HTTPS/,
  );
  assertFlags(
    mutate("https://arxiv.org/abs/2303.17651", "https://arxiv.org/abs/2303.17651?utm_source=x"),
    /tracking/,
  );
  assertFlags(mutate("https://arxiv.org/abs/2303.17651", "https://bit.ly/abc"), /shortener/);
});

test("dated sources carry a venue tag", () => {
  assertFlags(mutate(`${SELF_REFINE} (arXiv 2023)`, SELF_REFINE), /Venue Year/);
});

test("duplicates are caught by URL, arXiv ID, and name", () => {
  assertFlags(
    mutate("https://arxiv.org/abs/2409.12917", "https://arxiv.org/abs/2303.17651"),
    /duplicate (URL|arXiv)/,
  );
  assertFlags(
    mutate("https://arxiv.org/abs/2409.12917", "https://arxiv.org/abs/2303.17651v2"),
    /duplicate arXiv ID 2303\.17651/,
  );
  assertFlags(
    mutate(
      "[Training Language Models to Self-Correct via Reinforcement Learning]",
      "[Self-Refine: Iterative Refinement with Self-Feedback]",
    ),
    /duplicate entry name/,
  );
});

test("Frameworks entries are repositories not already linked as [code]", () => {
  assertFlags(
    mutate("- [DSPy](https://github.com/stanfordnlp/dspy)", "- [DSPy](https://dspy.ai)"),
    /repository/,
  );
  assertFlags(
    mutate("https://github.com/stanfordnlp/dspy", "https://github.com/madaan/self-refine"),
    /already linked as \[code\]/,
  );
  assertFlags(
    mutate(
      "- [DSPy](https://github.com/stanfordnlp/dspy)",
      "- [DSPy](https://github.com/stanfordnlp/dspy) (arXiv 2023)",
    ),
    /no venue tag/,
  );
});

test("Foundations is closed and the recency floor holds elsewhere", () => {
  const goedel = "(arXiv 2003)";
  assertFlags(mutate(`${SELF_REFINE} (arXiv 2023)`, `${SELF_REFINE} (arXiv 2021)`), /2022 onwards/);
  assertFlags(mutate(goedel, "(arXiv 2023)"), /pre-2022/);
  const extra =
    "- [Extra Landmark](https://arxiv.org/abs/1111.11111) (arXiv 2011) - Adds a sixth landmark.\n";
  assertFlags(
    mutate("\n## Self-Refinement and Reflection", `${extra}\n## Self-Refinement and Reflection`),
    /Foundations is closed/,
  );
});

test("Contents matches the section headings", () => {
  assertFlags(mutate("- [Foundations](#foundations)\n", ""), /Contents must list/);
  assertFlags(mutate("(#foundations)", "(#foundation)"), /anchor/);
});

test("the Field Map names every list section once", () => {
  assertFlags(mutate("<br/>Foundations", ""), /Field Map must name "Foundations" once; found 0/);
});

test("Reading Paths name existing entries in the stated section", () => {
  assertFlags(
    mutate(
      "| 3    | Self-Refine: Iterative Refinement with Self-Feedback",
      "| 3    | Self-Refine Renamed",
    ),
    /not an entry/,
  );
  assertFlags(
    mutate(
      "| Self-Refinement and Reflection                | The simplest",
      "| Self-Refinement                               | The simplest",
    ),
    /no section/,
  );
});
