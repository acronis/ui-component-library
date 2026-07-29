---
'@constructor-lab/ui-react': minor
---

feat(data-table): manual/server query contract + DataGrid data states (P0.6)

**DataTable (model):**

- `useDataTable` gains independent manual modes — `manualSorting`,
  `manualFiltering`, `manualPagination`, `manualGrouping` — plus `rowCount` /
  `pageCount` for manual pagination. A manual stage tracks its slice/state and
  emits changes but leaves the client rows untouched (the caller processes them
  server-side); no client row model is installed for that stage.
- New `onQueryChange` callback fires once per atomic query transition (a change
  to sorting, filters, global filter, grouping, or pagination), carrying the
  previous and next `DataTableQuery` and the canonical request key of the next
  query. A query-changing sort/filter/group resets `pageIndex` in the same
  transition, so only the post-reset key is emitted. The caller owns
  fetch/cancellation and stale-result handling (compare against the latest
  `requestKey`).

**DataGrid (composed chrome):**

- New `state="error"` renders an `Alert` (with optional `error` content and an
  `onRetry` button). Loading never infers empty and an error is never treated as
  empty — the engine is fed no rows in the empty/error states so counts and
  pagination stay consistent.
- New `server` config (`DataGridServerConfig`: `query`, `rowCount?`, `pageCount?`,
  `onQueryChange`) puts the grid in all-manual mode — the query slices are
  controlled from `server.query`, pagination controls drive server navigation,
  and every atomic query transition calls `server.onQueryChange`. DataGrid never
  sorts, filters, or slices client rows in server mode.

Stories added: `ErrorState`, `Server`. The all-results server-selection token
(design §3.6) remains a follow-up.
