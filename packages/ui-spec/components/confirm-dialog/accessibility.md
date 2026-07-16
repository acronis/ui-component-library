# ConfirmDialog — Accessibility

- **Role:** `role="alertdialog"` (from the AlertDialog primitive) — a modal that
  interrupts and demands a response, named by its title and described by its
  description via `aria-labelledby` / `aria-describedby`.
- **Focus:** focus is trapped within the dialog while open and returns to the
  trigger on close. Focus defaults to **Cancel** (the safe choice), never the
  destructive confirm — so an accidental Enter does not perform the action.
- **Dismissal:** Escape closes the dialog (→ Cancel semantics); clicking the
  scrim does **not** dismiss it, which is the point of a confirmation.
- **Keyboard:** Tab cycles between Cancel and Confirm; Enter/Space activate the
  focused action.
- **Name/role:** the two actions are real `Button`s with text labels; the
  destructive state is conveyed by the confirm label + styling, and the action is
  never conveyed by color alone (it has an explicit label).
- **Contrast:** all colors resolve from `--ui-*` tokens (AlertDialog surface +
  Button tiers), authored to meet WCAG contrast.
- **WCAG:** 2.1.2 (no keyboard trap beyond the intended modal trap), 2.4.3 (focus
  order), 4.1.2 (name/role/value), 1.4.3 (contrast).
