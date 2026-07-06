# Menu — Behavior

## Rendering

### Renders a panel of groups/sections and items

**Given** an open Menu with a section of items
**When** it renders
**Then** it shows a bordered panel (`role="menu"`) containing each group's or
section's items (`role="menuitem"`)
**And** the panel surface, border, radius, and padding resolve from the
`--ui-button-menu-dropdown-container-*` tokens.

### Sections are divided; plain groups are not

**Given** a panel with more than one `section`
**When** it renders
**Then** every section after the first shows a top divider from the
`--ui-button-menu-dropdown-section-container-border-*` tokens; the first
section has no divider.

**Given** a panel using a plain `group` instead of a `section`
**When** it renders
**Then** no border, padding, or gap is added — `group` only clusters related
parts semantically (`role="group"`).

## Item content

### An item shows a label with optional extras

**Given** an item with a label
**When** it renders
**Then** it shows the label in `--ui-button-menu-dropdown-item-label-color`,
truncating with an ellipsis when the panel is too narrow.

**Given** an item with a leading `icon`
**When** it renders
**Then** the icon appears before the label at 16px in
`--ui-button-menu-dropdown-item-icon-color`.

**Given** an item with a `shortcut`
**When** it renders
**Then** a trailing hint appears in
`--ui-button-menu-dropdown-extras-shortcut-label-color`, whether passed via
the item's `shortcut` prop or as the standalone shortcut part inside the
item's children.

**Given** an item with `cascade`
**When** it renders
**Then** a trailing chevron appears in
`--ui-button-menu-dropdown-extras-cascade-icon-color` (mirrored in RTL). This
is an indicator only — use a submenu trigger (below) for a live nested menu.

## Checkbox & radio items

### Toggling a checkbox item

**Given** a checkbox item with `checked = false` (or uncontrolled)
**When** the user activates it
**Then** a check indicator appears in `--ui-button-menu-dropdown-item-icon-color`
and `checked-change(true)` fires; the consumer owns the value when controlled.

### Choosing a radio item

**Given** a radio group with a `value`
**When** the user activates a different radio item in the group
**Then** the previously selected item's dot indicator clears, the newly
selected item's dot appears in `--ui-button-menu-dropdown-item-icon-color`,
and `value-change` fires with that item's value.

## Labels & separators

### A label is a non-interactive heading

**Given** a `label` part
**When** it renders
**Then** it shows static text in `--ui-button-menu-dropdown-item-label-color`
(padded from the item padding tokens), taking no part in roving keyboard
navigation; `inset` aligns it with rows that have a leading indicator.

### A separator divides groups of items

**Given** a `separator` between two groups of items
**When** it renders
**Then** it shows a 1px rule (`role="separator"`) in the section-container
border color, spaced by the section-list-gap token.

## Cascaded submenus

### A submenu trigger opens a nested panel

**Given** a submenu trigger row (label + optional leading `icon` + a trailing
cascade chevron)
**When** the user hovers it, presses Enter/Space, or presses the End-side arrow
**Then** a nested panel opens to the `inline-end` side, themed from the same
`--ui-button-menu-dropdown-container-*` / item tokens as the root panel, and
receives roving keyboard navigation; the Start-side arrow or Esc closes it.

**Given** a submenu is open
**When** its trigger renders
**Then** the trigger row stays in the hover state
(`--ui-button-menu-dropdown-item-container-color-hover`) via `data-[popup-open]`.

## Interaction states

### Tracks each item state from its own token

**Given** an item, checkbox item, radio item, or submenu trigger is idle,
highlighted (pointer hover or keyboard nav), or pressed
**When** it renders
**Then** the row background resolves from the matching
`*-item-container-color-idle` / `*-item-container-color-hover` /
`*-item-container-color-active` token (brand/theme overrides honored per
state).

### Disabled suppresses activation

**Given** an item, checkbox item, or radio item with `disabled`
**When** the user activates it
**Then** no click/toggle/change is emitted, the row is dimmed and
non-interactive, and it is skipped by keyboard navigation.

## Open / closed

### The panel opens from its trigger

**Given** a closed Menu
**When** the trigger is activated (click / Enter / Space / Arrow)
**Then** the panel opens (emitting open-change), receives focus, and enables
roving keyboard navigation.

**Given** an open panel
**When** an item is selected, Esc is pressed, or the user clicks outside
**Then** the panel closes (emitting open-change).

## Right-to-left

### The cascade mirrors in RTL

**Given** a Menu in a right-to-left context (a `dir="rtl"` ancestor for CSS and
a Base UI `DirectionProvider direction="rtl"` for positioning)
**When** a submenu opens
**Then** the leading icon and label sit on the right, the cascade chevron flips
(`rtl:rotate-180`), and the submenu panel opens to the inline-end (left) side.
