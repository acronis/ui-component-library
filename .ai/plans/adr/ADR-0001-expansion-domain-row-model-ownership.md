# ADR-0001: TanStack's expand row model belongs to `tree`, not `detailExpansion`

- **Status:** **Accepted** by the team lead, 2026-07-27, after design-gate review
  (`.ai/team/table-parity-p1/design/da-review.md` — the deciding fact was
  re-verified against the installed build output and survived).
- **Date:** 2026-07-27 (revised same day: NB-1 quotation, reduced render-layer
  consequence, OQ-1 decided, OQ-2 added)
- **Deciders:** team lead (accept/reject); architect (author)
- **Scope:** `packages/ui-react` DataTable engine + render layer
- **Context inputs:** `.ai/team/table-parity-p1/explore/researcher-engine.md`
  (cross-cutting gap #1), `context/table-feature-parity-design.md` §3.2, §3.5,
  §6.7, §7, §10.6
- **Confidence:** High (the deciding facts are verified in the installed
  TanStack source, not inferred)

## Context

`detailExpansion` and `tree` are two of the seven unshipped P1 behavior groups.
The design (§3.2) requires them to be fully independent: *"Detail and tree
expansion never share an ID namespace, state key, callback, or reset action."*
At the **state** layer they already are — `detailExpanded` and `treeExpanded`
are separate slices, separately reconciled, separately toggleable, and
`data-table-controller.test.tsx:742-762` pins that independence today.

At the **engine** layer they are not. TanStack Table v8 ships exactly one
expand/collapse feature (`state.expanded` + `getExpandedRowModel()` +
`onExpandedChange` + `row.getIsExpanded()`/`getCanExpand()`/`toggleExpanded()`),
and `data-table-controller.ts` binds all of it to `detailExpanded`:

- `data-table-controller.ts:574` — `expanded: setToRecord(normalizedState.detailExpanded)`
- `data-table-controller.ts:625` — `getExpandedRowModel()` installed when `detailEnabled`
- `data-table-controller.ts:679-685` — `onExpandedChange` writes back to `detailExpanded`

`tree` needs an expand/collapse row model too, and nothing today reads
`treeExpanded` to decide which subrows are visible. Whoever picks up either
group first forecloses the other. This ADR resolves that, because it is the
single decision gating the most downstream work (`tree` blocks `grouping`;
`grouping` and `tree` jointly determine the render layer's row-kind shape).

### The fact that decides it

Verified against the installed `@tanstack/table-core@8.21.3`
(`build/lib/utils/getExpandedRowModel.js`):

```js
function getExpandedRowModel() {
  return table => memo(
    () => [table.getState().expanded, table.getPreExpandedRowModel(), table.options.paginateExpandedRows],
    (expanded, rowModel, paginateExpandedRows) => {
      if (!rowModel.rows.length || (expanded !== true && !Object.keys(expanded ?? {}).length)) {
        return rowModel;
      }
      if (!paginateExpandedRows) {
        // Only expand rows at this point if they are being paginated
        return rowModel;
      }
      return expandRows(rowModel);
    }, …);
}

function expandRows(rowModel) {
  const expandedRows = [];
  const handleRow = row => {
    expandedRows.push(row);
    if (row.subRows?.length && row.getIsExpanded()) {
      row.subRows.forEach(handleRow);
    }
  };
  rowModel.rows.forEach(handleRow);
  return { rows: expandedRows, flatRows: rowModel.flatRows, rowsById: rowModel.rowsById };
}
```

`getExpandedRowModel()` walks **`row.subRows` only**. It is a *subrow-visibility*
stage and nothing else. For a dataset without `getSubRows` — which is every
current detail-expansion consumer — it returns the input row model unchanged.

The wrapper's `paginateExpandedRows` branch is the stage's one other behavior,
and it is a tree concern too: `true` (the default,
`build/lib/features/RowExpanding.js:27`) expands before the page slice, so
descendants consume page slots; `false` makes `getPaginationRowModel` slice
roots first and expand after. The option is
`'rejected-library-contract'` (`data-table-engine-options.ts:111`), so the
library owns the choice — see OQ-2.

The corollary is that **`getExpandedRowModel()` does no work for detail
expansion today.** It is installed (`:625`) but is an identity transform. Detail
rows are produced entirely by the render layer:
`data-table-view.tsx:367-376` appends an extra `<TableRow>` when
`renderExpandedRow && row.getIsExpanded()`. The only thing detail expansion
actually consumes from the TanStack feature is `row.getIsExpanded()` — a boolean
lookup into a row-ID-keyed record that the `detailExpanded` slice already is.

The same source shows the feature is *tree-shaped by construction*:
`row.getCanExpand()` defaults to `!!row.subRows?.length`
(`build/lib/features/RowExpanding.js:149`), and `paginateExpandedRows` exists to
control whether expanded **descendants** consume page slots. Both are tree
semantics. Detail expansion has to override `getCanExpand` (via the deprecated
`getRowCanExpand` prop) precisely because the default is wrong for it.

So the scarce resource is not contested on equal terms: one claimant needs the
feature's actual behavior, the other only needs a boolean it already owns.

## Decision

**Bind TanStack's `expanded` feature to `treeExpanded`. Make `detailExpansion`
a library-owned render-layer projection over the `detailExpanded` slice, with no
TanStack row-model involvement.**

Concretely:

1. `state.expanded` is sourced from `treeExpanded`; `onExpandedChange` routes to
   `requestChange('treeExpanded', …)`; `getExpandedRowModel()` is installed when
   `tree` is enabled, not when detail is.
2. `getSubRows` continues to feed the core row model. With (1), `treeExpanded`
   now actually gates descendant visibility — the missing wire from the
   inventory's `tree` row is a two-line change once this ADR lands, not a custom
   row-model stage.
3. Detail expansion reads `detailExpanded` directly through the controller. Its
   `isExpandable` predicate is a library predicate evaluated by the detail
   feature, not TanStack's `getRowCanExpand`.
4. The detail row is a **display row**, not a row-model row: it never enters
   `getRowModel().rows`, never consumes a pagination slot, and never appears in
   `flatRows`/`rowsById`. See "Consequences for the render layer".

### Why the pipeline order still holds

Design §3.5 specifies:

```text
core/tree relationships -> filter -> group roots -> sort -> tree expand
-> detail-row projection -> paginate -> virtual presentation
```

TanStack's native stage order is core → filter → group → sort → **expand** →
paginate. Binding `expanded` to `tree` makes the engine's order match the
design's for every stage the engine owns. The one divergence is that this ADR
places **detail projection after pagination** (in the view) rather than before
it. See open question OQ-1 below — this is a design-text conflict I am flagging,
not silently resolving.

## Ratified deviation (F1, landed `e28bcd0`)

The decision above says `state.expanded` binds to `treeExpanded`
**unconditionally**. That is not implementable, and the reason is a constraint
this ADR created for itself: `data-table.test.tsx` is in F2's read-only guard
set, and its tests call `row.getIsExpanded()` / `row.toggleExpanded()` from the
caller's *own* column defs and expect the detail panel to follow. On the frozen
legacy path those row methods are the only handle a caller has, so moving them
to the tree domain breaks a suite that is not allowed to change.

**What shipped, and what the team lead ratified** — verified in
`data-table-controller.ts:604-609`:

```ts
const legacyDetailBinding = usesLegacyExpansion && !treeEnabled;
const expandedSlice = legacyDetailBinding ? 'detailExpanded' : 'treeExpanded';
```

`state.expanded` binds to `treeExpanded` **except** on the frozen legacy path —
`getRowCanExpand`/`renderExpandedRow` present *and* no tree configured — where it
stays on `detailExpanded` as a **pure boolean carrier**: no expand row model is
installed (`:689` gates `getExpandedRowModel()` on `treeEnabled` alone), so the
slice only feeds `row.getIsExpanded()`. Nothing about the row model or the
pipeline changes; the deviation is confined to which slice a boolean lookup
reads.

**Removal condition.** This branch dies with the deprecated aliases it exists
for, in the next major (design §10.8). It is not a permanent dual binding, and
no new code should reach it: the branch requires `usesLegacyExpansion`, which
only the two deprecated props set.

**Two ratified additions from the same unit:**

1. **`getSubRows` on its own now means tree.** Previously it fed the core row
   model while `expanded` was bound to detail, so subrows nested but never
   toggled. It now implies `treeEnabled`, which is what makes the primary
   binding useful without a `tree` config. This is the behavior change the ADR
   predicted for the `getSubRows` + `renderExpandedRow` combination, and the
   characterization test in F1's Done item 3 pins it.
2. **`DataTableController.getExpansion()`** (`:307`, `:850`) is new. Once
   detail-expandability stops being TanStack's `getRowCanExpand`, the predicate
   has nowhere else to live — it is not a state slice, not a TanStack option, and
   not per-row render context. A controller accessor is the right home, and it is
   additive to the public surface.

## Alternatives rejected

**A. Keep `expanded` on `detailExpanded`; hand-roll a tree-visibility stage.**
Rejected. It requires reimplementing subrow flattening, `paginateExpandedRows`,
and `getExpandedDepth` outside TanStack while the real `getExpandedRowModel()`
still runs above it as a no-op. Two competing meanings of `row.getIsExpanded()`
would coexist on the same row object. `getCanExpand()`'s subrow-based default
would keep reporting tree truth to a detail consumer. It assigns the feature to
the claimant that does not use its behavior and forces the claimant that does to
rebuild it — strictly more code for strictly worse semantics.

**B. Multiplex one `expanded` record with namespaced keys (`detail:<id>`, `tree:<id>`).**
Rejected. `row.getIsExpanded()` looks up `state.expanded[row.id]` by exact row
ID; there is no hook to remap it without shadowing row methods, which the
adapter contract forbids (design §4.1: hooks "cannot replace … controller
methods"). It also directly violates §3.2's "never share an ID namespace [or]
state key" and would collapse the separate `aria-expanded`/`aria-controls`
targets §7 requires.

**C. Two TanStack instances, one per expansion domain.**
Rejected. Contradicts the design's central decision (§1: one controller owns the
only engine instance; §12: "chrome and body share one controller") and
reintroduces exactly the split-instance defect P0.2 fixed. Doubles reconciliation
and request-key emission.

**D. Deliver the second expand model as a public `DataTableEnginePlugin`.**
Rejected. The registrar can only add a plugin's own namespaced `rowModels.*`
surface; §4.1 forbids a plugin from replacing or inserting a stage into the
canonical pipeline (confirmed as inventory gap #4). Tree visibility *is* a
canonical stage.

**E. Ship `tree` without pagination interaction (tree only in unpaginated grids).**
Rejected as a partial cut. Under this decision the tree/pagination interaction is
a *one-line option choice* (OQ-2) rather than new machinery, so the cut removes a
supported combination and saves nothing. It saves nothing only once OQ-2 is
answered — that is the whole cost.

## Consequences

### For the controller (`data-table-controller.ts`)

- `detailEnabled` stops gating `getExpandedRowModel()`; a new `treeEnabled` gate
  takes it.
- The deprecated `getRowCanExpand`/`renderExpandedRow` props continue to
  normalize into detail expansion exactly as §10.6 requires, but now through the
  library predicate/renderer rather than through TanStack. **Output must be
  byte-identical** — the P0.1 characterization tests are the guard.
- One behavior change exists and it has no consumer: today a caller supplying
  *both* `getSubRows` and `renderExpandedRow` gets a single conflated expand
  state; afterwards they get two independent ones. A repo-wide grep finds no
  call site combining them (`getSubRows` appears only in
  `data-table-controller.test.tsx:346`, `data-table-controller-types.test.ts`,
  and the hand-rolled `data-table-recipes.stories.tsx` bypass; the legacy
  expansion props appear only in flat-data tests/stories and
  `apps/demos/src/data-table/DataTableExpandableRows.tsx`). Add a
  characterization test for the combination rather than assuming it stays
  unused.

### For the render context (`data-table-render-context.ts`) — a public type change

`DataTableRowContext.isExpanded` / `.canExpand` / `.toggleExpanded`
(`data-table-render-context.ts:44-47`, factory at `:129-133`) are currently
ambiguous: they proxy TanStack's row methods, which today mean *detail* and
after this ADR would silently mean *tree*. A silent meaning-flip on an exported
type is the one outcome to avoid.

Required shape:

- Add `row.detail = { isExpanded, canExpand, toggle }` and
  `row.tree = { isExpanded, canExpand, toggle, depth, hasChildren, loadState }`.
- Keep `isExpanded`/`canExpand`/`toggleExpanded` as **deprecated aliases of the
  `detail` domain** for the compatibility minor. Because today's values are
  driven by `detailExpanded`, aliasing them to detail is a zero-behavior-change
  migration; aliasing them to tree would be a silent break.
- Remove the aliases in the same major that removes the other table
  compatibility adapters (design §10.8).

This is a public-contract addition plus a deprecation, not a break. It is the
justification this ADR exists to record (`packages/ui-react/AGENTS.md`: no
breaking changes to published component APIs without an ADR).

### For the view (`data-table-view.tsx`) — the row-kind consequence

**Scope correction (design-gate review).** An earlier draft of this ADR framed
this as "moving detail rows out of the row model". That was wrong, and the
correction matters because it shrinks the blast radius: **detail rows were never
in the row model.** They are appended by the view at
`data-table-view.tsx:367-376`, inside the same `<Fragment key={row.id}>` as their
parent record row. The review checked each consumer that could have depended
otherwise — selection (`row.getIsSelected()` per record row; DataGrid's
select-all uses `table.getIsAllPageRowsSelected()`), `emptyColSpan` (computed
from `getVisibleLeafColumns()`), the detail row's own `colSpan` (per-parent), and
every existing test — and found no dependency. Nothing observable changes here.

What this decision actually requires of the view is narrower: the row-kind
concept has to become **explicit and extensible**, because `tree`, `grouping`
and `footer` each add a kind and the current single hard-coded special case
cannot carry three more. That is the inventory's cross-cutting gap #3.

**The engine produces record rows; the view derives a display-row list.**

```ts
type DataTableDisplayRow<TData> =
  | { kind: 'data';        row: Row<TData>; depth: number }
  | { kind: 'detail';      parent: Row<TData>; domId: string }
  | { kind: 'group';       groupId: string; depth: number }
  | { kind: 'tree-status'; parent: Row<TData>; status: 'loading' | 'error' }
  | { kind: 'footer';      scope: 'table' | 'group' };
```

Consequences that follow from this and are binding on later units:

1. **Pagination counts records, not display rows.** A `pageSize` of 25 renders 25
   `kind: 'data'` rows plus whatever detail/status rows they project. This is the
   shipped behavior and the pagination UI's counts already assume it.
2. **Virtualization windows the display-row list**, not `getRowModel().rows`.
   That is what makes design §7's "virtual rows preserve row index/count
   metadata" satisfiable: logical identity lives on the record row, geometry
   lives on the display row.
3. **Tree descendants are `kind: 'data'`**, produced by the engine, with `depth`
   from `row.depth`. Indentation is presentation over that depth. Group rows and
   tree-status rows are synthetic and carry no record ID — satisfying §6.5
   ("Synthetic group rows are never record IDs").
4. **ARIA targets separate cleanly.** The detail display row owns
   `${tableId}--detail--${base64url(rowId)}`; the tree child group owns
   `${tableId}--tree--${base64url(rowId)}` (§7). `aria-controls` is emitted
   exactly when the corresponding display row is in the list — which is now a
   directly observable condition rather than an inference.
5. **Accordion mode (§6.7)** is a detail-domain rule only: opening a second
   detail row closes the previous one and provably cannot collapse a tree node,
   because the two live in different slices and different display-row kinds.
6. **Keyboard roving focus must keep indexing records, not display rows.** This
   is the one real regression risk the display-row list introduces, found by the
   design-gate review. `setCurrentAndFocus` indexes `rows` positionally
   (`data-table-view.tsx:117-124`) and `rowIndex` (`:216`) is the record-row
   index; if the view iterates display rows naively, Arrow-Down from a row with
   an open detail panel lands on the panel. The existing arrow-navigation test
   (`data-table-root-view.test.tsx:414-430`) renders a table with no detail rows
   and cannot catch it. **A test covering arrow navigation across an expanded row
   is required** — assigned to F1 in the decomposition.

Building the display-row list is **foundation work that must land before any of
`tree`, `grouping`, `footer`, or `virtualization`** — see
`.ai/plans/PLAN-table-parity-p1-decomposition.md`, unit F2.

### For the neutral spec

No `api.yaml` change: both groups are already declared. The acceptance scenarios
already exist and become executable under this decision without edit:

- `packages/ui-spec/components/data-table/behavior.md:387-394` — "Detail and tree
  expansion are separate"
- `packages/ui-spec/components/data-grid/behavior.md:218-225` — "Expansion and
  lazy tree are independent"

## Decided: OQ-1 — a detail row does not consume a pagination slot

**Decided by the team lead, 2026-07-27.** A detail row is a view-layer
projection rendered after pagination. `pageSize: 25` means 25 records, which
keeps it in agreement with the counts the pagination UI already reports, and it
is the shipped behavior.

**Consequence, recorded so it cannot resurface as folklore:**
`context/table-feature-parity-design.md` §3.5 orders the pipeline
`… -> tree expand -> detail-row projection -> paginate -> virtual presentation`.
That text says a detail row precedes the page slice, which is **not** what the
library does. The design document needs an amendment moving detail projection
after pagination, and noting that it is a render-layer stage rather than a
row-model stage — the row model never contains a detail row (see the scope
correction above). Expressing it the other way would require synthetic rows in
`flatRows`/`rowsById`, which collides with §6.5's "synthetic group rows are never
record IDs".

Amendment ownership: `context/table-feature-parity-design.md` is a durable
context document, not a decomposition artifact. **Flagging for the team lead to
route** — tech-writer is the natural owner, with this ADR as the source. It
should land before F2, so that a developer reading §3.5 does not implement the
superseded order.

## Decided: OQ-2 — tree descendants *do* consume pagination slots

**Decided by the team lead, 2026-07-27, and subsequently found to be a
confirmation of existing behaviour rather than a change to implement.** Tree
descendants consume pagination slots because `paginateExpandedRows` **defaults**
to `true`, and expansion therefore runs before the page slice.

**Correction to an earlier wording of this section:** it said the option "is set
to `true`". It is deliberately **left unset** — U2 proved the behaviour by running
(`pageSize: 2` with a parent and two children yields `['p1','c1']`, displacing
`p2`; `pageSize: 4` yields `['p1','c1','c2','p2']`), and writing the default
explicitly would move `table.options.paginateExpandedRows` from `undefined` to
`true` for zero behavioural gain. The rationale is recorded in the source at
`data-table-features/tree.ts:22-24`.

The two expansion domains resolve **opposite ways, deliberately**, and the
reason is the same distinction the whole ADR turns on:

| | Is it a record? | In the row model? | Consumes a page slot? |
| --- | --- | --- | --- |
| Detail row | No — a presentation of a record already on the page | No, never | **No** (OQ-1) |
| Tree descendant | Yes | Yes, before pagination | **Yes** (OQ-2) |

Design §3.5 orders `tree expand -> paginate`, so here the design text and the
TanStack default already agree — no amendment is needed for OQ-2, unlike OQ-1.
The option remains `'rejected-library-contract'`
(`data-table-engine-options.ts:111`), so the library sets it and no caller can
override it.

**Consequence for U2:** "page size" for a tree grid means 25 *rows* including an
expanded parent's visible children, not 25 roots. Worth stating even though no
code changes, because a reader who assumes the opposite will read the row counts
as a bug. U2's brief carries it, along with the running evidence.
