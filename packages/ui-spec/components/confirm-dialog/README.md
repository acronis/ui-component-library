# ConfirmDialog

A modal confirmation for a single, often destructive action:
**`<ConfirmDialog title description confirmLabel destructive onConfirm />`**. A
config-driven composite over the `AlertDialog` primitive that bakes in the
approved confirmation shape — a title, an optional consequence line, and exactly
two footer actions (a secondary Cancel + a default/destructive Confirm) — so
every "are you sure?" reads the same way.

> **Opinionated composite (design-pending v1).** Phase-1 candidate of
> `context/opinionated-composites-proposal.md` — it trades flexibility for
> consistency. Built from requirements, not a Figma mockup.

## When to use

- Confirming a destructive or irreversible action (delete, revoke, disconnect).
- A yes/no decision with a clear consequence and no data to enter.

## When not to use

- Anything that collects input (even one field) — use a form dialog.
- A routine, reversible action — a `Toast` with undo is friendlier than a modal.
- A confirmation whose layout must differ from the fixed shape — compose the
  `AlertDialog` parts directly (the escape hatch; flexibility lives one layer down).

## Why not a plain Dialog?

ConfirmDialog builds on `AlertDialog`, which is deliberately more insistent than
`Dialog`: it traps focus, defaults focus to Cancel (the safe choice), and cannot
be dismissed by clicking outside — the point of a confirmation.

## Example (React — implemented)

```tsx
import { ConfirmDialog } from '@constructor-lab/ui-react';

// Controlled
<ConfirmDialog
  open={open}
  onOpenChange={setOpen}
  title="Delete project?"
  description="This permanently removes the project and its data. This action cannot be undone."
  confirmLabel="Delete"
  destructive
  onConfirm={handleDelete}
/>

// Uncontrolled, opened from a trigger
<ConfirmDialog
  title="Delete account?"
  confirmLabel="Delete"
  destructive
  trigger={<Button variant="destructive">Delete account</Button>}
  onConfirm={handleDelete}
/>
```

Vue and Web Component implementations are planned and target the same contract —
see `api.yaml` `adapters`.
