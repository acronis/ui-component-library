# Menu — Accessibility

## Roles & structure

- The panel is a Base UI `Menu.Popup` with `role="menu"`; a plain `group` and
  a divided `section` both render `role="group"`. Items are `role="menuitem"`;
  checkbox items `role="menuitemcheckbox"` with `aria-checked`; radio items
  `role="menuitemradio"` with `aria-checked`, grouped inside a `radio-group`.
- The trigger owns `aria-haspopup="menu"`, `aria-expanded`, and
  `aria-controls` pointing at the panel — Base UI wires these when the trigger
  and content share the same `Menu.Root`. A `submenu-trigger` carries the same
  `aria-haspopup="menu"` / `aria-expanded` pair for its nested panel.
- Item accessible names come from their text content. A leading icon is
  decorative; the shortcut hint and cascade chevron must not be the only thing
  conveying meaning. Separators are `role="separator"`; labels are
  non-interactive headings with no implicit role relationship to the items
  that follow them.

## Keyboard

- `Enter` / `Space` / `ArrowDown` on the trigger — open the panel and focus the
  first item.
- `ArrowUp` / `ArrowDown` — move between items (roving focus); `Home` / `End`
  jump to first / last; typeahead jumps to a matching item.
- `Enter` / `Space` — activate the focused item, toggle a checkbox item, or
  select a radio item.
- `ArrowRight` (or the inline-end arrow) on a submenu trigger — opens its
  nested panel and moves focus to its first item; `ArrowLeft` (or the
  inline-start arrow) closes it and returns focus to the trigger.
- `Esc` — closes the nearest open panel (a submenu first, then the root) and
  returns focus to its trigger.
- `Tab` — closes the panel and moves focus onward.
- Disabled items are skipped and ignore activation.

## Screen reader

- Opening announces the menu and its first item (e.g. "Profile, menu item 1 of
  4").
- Checkbox and radio items announce their checked/selected state; toggling or
  reselecting re-announces it.

## Focus

- Opening moves focus into the panel; closing (via select / Esc / outside
  press) returns focus to the trigger. Base UI manages the focus trap and
  restoration, including for nested submenus.
- Highlighted rows are indicated with a background
  (`--ui-button-menu-dropdown-item-container-color-hover`) for both pointer
  and keyboard, so the current item is always visible.

## Contrast

- Color pairs come from the `--ui-button-menu-dropdown-*` tier in
  `@spec-lab/tokens` and are maintained against WCAG AA at the design-token
  level. The disabled treatment relies on the row still resolving its label /
  icon tokens under a reduced-emphasis row.
