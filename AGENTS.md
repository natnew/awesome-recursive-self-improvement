# AGENTS.md

Operating protocol for AI coding agents working in this repository.

Claude Code should read `CLAUDE.md` first, then use this file as the shared repository contract. Other agents should start here. Follow repository-local guidance over generic awesome-list assumptions.

## Repository North Star

This is a public, maintained awesome list for recursive self-improvement in AI. The `README.md` is the product: a durable, high-signal, navigable map of the field for readers, contributors, and AI agents.

The list is curated, not accumulated. Each entry should help a reader understand a self-improvement loop, find a credible primary source, or compare related work. Selectivity, durability, clear placement, and neutral description quality matter more than volume.

## Agent Role

Agents may help with:

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

Agents must not:

- Add speculative or low-signal entries
- Inflate claims or preserve promotional wording
- Reorganise the list without explicit instruction
- Run broad formatting sweeps
- Edit unrelated files
- Rewrite the maintainer's style unnecessarily
- Turn one contribution into a broad structural change
- Add to the closed Foundations section
- Touch protected areas unless explicitly instructed

## Read Order

Before reviewing or editing, read in this order:

1. `README.md` — scope, taxonomy, Field Map, Reading Paths, formatting, protected areas, and existing examples
2. `CONTRIBUTING.md` — inclusion and exclusion criteria, entry format, link and description rules
3. `CLAUDE.md` — the maintainer contract and decision priority, and Claude-specific review format
4. `.github/skills/review-entry/SKILL.md` — the entry-review checklist with concrete commands
5. `.github/skills/scout-rsi-papers/SKILL.md` — the scouting and triage procedure, if sourcing candidates
6. `.github/agents/` — curation, paper-scout, and taxonomy agent personas, where relevant
7. Recent issues and merged PRs, where available, for maintainer precedent

Do not assume the generic awesome-list pattern overrides this repository's existing structure.

## Repository Structure

| Path              | Purpose                                                          |
| ----------------- | ---------------------------------------------------------------- |
| `README.md`       | The list itself — the main artefact.                             |
| `CONTRIBUTING.md` | How to propose additions and the quality bar for entries.        |
| `assets/`         | Images referenced by the README.                                 |
| `scripts/`        | Maintenance tooling (e.g. link checking).                        |
| `.github/`        | CI, governance, and a curated subset of agent/skill definitions. |

## Repository Facts

- The `README.md` contains an introduction, Contents, a Field Map diagram, Reading Paths, and the topical sections of the list.
- Main list sections are bullet lists, one link per line. Match the local section style exactly.
- Some sections include explanatory text before entries (Field Map, Reading Paths, section intros). Preserve it.
- A resource must be published or substantially updated from **2022 onwards**. The **Foundations** section is a bounded set of pre-2022 landmarks and is **closed** — never add to it.
- Entries use the exact format `- [Name](URL) (Venue Year) - Objective one-sentence description.`, with an optional `[[code](URL)]` link between the venue tag and the description.
- The `(Venue Year)` tag is written as the source states it (`(arXiv 2024)`, `(NeurIPS 2023)`, `(Nature 2024)`), and is omitted only when the source gives no date.
- New entries are added in the section's existing ordering style; do not reshuffle existing entries.
- New categories, section splits, or section merges are handled separately from single-entry work, and belong to the taxonomy curator.
- The Field Map diagram and Reading Paths must stay in sync with any section change; use the `generate-field-map` skill rather than hand-writing replacements.
- Frameworks and Implementations entries are maintained open-source tools: use the repository as the primary link, no venue tag, and do not duplicate a repository already linked as `[code]` from a paper entry.
- This repository has no runtime service; `npm test` (lint + link check) is the quality gate.

## Scope Rules

Belongs:

- Inspectable systems that improve their own performance loops
- Feedback, self-evaluation, and self-refinement methods
- Self-generated data, self-rewarding, and self-play resources
- Experience learning, memory, and test-time adaptation
- Automated curricula and recursive decomposition
- Scaffold and prompt optimisation
- Code evolution and algorithm discovery
- Self-evolving agents and automated AI research
- Multimodal and embodied self-improvement
- Evaluation, verification, and benchmarks for self-improving systems
- Safety, governance, and limits relevant to recursive self-improvement
- Papers, technical reports, datasets, benchmarks, official repositories, docs, and durable project or lab pages on the above

Does not belong:

- Generic AGI, singularity, futurism, philosophy, or opinion pieces
- Generic AI-agent frameworks with no self-improvement mechanism
- Thin wrapper or summary pages with little original technical value
- Pure marketing or promotional vendor pages
- Broken or inaccessible links
- Duplicate or near-duplicate resources
- Pre-2022 resources, roadmaps, or maintainer notes
- Newsletters and news coverage
- Tracking links, affiliate links, or URL shorteners
- Unsupported ranking, performance, adoption, or novelty claims
- Time-sensitive claims such as "latest", "best", "leading", "fastest", or "most advanced"
- Content outside recursive self-improvement in AI

## Quality Bar

