# ADR-0002: A library-owned internal feature-module registry across DataTable and DataGrid

- **Status:** **Conditional go** from the team lead, 2026-07-27, *with extended
  scope*. Revised after the design-gate review
  (`.ai/team/table-parity-p1/design/da-review.md`, blockers BL-1/2/3/4/5), which
  found the architecture sound but the original scope boundary too narrow to
  deliver the fan-out it exists for, and the acceptance criterion not
  load-bearing.
- **Date:** 2026-07-27 (revised same day)
- **Scope:** `packages/ui-react/src/components/ui/data-table` **and**
  `.../data-grid` internal structure. *(Widened from data-table-only — see BL-2
  below; a DataTable-only registry buys nothing, because every Wave 1 unit is
  defined as engine half plus DataGrid chrome.)*
- **Confidence:** Medium-High on the design; **Low-Medium on the effort
  estimate** — the scope grew substantially in this revision and the DataGrid
  half (F4) is now comparable in size to the DataTable half (F2).
- **Enables:** the Wave 1/2 fan-out in
  `.ai/plans/PLAN-table-parity-p1-decomposition.md`

## Context

Seven behavior groups remain. Nearly all of them must change the same handful of
files, and developers share **one checkout** — there is no merge step, so two
agents writing one file clobber each other, and a one-line edit is a whole-file
write. Disjoint file ownership is the only available mechanism, and with the
current file layout there is no disjoint partition.

The contended surfaces, as re-verified by the design-gate review:

| Surface | Why every feature touches it |
| --- | --- |
| `data-table-controller.ts:579-694` | the single `useReactTable({…})` option literal, ~20 conditional spreads |
| `data-table-controller.ts:167-198`, `:232-238` | three hand-listed options unions naming every feature key |
| `data-table-view.tsx:216-379` | one flat `rows.map(…)` with a single hard-coded special case |
| `data-table-render-context.ts` | one context factory per shape, no extension point |
| `data-grid.tsx` — eight distinct sites | interface, a **total-record** `satisfies`, resolved-shape interface, resolver, destructure, options assembly, column assembly, render body |

Three of those are contended *by construction*: a
`satisfies Record<keyof DataGridGroupedConfig<unknown>, …>` total record
(`data-grid.tsx:378-391`) makes the file fail to compile until every new group
key is added to it; a hand-listed union cannot be extended from elsewhere; and a
render body is the only place chrome can mount.

The public `plugins` input cannot absorb any of this: design §4.1 forbids a
plugin from "replac[ing] or insert[ing] a stage into the canonical DataTable
pipeline". That prohibition is about **third-party** extension. It says nothing
about how the library organizes its own features — and TanStack's own
architecture is exactly this (`RowExpanding`, `RowSelection`, `ColumnSizing` …
are internal feature modules composed into one table).

## Decision

Introduce **two symmetric library-owned module registries**, both distinct from
and unrelated to the public `plugins` input:

- `data-table/data-table-features/` — one module per engine feature
- `data-grid/data-grid-config/` — one module per grouped config group

### DataTable feature module

