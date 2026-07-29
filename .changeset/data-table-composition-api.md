---
'@constructor-lab/ui-react': minor
---

feat(data-table): publish the flexible DataTable composition API

The table-feature-parity foundation (one controller owning the normalized state
and single TanStack instance, framework-neutral state/change/query contract,
seven-key engine-option allowlist, and analyzable custom-feature plugin surface)
was implemented and tested but never exported. It is now public from
`@constructor-lab/ui-react`:

- `useDataTable` controller hook (`DataTableController`, its options unions, the
  `IdentityFreeDataTableState` helper, and the `DataTableToggleAction` imperative
  actions), plus the deprecated compatibility overload.
- `DataTableRoot` / `useDataTableRoot` / `DataTableView` composition primitives.
- Typed render contexts (`createHeaderContext`, `createRowContext`,
  `createCellContext`, `createStateContext`) that expose values/metadata/commands
  only — never preassembled product chrome.
- The framework-neutral contract (`DataTableState`, `DataTableSlice`,
  `DataTableQuery`, `DataTableChangeEvent`, descriptors, serializable types),
  query helpers (`createDataTableQuery`, `createDataTableRequestKey`,
  `serializeDataTableRequest`), and state helpers
  (`createDefaultDataTableState`, `useControllableDataTableSlice`).
- The React-only engine escape hatches: `DataTableEngineOptions` allowlist
  (`DATA_TABLE_SAFE_ENGINE_OPTION_KEYS`, `normalizeDataTableEngineOptions`,
  `TANSTACK_TABLE_OPTION_CLASSIFICATION`) and the custom-feature plugin surface
  (`DataTableEnginePlugin`, its manifest/registrar types,
  `inspectDataTablePluginTopology`, `prepareDataTableExtensions`).

The existing `DataTable`, `DataTableToolbar`, `DataTablePagination`,
`DataTableViewOptions`, and `DataTableColumnHeader` exports are unchanged; the
standard product-chrome companions remain frozen one-minor compatibility
adapters that move behind DataGrid and are removed next major.
