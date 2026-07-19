# RFC-0005 — Cross-repo governance & package-scope reconciliation

- **Status:** Draft
- **Date:** 2026-07-19
- **Author:** Leonid Romanov
- **Deciders:** Platform lead + kit maintainers
- **Confluence:** _(pending)_
- **Affects:** `@ui/cyber-console`, all MFE repos, `packages/ui-spec`,
  `tools/eslint-rules`
- **Relates to:** [`../02-layer-model.md`](../02-layer-model.md) §4,
  [`../03-layer-contracts.md`](../03-layer-contracts.md), RFC-0003, RFC-0004

## Decision needed

How do the layer contracts and the three gates bind **outside this repo** — in
Cyber Console and each MFE — given that (a) they live in separate repos and (b)
they consume a **different npm scope** than this repo publishes?

## Context

Verified state of `@ui/cyber-console` (2026-07-19):

- It's a separate pnpm monorepo (React 19, TanStack Router, FrontX/GTS Module
  Federation), **not** part of this repo.
- The shell consumes **`@acronis-platform/ui-react` + `@acronis-platform/tokens-pd`
  - `@acronis-platform/icons-react`** — a **different scope** from this repo's
    **`@constructor-lab/ui-react` / `@constructor-lab/tokens` / `@constructor-lab/icons-react`**.
- MFEs are mid-migration: shell on the modern kit, `clients-mfe` still on legacy
  `@acronis-platform/shadcn-uikit`, `demo-mfe` on raw Radix.
- Screens are GTS `mfe.json` extensions validated by **zod at runtime**; there's
  no `screen.yaml`, no `ui-spec`, no grammar/`kit-lint`/`screen-audit` there.
- Lint/format is **oxlint + oxfmt** (Rust), not ESLint/Prettier — so the
  `acronis-patterns` ESLint plugin doesn't run there as-is.

So today the ecosystem's governance stops at this repo's edge. Three distinct
gaps: **scope/naming**, **enforcement portability**, and **spec adoption**.

## Options

### Scope/naming

- **A (proposed):** Declare the canonical published scope and map the other. Is
  the ecosystem `@constructor-lab/*` or `@acronis-platform/*`? Pick one as source
  of truth; document the other as a mirror/alias or a migration target.
- **B:** Accept two scopes indefinitely; maintain a compatibility table.

### Enforcement portability (ESLint vs oxlint)

- **A (proposed):** Publish `@constructor-lab/eslint-plugin-patterns` and run it
  in MFE CI even where oxlint is the default formatter (ESLint for pattern rules,
  oxlint for the rest).
- **B:** Port the pattern detectors to oxlint's plugin model when it matures.
- **C:** Enforce only via the rendered `screen-audit`, which is lint-agnostic.

### Spec adoption (ties to RFC-0004)

- **A (proposed):** Emit the runtime GTS `mfe.json` **from** a design-time
  `screen.yaml`/`app.yaml`, so one spec feeds both the gates and the runtime.
- **B:** Keep GTS runtime specs; add a parallel design-time spec for audit only.

## Recommendation

Resolve **scope/naming first** (it blocks everything downstream), then ship the
publishable ESLint plugin (RFC-0003) and pilot `screen.yaml → mfe.json` emission
on one Cyber Console screen (RFC-0004 Option C). Treat the shadcn/Radix MFEs as
migration backlog, not blockers.

## Open sub-questions

- Is `@acronis-platform/*` (what Console uses) the same design system as
  `@constructor-lab/*` (this repo), a fork, or the eventual rename target?
- Should `ui-spec` (schemas + grammar) be **published** so MFE repos can depend
  on it, rather than copied?
- Where does the ledger live when findings come from multiple repos?

## Decision

_Pending. This is the largest open item; likely splits into follow-up RFCs once
the scope question is answered._
