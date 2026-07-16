# Proposal: Opinionated (config-driven) composites

- **Status:** Proposed (not yet adopted)
- **Date:** 2026-07-16
- **Owner:** Leonid Romanov
- **Affects:** `packages/ui-react` (new composite components, optional
  `/composites` subpath export), `packages/ui-spec` (specs `layer: composite`,
  optional `apiStyle` field, pattern graduations), `tools/eslint-rules`
  (`prefer-*` rules), `apps/docs` (Composites nav). **No changes to existing
  primitives' public surface.**
- **Builds on:** `context/component-layers-proposal.md` (Primitive vs Composite
  and the pattern→composite pipeline), `context/kit-consistency-audit-proposal.md`
  (grammar / kit-lint / screen-audit / ledger), and
  `packages/ui-spec/context/component-specs-proposal.md` (framework-agnostic specs).

---

## 1. Problem

We ship many **single-purpose primitives** wrapping Base UI (`table`, `button`,
`popover`, `field`, …). That granularity — even with patterns, grammar rules, and
screen specs — lets two teams assemble the _same_ UI slightly differently:
mismatched control heights in a toolbar, off-grid indents, different row/action
ordering, class drift (`border` vs `border-border`), "two slightly different
reds." These are exactly the failure modes the grammar checklist already
enumerates (Z2 control-height, Z1 off-grid spacing, C4 variant parity, C6 two
components for one job, A3 bare-border, T5 one-token-per-role).

The primitives are correct to be flexible. The problem is that **there is no
opinionated layer that bakes an approved layout into one component and asks teams
to use it** — e.g. `<DataGrid columns={…} rows={…} />` instead of hand-wiring
`Table` + `TableHeader` + `TableRow` + `TableCell` + selection + pagination.

## 2. What already exists (so we extend, not fork)

This is deliberately a small delta on top of decisions the repo already made:

- **The layer model is already here.** `context/component-layers-proposal.md`
  defines **Primitive vs Composite**; every `packages/ui-spec/components/*/index.yaml`
  already carries a `layer:` field (the "classify-don't-move" mechanism). **11
  composites already ship**: `app-shell`, `auth-layout`, `card-filter`, `command`,
  `data-table`, `page-header`, `search-global`, `sidebar-primary`,
  `sidebar-secondary`, `tour`, `widget-placeholder`.
- **A `<Table rows columns/>`-style composite already exists.** `DataTable` takes
  `columns: ColumnDef[]` + `data: TData[]` over TanStack Table, owns all table
  state, and renders the whole `Table` tree internally. `CardFilter` is a second
  config-driven composite (`label`/`value`/`icon`/`variant`). So the pattern this
  proposal formalizes is **already precedented in the codebase**.
- **A graduation pipeline exists.** `ui-spec/patterns/*` holds 19 approved
  recipes (incl. `table-view`, `data-table-bulk-actions`, `confirm-dialog`,
  `form-layout`, `card-grid`, `detail-drawer`, `wizard-dialog`, `dashboard`); a
  pattern graduates into a published composite via `implementedBy` (only
  `app-shell` has graduated so far). See `patterns/GRADUATION.md`.
- **Consistency enforcement exists.** The grammar registry (`KitRule`,
  `must`/`should`/`may`), `kit-lint` (static, gates CI on T1/T2), `screen-audit`
  (structural, gates on Z2/I1/I5), the self-improving **ledger**, and scoped
  **overrides** are all live.
- **"Use THIS component, not ad-hoc markup" already has a prototype.** The local
  ESLint plugin `acronis-patterns` (`tools/eslint-rules`) ships `no-adhoc-sheet`,
  which steers authors from a hand-rolled fixed panel to `Sheet`. Its header calls
  it "the PROTOTYPE of pattern enforcement" and the seed of
  `@constructor-lab/eslint-plugin-patterns`.
- **A separate package was already considered and rejected.** The layers proposal
  (§1, §8) rejects a shadcn-blocks-style `ui-blocks` package: it "duplicates
  `ui-spec/patterns` + composite components + `ui-spec/screens`, adds a fifth home
  for compositions, and works against the grammar/audit consistency system."

**The gap this proposal fills:** the existing composites are _inconsistent in API
style_ (`data-table`/`card-filter` are config-driven; `page-header`/`app-shell`/
`sidebar-*` are parts/slots) with **no rule for which to use when**, there is **no
prioritized slate of config-driven candidates**, and enforcement is a **single
prototype rule**.

