---
'@constructor-lab/ui-react': patch
---

fix(data-grid): the pager counts a server-owned selection instead of reporting 0

User-reported: the pagination row read **"0 of 4 row(s) selected."** over a grid with
everything selected.

`server.selection` in `all-results` mode means "everything the query matches except
`excludedIds`", and the engine's `rowSelection` slice is **deliberately never
written** in that mode — the controlled token stays authoritative and nothing is
committed internally. The pager asked `getFilteredSelectedRowModel()`, which counts
per-row selection, so the numerator was 0 however much was selected. Nothing was
broken; the pager was asking a question the mode cannot answer.

`DataGridPagination` takes a new optional `selectedCount` prop, resolved by the config
layer from the **effective** `resolved.server.selection` — `all-results` counts as
total minus exclusions, `explicit` counts the owner's enumerated ids, and an
`all-results` token scoped to a stale `queryRequestKey` resolves away rather than
being attributed to the current query. A resolved number rather than the
`DataGridServerSelection` union, so the pager learns no server-selection semantics.

Absent the prop, the engine's own count stands, so every client-side grid is
unchanged.

Known limitation, logged rather than fixed: a caller composing `DataGridPagination`
directly without supplying `selectedCount` still gets the engine's count, which sees
only ids inside the loaded window.
