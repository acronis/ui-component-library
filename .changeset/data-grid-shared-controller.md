---
'@constructor-lab/ui-react': minor
---

feat(data-grid): build DataGrid on the shared DataTable controller

DataGrid no longer creates its own separate TanStack instance. It now composes
the one canonical `useDataTable` controller plus `DataTableRoot`/`DataTableView`,
so its toolbar, grid body, and pagination all read and mutate a single engine
that owns the normalized state, query, and controlled/uncontrolled semantics —
the "one engine only" rule from the table-feature-parity design. Its public prop
surface (`columns`, `rows`, `state`, `selectable`, `toolbar`, `searchKey`,
`pagination`, `onRowClick`, `striped`, …) is unchanged, and every existing
behavior is preserved. Because the shared controller installs no pagination model
unless requested, DataGrid renders every row when `pagination` is not set rather
than silently truncating to a default page.

`DataTableView` gains an `onRowClick(context)` prop that fires with the clicked
row's typed context and composes with `highlightCurrentRow`; DataGrid maps it to
its `onRowClick(row)` callback.
