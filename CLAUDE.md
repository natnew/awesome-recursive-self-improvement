# CLAUDE.md

Claude-specific operating layer for this repository. It routes to the authoritative files and adds only what they don't cover.

## What this repo is

A curated Markdown awesome-list on recursive self-improvement in AI. `README.md` is the product; there is no application, build, or deploy. The main work is **curation**: reviewing entries and PRs, triaging issues, checking links, and making small, exact README edits. The list is curated, not accumulated: an interesting, popular, or recent resource still does not belong unless it describes a self-improvement loop.

## Where the rules live

When sources disagree, the file higher in this list wins. Read these files rather than working from memory.

| File                                         | Authority for                                                                                                                  |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `CONTRIBUTING.md`                            | Every curation rule: scope, inclusion order, exclusions, entry format, links, placement, duplicates.                           |
| `AGENTS.md`                                  | Shared agent contract: role, decision matrix, issue/PR workflows, stop-and-ask, protected areas, comment style, final summary. |
| `README.md`                                  | Current taxonomy, section intros, and local entry style. Read the target section and its neighbours before placing anything.   |
| `.github/skills/review-entry/SKILL.md`       | Pass/fail checklist for any proposed or changed entry, including a PR diff.                                                    |
| `.github/skills/scout-rsi-papers/SKILL.md`   | Finding new candidates. Output is proposals only; never edit `README.md` while scouting.                                       |
| `.github/skills/audit-list-health/SKILL.md`  | Periodic link-rot and superseded-preprint audits.                                                                              |
| `.github/skills/generate-field-map/SKILL.md` | Regenerating the Field Map and Reading Paths after an approved section change.                                                 |
| `.github/agents/*.agent.md`                  | Personas: curation reviewer, paper scout, taxonomy curator.                                                                    |

These `.github/skills` files are procedures to read and follow. They are not installed Claude Code skills, and `.claude/` is git-ignored. `.github/copilot-instructions.md` only points to `AGENTS.md` and `CONTRIBUTING.md`. Don't restate rules from `CONTRIBUTING.md` in any other file; link to it.

## Commands

```bash
npm ci                                      # install (Node 20, as in CI)
npm test                                    # quality gate: markdownlint + Prettier check + offline link-format check
npx prettier --write <file>                 # format only the files you touched
npm run lint:awesome                        # awesome-lint over README.md; its repository check needs a pushed branch and GitHub API access
CHECK_LINKS=1 node scripts/link-check.mjs   # network check; not run in CI; 403/405/429 are logged as inconclusive
grep -n "<arxiv-id>\|<title-word>" README.md   # duplicate check (a bare arXiv ID catches abs/, pdf/ and vN forms)
```

CI (`.github/workflows/ci.yml`, on every pull request and on pushes to `main`) runs `npm run lint` and the offline link check in one job, and `npm run lint:awesome` in a second job. `npm run format` rewrites every Markdown, JSON, and YAML file in the repo, so it counts as a broad sweep. Use it only when asked to.

## Invariants

- **Entry format:** `- [Name](URL) (Venue Year) \[[code](URL)\] - One neutral sentence.` The venue tag is as the source states it. The code link is optional, must point to the official repository, and keeps its backslashes so `awesome-lint` passes.
- **Recency:** 2022 onwards. **Foundations is closed**: never add to it.
- **Frameworks and Implementations:** link the repository, with no venue tag. Never duplicate a repo already linked as `[code]` elsewhere.
- **Ordering:** append new entries to the end of their section and never reshuffle existing entries.
- **Structure is frozen without approval.** Headings, Contents, badges, section intros, the Field Map, and Reading Paths are protected (full list in `AGENTS.md`). A section add, split, merge, or rename needs maintainer approval first. After approval, follow `generate-field-map` so the Field Map and Reading Paths stay in sync. Don't hand-write that output.
- **Don't edit tooling unless asked:** `package*.json`, `scripts/`, `.github/workflows/`, and the git-ignored root `agents/`, `skills/`, `hooks/`, `instructions/`, `plugins/`, `workflows/`.
- **Only edit when asked:** review and triage requests produce a recommendation, not a README edit.

## Decision order

Apply the inclusion checks in `CONTRIBUTING.md` in order and stop at the first failure, then pick the outcome from the decision matrix in `AGENTS.md`. Prefer making a small mechanical fix yourself over sending the contributor back.

## How to work

- **Verify against the source.** Fetch the arXiv `abs/` page, proceedings page, or repository to confirm the title, venue, year, and what the paper actually claims. Never write a description or venue tag from memory. If the fetch fails, say the entry is unverified.
- **Check for duplicates beyond `README.md`.** Also check open and closed issues and PRs with the GitHub MCP tools. A published version may already be listed under a preprint's title.
- **Keep diffs minimal.** Change only the lines you were asked to change. A single-entry task touches one line of `README.md` and nothing else.
- **Run `npm test` before you commit.** Show its output rather than claiming it passed.
- **Use parallel work only where it pays off.** Subagents fit fan-out work: scouting several themes, or verifying many candidate links or sources for an audit. Handle single-entry review and PR review inline.
- **Finish** with the Final Response Pattern in `AGENTS.md`. Include a draft maintainer comment when the task involves a contributor.
