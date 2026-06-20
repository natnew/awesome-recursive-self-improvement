# CLAUDE.md

## What this repo is

A **curated awesome-list** about recursive self-improvement in AI. The deliverable is `README.md` —
a public, maintained resource list, not an application. There is no service to build or deploy.
Your job is to help maintain the list: review contributions, triage issues, place entries, check
link quality, and write short maintainer comments. Source of truth for rules: `CONTRIBUTING.md`
(if anything here disagrees with it, `CONTRIBUTING.md` wins).

## Commands

| Command          | What it does                                                          |
| ---------------- | -------------------------------------------------------------------- |
| `npm run lint`   | markdownlint + Prettier check — must pass.                           |
| `npm run format` | Auto-format Markdown/JSON/YAML with Prettier before committing.       |
| `npm test`       | Lint + link check — the quality gate.                                |
| `npm run build`  | No-op (documentation repo).                                          |
| `node scripts/link-check.mjs` | Offline format check of links.                          |
| `CHECK_LINKS=1 node scripts/link-check.mjs` | Network check that URLs resolve.          |

## Scope — what belongs

Inspectable systems that improve their own performance loops: feedback, self-evaluation,
self-generated data, code modification, memory, test-time adaptation, automated curricula, tool
use, or governed update mechanisms. A resource must be **2022 or later**, directly on-topic, use a
stable primary-source link, add something distinct, and fit one section cleanly.

## Scope — what does not belong

- Generic AGI, singularity, futurism, philosophy, or opinion pieces.
- Generic AI-agent frameworks with no self-improvement mechanism.
- Promotional vendor pages, thin wrapper/summary pages, newsletters, news coverage.
- Pre-2022 resources, duplicates, broken links, roadmaps, maintainer notes.
- Tracking links, affiliate links, URL shorteners.

## Decision priority

When reviewing an addition, apply these gates **in order** and stop at the first failure:

1. **Scope fit** — it must describe a recursive self-improvement loop, not merely be adjacent to one.
2. **Recency** — published or substantially updated 2022 or later.
3. **Source quality** — a primary/canonical source, not a wrapper or summary.
4. **Not a duplicate** — see the duplicate check below.
5. **Single best section** — fits exactly one existing section cleanly.
6. **Neutral wording** — an objective, one-sentence description that matches the source.
7. **Link validation** — the URL resolves and is canonical.

**Curation over expansion:** do not accept a resource just because it is interesting, popular,
recent, or AI-related. It must directly strengthen the recursive self-improvement scope of the
list, or it does not belong.

## Entry format and quality

Exact format, one link per line:

```markdown
- [Name](URL) - Objective one-sentence description.
```

- **One sentence**, ending in a full stop. No semicolon-chained clauses doing the work of two.
- **Neutral and factual.** No hype ("groundbreaking", "state-of-the-art", "must-read"), no
  recommendations, no speculation. Strip promotional, ranking, pricing, time-sensitive, or
  unsupported claims, or neutralise them.
- **Matches the source.** Claim nothing broader, newer, safer, or more conclusive than the linked
  source supports. Fetch the source if unsure.
- **Prefer official/primary sources** — papers, repositories, datasets, docs, conference/workshop
  pages, lab blogs, durable project pages — over thin wrapper or summary pages.

## Link quality

- **Canonical URL:** arXiv `abs/` over `pdf/`; published proceedings (ACL Anthology, NeurIPS,
  OpenReview) over a preprint when both exist; HTTPS.
- Remove tracking params (`utm_*`, `ref=`, `fbclid`). No shorteners or affiliate links.
- Verify the link resolves and the linked title matches the entry name.

## Section placement

- README sections are fixed; keep headings and their order unchanged.
- Place each entry in the **single best-fitting** section. If it fits none cleanly, flag it for the
  taxonomy curator rather than forcing it.
- Add new entries in the section's existing ordering style; **do not reshuffle** existing entries.
- If you change, add, or split a section, the **Field Map** diagram and **Reading Paths** must stay
  in sync. Use the `generate-field-map` skill (`.github/skills/generate-field-map/`) if it is
  available. If that skill or generator is not available, do not invent or hand-write replacement
  output silently — instead flag in your summary that the Field Map and Reading Paths need
  maintainer review.

## Duplicate check

Before adding, search `README.md` for the URL, the arXiv ID in every form, and distinctive title
words:

```bash
grep -i "<arxiv-id-or-distinctive-title-word>" README.md
```

## PR triage workflow

1. Review only the added/changed entries; do not propose broad reshuffling.
2. Run each through the `review-entry` checklist (`.github/skills/review-entry/SKILL.md`).
3. Classify and act:
   - **Accept as-is** — all rules pass.
   - **Edit as maintainer** — only mechanical issues (format, spelling, URL canonicalisation,
     wording, section placement). Make the small safe fix directly rather than asking the
     contributor for an unnecessary round-trip; note what you changed.
   - **Request changes** — fails scope/recency/primary-source judgement calls the contributor
     should weigh in on; explain which rule and why, briefly.
   - **Close** — clearly out of scope, duplicate, or promotional, with a warm one-line reason.
   - **Park** — plausible but needs a section that doesn't exist yet; flag for the taxonomy curator.

## Issue-to-entry workflow

1. Identify the canonical primary source for the suggested resource.
2. Confirm scope and recency; run the duplicate check.
3. Draft the entry in exact format with a neutral one-sentence description.
4. Validate with `review-entry` and the link check, then place it in the best section.

## Contributor communication

Warm, concise, respectful, low-friction. Thank people for the suggestion. Prefer fixing a small problem yourself over
sending a contributor back for trivial edits. Never weaken a rule to admit an interesting resource —
curation beats completeness.

## Repository layout notes

- Curation tooling lives under `.github/` (`agents/`, `skills/`): `review-entry`,
  `scout-rsi-papers`, `audit-list-health`, `generate-field-map`, and the curation/paper-scout/
  taxonomy agents. Use these rather than reinventing the rules.
