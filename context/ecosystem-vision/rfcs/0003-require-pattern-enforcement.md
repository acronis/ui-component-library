# RFC-0003 — `require-pattern` ESLint rule + enforcement rollout

- **Status:** Draft
- **Date:** 2026-07-19
- **Author:** Leonid Romanov
- **Deciders:** Kit maintainers + app leads
- **Confluence:** _(pending)_
- **Affects:** `tools/eslint-rules` (`acronis-patterns`), `apps/**`, MFE repos
- **Relates to:** [`../03-layer-contracts.md`](../03-layer-contracts.md) §2,
  `context/pattern-first-screens-proposal.md` (D2),
  `context/opinionated-composites-proposal.md`

## Decision needed

Do we build a screen-scope `require-pattern` / `no-adhoc-composition` ESLint rule
that makes "no hand-wired primitives in screens" enforceable — and on what
rollout (warn-then-error, grandfathering)?

## Context

The downward-only rule (RFC-0001) is only real if a machine enforces it at the
screen edge. Today `acronis-patterns` has `no-adhoc-sheet`, `prefer-confirm-dialog`,
`prefer-stat-row` — all narrow, warn-first. There is no general rule that a
screen region assembling ≥N primitives (matching a known pattern's shape) must
use that pattern/template instead.

## Options

### Option A — Build `require-pattern`, warn-first with grandfathering (proposed)

Generalize the `prefer-*` seed into a screen/app-scoped rule: assembling ≥N
primitives into a region that matches a known pattern is a finding that **names
the pattern to adopt**. Per D2: **errors on new/changed screens, warns on
existing** until migrated. Kit-internal code (composites/patterns/templates) is
exempt.

### Option B — Rely on the rendered `pattern-conformance` audit only

Skip the static rule; catch drift at `screen-audit` time. Later feedback, but no
new ESLint machinery.

### Option C — Manual review only

Cheapest now; doesn't scale — the exact failure the vision targets.

## Recommendation

Option A **plus** the rendered `pattern-conformance` detector (they're
complementary: static catches authoring, rendered catches structure). Ship
`should`/warn first; promote to `must` per-rule via the ledger once false
positives are wrung out.

## Open sub-questions

- The threshold N and the "matches a pattern's shape" heuristic — how precise
  before it cries wolf?
- Grandfather mechanism: allowlist file vs. per-file opt-out comment?
- Does the rule live in `acronis-patterns` or graduate to a published
  `@constructor-lab/eslint-plugin-patterns` so MFE repos can consume it (ties to
  RFC-0005)?

## Decision

_Pending. `must` promotion requires a named human approver per rule._
