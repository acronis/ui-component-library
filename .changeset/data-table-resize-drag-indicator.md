---
'@constructor-lab/ui-react': minor
---

feat(data-table): show a column's prospective width while a resize handle is dragged

A thin vertical line, spanning the whole table, marks where the dragged column's
edge will land. **Not decoration:** `columnsFeatures` defaults
`columnResizeMode` to `'onEnd'`, so the column does not move until release — until
now, grabbing a handle produced no response at all and the new width appeared with
the pointer already up. In that mode the line is the interaction's only visible
half.

- It tracks the **prospective** width, `clamp(startSize + delta, minSize,
maxSize)`, mirroring `table-core`'s own arithmetic (the `-0.999999` floor and the
  two-decimal rounding included). The clamp is load-bearing: TanStack writes the
  dragged width unclamped and clamps on _read_, so an unclamped line keeps
  travelling after the column has stopped at its minimum — asserting a width the
  release cannot produce.
- It is painted on the **container box** (`[data-slot="table-container"]`) as an
  `::after`, at the z ladder's new `55` rung — above every sticky rule, below the
  scrollbar. Hosting it inside a header cell would have grown the viewport's
  scrollable overflow and resized the scrollbar mid-drag.
- Available to any composer, not just `DataGrid`: it keys off the engine's own
  drag state, so wiring a handle to `resizeHandleProps` is enough.
- Styled from the `Resizable` token tier (`--ui-resizable-border-width` /
  `-color-active`), which is the kit's existing vocabulary for a resize divider
  being dragged.

**New:** `Table.containerStyle` — the counterpart to `containerClassName`, for
giving the scroll container's box a value a class cannot express (a computed
length, or a custom property driving a rule `containerClassName` declares).
`containerProps` remains the escape hatch for the _scrolling element_, which is a
different node. `width` still wins over `containerStyle` on conflict.

Not covered by visual regression: a screenshot cannot capture a drag, so those
baselines are unchanged and say nothing about this feature.
