# OTPField — Accessibility

## Roles

- Each slot is a native `<input>` with `inputmode` and `autocomplete="one-time-code"`
  set from the field's `validation-type`, so mobile keyboards and OS autofill
  offer the received code.
- The field renders a hidden input carrying the full value for form submission
  and constraint validation.
- Give the field an accessible name — a `FieldLabel` / `<label>` or `aria-label`
  describing what the code is (e.g. "Verification code").

## Keyboard

| Key                        | Action                                                  |
| -------------------------- | ------------------------------------------------------- |
| Character key              | Fill the focused slot and advance to the next.          |
| `Backspace`                | Clear the focused slot (or the previous) and move back. |
| `ArrowLeft` / `ArrowRight` | Move focus between slots.                               |
| `Home` / `End`             | Move focus to the first / last slot.                    |
| Paste (`Cmd/Ctrl+V`)       | Fill slots from the clipboard, filtered and clamped.    |

## Screen reader

- Announced as a labelled group of inputs; the current slot and its filled state
  are announced as focus moves.
- With `mask`, entered characters are not read back individually.

## Contrast

- Slot border and value text reuse the `--ui-input-text-*` tokens (meet 3:1
  non-text / 4.5:1 text against the surface); the focused slot shows the shared
  `--ui-focus-primary` ring for a visible focus indicator.
