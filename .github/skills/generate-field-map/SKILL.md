---
name: generate-field-map
description: "Regenerate the Field Map (Mermaid diagram) and Reading Paths sections of README.md so they stay consistent with the current section taxonomy and entries. Use whenever sections are added, renamed, merged, or removed, or when reading-path entries change."
---

# Generate Field Map

The README of `awesome-recursive-self-improvement` contains two navigation aids that must stay in sync with the list itself:

1. **Field Map** — a Mermaid flowchart of the recursive self-improvement loop, with each loop stage mapped to the README sections that cover it.
2. **Reading Paths** — short curated tracks through existing entries for different audiences.

This skill regenerates both whenever the taxonomy or key entries change.

## Field Map structure

The diagram depicts the canonical RSI feedback loop. Keep it to this shape — a compact loop, not an org chart:

- **Act / Generate** — the system produces outputs, actions, code, or data. Covers: Self-Generated Data and Self-Rewarding Models; Self-Play and Zero-Data Reasoning; Recursive Decomposition and Automated Curricula; Code Evolution and Algorithm Discovery; Automated AI Research and Scientific Discovery; Multimodal and Embodied Self-Improvement.
- **Evaluate / Verify** — the system or an external check scores the result. Covers: Evaluation, Verification, and Benchmarks; Self-Refinement and Reflection.
- **Update** — the improvement lands in weights, prompts, code, memory, or curricula. Covers: Experience Learning and Memory; Test-Time Adaptation and Inference-Time Improvement; Scaffold and Prompt Optimisation; Self-Evolving Agents.
- The loop arrows back from Update to Act.
- **Safety, Governance, and Limits** bounds the loop (a dashed link to the loop subgraph), not a stage in it.
- **Frameworks and Implementations** is tooling for building the loop (a second dashed link), not a stage in it.
- **Surveys and Overviews**, **Workshops and Research Agendas**, and **Foundations** sit outside the loop as entry points.

Rules:

- Use plain `flowchart` syntax that GitHub's built-in Mermaid renderer supports; no themes and no click handlers. Simple `<br/>` line breaks inside node labels are fine.
- Node labels name the loop stage with the covering sections listed underneath.
- Every README content section must appear exactly once in the diagram; when sections change, re-derive the mapping above rather than bolting nodes on.
- Validate the syntax renders (VS Code Markdown preview or mermaid.live) before finishing.

## Reading Paths structure

Three tracks, each 5–7 links **to entries that already exist in the list**, ordered from accessible to advanced:

- **New to the field** — start with a survey, then the canonical accessible papers (reflection, self-rewarding, constitutional-style feedback).
- **Building self-improving systems** — practitioner track: self-evolving agents, code evolution, memory/experience, then a benchmark to measure against.
- **Safety and limits** — reward hacking, sabotage/monitoring evaluations, open-ended-system safety, recursive-training collapse.

Rules:

- Each item is `1. [Name](#section-anchor) — why it is on this track (one short clause).` linking to the README **section anchor**, with the name matching the entry exactly so readers can find it.
- Never link to a resource that is not in the list; never invent a track item.
- After regenerating, verify every anchor matches a heading in `README.md` (GitHub anchors: lowercase, spaces → hyphens, punctuation dropped).

## Process

1. Read the current `README.md` section list and the existing Field Map / Reading Paths blocks.
2. Re-derive the stage→section mapping and rebuild the Mermaid block.
3. Confirm every reading-path entry still exists in the list (titles can change when URLs are swapped to venue versions); fix names and anchors.
4. Replace the two blocks in place; touch nothing else in the README.
5. Run `npm run lint` and confirm the Mermaid block renders.
