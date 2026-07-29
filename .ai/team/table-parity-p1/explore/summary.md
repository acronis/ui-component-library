# Explore phase summary — table-parity-p1

Closeout for the Explore phase of `table-parity-p1` on branch
`feat/table-parity`, as of commit `6ad26a7`. Two researchers covered
disjoint halves of the design's 16 behavior groups: `researcher-engine.md`
inventoried the seven groups that don't exist as props at all
(`detailExpansion`, `tree`, `grouping`, `virtualization`, `columnsFeatures`,
`persistence`, `footer`); `researcher-surface.md` inventoried the member
gaps inside the nine groups that already ship, plus `getRowId`,
`state`/`defaultState`, and the `apps/demo` `/data` route as a concrete
case study. This document reads both together; it does not re-verify
either.

**Bottom line:** the programme is not "nine groups done, seven to go."
Only one shipped group (`actions`) matches its designed member list; the
other eight are subsets, and the risk is concentrated in a handful of
shared files rather than spread evenly across groups. A plan that staffs
this work by handing each behavior group to a separate owner and expecting
independent PRs will collide, repeatedly, in the same three files.

## Two findings that should change how this gets planned

**1. The contended files are the three DataTable engine files, not the
DataGrid composite.** Five of the seven unshipped groups
(`detailExpansion`, `tree`, `grouping`, `virtualization`, `columnsFeatures`,
plus `footer`) all need changes to `data-table-controller.ts`,
`data-table-render-context.ts`, and `data-table-view.tsx` — the row-model
pipeline, the render-context factories, and the row-rendering loop. By
contrast, each group's DataGrid-layer work is comparatively
non-contentious: it lands in a new, group-specific chrome file
(`data-grid-detail-expansion.tsx` and siblings) plus an additive entry in
`DataGridGroupedConfig`. The obvious read of "DataGrid parity work" —
that the composite is the shared surface everyone touches — is backwards.
The composite is where the seven groups diverge; the three engine files
are where they converge. Whoever sequences this work should treat those
three files as the scarce resource, not `data-grid.tsx`.

**2. `table.tsx` and `data-table-view.tsx` are each wanted by two
workstreams that don't yet know about each other.** The engine researcher
found this from the P1 side: `virtualization` needs a scroll-container/sticky
mechanism on the `Table` primitive, `footer` needs a sticky footer, and
`grouping` needs sticky group headers — three groups independently reaching
for the same missing primitive capability (cross-cutting gap #2 in
`researcher-engine.md`). The surface researcher found the other half from
the shipped-group side: `appearance`'s box/surface cluster
(`background`, `size`, `width`, `height`, `maxHeight`, `stickyHeader`,
`borders`) is *also* new `Table`/`TableRow`/`TableHead` variant work,
described independently as "the only cluster reaching below DataGrid into
the primitive." These are the same file, wanted for overlapping reasons, by
two people who each only saw their own half. `data-table-view.tsx` has the
identical shape: the P1 groups need it to render group/tree/footer rows and
apply pin/size/virtualized windowing, while `appearance`'s resolver cluster
needs it to accept and apply the row/cell/header class+style resolvers it
already builds contexts for. Landing either side first without the other
in view will force a rework of whichever lands second.

**Cross-cutting conclusion (only visible from reading both documents
together): `appearance` is not the small, cosmetic, one-member group its
current `striped`-only shipped state suggests.** Its box/surface cluster
*is* the sticky/variant work that `virtualization`, `footer`, and `grouping`
each separately need from `table.tsx`, and its `height`/`maxHeight` members
are the unconfirmed precondition the engine researcher flagged as blocking
`virtualization`'s bounded-height invalid-combination rule (cross-cutting
gap #5: "I could not confirm... whether `appearance.height`/`maxHeight`/
`stickyHeader`... actually has a bounded-container implementation today").
That makes `appearance` — filed under the "shipped, just missing some
members" half of the programme — sit on the critical path for three
nominally unstarted P1 features. Finishing it is not cosmetic cleanup; it
is a blocking dependency that neither inventory names as such on its own.

## Dependency shape among the seven unshipped groups

- **The one real blocking pair:** `tree` and `detailExpansion` both need
  TanStack's single native expand/collapse row-model feature
  (`state.expanded`/`getExpandedRowModel`), which is currently wired
  exclusively to `detailExpansion`. This is an engineering decision (a
  second, independent row-model stage for tree, or some other resolution),
  not a mechanical gap — whoever picks up `tree` must resolve it with (or
  instead of) `detailExpansion`'s owner.
- **`grouping` trails `tree`:** its "group roots, preserve descendant
  trees" rule presumes tree relationships already exist in the row-model
  pipeline. Its state/query wiring (page-reset, request-key serialization)
  is otherwise already complete — only `getGroupedRowModel()` installation
  and the render layer are missing.
