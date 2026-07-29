---
'@constructor-lab/ui-react': patch
---

DataTable: `toggle({ type: 'select-row' })` and `toggle({ type: 'select-all' })` now
go through the engine, so they agree with the selection checkbox.

Both actions wrote the selection slice by hand, which re-implemented TanStack's own
selection mutation while omitting everything it does. A caller driving selection
through these public actions got a selection model that **disagreed with the
checkbox** in three configurations:

- **single-select mode now replaces rather than accumulates.** Selecting a second row
  used to leave both selected.
- **a row your `isRowSelectable` rejects is now refused.** It used to be selected
  anyway — while its checkbox stayed disabled, so the two paths disagreed about a row
  the user cannot click.
- **selection now cascades to sub-rows** where the engine allows it. A parent selected
  through the action used to leave its descendants behind, while the same parent
  selected through its checkbox took them.

`select-all` additionally resolves its toggle direction from the engine, so a page
whose only unselected rows are ineligible now counts as fully selected and toggling it
clears the page instead of doing nothing visible.

Both actions also stop hardcoding the change cause, so a caller that claims a
provenance for a wrapped call now has it reported instead of overwritten. A bare
action still reports `api`, which is the honest answer for a programmatic change.

One deliberate difference from the engine: `select-row` with an id no row has is a
no-op rather than an exception. The engine's own lookup throws; the previous behaviour
added the phantom id, which the data-reconcile pass pruned on the next data change
anyway, so raising inside a caller's event handler would be a new failure mode rather
than a fix.
