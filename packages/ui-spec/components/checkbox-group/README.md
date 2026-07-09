# CheckboxGroup

Provides shared state to a set of related checkboxes: the group owns a single
list of the ticked members' `name`s, so you read and write one array instead of
juggling a boolean per box. Use it for a multi-select question where any number
of options — including none — may be chosen.

> **Design-pending v1.** Layout-only wrapper on Base UI `CheckboxGroup`; members
> carry the `--ui-checkbox-*` theming. No Figma node yet — reconcile with
> `/figma-component CheckboxGroup <url> --update` when a mockup lands.

## When to Use

- Several checkboxes that answer one question ("Which notification channels?").
- You want the selection as one `string[]` value (easy to submit/validate).
- Building a "select all" parent (pass `all-values`) over a set of members.

## When NOT to Use

- A single on/off choice — use a bare `Checkbox`.
- **Mutually exclusive** options — use a `RadioGroup`.
- More than ~7 options, or options needing search — use `Select` / `Combobox`.

## Quick Examples

### React

```tsx
import { CheckboxGroup, Checkbox } from '@spec-lab/ui-react';

function Channels() {
  const [value, setValue] = useState<string[]>(['email']);
  return (
    <CheckboxGroup value={value} onValueChange={setValue}>
      <Checkbox name="email" label="Email" />
      <Checkbox name="sms" label="SMS" />
      <Checkbox name="push" label="Push notifications" />
    </CheckboxGroup>
  );
}
```

Wrap the group in a `FieldSet` + `FieldLegend` to give it an accessible name and
a single error slot — see the [field group](../../patterns/field-group) pattern.

## Parts

| Part | Element                | Notes                                            |
| ---- | ---------------------- | ------------------------------------------------ |
| root | `div` (`role="group"`) | Owns the `string[]` value; stacks members.       |
| item | `Checkbox`             | A member; ticks when its `name` is in the value. |

## Spec Files

| File               | Contents                                           |
| ------------------ | -------------------------------------------------- |
| `index.yaml`       | Identity, status, category, dependencies           |
| `anatomy.yaml`     | Root, item part, group value state                 |
| `api.yaml`         | Framework-agnostic contract + framework adapters   |
| `tokens.yaml`      | None (layout-only; members use `--ui-checkbox-*`)  |
| `behavior.md`      | Given/When/Then behavior scenarios                 |
| `accessibility.md` | Group role/name, keyboard, screen-reader, contrast |
