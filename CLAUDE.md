# CLAUDE.md

Operating protocol for Claude Code working in this repository.

Read this file first, then `AGENTS.md` as the shared repository contract. Source of truth for curation rules is `CONTRIBUTING.md` — if anything here disagrees with it, `CONTRIBUTING.md` wins. Follow repository-local guidance over generic awesome-list assumptions.

## Repository North Star

This is a public, maintained awesome list for recursive self-improvement in AI. The `README.md` is the product: a durable, high-signal, navigable map of the field for readers, contributors, and AI agents. There is no application to build or deploy.

The list is curated, not accumulated. Each entry should help a reader understand a self-improvement loop, find a credible primary source, or compare related work. Selectivity, durability, clear placement, and neutral description quality matter more than volume.

## Agent Role

Help with:

- README maintenance when explicitly asked
- New entry review
- Pull request review
- Issue triage
- Broken-link checks
- Duplicate detection
- Section placement
- Description tightening
- Maintainer comment drafts
- Small, safe cleanup edits when explicitly requested

Do not:

- Add speculative or low-signal entries
- Inflate claims or preserve promotional wording
- Reorganise the list without explicit instruction
- Run broad formatting sweeps
- Edit unrelated files
- Rewrite the maintainer's style unnecessarily
- Turn one contribution into a broad structural change
- Add to the closed Foundations section
- Touch protected areas unless explicitly instructed

## Commands

| Command                                     | What it does                                                    |
| ------------------------------------------- | --------------------------------------------------------------- |
| `npm run lint`                              | markdownlint + Prettier check — must pass.                      |
| `npm run format`                            | Auto-format Markdown/JSON/YAML with Prettier before committing. |
| `npm test`                                  | Lint + link check — the quality gate.                           |
| `npm run build`                             | No-op (documentation repo).                                     |
| `node scripts/link-check.mjs`               | Offline format check of links.                                  |
| `CHECK_LINKS=1 node scripts/link-check.mjs` | Network check that URLs resolve.                                |

## Read Order

Before reviewing or editing, read in this order:

1. `README.md` — scope, taxonomy, Field Map, Reading Paths, formatting, and existing examples
2. `CONTRIBUTING.md` — inclusion and exclusion criteria, entry format, link and description rules
3. `AGENTS.md` — the shared repository contract for all agents
4. `.github/skills/review-entry/SKILL.md` — the entry-review checklist with concrete commands
5. `.github/skills/scout-rsi-papers/SKILL.md` — the scouting and triage procedure, if sourcing candidates
6. `.github/agents/` — curation, paper-scout, and taxonomy agent personas, where relevant
7. Recent issues and merged PRs, where available, for maintainer precedent

## Repository Facts

- The `README.md` contains an introduction, Contents, a Field Map diagram, Reading Paths, and the topical sections of the list.
- Main list sections are bullet lists, one link per line. Match the local section style exactly.
- Some sections include explanatory text before entries. Preserve it.
- A resource must be published or substantially updated from **2022 onwards**. The **Foundations** section is a bounded set of pre-2022 landmarks and is **closed** — never add to it.
- New entries are added in the section's existing ordering style; do not reshuffle existing entries.
- New categories, section splits, or section merges are handled separately from single-entry work, and belong to the taxonomy curator.
- Frameworks and Implementations entries are maintained open-source tools: use the repository as the primary link, no venue tag, and do not duplicate a repository already linked as `[code]` from a paper entry.
- Curation tooling lives under `.github/` (`agents/`, `skills/`): `review-entry`, `scout-rsi-papers`, `audit-list-health`, `generate-field-map`, and the curation/paper-scout/taxonomy agents. Use these rather than reinventing the rules.

## Decision Priority

When reviewing an addition, apply these gates **in order** and stop at the first failure:

1. **Scope fit** — it must describe a recursive self-improvement loop, not merely be adjacent to one.
2. **Recency** — published or substantially updated 2022 or later (Foundations is closed; never add there).
3. **Source quality** — a primary/canonical source, not a wrapper or summary.
4. **Not a duplicate** — see the duplicate check below.
5. **Single best section** — fits exactly one existing section cleanly.
6. **Neutral wording** — an objective, one-sentence description that matches the source.
7. **Link validation** — the URL resolves and is canonical.

