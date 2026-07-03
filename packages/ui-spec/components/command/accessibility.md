# Command — accessibility

Built on the Base UI **Combobox** primitive (combobox + listbox pattern); in
`CommandDialog`, wrapped in a Base UI **Dialog**.

## Roles & ARIA

- The search field is `role="combobox"` with `aria-expanded`, `aria-controls`
  pointing at the list, and `aria-activedescendant` tracking the highlighted item.
- The list is `role="listbox"`; each command is `role="option"` with
  `aria-selected` / `aria-disabled` as appropriate. Groups are `role="group"`
  labelled by their heading.
- `CommandDialog` renders `role="dialog"` (modal) with a backdrop; give it an
  accessible name via `title` (default "Command palette").

## Keyboard

| Key                 | Action                              |
| ------------------- | ----------------------------------- |
| (type)              | Filter the list                     |
| ArrowDown / ArrowUp | Move the highlight between commands |
| Enter               | Select the highlighted command      |
| Escape              | Close the dialog (`CommandDialog`)  |

## Focus

- Opening the palette focuses the search input. In `CommandDialog`, focus is
  trapped within the dialog and restored to the trigger on close (Base UI Dialog).
- The highlighted option is tracked with `aria-activedescendant`; DOM focus stays
  on the input while arrow keys move the highlight.

## Screen reader

- The number and identity of matches are conveyed through the listbox/option
  roles and `aria-activedescendant`. Leading icons are decorative; the option is
  announced by its label. Shortcut hints are visual; expose real shortcuts via
  the app's key handling if needed.

## Contrast

- All colors resolve to `--ui-*` tokens meeting the kit's contrast targets in
  light and dark; the highlighted row uses the surface-hover token. No color is
  hand-authored.
