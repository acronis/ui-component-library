# FormLayout

The config-driven form: **`<FormLayout fields={…} values onValueChange />`**. It
maps a flat field-descriptor list onto the right ui-react control and normalizes
each control's differing change convention behind one uniform
`onValueChange(name, value)`, laying fields out with the shared Form rhythm (or a
responsive two-column Grid) — so every form in the app reads the same way.

> **Opinionated composite (design-pending v1).** Tier-1 candidate of
> `context/opinionated-composites-proposal.md` — it trades flexibility for
> consistency. Built from requirements, not a Figma mockup.

## When to use

- A create/edit form assembled from standard controls (text, select, switch,
  checkbox, number, radio, textarea) where the layout and spacing should match
  every other form.
- Rendering a form from data/config rather than hand-composing each `Field`.

## When not to use

- A form with bespoke controls, custom per-field layout, or cross-field logic the
  descriptor can't express — compose `Form` / `Field` / `Grid` + the controls
  directly (the escape hatch; flexibility lives one layer down).
- A single inline control — use that control on its own.

## Field types

`text` · `email` · `password` · `textarea` · `select` · `number` · `checkbox` ·
`switch` · `radio`. `select` / `radio` take `options`; `number` takes
`min`/`max`/`step`; `textarea` spans the full row in a two-column layout.

## Example (React — implemented)

```tsx
import { FormLayout } from '@constructor-lab/ui-react';

const [values, setValues] = useState({});

<FormLayout
  columns={2}
  fields={[
    { name: 'firstName', label: 'First name', required: true },
    { name: 'lastName', label: 'Last name', required: true },
    { name: 'role', label: 'Role', type: 'select', options: roles },
    { name: 'seats', label: 'Seats', type: 'number', min: 1 },
    { name: 'bio', label: 'Bio', type: 'textarea' },
    { name: 'notify', label: 'Email notifications', type: 'switch' },
  ]}
  values={values}
  onValueChange={(name, value) => setValues((v) => ({ ...v, [name]: value }))}
  errors={errors}
  onSubmit={save}
/>;
```

Vue and Web Component implementations are planned and target the same contract —
see `api.yaml` `adapters`.
