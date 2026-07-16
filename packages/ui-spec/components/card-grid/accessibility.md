# CardGrid — Accessibility

- **Structure:** a `Grid` container of uniform `Card` tiles. CardGrid adds no
  extra ARIA — it is a layout of the composed Card content, so semantics come
  from what `renderItem` puts inside each Card (headings, links, buttons).
- **Reading order:** cards follow DOM order, which matches the visual reflow, so
  keyboard and screen-reader order stay consistent as columns change.
- **Interactive tiles:** if a card links into a detail view, put a real link or
  button inside `renderItem` (e.g. a `Button`, or a `Card` with `render` as a
  link) so it is focusable and named — don't rely on a click handler on the tile
  alone.
- **Uniformity:** keep each item's content parallel (title + description +
  action) so the grid reads as a coherent set rather than a broken table.
- **Contrast:** the Card shell's surface / border / text come from the semantic
  `--ui-*` tokens, authored to meet WCAG contrast.
- **WCAG:** 1.3.2 (meaningful sequence — DOM order matches reflow), 1.4.3
  (contrast), plus whatever the `renderItem` content requires (2.1.1 / 4.1.2 for
  interactive cards).
