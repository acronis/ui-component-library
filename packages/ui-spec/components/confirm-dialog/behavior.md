# ConfirmDialog — Behavior

## Shape

### Renders the fixed confirmation shape

**Given** a `title` (and optional `description`)
**When** the dialog is open
**Then** it renders the title, the description (when provided), and exactly two
footer actions — Cancel and Confirm — in that order.

### Exactly two actions

**Given** any ConfirmDialog
**When** it renders
**Then** there are only two actions; the shape does not allow a third. Cancel is
secondary and Confirm is default (or destructive), never the reverse.

## Confirm / cancel

### Confirm

**Given** the dialog is open
**When** the user activates the confirm action
**Then** `onConfirm` is called and the dialog closes.

### Cancel

**Given** the dialog is open
**When** the user activates the cancel action (or presses Escape)
**Then** `onCancel` is called (for the button) and the dialog closes without
confirming.

## Destructive

**Given** `destructive`
**When** it renders
**Then** the confirm action uses the destructive Button styling (the confirm
action, not Cancel).

## Open state

### Controlled

**Given** `open` + `onOpenChange`
**When** open state changes (trigger, confirm, cancel, Escape)
**Then** `onOpenChange` fires with the next value; the consumer owns the state.

### Uncontrolled

**Given** `defaultOpen` and/or a `trigger`
**When** the trigger is activated
**Then** the dialog opens and manages its own open state.

## Insistence (inherited from AlertDialog)

**Given** the dialog is open
**When** the user clicks outside the popup
**Then** it does **not** dismiss (unlike a plain Dialog)
**And** focus is trapped within the dialog, defaulting to Cancel (the safe choice).

## Composition / escape hatch

**Given** a need the fixed shape cannot express
**When** the author needs more control
**Then** they compose the `AlertDialog` parts directly — flexibility lives one
layer down, not in more ConfirmDialog props.