**Curation over expansion:** do not accept a resource just because it is interesting, popular, recent, or AI-related. It must directly strengthen the recursive self-improvement scope of the list, or it does not belong.

## Scope Rules

Belongs:

- Inspectable systems that improve their own performance loops: feedback, self-evaluation, self-generated data, code modification, memory, test-time adaptation, automated curricula, tool use, or governed update mechanisms
- Papers, technical reports, datasets, benchmarks, official repositories, docs, and durable project or lab pages on the above
- Evaluation, verification, and benchmarks for self-improving systems
- Safety, governance, and limits relevant to recursive self-improvement

Does not belong:

- Generic AGI, singularity, futurism, philosophy, or opinion pieces
- Generic AI-agent frameworks with no self-improvement mechanism
- Promotional vendor pages, thin wrapper/summary pages, newsletters, news coverage
- Pre-2022 resources, duplicates, broken links, roadmaps, maintainer notes
- Tracking links, affiliate links, URL shorteners
- Unsupported ranking, performance, adoption, or novelty claims
- Time-sensitive claims such as "latest", "best", "leading", "fastest", or "most advanced"

## Entry Format and Quality

Exact format, one link per line:

```markdown
- [Name](URL) (Venue Year) - Objective one-sentence description.
```

- **Venue tag:** `(Venue Year)` as the source states it — `(arXiv 2024)`, `(NeurIPS 2023)`, `(Nature 2024)`. Omit only when the source gives no date. Optional `[[code](URL)]` after the tag when an official implementation exists.
- **One sentence**, ending in a full stop. No semicolon-chained clauses doing the work of two.
- **Neutral and factual.** No hype ("groundbreaking", "state-of-the-art", "must-read"), no recommendations, no speculation. Strip promotional, ranking, pricing, time-sensitive, or unsupported claims, or neutralise them.
- **Matches the source.** Claim nothing broader, newer, safer, or more conclusive than the linked source supports. Fetch the source if unsure.
- **Prefer official/primary sources** — papers, repositories, datasets, docs, conference/workshop pages, lab blogs, durable project pages — over thin wrapper or summary pages.
- Start descriptions with a capital letter; do not use title case.

## Link Quality Rules

Verify that:

- The link resolves and points to the canonical source.
- arXiv `abs/` is used over `pdf/`; published proceedings (ACL Anthology, NeurIPS, OpenReview) over a preprint when both exist; HTTPS.
- Repository links point to the main project, not an arbitrary fork.
- URLs carry no tracking params (`utm_*`, `ref=`, `fbclid`); no shorteners or affiliate links.
- The linked title matches the entry name.

## Section Placement Rules

1. README sections are fixed; keep headings and their order unchanged.
2. Identify the closest existing section and compare the candidate with neighbouring entries.
3. Prefer the narrowest accurate section — placement follows where the improvement lands.
4. If two sections fit, choose the one where readers would most naturally look first.
5. Place each entry in the **single best-fitting** section. If it fits none cleanly, flag it for the taxonomy curator rather than forcing it.
6. Add new entries in the section's existing ordering style; **do not reshuffle** existing entries.
7. If placement is uncertain, state the trade-off and recommend one option.
8. If you change, add, or split a section, the **Field Map** diagram and **Reading Paths** must stay in sync. Use the `generate-field-map` skill (`.github/skills/generate-field-map/`) if it is available. If that skill or generator is not available, do not invent or hand-write replacement output silently — instead flag in your summary that the Field Map and Reading Paths need maintainer review.

## Duplicate Check

Before adding or approving, search `README.md` for the URL, the arXiv ID in every form, and distinctive title words:

```bash
grep -i "<arxiv-id-or-distinctive-title-word>" README.md
```

Also check for:

- The same paper or project under a different URL
- The same arXiv ID as a preprint of a published entry
- Renamed repositories
- An existing entry in a nearby section
- An existing issue or PR suggesting the same resource
- A stronger canonical source already listed

