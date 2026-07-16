# StatRow — Behavior

## Rendering

### One tile per stat

**Given** a `stats` list
**When** StatRow renders
**Then** it renders one CardFilter tile per stat, in order, showing each stat's
label and value (and optional leading icon).

### Variant derived from the descriptor

**Given** a stat
**When** it renders
**Then** its tile variant is derived: `empty` → a `static-empty` placeholder (an
em-dash value, no icon); `onClick` or `render` → a `clickable` filter (renders a
`<button>` with hover/active/focus states); otherwise a `static` tile.

### Clickable tiles fire their handler

**Given** a stat with `onClick`
**When** the user activates its tile
**Then** `onClick` is called. Static and empty tiles are not interactive (no
button, not in the tab order).

## Layout

### Wrapping row by default

**Given** no `columns`
**When** it renders
**Then** the tiles are a wrapping flex row of fixed-width (224px) cards.

### Equal-width grid with `columns`

**Given** `columns`
**When** it renders
**Then** the tiles fill an equal-width grid of that many columns.

## Composition / escape hatch

**Given** a one-off card or a bespoke tile the descriptor can't express
**When** the author needs more control
**Then** they use `CardFilter` directly — flexibility lives one layer down.
