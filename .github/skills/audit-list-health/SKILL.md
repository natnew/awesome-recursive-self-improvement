---
name: audit-list-health
description: "Audit the awesome list for link rot, superseded preprints, abandoned projects, and entries that no longer meet the quality bar, and output an audit report with recommended actions. Use periodically or before a release of the list."
---

# Audit List Health

You are auditing `README.md` of `awesome-recursive-self-improvement` for decay. A curated list stays valuable only if every entry stays live, canonical, and in scope. The output is an **audit report** — apply fixes only when the maintainer asks.

## Process

1. **Link rot** — run the network link check and collect failures:

   ```bash
   CHECK_LINKS=1 node scripts/link-check.mjs
   ```

   For each failing URL, determine whether it moved (find the new canonical URL) or died (recommend removal or a replacement primary source).

2. **Superseded preprints** — for each arXiv entry, check whether a published version now exists (ACL Anthology, OpenReview, NeurIPS/ICML/ICLR proceedings). Where one does, recommend swapping to the canonical proceedings link per `CONTRIBUTING.md` ("prefer canonical paper, proceedings, project, or lab links").

3. **Abandoned projects** — for each GitHub repository entry, check whether the repo is archived, deleted, or visibly dormant in a way that breaks the claim in its description. Dormant but historically significant papers/projects stay; entries whose description claims an ongoing resource that no longer exists get flagged.

4. **Description drift** — spot-check entries whose source has changed (renamed papers, retitled blog posts, v2 abstracts with different claims). The description must still match the source.

5. **Bar check** — flag entries that, with hindsight, fail current `CONTRIBUTING.md` criteria (secondary source, no self-improvement mechanism, duplicate coverage). Be conservative: recommend removal only with a stated rule violation, never on taste.

## Output format

```markdown
## List health audit — <date>

| Entry       | Section   | Issue                                                                                                | Recommended action                                                        |
| ----------- | --------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| [Name](URL) | <section> | <dead link / moved / superseded by venue version / archived repo / description drift / fails rule N> | <replace URL with X / remove / reword description to Y / keep, no action> |

**Summary:** <n> entries checked, <n> healthy, <n> need action.
```

If everything is healthy, say so explicitly — an empty table with a confirmation is a valid, useful result.

## Guardrails

- Report first; edit `README.md` only on explicit maintainer instruction.
- Never replace a primary source with a secondary one, even if the primary is awkward (e.g. a PDF on a lab CDN).
- Preserve section ordering and heading names; this audit never restructures the taxonomy (that is the taxonomy curator's job).
- When recommending a URL swap, verify the new URL resolves before recommending it.
