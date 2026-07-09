# OTPField

A segmented input for a fixed-length one-time code — email/SMS verification, 2FA,
or a PIN. The field owns the whole value across `length` slots and handles focus
movement, paste-to-fill, character filtering, and optional masking for you.

> **Design-pending v1.** Wraps Base UI `OTPField`; slots reuse the
> `--ui-input-text-*` tokens. No Figma node yet — reconcile with
> `/figma-component OTPField <url> --update` when a mockup lands.

## When to Use

- Entering a verification code or 2FA token of known length.
- A PIN or short numeric code where per-character slots aid legibility.
- Codes that benefit from OS/keyboard `one-time-code` autofill.

## When NOT to Use

- Free-form or variable-length text — use `InputText`.
- A single hidden secret (password) — use an `InputText` with `type="password"`.
- Very long codes where discrete slots become unwieldy — use `InputText`.

## Quick Examples

### React

```tsx
import { OTPField, OTPFieldInput } from '@spec-lab/ui-react';

function Verify({ onComplete }: { onComplete: (code: string) => void }) {
  return (
    <OTPField length={6} onValueComplete={onComplete}>
      {Array.from({ length: 6 }).map((_, i) => (
        <OTPFieldInput key={i} />
      ))}
    </OTPField>
  );
}
```

Group the slots with an `OTPFieldSeparator`, mask sensitive codes with `mask`,
and change the accepted characters with `validationType` (default `numeric`).

## Parts

| Part      | Element | Notes                                             |
| --------- | ------- | ------------------------------------------------- |
| root      | `div`   | Owns the value; manages focus, paste, validation. |
| input     | `input` | One character slot; render `length` of them.      |
| separator | `span`  | Optional non-interactive separator between slots. |

## Spec Files

| File               | Contents                                         |
| ------------------ | ------------------------------------------------ |
| `index.yaml`       | Identity, status, category                       |
| `anatomy.yaml`     | Root, input/separator parts, value state         |
| `api.yaml`         | Framework-agnostic contract + framework adapters |
| `tokens.yaml`      | `--ui-input-text-*` slot references + focus ring |
| `behavior.md`      | Given/When/Then behavior scenarios               |
| `accessibility.md` | Roles, keyboard, screen-reader, contrast         |
