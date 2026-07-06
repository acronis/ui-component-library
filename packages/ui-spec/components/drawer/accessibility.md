# Drawer — accessibility

- The panel is a Base UI `Drawer.Popup` (Drawer extends Dialog): `role="dialog"`
  - `aria-modal`, labelled by `DrawerTitle` (`aria-labelledby`) and described by
    `DrawerDescription` (`aria-describedby`). Always include a `DrawerTitle` so the
    panel has an accessible name.
- Focus is trapped within the open panel and returns to the trigger on close;
  background scroll is locked while open (Base UI). `Esc` and an outside press
  dismiss an uncontrolled drawer.
- Swipe-to-dismiss is a pointer enhancement, not the only way out — the close
  button, `Esc`, and the backdrop remain available for keyboard and
  assistive-technology users.
- The close button is a real button labelled "Close" (sr-only text) and shows a
  visible focus ring (`--ui-focus-primary`).
- The `DrawerSwipeArea` grab handle is decorative; it is not the accessible name
  or the primary dismiss control.

## Contrast

Title uses `--ui-text-on-surface-primary` and description/close use
`--ui-text-on-surface-secondary` over the `--ui-background-surface-secondary`
panel; the header/footer bars use `--ui-background-surface-primary` divided by
`--ui-border-on-surface-border`. All meet text/non-text contrast in light and
dark; the backdrop uses `--ui-background-backdrop-screen`.
