# OTPField — Behavior Scenarios

## Rendering

### Renders one slot per length

**Given** an OTPField with `length` of 6 and 6 `OTPFieldInput`s
**When** it renders
**Then** six character slots are shown
**And** the value is empty

### Distributes a default value across slots

**Given** an OTPField with `default-value` `"1234"` and `length` 4
**When** it renders
**Then** each slot shows one character: `1`, `2`, `3`, `4`

---

## Interaction

### Typing advances focus

**Given** focus in the first slot
**When** the user types a valid character
**Then** the slot fills
**And** focus moves to the next slot
**And** `value-change` fires with the accumulated value

### Backspace moves back

**Given** focus in a filled slot
**When** the user presses Backspace
**Then** the character is removed
**And** focus moves to the previous slot

### Paste fills multiple slots

**Given** an OTPField
**When** the user pastes a string
**Then** it is distributed across the slots (filtered by `validation-type`, clamped to `length`)

### Rejects characters outside the validation type

**Given** an OTPField with `validation-type: numeric`
**When** the user types a letter
**Then** the character is not accepted
**And** the value does not change

### Completes and optionally submits

**Given** an OTPField with `auto-submit` inside a form
**When** the last slot is filled
**Then** `value-complete` fires with the full code
**And** the form is submitted

### Disabled blocks entry

**Given** an OTPField with `disabled`
**When** the user types
**Then** no slot changes
**And** `value-change` does not fire

---

## Edge Cases

### Masking hides characters

**Given** an OTPField with `mask`
**When** slots are filled
**Then** each shows a masked glyph instead of the character
**And** the value still holds the real characters

### Controlled mode defers to the consumer

**Given** an OTPField with a controlled `value`
**When** the user types
**Then** `value-change` fires with the requested value
**And** the slots update only when the consumer updates `value`
