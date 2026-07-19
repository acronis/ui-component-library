# RFC-0001 — Adopt the 8-layer ecosystem model

- **Status:** Draft
- **Date:** 2026-07-19
- **Author:** Leonid Romanov
- **Deciders:** Kit maintainers + platform lead
- **Confluence:** _(pending space creation)_
- **Affects:** whole ecosystem (vision-level)
- **Relates to:** [`../02-layer-model.md`](../02-layer-model.md),
  `context/component-layers-proposal.md`, `context/pattern-first-screens-proposal.md`

## Decision needed

Do we adopt the layer ladder — `Console → App → Screen → Template → Pattern →
Composite → Primitive`, over ambient Tokens + Icons, sourced from Figma — as the
**canonical mental model and governance spine** for the Cyber ecosystem, with
the downward-only dependency rule as its one invariant?

## Context

The repo already realizes most of the ladder: `layer: primitive|composite`,
`pattern.yaml`, `screen.yaml`, `app.yaml`, grammar + detectors. What's missing
is (a) a **ratified name** for the whole model so every team speaks it, and
(b) the **Template** rung (RFC-0002). Without a ratified spine, each new proposal
re-litigates the vocabulary.

## Options

### Option A — Adopt the 8-layer model as-is (proposed)

Ratify [`02-layer-model.md`](../02-layer-model.md) verbatim: 8 layers, ambient
tokens/icons, downward-only rule. Subsequent RFCs (0002–0005) fill the gaps.

### Option B — Adopt without the Template layer

Ratify 7 layers; treat page skeletons as ordinary composites. Simpler, but loses
the `common-template` archetype's altitude distinction (RFC-0002 argues why it
matters).

### Option C — Keep the status quo (proposals, no unifying model)

Each proposal stands alone. Lowest ceremony; highest drift in vocabulary and
ownership.

## Recommendation

Option A. The machinery already exists; naming the spine is cheap and unblocks
consistent language across PMs/designers/devs and across repos.

## Open sub-questions

- Is "Template" the right word, or does it collide with existing usage (Figma
  templates, project scaffolds)? Alternatives: "Page", "Layout", "Blueprint".
- Should the model be documented once here and _referenced_ from the older
  proposals, or should the proposals be retired into this doc set?

## Decision

_Pending._