## 3. The two-layer contract (keeping flexibility in the primitives)

Make the split explicit and load-bearing:

- **Primitives stay maximally flexible.** We never reduce a primitive's surface.
  `Table` keeps its 8 compositional parts. This is the permanent escape hatch.
- **Composites are the opinionated, batteries-included layer.** Reduced
  flexibility _on purpose_ — they encode an approved layout, the grammar rules,
  and the wiring. `<DataGrid columns rows/>` lives here.

**Invariant:** every config-driven composite is built _on top of_ the primitives
and **documents the drop-down path** ("need something `DataGrid` can't express?
use `Table` directly"). Flexibility is not lost — it is relocated one layer down.
This is the direct answer to "keep the ability to have flexibility in the uikit
primitives."

## 4. The missing decision rule: config-driven vs compositional

| Use **config-driven** (`items`/`columns`/`fields` props)                   | Use **compositional** (parts / slots)                     |
| -------------------------------------------------------------------------- | --------------------------------------------------------- |
| Content is **homogeneous & repeated** (rows, fields, filters, KPIs, steps) | Content is **heterogeneous / arbitrary**                  |
| Consistency _is_ the point; variation is noise                             | It is a **layout scaffold** holding rich, varied children |
| e.g. `DataGrid`, `FormLayout`, `ConfirmDialog`, `DetailList`               | e.g. `AppShell`, `PageHeader`, `Sidebar*`                 |

**Hybrid is the mature shape** and `DataTable` already demonstrates it: a
config-driven core plus typed escape hatches (`renderExpandedRow`, cell renderers
inside the column def, a `render` prop). Record the choice as
`apiStyle: config | compositional | hybrid` on the composite's spec so it is
queryable and reviewable.

## 5. Candidate composites (anchored to existing patterns so they can graduate)

Prioritized by consistency-pain × pattern backing. Each sits on named primitives
and enforces named grammar rules. API sketches are illustrative, not final.

### Tier 1 — highest pain, proven patterns (graduation-ready)

- **`DataGrid`** — the batteries-included `<Table rows columns/>`. Pattern
  `table-view` (+ `data-table-bulk-actions`). Bundles what `DataTable` leaves as
  _separate seams_ today (toolbar, pagination, selection, empty/skeleton) into one
  wired grid.

  ```tsx
  <DataGrid
    columns={columns}                 // reuse TanStack ColumnDef[] (DataTable already exposes this)
    rows={rows}
    selectable
    toolbar={{ search: true, filters, bulkActions }}
    pagination
    state="loading | empty | loaded"
    onRowClick={…}
  />
  ```

  Enforces: toolbar control-height parity (Z2), one empty/skeleton treatment,
  selection UX, pagination. Escape hatch: `Table` + the existing instance-driven
  `DataTableToolbar` / `DataTablePagination` / `DataTableViewOptions` parts.

- **`ConfirmDialog`** — pattern `confirm-dialog`.

  ```tsx
  <ConfirmDialog
    open
    title
    description
    confirmLabel
    destructive
    onConfirm
    onCancel
  />
  ```

  Enforces: button order + variant parity (C4), destructive styling, focus/dismiss
  (I2).

- **`FormLayout`** — patterns `form-layout` / `form-two-column` / `field-group`.

  ```tsx
  <FormLayout
    fields={[{ name, label, type, required, options, description }]}
    columns={1 | 2}
    values={values} onChange={…} onSubmit={…}
  />
  ```

  Enforces: label/field spacing, required markers, error placement, two-column
  rhythm (C1). Escape hatch: a `renderField` prop + the `Field` primitives.

### Tier 2 — high reuse

- **`DetailList`** (`items={[{ label, value }]}`, 1–2 col) — patterns
  `detail-drawer` / `sheet-detail-panel`. Replaces bespoke label/value grids.
- **`StatRow`** (`stats={[{ label, value, icon, onClick }]}`) — wraps `CardFilter`,
  enforces the KPI row so stat tiles never drift.
- **`CardGrid`** (`items`, `minColumnWidth`, `renderItem`) — pattern `card-grid`.

### Tier 3 — as demand proves them (used in ≥2 screens = the graduation bar)

- **`FilterBar`** (`filters={[…]}`) — note `filter-popover` is intentionally a
  _never-graduates_ recipe, so this would be a fresh composite, not that pattern's
  graduation.
- **`WizardDialog`** (`steps={[…]}`) — pattern `wizard-dialog`.
- **`DashboardGrid`** (widget layout) — pattern `dashboard`, over
  `widget-placeholder`.

## 6. How to "insist" without trapping teams

Three dials, softest → hardest:

1. **Docs + graduation (soft).** Each composite graduates its pattern
   (`implementedBy`); the pattern's `anti_patterns` name the ad-hoc alternative.
   This is what already steers agents and humans.
2. **ESLint `prefer-*` rules (medium).** Grow `acronis-patterns` into
   `@constructor-lab/eslint-plugin-patterns`: `prefer-data-grid` (flag `<Table>` +
   `.map(row)`), `prefer-confirm-dialog`, `prefer-form-layout`. Ship as
   **`should`/warn** first (conservative, like `no-adhoc-sheet`), with the
   ledger/overrides as the pressure valve.
3. **Grammar `composition/*` `must` (hard).** C4 (variant parity) and C6 (two
   components for one job) already exist; the screen-audit can flag "this screen
   rolled its own table." **Only a human ratifies `must`** (existing rule), and
   **overrides** provide scoped, auditable waivers — so "insist" never becomes
   "trapped."

The escape hatch is structural: composites are built on primitives, so dropping
down is always one import away.

## 7. Separate package? — Recommendation: **No**, with a middle ground

A second package fragments theming, VR baselines, and the single grammar/audit
domain — and the layers proposal already rejected it for those reasons.

**Middle ground if a visible boundary is wanted:** a **subpath export tier inside
`ui-react`** — `@constructor-lab/ui-react/composites` — plus the existing
`layer: composite` field and the docs "Composites" section. That yields the
"these are the opinionated ones, prefer them" signal and tree-shaking, without a
second package or a second consistency domain. **This is the recommendation.**

## 8. Open questions

1. **Where does config-driven stop becoming "its own product"?** A schema-driven
   `FormLayout`/`DataGrid` edges toward a mini-framework — the same risk the
   demo-console proposal flagged for a runtime `screen.yaml` renderer. Proposed
   line: composites render **fixed structure from data**; anything needing a
   runtime interpreter is out of scope.
2. **TanStack in the public API.** `DataGrid` bakes in `ColumnDef` (as `DataTable`
   already does). Acceptable, or wrap it behind a neutral column type?
3. **Enhance `DataTable` vs add `DataGrid`.** Bundling toolbar/pagination _into_
   `DataTable` is breaking; a new `DataGrid` is additive. Lean additive.
4. **Generic vs domain-specific.** Keep composites generic (`DataGrid`) and leave
   domain composites (`ProtectionTable`) to apps/MFEs? (Repo leans generic.)
5. **`must` vs `should` for `prefer-*` rules** — how aggressively to block ad-hoc
   assembly, given only humans may ratify `must`.
6. **Controlled/uncontrolled + i18n/RTL conventions** for config-driven composites,
   and the **combinatorial VR burden** (many `state` × `variant` baselines).

## 9. Implementation plan

- **Phase 0 — Ratify the model (docs only).** Fold §3 (two-layer contract) and §4
  (decision rule) into `component-layers-proposal.md` or keep this doc as the
  companion; add an optional `apiStyle` field to the composite spec schema. Pick
  the pilot.
- **Phase 1 — Pilot `DataGrid`.** Build on `Table` + TanStack; graduate the
  `table-view` pattern (`implementedBy: DataGrid`); ship the full deliverable
  (7-file spec `layer: composite`, tests, hand + generated stories, light+dark VR
  baselines, docs page, changeset) using the same `/react-component` →
  `/figma-component` recipe. This establishes the config-driven composite recipe
  end-to-end.
- **Phase 2 — `ConfirmDialog` + `FormLayout` + `DetailList`.** Each graduates its
  pattern.
- **Phase 3 — Enforcement.** Grow `acronis-patterns` into the `prefer-*` plugin
  (warn-first), wire the `composition/*` grammar rules + ledger entries, and
  (optionally) add the `/composites` subpath export tier.
- **Phase 4 — Remaining candidates on demand** (`CardGrid`, `StatRow`, `FilterBar`,
  `WizardDialog`, `DashboardGrid`) once each is used in ≥2 screens. Feed them into
  the screen-audit and the demo-console templates gallery.

## 10. Non-goals

- Reducing or changing any **primitive's** public surface.
- A **separate composites package** (see §7).
- A **runtime `screen.yaml` interpreter** or app generator (that is the
  demo-console proposal's territory).
- **Domain-specific** composites in the shared library (they belong in apps/MFEs).
