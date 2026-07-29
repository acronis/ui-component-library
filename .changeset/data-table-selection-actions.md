---
'@constructor-lab/ui-react': minor
---

feat(data-table): selection model + DataGrid selection/actions/bulk chrome (P0.5)

**DataTable (model):**

- `useDataTable`'s `selection` option now accepts a config —
  `{ mode?: 'single' | 'multiple'; isRowSelectable?; reserve? }` — mapping to the
  engine's single/multi row selection and per-row eligibility. `reserve` keeps
  selected IDs absent after a data replacement instead of pruning them.
  `DataTableSelectionConfig` is exported.

**DataGrid (composed chrome):**

- Now runs on the identity controller branch (a `getRowId`, defaulting to the row
  index) so selection, actions, and bulk operations have stable row identity.
- New `selectionMode` (`single` hides the header select-all and keeps one row
  selected) and `isRowSelectable` (ineligible rows get a disabled checkbox and
  are skipped by select-all).
- New `actions` prop renders a per-row action menu (`ButtonIconMenu` +
  `DropdownMenu`) with per-row disabled predicates; destructive items route
  through `ConfirmDialog`. Action controls stop row click/selection propagation.
- New `bulkActions` prop renders a selection bulk-action bar (`Button`s + a
  selected-count + clear) shown while rows are selected, with destructive actions
  confirmed via `ConfirmDialog`. Each action receives the selected rows.
- Exports: `DataGridActionsConfig`, `DataGridRowAction`, `DataGridBulkAction`,
  `DataGridActionConfirm`, `createActionsColumn`, `DataGridBulkActions`.

**Row/cell interaction (DataTableView + DataGrid):**

- `DataTableView` gains typed pointer/activation events — `onRowHover`,
  `onRowActivate` (Enter while the row is focused, or double-click), `onCellClick`,
  and `onCellHover` — and `onRowClick` now receives a `DataTableRowPointerEvent`
  carrying the row context and native event. New event types
  `DataTableRowPointerEvent`, `DataTableRowActivationEvent`, and
  `DataTableCellPointerEvent` are exported.
- New `currentRow` prop enables current-row **roving focus**: body rows share one
  tab stop, Up/Down move the current row one visible record, Home/End jump to the
  first/last, Enter activates, and the current row carries `aria-current`.
  Interactive descendants stay tabbable and do not activate the row.
- DataGrid exposes `currentRow`, `onRowActivate`, `onRowHover`, `onCellClick`,
  and `onCellHover` (called with the row data / column id) over the shared
  controller.
