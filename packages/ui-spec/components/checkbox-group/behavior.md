# CheckboxGroup — Behavior Scenarios

## Rendering

### Reflects the group value on its members

**Given** a CheckboxGroup with `value` (or `default-value`) of `["email"]`
**When** it renders
**Then** the member whose `name` is `"email"` is checked
**And** every other member is unchecked

### Renders member checkboxes in order

**Given** a CheckboxGroup with several `Checkbox` children
**When** it renders
**Then** each child is a checkbox exposed in source order

---

## Interaction

### Ticking a member adds its name (uncontrolled)

**Given** an uncontrolled CheckboxGroup with value `["email"]`
**When** the user ticks the `"sms"` member
**Then** the group value becomes `["email", "sms"]`
**And** `value-change` fires with the new array

### Unticking a member removes its name

**Given** a CheckboxGroup with value `["email", "sms"]`
**When** the user unticks the `"email"` member
**Then** the group value becomes `["sms"]`
**And** `value-change` fires with the new array

### Controlled mode defers to the consumer

**Given** a CheckboxGroup with a controlled `value`
**When** the user ticks a member
**Then** `value-change` fires with the requested array
**And** the members update only when the consumer updates `value`

### Disabled blocks the whole group

**Given** a CheckboxGroup with `disabled`
**When** the user clicks any member
**Then** the value does not change
**And** `value-change` does not fire
**And** every member shows the disabled state

---

## Edge Cases

### Empty selection is valid

**Given** a CheckboxGroup with value `[]`
**When** it renders
**Then** no member is checked
**And** the group is a legitimate state (the consumer decides if it is valid)

### Names not present as members are ignored

**Given** a group value containing a name with no matching member
**When** it renders
**Then** that entry ticks nothing and is preserved in the value until changed
