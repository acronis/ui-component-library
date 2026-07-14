# ButtonMenuDropdown — Accessibility

## Roles & structure

- The panel is a Base UI `Menu.Popup` with `role="menu"`; each item is
  `role="menuitem"`. Sections group related items (`role="group"`).
- The trigger (usually a `ButtonMenu`) owns `aria-haspopup="menu"`,
  `aria-expanded`, and `aria-controls` pointing at the panel — Base UI wires
  these when the trigger and content share the same `Menu.Root`.
- Item accessible names come from their text content. A leading icon is
  decorative; the shortcut hint and cascade chevron must not be the only thing
  conveying meaning.

## Keyboard

- `Enter` / `Space` / `ArrowDown` on the trigger — open the panel and focus the
  first item.
- `ArrowUp` / `ArrowDown` — move between items (roving focus); typeahead jumps to
  a matching item.
- `Enter` / `Space` — activate the focused item.
- `Esc` — close the panel and return focus to the trigger.
- `Tab` — closes the panel and moves focus onward.
- Disabled items are skipped and ignore activation.

## Focus

- Opening moves focus into the panel; closing (via select / Esc / outside press)
  returns focus to the trigger. Base UI manages the focus trap and restoration.
- Highlighted items are indicated with a background
  (`--ui-button-menu-dropdown-item-container-color-hover`) for both pointer and
  keyboard, so the current item is always visible.

## Contrast

- Color pairs come from the `--ui-button-menu-dropdown-*` tier in
  `@constructor-lab/tokens` and are maintained against WCAG AA at the design-token
  level. The disabled treatment relies on the item still resolving its label /
  icon tokens under a reduced-emphasis row.
