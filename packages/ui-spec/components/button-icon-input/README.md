# ButtonIconInput

The small icon-only button that lives **inside** an input box — a clear (✕)
button, a password reveal eye, a search trigger.

It is a distinct component from [`ButtonIcon`](../button-icon/README.md), not a
size of it: the container is 20×20 (against ButtonIcon's 32×32) with 2px padding
around a 16px glyph, so it clears a 32px field box with the field's own padding-y
on either side. It also carries an `error` variant, which `ButtonIcon` has no use
for — an affordance inside a field has to follow that field into its error
treatment.

## When to use

- Any icon affordance rendered inside an input box: clear, reveal, pick, trigger.
- When the affordance must turn red with the field (`variant="error"`).

## When not to use

- For a standalone icon button in a toolbar, header, or row — use `ButtonIcon`.
- For an icon button that opens a menu — use `ButtonIconMenu`.

## Examples

```tsx
import { ButtonIconInput } from '@constructor-lab/ui-react';

// Clear affordance
<ButtonIconInput aria-label="Clear" onClick={onClear}>
  <TimesIcon />
</ButtonIconInput>;

// Following its field into the error treatment
<ButtonIconInput aria-label="Show password" variant="error">
  <EyeClosedIcon />
</ButtonIconInput>;
```

Positioning is the field's job — the component ships no absolute positioning.
`InputPassword` places it with
`absolute end-[var(--ui-input-password-global-box-padding-x)] top-1/2 -translate-y-1/2`.

## Parts

| Part   | Element    | Description                                         |
| ------ | ---------- | --------------------------------------------------- |
| `root` | `<button>` | The 20×20 surface (background, radius, focus ring). |
| `icon` | `<svg>`    | The single 16px glyph, tinted via `currentColor`.   |

## Known token gap

The `error` tier emits no `icon-color-disabled` (only `normal` does), so a
disabled `error` button reuses
`--ui-button-icon-input-normal-icon-color-disabled`. The Figma has no
disabled+error rendering to contradict this — it shows a constraint-validation
note in that cell instead, because a disabled control is barred from validation.
