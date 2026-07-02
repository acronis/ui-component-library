# ButtonGroup — behavior

ButtonGroup is a presentational container; it has no internal state and no events
of its own. Its children (usually `Button`s) keep their own behavior.

## Grouping

- **Given** a `ButtonGroup` with several `Button` children **when** rendered
  **then** the buttons sit flush against each other and their shared inner corner
  radii and borders are collapsed, so they read as one segmented control.
- **Given** `orientation="horizontal"` (default) **when** rendered **then** items
  lay out left-to-right; each non-first item loses its left radius and left
  border, each non-last item loses its right radius.
- **Given** `orientation="vertical"` **when** rendered **then** items stack
  top-to-bottom with the top radius/border collapsed on non-first items.

## Parts

- **Given** a `ButtonGroupText` child **when** rendered **then** a static, muted,
  bordered addon appears inline with the buttons (e.g. a `https://` prefix or a
  unit label). It is not interactive.
- **Given** a `ButtonGroupSeparator` child **when** rendered **then** a divider is
  drawn between the adjacent items (vertical by default).
- **Given** `ButtonGroupText` with a `render` prop **when** rendered **then** its
  classes and props are merged onto that element (e.g. a `<label>`).

## Focus

- **Given** a focused child button **when** it shows its focus ring **then** the
  group lifts that child above its neighbors (`z-index`) so the ring is not
  clipped by the adjacent collapsed borders.

## Non-goals

- ButtonGroup does **not** manage selection or a "pressed" state across its items
  (it is not a toggle/segmented-value control — use `ToggleGroup` for that).
