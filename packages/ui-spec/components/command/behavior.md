# Command — behavior

Given/When/Then scenarios for the command palette. Filtering, keyboard
navigation, and ARIA are provided by the Base UI Combobox primitive.

## Filtering

- **Given** an open palette, **when** the user types in the search input, **then**
  the list narrows to commands whose `label` matches the query, and groups with no
  matches are hidden.
- **When** the query matches nothing, **then** the list shows the `emptyMessage`.

## Selection

- **Given** the filtered list, **when** the user clicks a command **or** presses
  Enter on the highlighted command, **then** `select` fires with that command's
  `value`.
- **Given** a disabled command, **when** the user clicks it, **then** nothing
  happens (it is not highlightable or selectable).

## Keyboard

- **When** the palette opens, **then** the search input is focused.
- **ArrowDown / ArrowUp** move the highlight through the visible commands
  (skipping disabled ones and crossing group boundaries).
- **Enter** selects the highlighted command.
- In `CommandDialog`, **Escape** closes the dialog.

## Dialog (`CommandDialog`)

- **Given** `CommandDialog` with `open`, **when** `open` becomes true, **then** the
  palette appears centered over a backdrop with focus trapped inside.
- **When** a command is selected, **then** the consumer typically runs the command
  and sets `open` to false to dismiss.
