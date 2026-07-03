# Contributing

Thank you for helping keep this list focused, current, and useful. Contributions should improve the signal of the list rather than expand it for completeness.

## Scope

This repository tracks recent technical resources on recursive self-improvement in AI: inspectable systems that improve their own performance loops through feedback, experience, self-evaluation, tool use, code modification, synthetic data, memory, test-time adaptation, evaluation, verification, or governed update mechanisms.

It is not a general AGI, singularity, futurism, philosophy, or AI-agent directory.

## Inclusion Criteria

A resource must:

- Be published or substantially updated from 2022 onwards. (The Foundations section is a
  deliberately bounded set of pre-2022 landmarks and is closed to new entries; do not propose
  additions to it.)
- Be directly relevant to AI recursive self-improvement.
- Use a stable, accessible link.
- Prefer primary sources.
- Add something distinct to the list.
- Fit one section clearly.
- Use the required format.

Primary sources include arXiv, ACL Anthology, OpenReview, official conference or workshop pages, official project pages, official GitHub repositories, official lab blogs, and official documentation.

## Exclusion Criteria

Do not add:

- Pre-2022 resources.
- Generic AGI, singularity, futurism, or opinion pieces.
- Generic AI agent frameworks without a self-improvement mechanism.
- Promotional vendor pages.
- Duplicate resources.
- Broken links.
- Tracking links.
- Affiliate links.
- URL shorteners.
- Descriptions that do not match the linked source.
- Long commentary.
- Roadmaps.
- Maintainer notes.

## Resource Format

Use this exact format:

```markdown
- [Name](URL) (Venue Year) - Objective one-sentence description.
```

- The `(Venue Year)` tag names the publication venue and year the source states, for example
  `(arXiv 2024)`, `(NeurIPS 2023)`, `(Nature 2024)`, `(ACL 2025)`. Omit the tag only when the
  source gives no date, as with some organisation or project pages.
- When an official implementation exists, add a `[[code](URL)]` link between the tag and the
  description. Link only the official repository.
- Descriptions must be neutral, factual, concise, specific, and no more than one sentence.

Entries in the Frameworks and Implementations section are maintained open-source tools rather
than papers: use the repository as the primary link, no venue tag, and do not duplicate a
repository already linked as `[code]` from a paper entry.

## Curation Tooling

This repository ships AI tooling that encodes the rules above, so you can self-check an entry before opening a pull request:

- `.github/skills/review-entry/SKILL.md` - a checklist that validates a proposed entry against every rule in this guide.
- `.github/skills/scout-rsi-papers/SKILL.md` - the procedure used to find and triage new resources.
- `.github/agents/curation-reviewer.agent.md` - an agent persona that applies the review checklist to entries or PR diffs.

Running your entry through the review checklist first makes review faster for everyone.

## Pull Request Guidance

- Add resources to the single best-fitting section.
- Keep section ordering and heading names unchanged.
- Check that the link works before submitting.
- Check that the linked title matches the resource name.
- Explain why the resource belongs in scope if the connection is not obvious.
- Avoid broad reshuffling unless it fixes a clear classification problem.

## Link and Description Quality Rules

- Prefer canonical paper, proceedings, project, or lab links over summaries.
- Remove tracking parameters from URLs.
- Do not use URL shorteners or affiliate links.
- Do not describe a resource as broader, newer, safer, or more conclusive than the linked source supports.
- Do not add hype language, personal recommendations, or speculative claims.