```ts
interface DataTableFeatureModule<TData, RowId extends string> {
  readonly id: DataTableFeatureId;
  /** Conditional TanStack options this feature contributes, or nothing. */
  engineOptions?(ctx: FeatureContext<TData, RowId>): Partial<TableOptions<TData>>;
  /** Display rows this feature contributes for a given record row. */
  displayRows?(ctx: DisplayRowContext<TData>): readonly DataTableDisplayRow<TData>[];
  /** Renders a display-row kind this feature owns. Required for every kind
   *  the feature's `displayRows` can emit, other than `kind: 'data'`. */
  renderDisplayRow?(row: DataTableDisplayRow<TData>, ctx: ViewContext<TData>): ReactNode;
  /** Fields this feature adds to the row/header/cell render contexts. */
  renderContext?(ctx: FeatureContext<TData, RowId>): RenderContextContribution<TData>;
  /** Per-column presentation, including the header-cell adornment slot. */
  columnPresentation?(ctx: ColumnContext<TData>): ColumnPresentation;
  /**
   * Reclassifies a row already in `getRowModel().rows`. Distinct from
   * `displayRows`, which appends per record row and cannot reclassify.
   */
  classifyDisplayRow?(row: Row<TData>, ctx: DisplayRowContext<TData>): DataTableDisplayRowKind | undefined;
  /** Table-scoped display rows that hang off no record row (footer). */
  tableDisplayRows?(ctx: ViewContext<TData>): readonly DataTableDisplayRow<TData>[];
  /** Props for a record row's `<TableRow>` — `expanded`, `sticky`, `stickyOffset`. */
  rowPresentation?(row: Row<TData>, ctx: ViewContext<TData>): TableRowPresentation;
  /** Runs an effect in fixed manifest order. Persistence restore lives here. */
  effects?(ctx: FeatureContext<TData, RowId>): void;
}

interface ColumnPresentation {
  /** Applied to the column's <TableHead> and every <TableCell>. */
  readonly style?: StyleValue;      // width, min/max-width, sticky offsets
  readonly className?: ClassValue;
  /** Rendered inside <TableHead>, in placement order. The header-cell seam. */
  readonly headerAdornments?: readonly ColumnAdornment[];
}

interface ColumnAdornment {
  /** Unique across contributing features; a collision throws. */
  readonly id: string;
  readonly placement: 'before-label' | 'after-label' | 'edge';
  readonly node: ReactNode;
}
```

