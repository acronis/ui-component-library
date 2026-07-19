# RFC-0004 — Adopt `screen.yaml` as the design-time screen source

- **Status:** Draft
- **Date:** 2026-07-19
- **Author:** Leonid Romanov
- **Deciders:** App leads + PMs
- **Confluence:** _(pending)_
- **Affects:** `apps/*`, MFE repos, `packages/ui-spec/screens`
- **Relates to:** [`../05-roles-and-authoring.md`](../05-roles-and-authoring.md),
  `context/demo-pattern-screens-proposal.md`,
  `context/pattern-first-screens-proposal.md`, RFC-0005

## Decision needed

Do product apps/MFEs adopt `screen.yaml` (regions → patterns/template +
`stateMachine`) as the **design-time source** for screens, with the
`/screen-from-spec` skill generating the implementation — and does a PRD have to
carry the D3 contract (entities, states, data, actions, per-state acceptance
criteria) before a screen is specced?

## Context

`ui-spec` has 6 specced screens and a validated `screen.yaml` schema. But real
product screens (e.g. Cyber Console) are authored as GTS `mfe.json` extensions
validated by **zod at runtime**, with **no design-time `screen.yaml`**. Until an
app adopts `screen.yaml`, the layer-5 contract and the three gates don't bind
there — the vision's consistency guarantee stops at the kit boundary.

## Options

### Option A — Adopt `screen.yaml` design-time, pilot first (proposed)

Pick one screen in one app, author its `screen.yaml`, generate it via
`/screen-from-spec`, run the gates, compare consistency to the hand-built
version. Require the D3 PRD contract for new screens. Expand once the pilot holds
(mirrors `demo-pattern-screens-proposal.md`).

### Option B — Design-time spec for demo only; products stay runtime-GTS

Keep `screen.yaml` as a kit/demo artifact; don't push it into products. Lowest
disruption; the vision remains aspirational for real products.

### Option C — Reconcile with GTS: generate `mfe.json` from `screen.yaml`

Treat `screen.yaml` as the design-time source and **emit** the runtime GTS
extension from it, so one spec feeds both. Highest value, most integration work;
depends on RFC-0005.

## Recommendation

Option A now (prove it on a pilot), with Option C as the target once RFC-0005
settles the cross-repo story. Make the D3 PRD contract mandatory for new screens
so the acceptance criteria can serve as test/audit oracles.

## Open sub-questions

- Machine-readable format for D3 acceptance criteria (so the loop consumes them).
- Which app + screen is the pilot? (A Cyber Console feature screen vs. an
  `apps/demo` route.)
- Who authors the first `screen.yaml` — PM with skill assistance, or dev?

## Decision

_Pending._
