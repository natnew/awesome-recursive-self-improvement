---
name: scout-rsi-papers
description: "Sweep arXiv, OpenReview, and official lab blogs for new resources on recursive self-improvement in AI, dedupe against README.md, and produce candidate entries in the exact CONTRIBUTING.md format with section placement rationale."
---

# Scout RSI Papers

You are scouting new resources for the `awesome-recursive-self-improvement` list. The output of this skill is a set of **candidate entries for maintainer review** — never edit `README.md` directly.

## Inputs

- Optional: a theme or README section to focus on (e.g. "test-time adaptation", "safety"). Default: a full-field sweep across all themes below.
- Optional: a time window (e.g. "last 3 months"). Default: since the most recent entries already in the list.

## Sources (sweep in this order)

1. **arXiv** — listings and search across `cs.AI`, `cs.LG`, `cs.CL` (use `https://arxiv.org/list/cs.AI/recent` or arXiv search/API queries).
2. **OpenReview** — accepted papers for the current ICLR/NeurIPS/ICML cycles, including the ICLR Workshop on Recursive Self-Improvement.
3. **Official lab blogs** — Anthropic, Google DeepMind, OpenAI, Meta AI (FAIR), Sakana AI. Blog posts qualify only when they are the primary source for a system (e.g. AlphaEvolve).
4. **ACL Anthology** — for published versions of NLP papers.

## Query list by theme

Run searches combining the theme terms with year qualifiers for recency:

| Theme (target section)                 | Search strings                                                                                                          |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Self-refinement and reflection         | "self-refine LLM", "self-correction language model", "intrinsic self-verification"                                      |
| Test-time adaptation                   | "test-time training LLM", "test-time reinforcement learning", "inference-time self-improvement"                         |
| Experience learning and memory         | "agent experience replay", "procedural memory LLM agent", "lifelong agent memory"                                       |
| Self-generated data and self-rewarding | "self-rewarding language model", "self-play LLM training", "zero data reasoning", "synthetic data self-improvement"     |
| Recursive decomposition and curricula  | "automated curriculum LLM", "recursive problem decomposition", "self-generated curriculum"                              |
| Code evolution and algorithm discovery | "self-improving coding agent", "evolutionary code generation LLM", "agent modifies own code"                            |
| Self-evolving agents                   | "self-evolving agent", "self-referential agent", "agent skill library learning"                                         |
| Multimodal and embodied                | "embodied agent self-improvement", "multimodal self-rewarding"                                                          |
| Evaluation and benchmarks              | "benchmark self-improving agents", "ML engineering agent benchmark", "AI research agent evaluation"                     |
| Safety, governance, limits             | "reward hacking evaluation", "sabotage evaluation LLM", "model collapse recursive training", "self-modification safety" |

## Process

1. **Sweep** each source with the relevant queries (or only the focused theme if one was given).
2. **Screen** each hit against the inclusion criteria in `CONTRIBUTING.md`:
   - Published or substantially updated 2022 onwards.
   - Directly about a self-improvement loop (feedback, self-evaluation, self-generated data, code modification, memory, test-time adaptation, or governed updates) — not a generic agent framework.
   - Primary source available (arXiv, ACL Anthology, OpenReview, official project page, official lab blog, official GitHub repository).
3. **Dedupe** against the current list. For each candidate, check `README.md` for:
   - the exact URL,
   - the arXiv ID in any form (`abs/`, `pdf/`, versioned),
   - the paper or system title (search a distinctive word from it).
4. **Canonicalise** the URL: prefer arXiv `abs/` pages over PDFs, prefer published proceedings over preprints when both exist, strip tracking parameters, never use shorteners.
5. **Draft** a one-sentence description that is neutral, factual, specific, and matches the linked source. Use British English. Start with a verb where natural (matching list style: "Introduces…", "Surveys…", "Evaluates…").
6. **Place** each candidate in exactly one README section, with a one-line rationale.

## Output format

```markdown
## Candidate entries (require maintainer review)

### <Section name>

- [Name](URL) - One-sentence description.
  - Rationale: <why it is in scope and why this section>
  - Source checked: <arXiv / OpenReview / lab blog>, <year>
```

End with a short list of near-misses you excluded and the exclusion reason (helps the maintainer trust the sweep).

## Guardrails

- Never edit `README.md` — output candidates only.
- Never include secondary coverage (news articles, newsletters, social posts, summary blogs).
- Never inflate descriptions beyond what the source claims.
- If unsure whether a resource is in scope, list it under near-misses with your doubt stated, rather than as a candidate.
