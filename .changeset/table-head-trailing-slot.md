---
'@constructor-lab/ui-react': minor
---

Table: add `TableHead`'s `trailing` slot, for controls that must sit outside the
sort button.

`children` is the column label, and a `sortable` header wraps its label in a
`<button>`. A control passed as `children` therefore became a descendant of that
button, where a pointer release fires `onSort`, Enter/Space sorts instead of
acting, and the button's accessible name absorbs the control's label. Since a
records grid is normally sortable _and_ resizable, that was the common case
rather than an edge case.

`trailing` renders as a sibling of the sort button, so its content keeps its own
events, focus and accessible name. Non-interactive decoration of the label (a
unit hint, an info icon) can stay in `children`; only controls must not nest.

Additive and layout-neutral — the slot adds no wrapper element, so a header cell
without `trailing` renders exactly as before.

This is the primitive half of the column-resize seam: `DataTableView` routes
`ColumnPresentation`'s `placement: 'edge'` header adornments into it, so a
column resize handle or reorder grip mounts there.
