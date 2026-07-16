# CardGrid — Behavior

## Rendering

### One card per item

**Given** an `items` list and a `renderItem`
**When** CardGrid renders
**Then** it renders one Card per item, each wrapping `renderItem(item, index)` as
its content — so every tile shares the Card shell and matches.

### Empty list

**Given** an empty `items` list
**When** it renders
**Then** it renders an empty grid (no cards).

## Layout

### Responsive columns (default)

**Given** `cols` (default 3)
**When** it renders
**Then** the cards fill a responsive grid of that many columns that reflows down
to fewer columns on narrow widths (Grid's `cols`).

### Auto-fill track

**Given** `minColumnWidth`
**When** it renders
**Then** the grid uses an auto-filling track of columns at least that wide,
fitting as many columns as the width allows (overriding `cols`).

### Gap

**Given** `gap` (default `md`)
**When** it renders
**Then** the cards are separated by that gap token (Grid's `gap`).

## Composition / escape hatch

**Given** a bespoke, non-uniform layout the item mapping can't express
**When** the author needs more control
**Then** they compose `Grid` + `Card` directly — flexibility lives one layer down.
