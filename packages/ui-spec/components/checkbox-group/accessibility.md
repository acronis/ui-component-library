# CheckboxGroup — Accessibility

## Roles

- The group root is a `<div role="group">`. Give it an accessible name — wrap it
  in a `FieldSet` + `FieldLegend`, or set `aria-label` / `aria-labelledby` — so
  assistive tech announces the members as a named group rather than orphaned
  checkboxes.
- Each member is a `Checkbox` (`role="checkbox"` with `aria-checked`), named by
  its own `label` / `aria-label`. See the checkbox spec.

## Keyboard

The group does not add roving focus — each member is individually tabbable, like
independent checkboxes:

| Key           | Action                                  |
| ------------- | --------------------------------------- |
| `Tab`         | Move focus to the next member (or out). |
| `Shift + Tab` | Move focus to the previous member.      |
| `Space`       | Toggle the focused member.              |

## Screen reader

- Announced as a group with its legend/label, then each member's label and
  checked state.
- When `disabled`, members are announced as unavailable and skipped for
  interaction.

## Group-level validation

- A "choose at least one" rule is a property of the group, not any single
  member. Surface one error message for the whole set (a `Field.Error` needs a
  `Field.Root` ancestor, so under a `FieldSet` render the message directly) and
  reference the group via `aria-describedby` where possible.

## Contrast

- The group carries no color; member contrast is the `Checkbox`'s
  responsibility (box border, fill, and glyph meet 3:1 non-text / 4.5:1 text
  against the surface).
