---
'@constructor-lab/ui-react': minor
---

feat(data-grid): sorting cycle/maxColumns and the appearance cluster (U9)

**`sorting`** gains `cycle` and `maxColumns`:

```tsx
sorting={{ mode: 'multiple', cycle: ['asc', 'desc'], maxColumns: 2 }}
```

`cycle` sets the direction sequence on repeated header activation — dropping
`'none'` makes sorting non-removable, and leading with `'desc'` sorts descending
first. `maxColumns` caps a multi-sort. Both are carried even when the sortable
header affordance is off, because a controlled `sorting` slice still cycles.

**`appearance`** gains the rest of the cluster beyond `striped`: `size`,
`background` (transparent / accent / subtle / surface), `showHeader`,
`stickyHeader`, independent `borders` strengths for the top, bottom, horizontal
and vertical edges, `width` / `height` / `maxHeight`, and the six
`rowClassName` / `rowStyle` / `cellClassName` / `cellStyle` / `headerClassName` /
`headerStyle` callbacks — each taking the same typed render context the rest of
the family uses.

An unset member is passed as absent rather than as an explicit `undefined`, so the
`Table` primitive's own defaults still apply and today's markup is unchanged.

`appearance.stickyHeader` without `height` or `maxHeight` now logs a development
error: with no bounded height the table never scrolls, so a sticky header has
nothing to stick to and the member would appear to do nothing.

**Fix:** the `detailExpansion` expander column's header cell had no accessible
name, failing axe's `empty-table-header` rule and leaving the column unnamed to a
screen reader. It now carries a visually-hidden label, so the header row still
reads as a bare expander gutter.
