# AspectRatio — accessibility

## Role & semantics

- AspectRatio is a plain `<div>` with **no role** — it is a layout wrapper and
  adds no semantics of its own. Screen readers see straight through it to the
  child.
- The **child** owns all semantics: an `<img>` needs a meaningful `alt` (or
  `alt=""` if purely decorative); a `<video>`/`<iframe>` needs its own
  accessible name/title.

## Content

- Because the box has a fixed ratio, ensure the content isn't clipped in a way
  that hides meaning — for text or interactive content inside a constrained box,
  verify it remains readable/operable at the target ratio and viewport widths.

## No interaction

- AspectRatio is not focusable and has no keyboard behavior; it introduces no tab
  stop. Any interactivity comes from the child.