`renderDisplayRow` is the fifth contribution point (BL-3a's sibling). Without it,
ADR-0001's `group`, `tree-status` and `footer` display-row kinds carry data but no
renderer, and `data-table-view.tsx` has no owner after F2 while four units need
it.

**Points six through nine were added from F2's survey**, each closing one
instance in the table above:

- **`classifyDisplayRow`** — TanStack's `getGroupedRowModel()` puts group rows
  *into* `getRowModel().rows`, so `kind: 'group'` is a **reclassification of a row
  already in the list**, not an insertion. `displayRows` is per-record-row and
  appends; it structurally cannot reclassify.
  `ui-spec/components/data-table/behavior.md:424` agrees ("only root rows are
  classified").
- **`tableDisplayRows`** — a table-scoped footer row hangs off no record row and
  belongs in `<TableFooter>`, not `<TableBody>`. No per-row hook can emit it.
- **`rowPresentation`** — F3 shipped `TableRow.expanded`, `sticky` and
  `stickyOffset`, but `ColumnPresentation` is keyed by **column**, so nothing
  could set a record row's `<TableRow>` props. See instance 7 above; this is the
  asymmetry the registry exists to prevent.
- **`effects`** — runs in fixed manifest order, so hook order is stable. Without
  it the plan's decided DataTable-side persistence restore engine is
  unimplementable.

`ColumnPresentation` was previously left as prose — "width, pin offset, …" — and
never defined, which left U3 with nowhere to render a resize handle or reorder
grip: `data-table-view.tsx:163-179` builds `<TableHead>` with fixed children, and
neither F3's pin-offset hook nor the DataGrid body slots reach inside a header
cell. `headerAdornments` is that seam. It needs no `table.tsx` change —
`TableHead` already merges `className` via `cn()` and spreads props, so an
`edge`-placed handle positions itself from the same contribution.

### The body-window seam

Virtualization cannot be expressed as a per-row contribution — it wraps the
whole list. F2 therefore extracts the body render into a single named seam
(`data-table-body-window.ts`) exporting an identity implementation that maps
every display row. U6 replaces that one file. No contribution point is added for
it; the seam *is* the mechanism.

### DataGrid config module

```ts
interface DataGridConfigModule<TData> {
  readonly key: keyof DataGridGroupedConfig<TData>;
  /** Deprecated flat aliases that normalize into this group. */
  readonly aliases: readonly string[];
  /** Normalizes props + aliases into this group's resolved values. */
  resolve(props: DataGridProps<TData, unknown>): { value: unknown; warnings: readonly string[] };
  /** Controller options this group contributes to `useDataTable({…})`. */
  controllerOptions?(resolved: unknown): Partial<DataTableControllerOptions<TData>>;
  /** Props this group contributes to `<DataTableView …/>`. */
  viewProps?(resolved: unknown, ctx: DataGridViewContext<TData>): Partial<DataTableViewProps<TData>>;
  /**
   * Transforms the column list. Applied in manifest order — NOT an injector.
   * Receives the running list and returns the next one.
   */
  columns?(input: readonly ColumnDef<TData, unknown>[], ctx: DataGridColumnContext<TData>): readonly ColumnDef<TData, unknown>[];
  /** Chrome this group mounts into a named slot in the DataGrid body. */
  chrome?(slot: DataGridChromeSlot, ctx: DataGridChromeContext<TData>): ReactNode;
  /**
   * Named callbacks this group adds to `DataGridCallbacks`, each mapped to the
   * state slice it observes, or `null` when the module wires it directly
   * (`onTreeLoad`, `onScroll`, `onRowAction`).
   */
  readonly callbacks?: Readonly<Record<string, DataTableSlice | null>>;
}
```

`columns`, `chrome`, `viewProps` and `callbacks` are the contributions added for
BL-2 and its two follow-ons. They are what let a Wave 1 unit mount its expander
column, its `ButtonIcon`/`Collapsible` chrome, its view props and its named
callback without opening `data-grid.tsx`.

**`columns` is a transform, not an injector** — corrected from the build face
after F4's developer checked it against `data-grid.tsx:876-934`, and verified
here. The shipped code does three structurally different things: `filters`
**maps over** existing columns to attach `operatorFilterFn`; `actions`
**splices** at start or end per `placement`; `selection` **prepends**
`__select__`. Only the third is injection. A running-list transform expresses all
three, and **the manifest order `filters → actions → selection` reproduces
today's output byte-for-byte**, including `actions.placement: 'start'` (actions
lands before the data columns, then selection prepends ahead of it). That order
is load-bearing; pin it with a test.

**`viewProps` was missing and its first customer is U9.** The other points reach
the render body's chrome but not `<DataTableView …/>`'s hand-listed prop
surface. U9's appearance cluster — `size`, `background`, `height`, `maxHeight`,
`stickyHeader`, `showHeader`, `borders` — is precisely a set of new
`DataTableView` props, so without this point U9 must reopen `data-grid.tsx` and
the registry fails on its first real customer.

`DataGridGroupedConfig`, `GROUPED_CONFIG_ALIASES` and `ResolvedDataGrid` move out
of `data-grid.tsx` into `data-grid-config/` and are **derived from the registry**
rather than hand-listed, so the total-record `satisfies` stops being a forcing
function. The type-level half uses interface augmentation from each module's own
file:

```ts
// data-grid-config/tree.ts
declare module './registry' {
  interface DataGridGroupedConfigMap<TData> {
    tree: false | TreeConfig<TData>;
  }
}
```

### The recurring failure mode — read this before adding a contribution point

**This registry's characteristic defect is a contribution point that does not
reach a surface a later unit needs.** It has now been found **seven times**, by
four different parties:

| # | Surface | Found by |
| --- | --- | --- |
| 1 | `<TableHead>` fixed children — no header-cell seam | design review (BL-3a) |
| 2 | `DataTableToggleAction` — no path for `measureLayout()` | design review (BL-3b) |
| 3 | `DataTableViewProps` — 17 hand-listed props, nothing reaches them | F4's build face |
| 4 | `DataGridCallbacks` — 13 of 17 members, four claimants | the sweep below |
| 5 | Group rows are **reclassified**, not appended — `displayRows` can only append | F2's survey |
| 6 | A table-scoped footer row hangs off no record row | F2's survey |
| 7 | `TableRow.expanded`/`sticky`/`stickyOffset` — `ColumnPresentation` is keyed by *column* | F2's survey |

Plus one adjacent instance: `effects` — the plan had already decided the
persistence restore engine belongs to DataTable, but no point ran an effect, so
that decision was **unimplementable** and U10 would have smuggled it through a
render-nothing component in a chrome slot.

**The mirror image, found by the build review — and arguably worse.** Every
instance above is *a surface no point can reach*. The build phase found the
inverse: **points that reach nothing.** Three declared capabilities had no wiring
behind them —

| Declared | Reality |
| --- | --- |
| `DataTableFooterConfig.sticky` | `data-table-view.tsx` renders `<TableFooter>` with no props; no seam reaches the section element |
| `bodyWindow.measureRow` | declared in the seam signature, never called from the view — so `measure: 'dynamic'` is unbuildable |
| `bodyWindow.scrollToRecord` | same, plus the controller arm throws and there is no view→controller bridge |

Why this is the worse failure: a missing seam **fails at the type level** the
moment a unit tries to use it, and the unit escalates. A declared-but-unwired
capability **type-checks perfectly** — the unit reads the README, sees its
capability listed, builds against it, and discovers the emptiness at runtime, or
worse, in review. The registry's own documentation becomes the thing that misleads.

**A third variety, and it fails at neither of the two times above.** The family
now has three shapes, distinguished by *when* each one fails — which is also the
order of how hard they are to diagnose:

| Shape | Fails at | Instances |
| --- | --- | --- |
| A surface no point can reach | **type level**, immediately | seven |
| A point that reaches nothing | **runtime** | three (`footer.sticky`, `measureRow`, `scrollToRecord`) |
| **A point whose reach nothing asserts** | **neither** — surfaces later, and is **misattributed to the consuming unit** | one (`renderContext`'s nested merge) |

The instance: `renderContext`'s nested `detail`/`tree` merge demonstrably works,
but delete `NESTED_CONTEXT_NAMESPACES` (`data-table-render-context.ts:31`) and
**nothing fails** — while U2's `loadState` would silently eat `depth`. The cost
lands on U2, in U2's code, for a defect in the registry.

The third is the worst of the three precisely because the bill goes to the wrong
developer. And note **the two-halves test as written would pass it**: there *is* a
consumer and there *is* an assertion — just not one covering the mechanism.

**So the test has three halves.** Ask all three, at every wave boundary:

1. *Which unit's surface can no point reach?* (a missing point)
2. **Which declared point is never called by the code that would have to call
   it?** (a decorative point)
3. **Which mechanism would survive deletion with every test still green?**
   (an unasserted point). Equivalently, and this is the operative form: **an
   assertion must be capable of failing on the defect it claims to cover, in the
   configuration its named consumer will actually use.** An assertion that passes
   both with and without the mechanism is documentation, not a guard.

The second is mechanically checkable and should be: for every member of a
contribution interface or seam signature, grep the consumer for its name. A
member with no call site in `data-table-view.tsx` (or the relevant consumer) is
decorative until proven otherwise. F2 declared all three of the above with correct
rationale — the declaration was right and the wiring simply had not happened yet,
which is exactly how this failure mode arises without anyone being careless.

**The test for whether a new point is needed.** For every prop, union member, or
attribute that a *hand-written* composition of `DataTable`/`Table` can set, ask:
*which unit will need to set it, and can any contribution point reach it?*

> **If a hand composition can reach a surface and no feature module can, that is
> the defect — not a limitation to work around.**

Instance 7 is the clearest illustration: F3 shipped `TableRow.sticky`, an
application composing `DataTableView` by hand could set it, and no module could,
because the only per-row-ish point was keyed by column. That asymmetry is
precisely what the registry exists to prevent.

**Run the test at each wave boundary**, against the units that become unblocked
next — not once at design time. Five of the seven were found *after* the ADR was
approved, and the two that were not would have been found earlier by asking this
question. A Wave 2 unit discovering the eighth instance is the failure this
section exists to prevent; escalate for a new point rather than routing around a
gap.

### The contribution-surface sweep

Three separate reviews found the same defect shape — *a hand-listed surface that
a later unit must extend, with no contribution point reaching it*. Three
instances is a pattern, so rather than fix them one at a time, every hand-listed
prop list, union, and total record in the table family was enumerated and
checked against the units that will need to extend it.

**Closed by a contribution point:**

| Surface | Claimants | Point |
| --- | --- | --- |
| `<TableHead>` fixed children (`data-table-view.tsx:163-179`) | U3 resize handle, reorder grip | `ColumnPresentation.headerAdornments` |
| `DataTableToggleAction` (`:265-279`) + its `toggle` switch (`:845-876`) | U6 `measure-layout`/`scroll-to-row`, U4 `toggle-group` | F2 pre-declares |
| `DataTableViewProps` (17 hand-listed props) | U9 appearance cluster | `viewProps` |
| **`DataGridCallbacks` (`data-grid-callbacks.ts:79-102`)** | **U1 `onDetailExpansionChange`, U2 `onTreeExpansionChange`/`onTreeLoad`, U4 `onGroupingChange`, U6 `onScroll`** | **`callbacks`** |

The fourth is **new, found by this sweep**. The interface hand-lists 13 members
where design §5.3 specifies 17, and every one of the four missing members
belongs to a different Wave 1/2 unit — a four-claimant shared file with no
mechanism. `resolveSliceCallbacks` (`:118+`) compounds it: a hand-written
`if`-chain mapping each callback to its slice, which the same four units would
each have to edit. Both are derived from the `callbacks` contribution, exactly as
`DataGridGroupedConfig` is derived from `key`/`aliases`.

**Checked and clear — no contribution point needed:**

- `QUERY_SLICES` / `QUERY_RESET_SLICES` / `PAGE_RESET_SLICES`
  (`data-table-controller.ts:63-78`). `grouping` is already listed, and U4's
  group-collapse slice is client-side UI state that does not participate in the
  query. No unit adds a member.
- `DataTableChangeCause` (`data-table-contract.ts:98`). U10 needs `'restore'`,
  which already exists and which nothing currently emits. No unit needs a new
  cause.
- `TANSTACK_TABLE_OPTION_CLASSIFICATION` (`data-table-engine-options.ts`). U3 and
  U7 turn options *on from inside the controller*; the options stay
  `'rejected-library-contract'` because that classification governs what a
  *caller* may pass. No reclassification, no contention.
- `DataTableSlice = keyof DataTableState` (`:91`). Derived — it follows U4's
  contract edit automatically.
- `FILTER_OPERATOR_LABELS` / `DataGridFilterOperator`. Single claimant (U7),
  already in its ownership.

**Flagged, not closed:** `DataTableRenderStatus`
(`data-table-render-context.ts:15`) is `'loading' | 'empty' | 'loaded'` while
`DataGridDataStateConfig` has a fourth status, `'error'`. That is an
inconsistency inside an already-shipped group rather than one of the seven, so
it belongs in the decomposition's slot S1, not in a P1 unit.

### Two invariants that make this safe rather than merely tidy

1. **Order is committed and asserted.** The DataTable feature list is the
   canonical pipeline order from design §3.5. A test pins it, so a feature cannot
   silently reorder the pipeline.
2. **Contributions are additive and collision-checked.** A module may not
   overwrite an option another module set; the composer throws on a duplicate
   key. This reuses the discipline the public plugin preflight already applies
   (§4.1 step 3). It cannot misfire on `normalizedEngineOptions`
   (`data-table-controller.ts:589`): the review confirmed the only
   caller-settable keys are the six `debug*` entries plus `renderFallbackValue`,
   none of which the controller literal sets.

### Scope boundary

**In**
- the feature-gated `useReactTable` option spreads (`data-table-controller.ts:593-639`)
- **the config-key declarations in the three options unions**
  (`:167-180`, `:182-193`, `:232-238`) — F2 pre-declares all seven remaining
  keys, each typed against a `…Config` interface *declared in and owned by* its
  own `data-table-features/<feature>.ts`, so a Wave 1 unit fills in its own file
  and never opens the union (BL-1)
- **the `DataTableToggleAction` union** (`:265-279`) and its `toggle` switch
  (`:845-876`) — the same problem in a second hand-listed union. F2 pre-declares
  `measure-layout` and `scroll-to-row` (U6) and `toggle-group` (U4), so no
  Wave 1/2 unit reopens the controller for a controller action (BL-3b)
- **deriving `STATE_SLICES`** (`:47-61`) from the contract, so a new state slice
  is declared only in `data-table-contract.ts` and `data-table-state.ts` — both
  pre-assigned to U4, which must not open the controller
- display-row derivation, per-kind rendering, and the body-window seam
- per-feature render-context fields, per-column presentation, and the
  header-cell adornment slot
- on the DataGrid side: the grouped-config type/alias/resolved-shape derivation,
  per-group resolution, controller-option contribution, column injection, and
  chrome slots

**Out**
- identity *logic* — `getRowId` handling, the identity-free/identity branch
  discrimination itself, reconciliation. Only the per-feature key declarations
  move; the rules stay in the controller.
- `requestChange`, the controlled/uncontrolled state helper, query and
  request-key emission
- the `engineOptions` allowlist and the public plugin preflight

## Alternatives rejected

**A. Leave the files as they are; serialize every unit that touches them.**
The honest no-refactor baseline, and its cost is precise: seven of seven groups
queue behind the same files. Waves 1–2 support **one** substantive developer.
Rejected as the default, but see "If rejected".

**B. Split horizontally by layer: one dev owns the controller, one the view, one
DataGrid chrome.** Three workers with zero refactor risk, so it is the strongest
alternative. Rejected because it breaks the repo's shippability convention —
every unit lands as component + tests + story + changeset + spec — and no single
layer can satisfy that. Each feature would ship as three cross-developer
handoffs with an integration step, and no unit would be independently
revertable. Reconsider if this ADR is rejected and three workers are still
wanted, accepting the handoff cost.

**C. Use the public `plugins` system for library features.** Forbidden by §4.1
for pipeline stages, and it would put library internals through a preflight
designed to defend against untrusted input.

**D. One file per feature, but each file *is* a patch to the controller.**
Reintroduces order-dependence without making it explicit, and defeats the
collision check.

## Consequences

**Positive**

- Wave 1 and Wave 2 gain real per-feature file ownership across *both* layers:
  `tree` owns `data-table-features/tree.ts` and `data-grid-config/tree.ts` and
  its chrome file, and opens no shared file.
- The four cross-cutting gaps the inventories identified — expand ownership,
  sticky, row kinds, "the plugin system can't do this" — each get exactly one
  home.
- The committed feature order makes design §3.5's pipeline executable and
  testable rather than an invariant living in a comment.

**Negative / risks**

- This is now a refactor of **two** files that are the correctness core of the
  table family (887 and 1148 lines), with no user-visible payload, and it must
  land as a pure characterization-preserving change.
- The DataGrid half (F4) grew from "split one function" to "derive three
  declarations from a registry and add two contribution points". It may not fit
  one Wave 0 unit. **If the F4 owner finds it does not, the correct response is
  to say so and plan the DataGrid half of Waves 1–2 as serialized** — not to
  ship a half-registry that leaves `data-grid.tsx` contended anyway.
- Genuine closure coupling: `onExpandedChange` (`data-table-controller.ts:679-685`)
  reads `table.getCoreRowModel().flatRows` inside an option callback declared in
  the same literal that produces `table` (`:579`). It is TDZ-safe only because
  the callback runs after construction. `FeatureContext` must expose a **lazy
  table accessor**, not the instance, or this breaks silently.
- The sorting option group is order-sensitive: `sortingEnabled` gates both the
  row model and the `enableMultiSort` / `enableSortingRemoval` / `sortDescFirst`
  / `maxMultiSortColCount` set (`:599-618`). The duplicate-key check is across
  modules, not within one call.

## Acceptance criterion

The original criterion — "the five existing suites pass unmodified" — was
**wrong in three ways**, all found by the design-gate review, and it is replaced
wholesale. It named a file that does not exist, omitted the only suite that
characterizes what F2 rewrites, and was not load-bearing at either hazard this
ADR itself names.

**Baseline (BL-4).** "Unmodified" means *unmodified relative to the tree as of
F1's landing commit*, not as of today. F1 lands before F2 and must modify
`data-table-controller.test.tsx` in at least three places
(`:100-146`, `:253-277`, `:399-416`) — each asserts exactly the binding ADR-0001
inverts. F1 records its landing SHA in its handoff.

**Suites that must pass unmodified relative to that baseline:**

| Suite | Why it is load-bearing |
| --- | --- |
| `data-table-controller.test.tsx` (841) | the state machine and row-model gating |
| `data-table.test.tsx` (344) | **added by this revision.** The only end-to-end characterization of legacy expansion *rendering* (`:88-160`) — and F2 rewrites `data-table-view.tsx:216-379`, so it is the single most load-bearing suite for that refactor |
| `data-table-root-view.test.tsx` (486) | root/view wiring. Note it has **no** expansion coverage — do not treat it as one |
| `data-table-state.test.tsx` (467) | **corrected extension** — it is `.tsx`, not `.ts` |
| `data-table-engine-plugins.test.ts` (731) | the public plugin preflight |
| `data-table-engine-options.test.ts` (167) | the compile-time allowlist guard |

These six are F2's **read-only guard set**. F2 runs them; F2 does not edit them.
The decomposition splits F2's `Owns` into "may modify" and "read-only guard" to
match, because an earlier draft granted F2 permission to modify the same files
this criterion forbids it from changing — the two cannot both hold.

**One deliberate exclusion.** `data-table-controller-types.test.ts` (162) was
listed here in the previous draft and is now **additive-only**, not read-only. It
is the compile-time guard for exactly the options unions BL-1 is about
(`:42-53`, `:104-106`, `:136-153`), so pre-declaring five new keys necessarily
grows it. F2 appends assertions for the new keys and leaves the existing ones
untouched.

**Coverage that must be added *before* the refactor commit.** A characterization
test written after a refactor characterizes the refactor, not the behavior it was
supposed to preserve. These are guards, so the ordering is part of the criterion:

1. **The lazy-table closure (hazard A).** The *only* test that reaches the
   `flatRows` argument is `data-table-controller.test.tsx:399-416`, which does so
   by passing `ExpandedState === true` — the sole shape for which the argument is
   used at all. That test is one of the three F1 rewrites, so the guard would
   disappear before F2 needs it, and a `FeatureContext` handing over an eager
   `undefined` table would pass everything. **F1's replacement must still drive
   `options.onExpandedChange?.(true)` and still assert every core row ID.**
2. **The sorting option group (hazard B).** Zero coverage today — a grep for
   `enableMultiSort`, `enableSortingRemoval`, `sortDescFirst` and
   `maxMultiSortColCount` across `data-table/__tests__` and
   `data-grid/__tests__` returns nothing (verified). A feature module could
   silently drop `sortingConfig.cycle` or `maxColumns` and pass every suite.
   **F2 adds option-level assertions for all four in a new file,
   `__tests__/data-table-engine-option-groups.test.ts`, in a commit that precedes
   the refactor commit.** The new file matters: their nearest existing neighbour
   is `data-table-controller.test.tsx:100-146`, which is first in the read-only
   guard set — putting them there would make this requirement and the baseline
   requirement mutually unsatisfiable.
3. **Arrow navigation across an expanded row** (ADR-0001 consequence 6). The
   existing arrow test renders no detail rows and cannot catch the display-row
   indexing regression. Assigned to F1.

**Making the ordering checkable.** "Precedes the refactor commit" is verifiable
with `git log` only if the landing has at least two commits, and nothing forces
that — `.husky/pre-commit` is indifferent to commit count. So: **F2 records its
guard-commit SHA in its handoff, exactly as F1 records its landing SHA.** The
ordering then becomes a fact a reviewer can check rather than an assertion by
the author.

A diff to any suite in the read-only guard set, or a missing pre-refactor guard,
is a signal the refactor changed behavior.

## If rejected

The decomposition still works, with these changes:

- Wave 0 keeps F1 (ADR-0001) and F3 (`table.tsx`) unchanged — neither depends on
  this ADR. F4/F5 shrink back to the type-test split, the toolbar defaults, and
  the `getRowId`/`state` work.
- Waves 1 and 2 collapse to **one** developer working the seven groups in the
  order `detailExpansion → tree → grouping → columnsFeatures → footer →
  virtualization → persistence`, with each group's DataGrid-chrome half
  optionally handed to a second developer once its engine half has landed — a
  pipelined 1.5, not 3.
- Of the reserved-slot units, only **U9** (cheap plumbing — DataGrid-side
  pass-through of controller options that already exist) stays genuinely
  parallel. **U7** (`facets`) and **U8** (`server` completion) both need
  controller edits, so under rejection they join the same queue. Do not plan
  them as parallel fill in that case.
