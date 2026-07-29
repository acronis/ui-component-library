---
'@constructor-lab/ui-react': patch
---

fix(data-grid): a column with an explicit `size` can now actually be resized

User-reported: dragging the resize handle on a column whose def declares a `size`
moved the drag indicator but never changed the column's width — "indicator appears
at a new spot each time but table column width visually not changing".

`columnPresentation` built the explicitly-sized `<th>` style from the column
definition's own `size` instead of from `column.getSize()`, which is the only value
a committed resize updates. The definition's number is a constant, so the emitted
`width` never moved — and because `minWidth` was pinned to the same constant, the
column could not be narrowed either. Inert in both directions, while every other
half of the feature (handle, drag, `columnSizing`, indicator) worked.

`width`/`minWidth` now read the live `column.getSize()`, so a resize is reflected in
both the header and the body cells, and the committed width honours the caller's
`minSize`/`maxSize` via TanStack's own clamp. `maxWidth` deliberately keeps reading
the caller's `maxSize`, because the resolved column def defaults `maxSize` to
`Number.MAX_SAFE_INTEGER` and a value with a default cannot express "unset".

Also: **the drag indicator is no longer drawn for the column at the table's trailing
edge.** The table is `w-full`, so that column's right edge is fixed by the container
and a line claiming it is about to move cannot be honoured. The column is identified
by measuring its trailing edge against the table's, not by index — reordering,
pinning and horizontal scroll all move the trailing column without moving any index.

At-rest rendering is unchanged: with nothing recorded in `columnSizing`,
`getSize()` returns the declared `size`. Verified against the committed visual
baselines, which are byte-identical.
