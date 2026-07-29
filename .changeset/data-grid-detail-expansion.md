---
'@constructor-lab/ui-react': minor
---

feat(data-grid): `detailExpansion` — caller-rendered detail panels (U1)

```tsx
<DataGrid
  columns={columns}
  rows={rows}
  getRowId={(row) => row.id}
  detailExpansion={{
    render: (row) => <InvoiceSummary invoice={row} />,
    isExpandable: (row) => row.hasDetail,
    mode: 'multiple',
  }}
  callbacks={{ onDetailExpansionChange: (event) => persist(event.value) }}
/>
```

A disclosure control appears in a `__detail__` system column behind the selection
checkbox, and opening it reveals `render(row)` in a full-width row beneath the
record.

**`render` is required** at the DataGrid layer — a detail group with nothing to
render is a configuration mistake. `isExpandable` decides which records get a
control at all; `reserve` retains expanded ids across a data replacement.
`mode: 'accordion'` keeps at most one panel open and is **proposed-only** in the
design, with `multiple` the shipped default.

`detailExpansion` is identity-bearing, so it requires `getRowId` — expanded ids
have to survive a data change, and an index cannot do that.

Three properties worth knowing because they are easy to assume wrong:

- **A detail row consumes no pagination slot.** It is a presentation of a record
  already on the page, not a record entering the row model, so `pageSize: 25`
  still means 25 records. This is deliberately the opposite of the answer for tree
  descendants, which are real records.
- **Detail and tree expansion are fully independent** — separate state slice,
  separate callback, separate display-row kind. Toggling a panel leaves
  `treeExpanded` untouched, and accordion mode can never collapse a tree node.
- **`aria-controls` is emitted exactly while the panel is mounted**, never
  pointing at an element that does not exist, while `aria-expanded` always
  reflects logical state. The control and the panel derive the id from one shared
  function, so they cannot disagree.

`onDetailExpansionChange` joins the named callbacks, carrying the same enriched
event shape as the rest of the family.
