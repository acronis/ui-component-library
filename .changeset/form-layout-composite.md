---
'@constructor-lab/ui-react': minor
---

Add `FormLayout` — a config-driven form composite (`<FormLayout fields={…} values onValueChange />`) over the `Form` / `Field` / `Grid` primitives. It maps a flat field-descriptor list onto the right control (text/email/password/textarea/select/number/checkbox/switch/radio), normalizes each control's differing change convention behind one uniform `onValueChange(name, value)`, and lays fields out in one or two responsive columns with required markers and per-field errors. An opinionated composite (see the opinionated-composites proposal). Initial version; design reconciliation pending.
