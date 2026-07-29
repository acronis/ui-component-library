---
'@constructor-lab/ui-react': minor
---

DataTable: an internal feature-module registry, a display-row list, two named
seams, and the `appearance` pass-through (ADR-0002, DataTable half).

This is a characterization-preserving refactor with one additive public surface.
It exists so the remaining behavior groups can be built in parallel: adding a
feature is now one new module file plus one manifest line, instead of edits to
`data-table-controller.ts`, `data-table-view.tsx` and
`data-table-render-context.ts` all at once.

**Internal, no behavior change.** The conditional `useReactTable` option spreads
and every `on*Change` handler moved into per-feature modules under
`data-table/data-table-features/`, composed in design §3.5's committed pipeline
order. Contributions are additive and collision-checked across modules — two
features setting the same option throws, naming both, rather than letting the
later one silently win. `data-table-view.tsx` now renders a **display-row list**
derived over the engine's record rows, so `detail`, `group`, `tree-status` and
`footer` rows are explicit kinds instead of one hard-coded special case.
Pagination still counts records, and keyboard roving focus and striping still
index records, not display rows.

**New public API, all additive:**

- `DataTableController.tableId` — a stable DOM id root, so the design §7 ARIA id
  schemes (`${tableId}--detail--${base64url(rowId)}`) have something to root at.
  The detail panel now carries that id, which is what lets an expander button
  point `aria-controls` at an element that exists exactly when the panel is
  mounted.
- `DataTableController.getFeatures()` — the library-internal registry runtime.
  Not an extension point; the public one is still `plugins` (design §4.1).
- `DataTableController.getViewBridge()` — the channel the view publishes its
  imperative window operations through. The controller owns the toggle-action
  union but cannot reach the view's scroll container, so `measure-layout` and
  `scroll-to-row` dispatch here. Library-internal.
- `DataTableView` gains **`stickyFooter`**, the only route by which a footer
  feature's `sticky` option reaches `TableFooter`: a feature renders the
  `<TableRow>` _inside_ `<TableFooter>` and cannot reach the section element.
- `DataTableView` **appearance pass-through**: `size`, `background`, `borders`,
  `width`, `height`, `maxHeight`, `stickyHeader` and `showHeader` now reach the
  `Table` primitive, plus the `rowClassName` / `rowStyle` / `cellClassName` /
  `cellStyle` / `headerClassName` / `headerStyle` resolvers. Previously the view
  rendered `<Table>` bare inside a hardcoded wrapper, so the primitive's
  presentation and scroll-container props were reachable from a hand-written
  composition and unreachable from DataGrid. Setting `height` or `maxHeight` is
  also what bounds the scroll container, which is the precondition for sticky
  sections and windowed rendering.
- **Behavior-group keys pre-declared** on the controller options:
  `columnsFeatures`, `grouping`, `footer`, `virtualization` and `persistence`,
  each typed against a config interface owned by its own feature module; and
  `filtering` / `pagination` widened from `boolean` to `boolean | Config`. All
  five new groups are keyed by column ID or index rather than row ID, so they sit
  on the base options and do **not** require `getRowId`. Every member of every
  config is optional at this layer.
- **`DataTableToggleAction` pre-declared members**: `measure-layout`,
  `scroll-to-row` and `toggle-group`. The two windowing actions dispatch through
  `getViewBridge()`, so implementing them needs no controller change;
  `toggle-group` needs a state slice that does not exist yet. All three throw a
  "not implemented yet" `TypeError` until their owner lands, rather than silently
  doing nothing.
- `createHeaderContext` takes an optional second `controller` argument. Omitting
  it keeps the previous behavior.

Migration notes:

- Nothing is required. Default rendered output is unchanged, and every existing
  suite passes unmodified.
- If you supplied `filtering` or `pagination` as a boolean, that still works —
  the config object form is new, not a replacement.
- `DataTableController` gained members, so a hand-written object literal typed as
  `DataTableController` (rather than one returned by `useDataTable`) needs
  `tableId`, `getFeatures` and `getViewBridge`. Test doubles are the realistic
  case.
