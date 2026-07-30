# InputPassword

A password field: a label, the masked input box, a reveal toggle inside the box,
and an optional description or error message.

It mirrors [`InputText`](../input-text/README.md)'s field furniture but is not a
variant of it — it has its own `--ui-input-password-*` token tier, and its
in-box affordance is a reveal toggle rather than a clear button.

## When to use

- Any password entry: sign-in, sign-up, change-password, credential forms.
- Whenever the user needs to verify what they typed without unmasking the field
  permanently.

## When not to use

- For ordinary single-line text — use `InputText`.
- For a one-time code — use `OTPField`.

## Examples

```tsx
import { InputPassword } from '@constructor-lab/ui-react';

// Basic field with helper text
<InputPassword
  label="Password"
  placeholder="Password"
  description="At least 8 characters."
/>;

// Required
<InputPassword label="Password" required />;

// Error — the box border, the reveal glyph, and the message all turn red
<InputPassword
  label="Password"
  value={value}
  error="Password is too short"
  onChange={onChange}
/>;

// Controlled reveal (e.g. to hide it again on submit)
<InputPassword
  label="Password"
  revealed={revealed}
  onRevealedChange={setRevealed}
/>;
```

## Parts

| Part          | Element    | Description                                             |
| ------------- | ---------- | ------------------------------------------------------- |
| `label`       | `<label>`  | Field label (associated via `htmlFor`/`id`).            |
| `required`    | `<span>`   | Required `*` marker (decorative; `aria-hidden`).        |
| `input`       | `<input>`  | The password box; `type` flips to `text` when revealed. |
| `reveal`      | `<button>` | The eye toggle (a `ButtonIconInput`).                   |
| `description` | `<p>`      | Helper text (normal state).                             |
| `error`       | `<p>`      | Error message; replaces the description when `error`.   |

## Notes

- The box's inline-end padding is computed from tokens
  (`box-padding-x + button width + box-gap`), so the value never runs under the
  reveal toggle.
- The reveal toggle inherits the field's variant: in the error treatment the eye
  turns red and its focus ring switches to `--ui-focus-error`.
