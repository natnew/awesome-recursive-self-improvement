<!-- This file mirrors AGENTS.md so GitHub Copilot and other agents share one source of truth. -->

# AGENTS.md

Guidance for AI coding agents (Copilot, Claude, Cursor, â€¦) working in this repository.

## What this repository is

`awesome-recursive-self-improvement` is a **curated awesome-list**: a single, well-organized
collection of high-quality links and resources about recursive self-improvement in AI. The
primary deliverable is **`README.md`**. This is a documentation repository, not an application â€”
there is no runtime service to build or deploy.

## Repository structure

| Path                                                                      | Purpose                                                          | Committed?                |
| ------------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------- |
| `README.md`                                                               | The list itself â€” the main artifact.                           | âœ…                       |
| `CONTRIBUTING.md`                                                         | How to propose additions and the quality bar for entries.        | âœ…                       |
| `assets/`                                                                 | Images referenced by the README.                                 | âœ…                       |
| `scripts/`                                                                | Maintenance tooling (e.g. link checking).                        | âœ…                       |
| `.github/`                                                                | CI, governance, and a curated subset of agent/skill definitions. | âœ…                       |
| `agents/`, `skills/`, `hooks/`, `instructions/`, `plugins/`, `workflows/` | The maintainer's **local** AI-tooling libraries.                 | âŒ Git-ignored by design. |

> **Important for agents:** the root `agents/`, `skills/`, `hooks/`, `instructions/`, `plugins/`,
> and `workflows/` folders are intentionally **git-ignored** and are not part of the published
> repository. Do not rely on them being present, and do not propose committing them. A small,
> curated subset is mirrored under `.github/agents/` and `.github/skills/` for discoverability.

## How to work here

- **Editing the list:** keep entries alphabetized within their section, one link per line, with a
  short, neutral description. Match the existing Markdown style.
- **Quality bar:** follow `CONTRIBUTING.md`. Every entry must be relevant, live, and non-duplicate.
- **Formatting:** run `npm run format` (Prettier) before opening a PR. `npm run lint` must pass.
- **Validation:** `npm test` runs the linter and the link checker (`scripts/link-check.mjs`).
- **No secrets:** this repo needs no environment variables; `.env.example` is intentionally empty.

## Commands

| Command          | What it does                                   |
| ---------------- | ---------------------------------------------- |
| `npm run lint`   | markdownlint + Prettier check.                 |
| `npm run format` | Auto-format Markdown/JSON/YAML with Prettier.  |
| `npm test`       | Lint + link check â€” the repo's quality gate. |
| `npm run build`  | No-op (documentation repo).                    |

## Review expectations

- PRs are routed via `.github/CODEOWNERS`.
- CI (`.github/workflows/ci.yml`) must be green: lint, link check, and `apm audit --ci`.
- Security issues: see `SECURITY.md`.

## AI tooling

Agent, skill, and MCP dependencies are declared **by reference** in `apm.yml` (Agent Package
Manager) and locked in `apm.lock.yaml`, so shared tooling stays in sync across repos without
committing the raw libraries. MCP servers available to agents are declared in `.vscode/mcp.json`.

### Curation agents and skills (committed)

The list curates itself with topic-aligned tooling under `.github/`:

| Definition                                   | Purpose                                                                                       |
| -------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `.github/agents/paper-scout.agent.md`        | Sweeps arXiv, OpenReview, and lab blogs for new RSI resources and proposes candidate entries. |
| `.github/agents/curation-reviewer.agent.md`  | Validates proposed entries or PR diffs against every `CONTRIBUTING.md` rule.                  |
| `.github/agents/taxonomy-curator.agent.md`   | Proposes section splits, merges, or new sections as the field evolves.                        |
| `.github/skills/scout-rsi-papers/SKILL.md`   | The scouting procedure: sources, per-theme queries, dedupe steps, output template.            |
| `.github/skills/review-entry/SKILL.md`       | The 13-point entry-review checklist with concrete commands.                                   |
| `.github/skills/audit-list-health/SKILL.md`  | Periodic audit for link rot, superseded preprints, and stale entries.                         |
| `.github/skills/generate-field-map/SKILL.md` | Regenerates the README Field Map diagram and Reading Paths when sections change.              |

When editing `README.md`, run entries through the `review-entry` checklist first, and keep the
Field Map and Reading Paths in sync with any section changes via `generate-field-map`.
