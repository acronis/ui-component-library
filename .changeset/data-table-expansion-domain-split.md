---
'@constructor-lab/ui-react': minor
---

DataTable: split the expansion domains so `detailExpansion` and `tree` are
independent (ADR-0001).

TanStack Table ships one expand/collapse feature and its row model walks
`row.subRows` only, so it is an identity transform for detail expansion and
exactly what a tree needs. The controller now binds `state.expanded`,
`getExpandedRowModel()` and `onExpandedChange` to the **`treeExpanded`** slice,
and detail expansion became a library-owned render-layer projection over
**`detailExpanded`** — a detail row never enters `getRowModel().rows`,
`flatRows` or `rowsById`, and it consumes no pagination slot.

`DataTableRowContext` gains two namespaces:

- `row.detail` — `{ isExpanded, canExpand, toggle }`
- `row.tree` — `{ isExpanded, canExpand, toggle, depth, hasChildren, loadState }`

`row.isExpanded`, `row.canExpand` and `row.toggleExpanded` are kept as
**deprecated aliases of the `detail` domain** for this compatibility line and
are removed in the same major as the other table compatibility adapters. Because
those values were already driven by `detailExpanded`, aliasing them to detail is
a zero-behavior-change migration.

`DataTableController` gains `getExpansion()`, reporting `treeEnabled`,
`detailEnabled` and the detail-domain `canExpandDetail` predicate.

Migration notes:

- The deprecated `getRowCanExpand` / `renderExpandedRow` props are unchanged:
  while no tree is configured they keep TanStack's `expanded` on the detail
  slice, so column cells that call `row.getIsExpanded()` /
  `row.toggleExpanded()` behave exactly as before.
- Supplying **both** `getSubRows` and `renderExpandedRow` previously produced a
  single conflated expand state. It now produces two independent ones: the tree
  disclosure drives `treeExpanded` and the detail panel drives `detailExpanded`.
  No known call site combines them.
- **`getSubRows` on its own now counts as a tree**, with or without a `tree`
  config — subrows are what the expand row model walks, so supplying them is
  what declares a tree. Two consequences for a `getSubRows`-only caller:
  `getExpandedRowModel()` is now installed where it previously was not, and
  `state.expanded` is sourced from `treeExpanded`. **Nothing renders
  differently** while `treeExpanded` is empty, which it is until something
  writes to it: the stage short-circuits on an empty expanded state and returns
  its input row model, so only root rows are visible exactly as before. What
  changes is that expanding a row through `treeExpanded` now actually reveals
  its descendants, which is the wire this split existed to connect.
- `getExpandedRowModel()` is no longer installed for detail-only expansion. It
  was an identity transform there — no dataset without `getSubRows` has subrows
  for it to walk — so rendered output is unchanged.
