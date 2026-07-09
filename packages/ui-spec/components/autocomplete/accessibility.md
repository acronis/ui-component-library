# Autocomplete — Accessibility

## Roles

- The input is a `combobox` with `aria-expanded`, `aria-controls` pointing at the
  listbox, and `aria-activedescendant` tracking the highlighted suggestion — all
  wired by Base UI.
- The dropdown is a `listbox`; each suggestion is an `option`.
- Give the field an accessible name with a `FieldLabel` / `<label>` or
  `aria-label`.

## Keyboard

| Key                     | Action                                                  |
| ----------------------- | ------------------------------------------------------- |
| Character keys          | Type into the field; opens and filters the suggestions. |
| `ArrowDown` / `ArrowUp` | Move the highlight through suggestions.                 |
| `Enter`                 | Choose the highlighted suggestion (fills the input).    |
| `Escape`                | Close the dropdown, keeping the typed text.             |
| `Tab`                   | Move focus out; the typed text remains the value.       |

## Screen reader

- Announced as a combobox; as the user types, the number of available
  suggestions and the highlighted option are announced.
- The empty message is announced when filtering yields no suggestions.

## Difference from Combobox

- Autocomplete does **not** force a selection — the accessible value is the typed
  text. Use `Combobox` when the value must be one of the listed options (it adds
  the selected-state `option` semantics and a check indicator).

## Contrast

- Field box, dropdown surface, and suggestion text reuse the
  `--ui-input-select-*` tokens (meet 3:1 non-text / 4.5:1 text); the focused
  field shows the `--ui-focus-primary` ring.
