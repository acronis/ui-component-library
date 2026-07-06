# ButtonMenuDropdown — Behavior

## Rendering

### Renders a panel of sections and items

**Given** an open ButtonMenuDropdown with a section of items
**When** it renders
**Then** it shows a bordered panel (`role="menu"`) containing each section's
items (`role="menuitem"`)
**And** the panel surface, border, radius, and padding resolve from the
`--ui-button-menu-dropdown-container-*` tokens.

### Sections are divided

**Given** a panel with more than one section
**When** it renders
**Then** every section after the first shows a top divider from the
`--ui-button-menu-dropdown-section-container-border-*` tokens; the first section
has no divider.

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
`--ui-button-menu-dropdown-extras-shortcut-label-color`.

**Given** an item with `cascade`
**When** it renders
**Then** a trailing chevron appears in
`--ui-button-menu-dropdown-extras-cascade-icon-color` (mirrored in RTL). This is
an indicator only — use a submenu trigger (below) for a live nested menu.

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

**Given** an item is idle, highlighted (pointer hover or keyboard nav), or pressed
**When** it renders
**Then** the item background resolves from the matching `*-item-container-color-idle`
/ `*-item-container-color-hover` / `*-item-container-color-active` token
(brand/theme overrides honored per state).

### Disabled suppresses activation

**Given** an item with `disabled`
**When** the user activates it
**Then** no click is emitted, the row is dimmed and non-interactive, and it is
skipped by keyboard navigation.

## Open / closed

### The panel opens from its trigger

**Given** a closed ButtonMenuDropdown
**When** the trigger is activated (click / Enter / Space / Arrow)
**Then** the panel opens (emitting open-change), receives focus, and enables
roving keyboard navigation.

**Given** an open panel
**When** an item is selected, Esc is pressed, or the user clicks outside
**Then** the panel closes (emitting open-change).
