# RFC-0002 — Add the Template layer (`template.yaml`)

- **Status:** Draft
- **Date:** 2026-07-19
- **Author:** Leonid Romanov
- **Deciders:** Kit maintainers
- **Confluence:** _(pending)_
- **Affects:** `packages/ui-spec` (new schema + `templates/`), `packages/ui-react`
  (template composites), `apps/demo` (gallery)
- **Relates to:** [`../04-common-template-layer.md`](../04-common-template-layer.md),
  RFC-0001, `context/opinionated-composites-proposal.md`,
  `context/component-layers-proposal.md`

## Decision needed

Do we add a **Template layer** — a config-driven, pattern-composed **page
skeleton** artifact (`template.yaml` + schema + a realizing `ui-react`
composite) — between Screen and Pattern? And is a template a plain
`layer: composite` with `category: page`, or a new `layer: template` enum value?

## Context

`pstorage-ui-hci`'s `common-template` serves ~50 pages from one config-driven
component (layout skeleton + orchestrator + parts + ~30 slots + a paging
variant). The user wants that repeatable-page power as a first-class, governed
layer. `ui-spec` has no template concept today; screens carry per-region
`layout.type` but there's no reusable page skeleton artifact.

## Options

### Option A — New `template.yaml` + reuse `layer: composite` (proposed)

Add `templates/<name>/template.yaml`, `template.schema.json`, `templates.test.ts`.
The realizing component is an ordinary `layer: composite` with `category: page`.
Screens gain a `template` field + `templateConfig`. No new enum → minimal schema
churn. Slots resolve to approved patterns (validated edge).

### Option B — New `layer: template` enum value

More explicit altitude, but touches `index.schema.json`, the `IndexSpec` TS type
(already behind on `layer`), docs grouping, and every classifier. Churn for a
label.

### Option C — No template layer; templates are big composites

Zero new machinery. But loses the design-time page-skeleton spec, the demo
gallery driver, and the "screen = fill a template" authoring experience.

## Recommendation

Option A. Get the artifact + validated slots without an enum migration; revisit
`layer: template` only if grouping demands it.

## Open sub-questions

- Config-contract typing: how much in `template.yaml` vs. the component's TS props?
- Do templates own routing/persistence (as `common-template` did) or delegate to
  the screen `stateMachine`? (Vision leans: behavior in the state machine.)
- First slate to build: `ResourceListTemplate` first (direct `common-template`
  analog)?

## Decision

_Pending._
