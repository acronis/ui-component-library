---
'@constructor-lab/ui-react': minor
---

Add the `tree` behavior group to `DataGrid`, and complete the eager half of the
`tree` feature in the `DataTable` engine.

```tsx
<DataGrid
  columns={columns}
  rows={regions}
  getRowId={(row) => row.id}
  tree={{ getChildren: (row) => row.reports, indent: 24 }}
  callbacks={{ onTreeExpansionChange: (event) => save(event.value) }}
/>
```

- `tree.getChildren` supplies descendant relationships (the DataTable-level
  `getSubRows` prop still works and is now the fallback, not the only route).
- `tree.indent` sets the per-level step, default 20px. It reaches the row as the
  `--table-tree-indent` custom property alongside `--table-tree-depth`, so a
  direct `DataTable` composition can indent from a column class with
  `calc(var(--table-tree-depth) * var(--table-tree-indent))`.
- `tree.column` names which column carries the disclosure and the indentation,
  defaulting to the first **declared** data column. Note this is not necessarily
  the leftmost _rendered_ one once `columnsFeatures` reorders or hides columns —
  and **hiding the tree column removes the disclosure entirely**, so the tree
  becomes unexpandable rather than merely un-indented.
- `tree.reserve` keeps expanded ids that are absent after a data replacement.
- `callbacks.onTreeExpansionChange` reports `treeExpanded` transitions. Tree and
  detail expansion share no slice, callback, or id namespace, so subscribing to
  one never delivers the other's events, and both may be enabled at once.

The disclosure is an **in-cell** control on the tree column rather than a leading
system column, because indentation and disclosure have to move together and a
fixed leading column cannot indent. It wraps the column's own cell renderer, so a
custom `cell` is preserved.

Accessibility: a plain grid with an in-cell disclosure button carrying
`aria-expanded`. `role="treegrid"` is deliberately not adopted, and the disclosure
emits no `aria-controls` — a tree parent reveals a variable set of sibling rows,
and several `<tr>` elements cannot share one id. Because `aria-level` is
meaningful only inside a `treegrid`, the nesting level is carried in the
disclosure's accessible name instead.

Tree descendants **consume pagination slots**: a page size of 4 over an expanded
parent with two children renders the parent, both children, and one more root.
This is the opposite of detail rows, which are a presentation of a record already
on the page.

### Lazy children

`tree.loadChildren` fetches children for a record that has none yet. Expanding a
childless row triggers it; each request is keyed, and a superseded result is
dropped, so a slow first response cannot overwrite a newer one.

```tsx
<DataGrid
  columns={columns}
  rows={regions}
  getRowId={(row) => row.id}
  tree={{
    getChildren: (row) => row.reports,
    loadChildren: (row) =>
      fetch(`/api/regions/${row.id}/children`).then(toJson),
  }}
  callbacks={{ onTreeLoad: (event) => track(event.status, event.requestKey) }}
/>
```

- While a request is in flight the branch shows a spinner row; on failure it shows
  an Alert with a Retry control. `tree.renderLoadError` replaces the failure
  content only — the spinner is not overridable, and retry cannot be suppressed.
- `callbacks.onTreeLoad` reports each transition (`loading`, then `loaded` or
  `error`) with the request key that identifies the attempt. A superseded result
  emits nothing, so the event stream is a faithful trace of what actually landed.
- **With a loader configured, every not-yet-resolved row gets a disclosure**, since
  the library cannot know whether a childless record has children until it asks. A
  row whose load completed with no children becomes a leaf and loses the control.
- Request status is deliberately **not** part of `treeExpanded` or any other state
  slice, so persisting or restoring table state never restores a stale load state.