An entry qualifies when all are true:

- It describes a recursive self-improvement loop, not merely a topic adjacent to one.
- It is published or substantially updated 2022 or later (Foundations is closed).
- The source is a primary or canonical source, not a wrapper or summary.
- The link is canonical, durable, and reachable.
- The resource adds something distinct from existing entries.
- The entry fits exactly one existing section without forcing a taxonomy change.
- The description is neutral, concise, specific, and non-promotional.
- The formatting matches the surrounding section.
- No duplicate or stronger existing equivalent is already present.

## README Formatting Rules

Infer format from the surrounding section before editing.

- Preserve the existing heading structure and order.
- Preserve the Contents list and its anchors.
- Preserve badges, the Field Map diagram, Reading Paths, section intros, and other protected areas.
- Match the section's existing format: a bullet list, one link per line.
- Use the exact entry format, including the `(Venue Year)` tag and optional `[[code](URL)]` link.
- Use HTTPS links where available.
- Use canonical names.
- Keep descriptions to one neutral sentence.
- Start descriptions with a capital letter.
- End descriptions with a full stop.
- Do not use title case for descriptions.
- Do not perform broad formatting changes unless explicitly asked.

## Link Quality Rules

Verify that:

- The link resolves.
- The link points to the canonical source.
- arXiv `abs/` is used over `pdf/`, and published proceedings (ACL Anthology, NeurIPS, OpenReview) are used over a preprint when both exist.
- Repository links point to the main project, not an arbitrary fork.
- Paper links prefer official publisher pages, arXiv, DOI, or project pages.
- Documentation links prefer official docs.
- Dataset and benchmark links prefer official pages or maintained repositories.
- URLs do not include tracking parameters (`utm_*`, `ref=`, `fbclid`).
- Shortened and affiliate links are avoided.
- The linked title matches the entry name.

## Description Style

Descriptions should be:

- Neutral
- Factual
- Specific
- One sentence
- Present tense where natural
- Free of hype
- Free of claims broader, newer, safer, or more conclusive than the source supports
- Useful to a reader scanning the list quickly

Prefer:

- "Self-refinement method where a model critiques and revises its own output before answering."
- "Benchmark for evaluating self-improving agents across task environments."
- "Framework for optimising prompts and scaffolds through iterative search."

Avoid:

- "Groundbreaking"
- "State-of-the-art"
- "Must-read"
- "Best"
- "Latest"
- "Revolutionary"
- Unsupported claims about performance, adoption, or maturity

## Section Placement Rules

1. Identify the closest existing section.
2. Compare the candidate with neighbouring entries.
3. Prefer the narrowest accurate section — placement follows where the improvement lands.
4. If two sections fit, choose the one where readers would most naturally look first.
5. Do not create a new section for a single item.
6. Do not move existing entries unless explicitly asked.
7. If placement is uncertain, state the trade-off and recommend one option.
8. If a resource fits no section cleanly, park it for the taxonomy curator rather than forcing it.

## Duplicate Checking Rules

Before adding or approving, search `README.md` for the URL, the arXiv ID in every form, and distinctive title words. Check for:

- Same URL
- Same paper or project under a different URL
- Same arXiv ID as a preprint of a published entry
- Renamed repositories
- An existing entry in a nearby section
- An existing issue or PR suggesting the same resource
- A stronger canonical source already listed (published proceedings over preprint)

If a duplicate exists, recommend closing, editing, or redirecting rather than adding another entry.

## Decision Matrix

| Decision           | Use when                                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------------ |
| Accept as-is       | In scope, primary source, correct placement, matching format, neutral description, no duplicate.             |
| Edit as maintainer | Strong resource needing small fixes: wording, punctuation, canonical URL, venue tag, placement, or format.   |
| Request changes    | May fit, but scope, recency, source quality, or placement is materially unclear and the contributor decides. |
| Close              | Out of scope, duplicate, promotional, pre-2022, or broken with no durable replacement.                       |
| Park               | Promising but not yet supported by the taxonomy, or requiring maintainer judgement.                          |

## Issue-to-Entry Workflow

For suggestion issues:

1. Check scope fit — it must describe a self-improvement loop.
2. Check recency (2022 onwards; never Foundations).
3. Check source quality — a primary or canonical source.
4. Check link quality and canonicalisation.
5. Run the duplicate check.
6. Identify the single best section.
7. Draft a neutral entry in exact format only if the resource qualifies.
8. Recommend accept, maintainer edit, request changes, close, or park, and keep the comment concise.

For broken-link issues:

1. Verify the reported link.
2. Search for a canonical replacement.
3. Prefer official replacements over mirrors.
4. Preserve the entry if a durable replacement exists.
5. Recommend removal only when no credible replacement exists.
6. State the action clearly.

## Pull Request Review Workflow

1. Read the PR title, description, and diff.
2. Confirm it changes only relevant files.
3. Check each added or changed link.
4. Run each entry through the `review-entry` checklist.
5. Check scope, recency, and source quality.
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

Comments should be warm, concise, respectful, and decision-oriented.

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
