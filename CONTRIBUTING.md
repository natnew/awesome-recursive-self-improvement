# Contributing

Thank you for helping keep this list focused, current, and useful. Contributions should improve the signal of the list rather than expand it for completeness.

This file is the single source of the curation rules. The agent instructions (`AGENTS.md`, `CLAUDE.md`) and the review checklists under `.github/skills/` apply these rules; where anything disagrees with this file, this file wins.

## Scope

This repository tracks recent technical resources on recursive self-improvement in AI: inspectable systems that improve their own performance loops through feedback, experience, self-evaluation, tool use, code modification, synthetic data, memory, test-time adaptation, evaluation, verification, or governed update mechanisms.

It is not a general AGI, singularity, futurism, philosophy, or AI-agent directory. An interesting, popular, or recent resource still does not belong unless it describes a self-improvement loop.

## Inclusion Criteria

Apply these checks in order and stop at the first failure:

1. **Scope** — the resource describes a self-improvement loop (feedback, self-evaluation, self-generated data, code modification, memory, test-time adaptation, automated curricula, or governed updates), or evaluates, bounds, or governs one. A topic adjacent to such a loop is not enough.
2. **Recency** — published or substantially updated from 2022 onwards. The Foundations section is a deliberately bounded set of pre-2022 landmarks and is closed to new entries.
3. **Primary source** — arXiv, ACL Anthology, OpenReview, official conference or workshop pages, official project pages, official GitHub repositories, official lab blogs, or official documentation.
4. **Not a duplicate** — nothing equivalent or stronger is already listed (see [Duplicates](#duplicates)).
5. **One section** — the resource fits one existing section clearly (see [Placement](#placement)).
6. **Neutral wording** — the description follows the [entry format](#entry-format).
7. **Canonical link** — the link is stable, reachable, and canonical (see [Links](#links)).

## Exclusion Criteria

Do not add:

- Pre-2022 resources.
- Generic AGI, singularity, futurism, or opinion pieces.
- Generic AI agent frameworks without a self-improvement mechanism.
- Thin wrapper or summary pages with little original technical value.
- Promotional vendor pages.
- Newsletters and news coverage.
- Duplicate or near-duplicate resources.
- Broken, tracking, or affiliate links, or URL shorteners.
- Descriptions that do not match the linked source.
- Long commentary, roadmaps, or maintainer notes.

## Entry Format

Use this exact format, one entry per line:

```markdown
- [Name](URL) (Venue Year) - Objective one-sentence description.
- [Name](URL) (Venue Year) \[[code](URL)\] - Objective one-sentence description.
```

- **Name** — the resource's title exactly as the linked source gives it.
- **Venue tag** — `(Venue Year)` names the publication venue and year the source states, for example `(arXiv 2024)`, `(NeurIPS 2023)`, `(Nature 2024)`, `(ACL 2025)`. Omit the tag only when the source gives no date, as with some organisation or project pages. The tag names the venue of the version you link: an `(arXiv Year)` tag links the arXiv `abs/` page, and a published version's tag names its venue and links its proceedings or journal page.
- **Code link** — when an official implementation exists, add a `\[[code](URL)\]` link between the tag and the description. Link only the official repository. Keep the backslashes: they render as `[code]` on GitHub, and without them `awesome-lint` reads the outer brackets as an undefined reference.
- **Description** — one sentence that is neutral, factual, specific, and concise. Start with a capital letter, end with a full stop, and use present tense where natural. Use UK spelling (organise, behaviour, modelling, licence as a noun).
- **No hype or time-sensitive claims** — avoid words such as groundbreaking, state-of-the-art, must-read, best, latest, leading, or revolutionary, and do not describe a resource as broader, newer, safer, or more conclusive than the linked source supports.

Entries in the Frameworks and Implementations section are maintained open-source tools rather than papers: use the repository as the primary link, no venue tag, and do not duplicate a repository already linked as `[code]` from a paper entry.

## Links

- Link the canonical source: prefer published proceedings (ACL Anthology, NeurIPS, ICLR, ICML, OpenReview, journal pages) over a preprint when both exist, and arXiv `abs/` pages over PDFs.
- Link repositories at the main project, not a fork.
- Use HTTPS, and remove tracking parameters (`utm_*`, `ref=`, `fbclid`).
- The linked page's title must match the entry name.

## Placement

- Sections are organised by where the improvement lands: inference-time, data- and weight-level, or process-level (see the introduction and Field Map in the README). Choose the narrowest section that describes the mechanism.
- If two sections fit, choose the one where readers would most naturally look first.
- Follow the section's existing order: new entries are appended to the end of the section unless the section clearly uses another order.
- Do not create a new section for a single resource, and do not move or reorder existing entries in an entry pull request. Section additions, splits, merges, and renames are proposed separately and need maintainer approval.

## Duplicates

Before proposing a resource, search `README.md` for its URL, its arXiv ID (which catches `abs/`, `pdf/`, and versioned forms), and a distinctive title word, and search existing issues and pull requests. Check for the same paper under a different URL, a preprint of an already-listed published version, a renamed repository, and a repository already linked as `[code]`.

## Suggesting a Resource

Either open a [suggestion issue](https://github.com/natnew/awesome-recursive-self-improvement/issues/new?template=suggest-resource.yml), which asks for the link, the section, and a short account of the self-improvement loop, or open a pull request that adds the entry directly. Report dead links, moved links, or newer published versions with the [link problem form](https://github.com/natnew/awesome-recursive-self-improvement/issues/new?template=report-link.yml).

Maintainers aim to respond to new issues and pull requests within seven days. Small fixes to an otherwise suitable entry (wording, URL form, venue tag, placement) are usually made by the maintainer rather than sent back.

## Pull Requests

- Add each resource to the single best-fitting section, following the rules above.
- Keep heading names, section order, and the README's navigation (Contents, Field Map, Reading Paths) unchanged.
- Check that the link works and that the linked title matches the entry name.
- Explain why the resource belongs in scope if the connection is not obvious.
- Run `npm test` if you have Node.js installed; CI runs the same checks, plus `awesome-lint`, on every pull request.

## Curation Tooling

The review checklists maintainers and AI agents use are in the repository, if you want to self-check an entry:

- `.github/skills/review-entry/SKILL.md` - the entry review checklist.
- `.github/skills/scout-rsi-papers/SKILL.md` - the procedure used to find and triage new resources.
