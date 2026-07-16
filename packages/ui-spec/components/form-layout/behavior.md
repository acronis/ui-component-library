# FormLayout — Behavior

## Rendering

### Maps each field's `type` to the right control

**Given** a `fields` list
**When** FormLayout renders
**Then** each descriptor renders its control: `text`/`email`/`password` → a text
input, `textarea` → a multiline input, `select` → a select, `number` → a number
field, `radio` → a radio group, `checkbox` → a checkbox, `switch` → a switch.

### Labels and required markers

**Given** a field with a `label` (and optional `required`)
**When** it renders
**Then** the label is shown, with a trailing " *" marker when `required` is set.

## Change handling

### Normalizes every control's change to one handler

**Given** any field type
**When** the user edits the control
**Then** `onValueChange(name, value)` is called with that field's name and next
value — regardless of whether the underlying control uses a native `onChange`, a
Base UI `onValueChange`, or an `onCheckedChange`.

## Validation / errors

**Given** `errors[name]` is set for a field
**When** it renders
**Then** that field shows the error message in the danger color, hides its
description, and marks the field invalid (for assistive tech).

## Layout

### One or two columns

**Given** `columns`
**When** it renders
**Then** `1` stacks the fields with the shared form rhythm; `2` lays them out in
a responsive grid that collapses to one column on narrow widths. Textarea fields
(and any field with `fullWidth`) span the full row.

## Submit / cancel

**Given** the submit button is activated
**When** the form submits (and native validation passes)
**Then** `onSubmit` is called with the current values.

**Given** `onCancel`
**When** the cancel button is activated
**Then** `onCancel` is called. The cancel button renders only when `onCancel` is set.

## Disabled

**Given** `disabled`
**When** it renders
**Then** every control and both footer buttons are disabled.

## Composition / escape hatch

**Given** a field or layout the descriptor can't express
**When** the author needs more control
**Then** they compose `Form` / `Field` / `Grid` and the controls directly —
flexibility lives one layer down, not in more descriptor keys.
