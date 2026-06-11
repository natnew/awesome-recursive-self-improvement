---
name: review-entry
description: "Validate one or more proposed awesome-list entries against every rule in CONTRIBUTING.md and output a pass/fail checklist with a corrected entry where fixable. Use before adding entries to README.md or when reviewing a contribution PR."
---

# Review Entry

You are the quality gate for `awesome-recursive-self-improvement`. Given one or more proposed entries (or a PR diff touching `README.md`), validate each against **every** rule below. The rules map 1:1 to `CONTRIBUTING.md` — if the two ever disagree, `CONTRIBUTING.md` wins.

## Checklist (apply every item to every entry)

1. **Format** — exactly `- [Name](URL) - Objective one-sentence description.` One link per line. Description ends with a full stop.
2. **One sentence** — the description contains exactly one sentence, no semicolon-chained clauses doing the work of two.
3. **Neutral and factual** — no hype ("groundbreaking", "state-of-the-art", "must-read"), no recommendations, no speculative claims.
4. **Matches the source** — the description claims nothing broader, newer, safer, or more conclusive than the linked source supports. Fetch the source if in doubt.
5. **British English** — "organise", "behaviour", "modelling", "licence" (noun).
6. **Primary source** — arXiv, ACL Anthology, OpenReview, official conference/workshop page, official project page, official GitHub repository, official lab blog, or official documentation. No news coverage, newsletters, or summary blogs.
7. **Canonical URL** — prefer arXiv `abs/` over `pdf/`; prefer published proceedings (ACL Anthology, NeurIPS proceedings, OpenReview) over a preprint when both exist; HTTPS; no tracking parameters (`utm_*`, `ref=`, `fbclid`); no shorteners or affiliate links.
8. **Recency** — published or substantially updated 2022 onwards.
9. **In scope** — describes a self-improvement loop (feedback, self-evaluation, self-generated data, code modification, memory, test-time adaptation, automated curricula, or governed updates). Generic agent frameworks, AGI/futurism, and opinion pieces fail.
10. **Distinct** — adds something the list does not already cover.
11. **No duplicate** — check `README.md` for the URL, the arXiv ID in any form, and the title:

    ```bash
    grep -i "<arxiv-id-or-distinctive-title-word>" README.md
    ```

12. **One clear section** — fits exactly one existing section; if it fits none, flag for the taxonomy curator instead of forcing it.
13. **Link works** — the URL resolves. Spot-check it, and run the repo gate:

    ```bash
    node scripts/link-check.mjs            # offline format check
    CHECK_LINKS=1 node scripts/link-check.mjs   # network check
    ```

## Output format

For each entry, a verdict table:

```markdown
### - [Name](URL) - Description.

| #   | Rule   | Result           |
| --- | ------ | ---------------- |
| 1   | Format | ✅ / ❌ <reason> |
| …   | …      | …                |

**Verdict:** ACCEPT / FIX / REJECT
**Corrected entry (if FIX):** - [Name](URL) - Corrected description.
**Target section:** <section name>
```

- **ACCEPT** — all rules pass.
- **FIX** — fails only mechanical rules (format, spelling, URL canonicalisation, description wording); provide the corrected entry.
- **REJECT** — fails scope, recency, primary-source, or duplicate rules; state which.

## Guardrails

- Never weaken a rule to admit an interesting resource — curation beats completeness.
- Never rewrite a description to claim more than the source does, even if the original proposal did.
- When reviewing a PR, check only the added/changed entries; do not propose broad reshuffling.
