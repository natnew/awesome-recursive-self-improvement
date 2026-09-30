# AGENTS.md

Operating protocol for AI coding agents working in this repository. Claude Code also reads `CLAUDE.md`, which adds commands and Claude-specific working notes.

## North Star

This is a curated awesome list for recursive self-improvement in AI. `README.md` is the product: a durable, high-signal, navigable map of the field for readers, contributors, and AI agents. The list is curated, not accumulated — selectivity, clear placement, and neutral descriptions matter more than volume.

## Where the Rules Live

| File                                         | Authority for                                                                                                         |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `CONTRIBUTING.md`                            | All curation rules: scope, inclusion order, exclusions, entry format, links, placement, duplicates. It wins disputes. |
| `AGENTS.md` (this file)                      | How agents work: role, workflows, decision matrix, stop-and-ask, protected areas, comment style, final summary.       |
| `README.md`                                  | Current taxonomy, section intros, and local entry style. Read the target section and its neighbours before editing.   |
| `.github/skills/review-entry/SKILL.md`       | Pass/fail checklist applying `CONTRIBUTING.md` to a proposed or changed entry, including a PR diff.                   |
| `.github/skills/scout-rsi-papers/SKILL.md`   | Finding new candidates. Output is proposals only.                                                                     |
| `.github/skills/audit-list-health/SKILL.md`  | Periodic link-rot, superseded-preprint, and scope audits.                                                             |
| `.github/skills/generate-field-map/SKILL.md` | Regenerating the Field Map and Reading Paths after an approved section change.                                        |
| `.github/agents/*.agent.md`                  | Personas: curation reviewer, paper scout, taxonomy curator.                                                           |

Read `CONTRIBUTING.md` before reviewing or editing anything, and do not restate its rules elsewhere; link to it instead. Recent issues and merged pull requests show maintainer precedent.

## Repository Structure

| Path              | Purpose                                                     |
| ----------------- | ----------------------------------------------------------- |
| `README.md`       | The list itself — the main artefact.                        |
| `CONTRIBUTING.md` | The curation rules and contribution process.                |
| `scripts/`        | Maintenance tooling (link checking).                        |
| `.github/`        | CI, Dependabot, CODEOWNERS, and the curation agents/skills. |

The root `agents/`, `skills/`, `hooks/`, `instructions/`, `plugins/`, and `workflows/` folders are the maintainer's local AI tooling. They are git-ignored by design: do not rely on them, edit them, or propose committing them. There is no runtime service; `npm test` is the quality gate.

## Agent Role

Agents may help with entry and pull request review, issue triage, broken-link and duplicate checks, section placement, description tightening, maintainer comment drafts, and small README edits when explicitly asked.

Agents must not:

- Add speculative or low-signal entries, or preserve promotional wording.
- Reorganise the list, reorder entries, or run broad formatting sweeps (`npm run format` rewrites every file).
- Turn one contribution into a structural change, or edit unrelated files.
- Add to the closed Foundations section.
- Touch protected areas unless explicitly instructed.
- Edit `README.md` or other files during a review or triage task: those produce a recommendation.

## Decision Matrix

| Decision           | Use when                                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------------ |
| Accept as-is       | Passes every check in `CONTRIBUTING.md`.                                                                     |
| Edit as maintainer | Strong resource needing small fixes: wording, punctuation, canonical URL, venue tag, placement, or format.   |
| Request changes    | May fit, but scope, recency, source quality, or placement is materially unclear and the contributor decides. |
| Close              | Out of scope, duplicate, promotional, pre-2022, or broken with no durable replacement.                       |
| Park               | Promising but not yet supported by the taxonomy, or requiring maintainer judgement.                          |

Minimise contributor friction: if a resource clearly qualifies and the problem is minor, make the fix as a maintainer edit rather than asking the contributor to revise.

## Workflows

**Suggestion issue.** Apply the inclusion checks in `CONTRIBUTING.md` in order, stopping at the first failure. If the resource qualifies, draft the entry in the exact format with its target section, then recommend a decision from the matrix.

**Broken-link issue.** Verify the reported link, search for a canonical replacement (official over mirrors), and keep the entry if a durable replacement exists. Recommend removal only when no credible replacement exists.

**Pull request review.**

1. Read the title, description, and diff; confirm only relevant files changed.
2. Run each added or changed entry through `.github/skills/review-entry/SKILL.md`, fetching the source to confirm title, venue, year, and claims.
3. If any section changed, confirm the Field Map and Reading Paths still match.
4. Decide from the matrix and draft a concise maintainer comment.

## Stop and Ask

Ask the maintainer before:

- Creating, splitting, merging, or renaming a section, or otherwise changing the taxonomy.
- Reordering entries or changing the Contents structure.
- Editing the Field Map or Reading Paths by hand (use `generate-field-map` after approval).
- Editing badges, section intros, or contribution rules.
- Removing more than one entry, or making judgement-heavy scope calls.
- Editing files unrelated to the stated task.

## Protected Areas

Do not edit unless explicitly instructed: badges, Contents, the Field Map, Reading Paths, the Foundations section, section introductory text, the licence, repository metadata unrelated to the task, and the git-ignored local tooling folders.

## Maintainer Comment Style

Warm, concise, respectful, and decision-oriented. Avoid long explanations, defensive or harsh wording, and asking contributors for trivial edits the maintainer can make.

- "Thank you for the suggestion. This is in scope, the link is canonical, and I would place it under X with a shorter neutral description."
- "Thank you for raising this. I would close it as a duplicate because the resource already appears under X."
- "Thank you — I would park this until the taxonomy has a clearer section for it."

## Final Response Pattern

When finishing a task, summarise what was reviewed, the decision or recommendation, what changed (if anything), risks or uncertainties, a suggested maintainer comment when a contributor is involved, and any follow-up needed.
