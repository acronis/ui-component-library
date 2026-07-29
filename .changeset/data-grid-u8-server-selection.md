---
'@constructor-lab/ui-react': minor
---

feat(data-grid): controlled server selection and `server.onSelectionChange` (U8)

**`server.selection`** hands selection ownership to the application, in the two
shapes design §3.6 specifies:

```tsx
server={{
  query,
  rowCount,
  selection: { mode: 'explicit', ids: new Set(['d-2']) },
  onSelectionChange: (event) => {
    // event.previous is the authoritative selection; event.selection is the request
    if (event.selection?.mode === 'explicit') setIds(event.selection.ids);
  },
  onQueryChange,
}}
```

An **`explicit`** selection is enumerable, so it becomes a controlled `selection`
slice: the boxes it names are ticked, and a click **requests** a change without
committing one. Nothing moves until the owner supplies a new `server.selection` —
so an owner that ignores the event gets a grid whose selection never changes,
which is the point rather than a bug.

An **`all-results`** selection means "everything the query matches, except these".
DataGrid cannot make that claim on its own — it has only ever seen the loaded
window — so the `token` is application-issued and scoped to the exact
`queryRequestKey` it was issued for. **A token whose key does not match the current
`query.requestKey` is stale and reports nothing**, until the owner supplies one for
the new key. DataGrid never invents a token and never labels loaded rows as all
server results.

**`server.onSelectionChange`** reports requested changes, carrying the
authoritative `previous`, the requested `selection`, and the `cause`/`query`/
`requestKey` of the transition. It runs **before** `callbacks.onSelectionChange`,
which only observes — the same authoritative-then-observe ordering
`server.onQueryChange` already has (design §5.3). Supplying it without
`server.selection` logs a development error: with no controlled selection the
engine owns selection outright and `callbacks.onSelectionChange` already reports
it, so firing here too would be a second event for one transition.

Controlling the same slice from both sides — `server.selection` and
`state.selection` — is design §5.2's invalid combination and is reported, which
falls out of the existing server/state overlap rule now that `selection` joins the
controlled slices.

**Not shipped, and named rather than left to be discovered: the `all-results`
toggle path.** Adjusting `excludedIds` when a row is toggled needs the loaded row
ids, and the one place a row id is in hand at that moment is the selection column's
cell renderer. So exclusion toggling lands with `selection.selectAll:
'all-results'`, and until it does an `all-results` token is reported and
staleness-checked but drives no checkbox. If that work ships without consuming
`ResolvedDataGridServer.selection`, the member and the `all-results` shape should
be deleted rather than left declared.

**Known limitation, pre-existing and now pinned by a test:** the `cause` on a
selection change driven by the row checkbox is `api`, not `pointer`, because the
checkbox calls `row.toggleSelected()` and the controller cannot see what drove it.
A screen therefore cannot currently distinguish a user click from a programmatic
selection.
