# AspectRatio — behavior

AspectRatio is a presentational layout primitive. No internal state, no events.

## Sizing

- **Given** an `AspectRatio` with a `ratio` **when** rendered **then** its width
  comes from its parent and its height is `width / ratio` (native CSS
  `aspect-ratio`).
- **Given** no `ratio` **when** rendered **then** it defaults to `1` (a square).
- **Given** a child sized `h-full w-full` (e.g. an `<img className="object-cover">`)
  **when** rendered **then** the child fills the ratio-constrained box.

## Passthrough

- **Given** a `className` and/or `style` **when** rendered **then** they merge
  onto the container (`className` appended; a caller `style` merged over the
  `aspect-ratio` declaration). Any other `<div>` attribute passes through.

## Non-goals

- AspectRatio does **not** load, crop, or lazy-load media — it only constrains
  the box. Media behavior (`object-fit`, `loading`) is the child's concern.
- It does **not** clip overflow by default; add `overflow-hidden` (and a radius)
  on the container when the child should be clipped.
