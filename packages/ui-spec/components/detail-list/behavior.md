# DetailList — Behavior

## Rendering

### One row per item

**Given** an `items` list
**When** DetailList renders
**Then** it renders a `<dl>` with one label/value row per item — the label in a
`<dt>`, the value in a `<dd>`.

### Optional per-item extras

**Given** an item with `icon`, `description`, and/or `actions`
**When** it renders
**Then** the icon appears as a leading glyph beside the value, the description as
a muted line under it, and the actions as inline links under it. Omitted extras
render nothing.

## Layout

### One or two columns

**Given** `columns`
**When** it renders
**Then** `1` stacks the rows full-width (fixed label column); `2` lays the rows
out in a responsive grid that collapses to one column on narrow widths.

### Label column width

**Given** `labelWidth` (or the default)
**When** it renders
**Then** the label column uses that width — defaulting to 14rem in one column and
8rem in two.

## Composition / escape hatch

**Given** a row or layout the item descriptor can't express
**When** the author needs more control
**Then** they compose the `DescriptionList` parts directly — flexibility lives one
layer down, not in more descriptor keys.
