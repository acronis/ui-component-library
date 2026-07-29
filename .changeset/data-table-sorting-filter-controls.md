---
'@constructor-lab/ui-react': minor
---

feat(data-table): sorting model + DataGrid sortable-header and column-filter controls (P0.4)

**DataTable / Table (model + presentation):**

- `useDataTable`'s `sorting` option now accepts a config —
  `{ mode?: 'single' | 'multiple'; cycle?; maxColumns? }` — in addition to
  `boolean`. It maps to the engine's multi-sort, sort-removal, desc-first, and
  multi-sort column cap. `DataTableSortingConfig` is exported.
- The header render context gains `sortCount` and a `sortDescription`
  (`"sorted descending, priority 2"`) for accessible multi-sort priority.
- `DataTableView` gains a `sortable` prop that presents the standard
  sortable-header affordance for every sortable column (driving the Table
  primitive's sort button/icon/`aria-sort`), with Shift-activation adding to a
  multi-sort. `renderHeader` now also receives the column's default rendered
  content so a projection can wrap rather than replace the label.
- The `Table` primitive's `TableHead` presents multi-sort priority via a new
  `sortPriority` prop, and its `onSort` now receives the originating mouse event
  (so callers can detect Shift for multi-sort). Backward compatible.

**DataGrid (composed chrome):**

- New `sortable` and `multiSort` props present sortable headers on the shared
  controller, with visible 1-based priority for multi-column sorts.
- New `filters` prop renders per-column filter controls (a `Filter` +
  `Popover` with an operator `Select` and value `Input`), applied-filter
  `Chip`s, and a reset control — all driving the one DataTable engine with AND
  logic. Supported operators: `equals`, `notEquals`, `contains`, `startsWith`,
  `greaterThan(OrEqual)`, `lessThan(OrEqual)`, `in`, plus `isEmpty`/`isNotEmpty`.
  `DataGridColumnFilterDef`, `DataGridFilterOperator`, `DataGridFilterValue`,
  `operatorFilterFn`, `evaluateFilterOperator`, and `FILTER_OPERATOR_LABELS` are
  exported.
