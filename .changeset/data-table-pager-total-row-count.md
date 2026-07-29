---
'@constructor-lab/ui-react': patch
---

fix(data-table): `DataTablePagination`'s "of N" reports the result total, not the loaded window

The DataTable half of the pager-label defect fixed on `DataGridPagination`. The two
components carried the identical expression, and the denominator half is reachable in
DataTable today: `manualPagination` and `rowCount` are supported controller options and
`DataTablePagination` is a public export, so a table paginating server-side announced
one loaded window as the whole result set — "of 4" beside its own "Page 1 of 483".

Now `table.getRowCount()`, which is `options.rowCount ?? prePaginationRowModel.rows.length`
— the owner's total when supplied and the client total when not, so client tables are
unchanged.

The numerator is deliberately left on the engine here. The grid's new `selectedCount`
prop exists because a _server selection token_ leaves the engine's `rowSelection` slice
unwritten, and DataTable has no server-selection path — the engine-options contract
rejects the options that would create one, so the prop would have no producer.
