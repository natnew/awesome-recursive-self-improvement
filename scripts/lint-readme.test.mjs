// Regression tests for scripts/lint-readme.mjs. Run with `node --test scripts/`.
import { test } from "node:test";
import assert from "node:assert/strict";
import { lintReadme, slug } from "./lint-readme.mjs";

const foundations = [2003, 2011, 2017, 2019, 2019]
  .map((y, i) => `- [Old ${i}](https://example.org/old-${i}) (arXiv ${y}) - Landmark ${i}.`)
  .join("\n");

/** A minimal README that passes; each test breaks one rule. */
function readme({ entry, extraEntry = "", frameworks, path } = {}) {
  return `# Awesome Test

## Contents

- [Field Map](#field-map)
- [Reading Paths](#reading-paths)
- [Foundations](#foundations)
- [Self-Refinement and Reflection](#self-refinement-and-reflection)
- [Frameworks and Implementations](#frameworks-and-implementations)

## Field Map

\`\`\`mermaid
flowchart TD
    entry["Entry points<br/>Foundations"] --> loop
    evaluate["Evaluate<br/>Self-Refinement and Reflection"]
    tools["Frameworks and Implementations<br/>tooling"] -.-> loop
\`\`\`

## Reading Paths

| Step | Entry | Section | Why |
| --- | --- | --- | --- |
${path ?? "| 1 | Self-Refine | Self-Refinement and Reflection | The simplest loop. |"}

## Foundations

${foundations}

## Self-Refinement and Reflection

${entry ?? "- [Self-Refine](https://arxiv.org/abs/2303.17651) (arXiv 2023) \\[[code](https://github.com/madaan/self-refine)\\] - Refines outputs with self-feedback."}
${extraEntry}

## Frameworks and Implementations

${frameworks ?? "- [DSPy](https://github.com/stanfordnlp/dspy) - Framework for optimising language-model programs."}

## Contributing

See the guide.
`;
}

const lint = (opts) => lintReadme(readme(opts));
const expectProblem = (opts, pattern) => {
  const problems = lint(opts);
  assert.ok(
    problems.some((p) => pattern.test(p)),
    `expected ${pattern} in:\n${problems.join("\n") || "(no problems)"}`,
  );
};

test("a well-formed README passes", () => {
  assert.deepEqual(lint(), []);
});

test("slug matches GitHub anchors", () => {
  assert.equal(slug("Evaluation, Verification, and Benchmarks"), "evaluation-verification-and-benchmarks");
});

test("entry format", () => {
  expectProblem({ entry: "- [X](https://example.org/x) (arXiv 2024): Missing dash." }, /does not match/);
  expectProblem({ entry: "- [X](https://example.org/x) (arXiv 2024) - lower case start." }, /capital letter/);
  expectProblem({ entry: "- [X](https://example.org/x) (arXiv 2024) - No full stop" }, /full stop/);
  expectProblem({ entry: "- [X](https://example.org/x) (arXiv 2024) - One. Two sentences." }, /one sentence/);
  expectProblem({ entry: "- [X](https://example.org/x) (arXiv 2024) - The best method." }, /promotional/);
});

test("unescaped code link", () => {
  expectProblem(
    { entry: "- [X](https://example.org/x) (arXiv 2024) [[code](https://github.com/a/b)] - Does x." },
    /escape the code link/,
  );
});

test("recency and the closed Foundations section", () => {
  expectProblem({ entry: "- [X](https://example.org/x) (arXiv 2019) - Does x." }, /2022 onwards/);
  const r = readme().replace(foundations, `${foundations}\n- [New](https://example.org/new) (arXiv 2018) - Extra.`);
  assert.ok(lintReadme(r).some((p) => /closed at 5/.test(p)));
});

test("link hygiene", () => {
  expectProblem({ entry: "- [X](http://example.org/x) (arXiv 2024) - Does x." }, /HTTPS/);
  expectProblem({ entry: "- [X](https://arxiv.org/pdf/2401.00001) (arXiv 2024) - Does x." }, /abs\/ page/);
  expectProblem({ entry: "- [X](https://example.org/x?utm_source=a) (arXiv 2024) - Does x." }, /tracking/);
  expectProblem({ entry: "- [X](https://bit.ly/abc) (arXiv 2024) - Does x." }, /shortener/);
});

test("duplicates across URL forms", () => {
  expectProblem(
    { extraEntry: "- [Again](https://arxiv.org/abs/2303.17651v2) (arXiv 2023) - Same paper." },
    /duplicate arXiv ID 2303\.17651/,
  );
  expectProblem(
    { frameworks: "- [Self-Refine](https://github.com/madaan/self-refine) - Repository already linked as code." },
    /duplicate URL/,
  );
});

test("Frameworks entries are bare repository links", () => {
  expectProblem({ frameworks: "- [DSPy](https://github.com/stanfordnlp/dspy) (arXiv 2023) - Framework." }, /no \(Venue Year\)/);
  expectProblem({ frameworks: "- [DSPy](https://dspy.ai/) - Framework." }, /GitHub repository/);
});

test("navigation stays in sync", () => {
  expectProblem({ path: "| 1 | Not Listed | Self-Refinement and Reflection | Why. |" }, /not listed/);
  expectProblem({ path: "| 1 | Self-Refine | No Such Section | Why. |" }, /unknown section/);
  assert.ok(lintReadme(readme().replace("- [Foundations](#foundations)\n", "")).some((p) => /Contents must list/.test(p)));
  assert.ok(lintReadme(readme().replace("<br/>Foundations", "")).some((p) => /Field Map must name "Foundations"/.test(p)));
});

test("relative links must resolve", () => {
  const r = `${readme()}\n[guide](MISSING.md)\n`;
  assert.ok(lintReadme(r, { fileExists: () => false }).some((p) => /missing file MISSING\.md/.test(p)));
});