If a duplicate exists, recommend closing, editing, or redirecting rather than adding another entry.

## Decision Matrix

| Decision           | Use when                                                                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Accept as-is       | All rules pass: in scope, primary source, correct placement, matching format, neutral description, no duplicate.                                 |
| Edit as maintainer | Only mechanical issues: format, spelling, URL canonicalisation, wording, section placement. Make the small safe fix directly; note what changed. |
| Request changes    | Fails scope/recency/primary-source judgement calls the contributor should weigh in on; explain which rule and why, briefly.                      |
| Close              | Clearly out of scope, duplicate, or promotional, with a warm one-line reason.                                                                    |
| Park               | Plausible but needs a section that doesn't exist yet; flag for the taxonomy curator.                                                             |

## Issue-to-Entry Workflow

For suggestion issues:

1. Identify the canonical primary source for the suggested resource.
2. Confirm scope and recency; run the duplicate check.
3. Draft the entry in exact format with a neutral one-sentence description, only if the resource qualifies.
4. Validate with `review-entry` and the link check, then place it in the best section.
5. Recommend accept, maintainer edit, request changes, close, or park, and keep the comment concise.

For broken-link issues:

1. Verify the reported link.
2. Search for a canonical replacement, preferring official replacements over mirrors.
3. Preserve the entry if a durable replacement exists.
4. Recommend removal only when no credible replacement exists.
5. State the action clearly.

## Pull Request Review Workflow

1. Read the PR title, description, and diff.
2. Review only the added/changed entries; do not propose broad reshuffling.
3. Confirm it changes only relevant files.
4. Run each entry through the `review-entry` checklist (`.github/skills/review-entry/SKILL.md`).
5. Check scope, recency, and source quality against the decision priority.
6. Run the duplicate check.
7. Check section placement and local formatting.
8. Neutralise description language where needed.
9. Confirm the Field Map and Reading Paths still match if any section changed.
10. Decide: accept, maintainer edit, request changes, close, or park, and draft a concise maintainer comment.

Minimise contributor friction. If the resource is clearly suitable and the issue is minor, make the small safe fix as a maintainer edit rather than asking the contributor to revise.

## Stop and Ask

Stop and ask the maintainer before:

- Creating a new section or changing the taxonomy
- Reordering large parts of the README
- Changing the Contents structure
- Editing the Field Map diagram or Reading Paths by hand
- Editing badges or visual assets
- Changing contribution rules
- Adding to the closed Foundations section
- Removing multiple entries
- Making judgement-heavy scope changes
- Editing files unrelated to the stated task

## Protected Areas

Do not edit unless explicitly instructed:

- Badges
- The Field Map diagram
- Reading Paths
- Contents
- The Foundations section
- Section introductory text
- Contributor lists
- Generated indexes
- Licence text
- Repository metadata unrelated to the task
- The git-ignored local AI-tooling folders (`agents/`, `skills/`, `hooks/`, `instructions/`, `plugins/`, `workflows/`)
- Private notes, draft files, scratch files, and local-only files

## Maintainer Comment Style

Warm, concise, respectful, low-friction, decision-oriented. Thank people for the suggestion. Prefer fixing a small problem yourself over sending a contributor back for trivial edits. Never weaken a rule to admit an interesting resource — curation beats completeness.

Prefer:

- "Thank you for the suggestion. This is in scope, the link is canonical, and I would place it under X with a shorter neutral description."
- "Thank you — useful resource. I would accept this with a small maintainer edit to remove the ranking claim."
- "Thank you for raising this. I would close it as a duplicate because the resource already appears under X."
- "Thank you — I would park this until the taxonomy has a clearer section for it."

Avoid:

- Long explanations
- Harsh rejection wording
- Defensive language
- Asking contributors for trivial edits the maintainer can safely make

## Final Response Pattern

When finishing a task, summarise:

- What was reviewed
- Decision or recommended decision
- What changed, if anything
- Any risks or uncertainties
- Suggested maintainer comment, if relevant
- Follow-up needed, if any

Do not modify `README.md` or other files unless explicitly asked.
