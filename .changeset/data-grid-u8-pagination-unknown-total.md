---
'@constructor-lab/ui-react': minor
---

feat(data-grid): pagination `showPageSize`/`showFirstLast`/`unknownTotal` and server directional capabilities (U8)

**`pagination.showPageSize`** and **`pagination.showFirstLast`** drop the
rows-per-page select and the first/last page buttons. Both default to `true`, so
nothing changes for an existing caller:

```tsx
pagination={{ pageSize: 25, showPageSize: false, showFirstLast: false }}
```

**`pagination.unknownTotal`** is for a cursor-style backend that can answer "is
there another page" but never "how many". It announces no page count and hides
first/last, and it is valid **only** in server mode with both new capabilities
supplied:

```tsx
pagination={{ unknownTotal: true }}
server={{
  query,
  hasNextPage: cursor.next !== null,
  hasPreviousPage: cursor.previous !== null,
  onQueryChange,
}}
```

**`server.hasNextPage`** and **`server.hasPreviousPage`** are the owner's
directional capabilities. They are authoritative when supplied and they have to
be, because the engine's answer in this configuration is not missing — it is
wrong. With manual pagination and neither `rowCount` nor `pageCount`, TanStack's
`getRowCount()` falls back to the length of the row model it was handed, so
`getPageCount()` becomes `ceil(loadedWindow / pageSize)`. A 500-result query
served 10 rows at a time reports a page count of **1**: the footer announces
"Page 1 of 1" and `getCanNextPage()` is `false`, so Next is dead on every page.
Supplying the two capabilities is what fixes both, and `unknownTotal` is what
stops the fabricated count being announced.

`unknownTotal` also passes `pageCount: -1` to the engine, so `getPageCount()`
reports genuinely-unknown rather than a count derived from the current window,
and page navigation is not clamped to it.

**New: `DataGrid` renders its own pagination row.** The frozen
`DataTablePagination` companion adapter takes exactly `{ table, pageSizeOptions }`
and is marked "do not add new features here", so the three members needed
DataGrid-owned chrome — the same move `toolbar.viewOptions` made for the toolbar
row. **At the defaults the two render identical markup**, and a test asserts that
byte-for-byte through one shared controller, so no existing DataGrid rendering
changes and no visual baseline moves. `DataTablePagination` stays exported for
external callers; DataGrid no longer consumes it.

**Deviation from the design contract, recorded deliberately.** Design §5.2 lists
`unknownTotal` outside server mode as an invalid combination, which implies only
that it is reported. It is reported — and it is also **not honored**: outside
server mode the member resolves to `false`. The client row model knows the real
total, so suppressing the count there would replace a correct answer with no
answer, which is strictly worse than the warning. Resolving it away also keeps the
invalid state out of everything downstream, so neither the chrome nor the
controller ever sees an unknown total it cannot support.

Four development warnings cover §5.2's invalid combinations for `unknownTotal`:
outside server mode, without both directional capabilities, alongside
`server.rowCount`/`server.pageCount`, and with an explicit `showFirstLast: true`.
The last keys off the caller having _set_ the member rather than off its resolved
value — `showFirstLast` defaults to `true`, so a resolved-value check would warn
on every correctly configured unknown-total grid. A fifth reports a `server`
config that supplies neither totals nor capabilities, which is the configuration
that silently produces the fabricated count above.

**None of the three members has a deprecated flat alias.** `pagination`'s flat
form is a boolean plus `pageSize`/`pageSizeOptions`, and it carries nowhere to put
a presentation flag, so the grouped config is the only route to all three — a
limit of the alias form rather than an omission here.
