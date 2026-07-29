---
'@constructor-lab/ui-react': minor
---

Table: add the presentation cluster and the scroll/sticky container.

`Table`, `TableRow` and `TableHead` had fixed classes against `--ui-table-*` and
no variants at all. This adds the box/surface cluster the table-parity design
calls `appearance`, plus the sticky and pin surfaces that virtualization,
footers and grouping all need. Everything is additive and every default
preserves today's rendered output.

`Table`:

- `size` — `'small' | 'medium' | 'large'` cell density. `medium` is the shipped
  metric set.
- `background` — `'transparent' | 'accent' | 'subtle' | 'surface'`. Legacy
  `backgroundColor` (transparent / solid-brand-accent / solid-brand-lightest /
  fixed-white) normalizes onto these. The variant also publishes the surface a
  sticky or pinned cell paints over scrolling content.
- `borders` — independent `top` / `bottom` / `horizontal` / `vertical`, each
  `false | true | 'subtle' | 'default' | 'strong'`. Each dimension resolves on
  its own; only `horizontal` is on by default (the shipped row divider).
- `width` / `height` / `maxHeight` on the scroll container (a bare number is
  px), plus `containerRef`, `containerClassName` and `containerProps`. The
  container reports `data-bounded` once a height is set — the precondition for
  sticky sections and for windowed rendering.

`TableHeader` / `TableFooter`: `sticky` pins the section to the top / bottom of
a bounded container.

`TableRow`: `current` (`aria-current` + `data-current` and a layout-neutral
leading marker; never `aria-selected`, so current and selected stay
independent), `expanded` (`aria-expanded` + `data-expanded`; Table never renders
or toggles the child content), and `sticky` + `stickyOffset` for group headers.

`TableHead` / `TableCell`: `pinned` (`'start' | 'end'`) + `pinOffset`. Table
presents the pin and marks the cell `data-pinned`; the owner decides which
columns are pinned and supplies the accumulated offset.

Notes:

- `border-collapse: collapse` paints row borders on the table's border grid, so
  a sticky header's divider would scroll away with the content. Sticky sections
  draw it as an inset hairline in the same row-divider token instead, and
  `borders.horizontal: false` removes that hairline too.
- The stacking order is fixed so the three sticky mechanisms compose: pinned
  body cell < sticky group row (pinned within) < sticky header/footer (pinned
  within).
- `Table` now exports `tableVariants` and the `TableProps`,
  `TableHeaderProps`, `TableFooterProps`, `TableCellProps`, `TableBorders`,
  `TableBorderValue`, `TableBorderStrength` and `TableColumnPin` types.
- No `showHeader` property: a header Table is not given is a header it does not
  render, so hiding it stays the owner's composition.
