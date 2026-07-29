---
'@constructor-lab/ui-react': minor
---

DataTable: whole-table footer summaries (U5).

`TableFooter` already existed and was exported; `DataTableView` simply never
rendered it. The footer is now a `kind: 'footer'` display row emitted from the
registry's `tableDisplayRows` point, and the view routes that kind into
`<TableFooter>` rather than `<TableBody>` — so a footer is never counted as a
record row by anything walking the body.

**New controller config, `footer`:**

- `summaries` — one entry per column, each naming a `columnId` and an
  `aggregate`: `sum`, `avg`, `min`, `max`, `count`, `countDistinct`, or a reducer
  `(rows) => SerializableValue` for anything the named set cannot express. The
  named forms are serializable so a server can compute them instead.
- `scope` per summary — `'filtered'` (the default) totals every row after
  filtering, sorting and tree expansion but **before** the page slice, so a
  paginated grid shows the grand total; `'page'` totals the visible page only.
- `render` — owns the footer's cells, receiving the typed footer context.
- `sticky` — pins the section, mapped onto the view's `stickyFooter` prop.

**The footer render context** (`DataTableFooterContext`) exposes `summaries`,
`summaryFor(columnId)`, `rows`, `pageRows`, `visibleColumnIds` and
`visibleColumnCount`. Each computed `DataTableSummaryValue` carries its `value`,
its `aggregate` (`'custom'` for a reducer), its `scope` and the `rowCount` it saw,
so a formatter can branch without re-deriving anything.

Two behaviors worth knowing:

- **An empty table has no total, and says so.** Every numeric aggregation returns
  `undefined` rather than `0` for an empty input, because a footer showing `0` for
  an empty table states something false. A column that genuinely sums to zero
  still shows `0`.
- **Cells follow column _visibility_, not the column definitions.** The footer
  emits one cell per visible column so it lines up with the body; an unsummarized
  column contributes an empty cell rather than being omitted.

Not included, deliberately: **group-scoped footers.** The design does not address
them. The display-row kind carries `scope: 'table' | 'group'` so the shape need
not change later, but only the table scope is emitted.

One deviation from design §5.2, recorded rather than silent: §5.2 makes
`summaries` and `render` mutually exclusive, and that rule is enforced at the
**DataGrid** layer where the caller sits. At the DataTable layer they compose —
`summaries` is the model and `render` is the presentation — because DataGrid
itself relies on that composition to format a caller's summaries, and enforcing
the exclusion here would leave `DataTableFooterContext.summaries` permanently
empty for every renderer.
