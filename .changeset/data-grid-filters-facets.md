---
'@constructor-lab/ui-react': minor
---

feat(data-grid): faceted filter options and multi-column global search (U7)

**Faceted option sources.** A column filter can now say where its options come
from, which is what turns a free-text control into a set-membership one:

```tsx
<DataGrid
  columns={columns}
  rows={rows}
  getRowId={(row) => row.id}
  filters={{
    columns: [
      { columnId: 'category', label: 'Category', facet: 'unique' },
      {
        columnId: 'status',
        label: 'Status',
        facet: ['active', 'paused', 'archived'],
      },
    ],
  }}
  toolbar={{ columnFilters: true }}
/>
```

`'unique'` offers the column's distinct values **with their counts**, `'min-max'`
its numeric range, and an explicit list supplies fixed options verbatim —
including ones that occur in no row. This is shipped legacy parity with
`filterStats`.

The values come from the **pre-filter** row model, so the option list keeps
showing every choice, with accurate counts, while a filter is applied. Facets need
client-side filtering and are inactive in server mode, where the client holds only
one page and any facet computed from it would be wrong.

**Multi-column global search.** `filters.global.columnIds` matches one query,
case-insensitively, across every listed column:

```tsx
filters={{ global: { columnIds: ['name', 'category', 'status'] } }}
toolbar={{ globalSearch: true }}
```

A term matching any one of those columns matches the row, so a screen no longer
needs to hand-roll an OR inside a single column's `filterFn`. Per-column
customization is a `globalFilterFn` on that column's metadata, which keeps the
query descriptor `{ q, columnIds }` serializable — server mode round-trips it
unchanged.

The deprecated singular `filters.global.columnId` still works. Supplying both
warns and `columnIds` wins.

**Behaviour change: the toolbar search box now drives the engine's global filter**
rather than one column's filter. For a single-column configuration this is
equivalent, and it is what makes the multi-column form work at all — previously the
box could only ever have matched one column. The reset control now clears the
global query as well as the column filters; before, a global query could be left
active with no way to clear it from the toolbar.
