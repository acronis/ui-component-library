# FormLayout — Accessibility

- **Structure:** renders a native `<form>` (via the `Form` primitive). Each field
  is a `Field` that auto-wires `htmlFor` / `id` / `aria-describedby` between the
  label, control, and description/error.
- **Labels:** every field has a visible label. The required marker (" *") is
  `aria-hidden` (decorative); requiredness is conveyed to assistive tech via the
  control's native `required`. Checkbox/switch fields use the control's own
  built-in label.
- **Errors:** when `errors[name]` is set the field is marked invalid (Field
  `invalid` → `aria-invalid` on the control) and the message renders in the danger
  color, associated with the control.
- **Controls:** each mapped control keeps its own keyboard and ARIA behavior
  (Select listbox, NumberField spinbutton, RadioGroup radios, Checkbox/Switch).
  Radio options are labeled by their wrapping `<label>`.
- **Submit:** the submit button is a real `type="submit"`, so Enter submits the
  form and native constraint validation runs before `onSubmit`.
- **Contrast:** all colors resolve from `--ui-*` tokens (the composed components'
  tiers + the danger error color), authored to meet WCAG contrast.
- **WCAG:** 1.3.1 (info & relationships — labels/fieldsets), 3.3.1 / 3.3.2 (error
  identification + labels/instructions), 2.1.1 (keyboard), 4.1.2 (name/role/value).

> **Known prototype gap:** the `select` / `number` / `radio` controls are rendered
> beside the `FieldLabel` rather than through `FieldControl`, so the label→control
> association for those relies on the control's own labeling (e.g. the Select
> trigger's `aria-label`) rather than Field's auto-wiring. Reconcile when promoting
> past v1.