- **`persistence` trails `columnsFeatures`:** the default restorable slice
  set is exactly the four column slices (visibility/order/sizing/pinning),
  two of which (`pinning`, `resizing`) don't visually exist yet. A partial
  cut restoring only visibility+order (already P0-shipped) could go first.
- **`virtualization`'s minimal flat-row cut is independent**, but full
  spec compliance touches `appearance.height`/`maxHeight` (see above),
  `tree`+`detailExpansion` (the focus-fallback policy spans both expansion
  domains), and `grouping` (sticky group headers).
- **`footer` and `columnsFeatures` are independently buildable** for their
  core scope — `footer` because `TableFooter` already exists as a primitive
  and just isn't rendered; `columnsFeatures` because none of its four
  sub-features (visibility done; pinning/resizing/reordering not) depend
  structurally on the others.

**What's actually parallelizable without collision:** `virtualization`'s
minimal cut, `columnsFeatures`, and `footer`'s whole-table-summary scope —
*provided* the shared `Table`-primitive sticky-positioning work (finding 2
above) is assigned to one owner instead of being reinvented three times,
and provided `appearance`'s box/surface cluster is sequenced in rather than
treated as a separate, lower-priority polish task.

## The recurring type-design problem: `getRowId` and `state`/`defaultState`

Both surface-side gaps hit the same wall for the same reason. The
DataTable controller already has the mechanism the design wants — two
exported call signatures, one that requires `getRowId` (or a caller-supplied
`state`) when an identity-bearing feature is configured, one deprecated
flat form where both stay optional. `DataGrid` can't reuse that shape
directly: it's a JSX component with one props interface, not a hook with
overloads, so "required when X" has to become a discriminated union (a new
branch vs. a deprecated branch) or some other mechanism — a decision that,
once made, resolves both gaps at once rather than twice.

The blast radius is smaller than the raw count suggests: 39 `<DataGrid>`
call sites omit `getRowId`, but only 10 use a grouped config and would need
updating; the other 29 are flat-only and should keep compiling under the
deprecated overload untouched. Exposing `state` publicly adds one more
wrinkle beyond the shared type-design question: `DataGridProps` already has
a deprecated flat prop literally named `state` (typed as the data-status
string), pinned by a compile-time assertion in
`table-family-public-types.test.ts:82,85` — the names collide and the
deprecated one can't just be renamed out from under existing callers.

## Member gaps in the shipped nine: mostly plumbing, two exceptions

Per `researcher-surface.md`'s table, six of the eight incomplete groups
(`selection`, `sorting`, `pagination`, `toolbar`, `dataState`,
`rowInteraction`) are missing members that are pure UI toggles or
plumbing already present in the controller — independent of the seven P1
groups and low-risk to close. Two are not:

- **`appearance`** — covered above; its box/surface cluster is P1
  engine-adjacent work, not polish.
- **`filters`** — the missing `columns[].facet` member needs a faceted
  row model, which is (like `grouping`'s row model) explicitly excluded
  from the public engine-options escape hatch pending controller work, plus
  a genuinely new multi-select UI (today's filter control renders one
  operator `Select` and one text `Input`, nothing else). `global.columnIds`
  (plural, vs. shipped's singular `columnId`) also has no defined
  cross-column matching semantics in the design itself.

Also outside the nine groups: `server` is missing `hasNextPage`/
`hasPreviousPage`/`selection`/`onSelectionChange` — exactly what
`pagination.unknownTotal` and `selection.selectAll:'all-results'` need, and
independent of the seven P1 groups.

## The `/data` demo route: gaps confirmed in situ

`apps/demo/src/app/routes/data/DataTable.tsx` is a hand-rolled
`useReactTable` screen that exercises the parity gaps concretely rather than
abstractly. It confirms two previously-suspected blockers (a real `facet`
need for two multi-select filters; a genuine initial-sort-on-mount that
would need a public `defaultState.sorting`) and surfaces a third that
wasn't previously flagged: its search box substring-matches across four
columns at once, a behavior the design's target `global.columnIds` has no
defined semantics for. That's a design gap, not an implementation gap —
someone has to decide what "search across N columns" means before it can
be built. Everything else in the route already has a shipped DataGrid
equivalent (bulk actions, column visibility, row actions, page sizes,
loading state) and touches none of the seven P1 engine groups.

## Source documents

- `.ai/team/table-parity-p1/explore/researcher-engine.md` — the seven
  unshipped groups, cross-cutting infrastructure gaps, per-group detail.
- `.ai/team/table-parity-p1/explore/researcher-surface.md` — member gaps
  in the nine shipped groups, `getRowId`, `state`/`defaultState`, the
  `/data` route. Transcribed from the researcher's text report (see the
  provenance note at the top of that file); not independently reauthored.
