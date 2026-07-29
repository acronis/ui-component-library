---
'@constructor-lab/ui-react': minor
---

feat(data-grid): grouped-config union forms for filters/pagination/toolbar (P0.7)

The three prototype props whose names clash by type now accept both their
deprecated legacy shape and the design's grouped config, normalized together:

- `filters`: `false | DataGridColumnFilterDef[] | DataGridFiltersConfig`. The
  config adds `{ columns, global: { columnId, placeholder } }`; the bare array is
  the deprecated alias for `{ columns }`.
- `pagination`: `boolean | DataGridPaginationConfig` (`{ pageSize, pageSizeOptions }`).
  The boolean plus the separate `pageSize`/`pageSizeOptions` props are deprecated.
- `toolbar`: `boolean | DataGridToolbarConfig` (`{ globalSearch, bulkActions }`).
  `globalSearch` shows the search box (its column comes from `filters.global` or
  the deprecated `searchKey`); `toolbar.bulkActions` supersedes the deprecated
  top-level `bulkActions`. `toolbar: {}` renders view options only.

Precedence follows the design: a grouped config wins over its deprecated alias
and supplying both emits a development warning (`filters.global` vs
`searchKey`/`searchPlaceholder`, `toolbar.bulkActions` vs `bulkActions`, the
`pagination` config vs `pageSize`/`pageSizeOptions`). `DataGridFiltersConfig`,
`DataGridPaginationConfig`, and `DataGridToolbarConfig` are exported. An unfiltered
grid now keeps a stable `columnFilters` reference so the memoized column set
(and TanStack row selection) survives re-renders.

Remaining P0.7 (follow-up): `actions` grouped form, `presets`, the P1 feature
groups, and the `table-view`/`data-table` screen migrations.
