# InputPassword — Behavior

## Rendering

**Given** a `label`
**When** the field renders
**Then** the label appears above the input and is associated with it via
`htmlFor`/`id` (clicking the label focuses the input).

**Given** `required`
**When** the field renders
**Then** a `*` marker is appended after the label and the input gets
`aria-required="true"`.

**Given** a `description`
**When** no `error` is set
**Then** the helper text shows below the input, associated via `aria-describedby`.

**Given** any state
**When** the field renders
**Then** the reveal toggle is always present inside the box — unlike `InputText`'s
clear button, it does not depend on the field having a value.

## Reveal

**Given** the field is uncontrolled
**When** the reveal toggle is activated
**Then** the input's `type` flips between `password` and `text`, the glyph swaps
between the closed and open eye, the accessible name swaps between
"Show password" and "Hide password", and `aria-pressed` follows the state.

**Given** `defaultRevealed`
**When** the field first renders
**Then** it starts in that reveal state.

**Given** a `revealed` prop
**When** the toggle is activated
**Then** `onRevealedChange` fires with the next state and the rendered state does
not change until the prop does — the component is fully controlled.

**Given** the field is `disabled`
**Then** the toggle is disabled too and cannot change the reveal state.

## Error

**Given** `error` is set
**When** the field renders
**Then** the input shows the error border (via `aria-invalid`), the reveal toggle
switches to its `error` variant, the error message replaces the description below
the input, and the message is associated via `aria-describedby`.

## Interaction

**Given** the field
**When** the pointer hovers it
**Then** the label, box, value / placeholder, and description shift to their
hover tokens.

**Given** the input
**When** it receives keyboard focus
**Then** it paints a 3px ring — `--ui-focus-primary` normally,
`--ui-focus-error` while in the error state. The reveal toggle has its own focus
ring, which is the Figma's `focused-icon` state.

**Given** any typing
**When** the value changes
**Then** the native `change` event is forwarded to the consumer.
