# ButtonIconInput — Accessibility

- **Name:** the control is icon-only, so it has no text to name it — pass
  `aria-label` (or `aria-labelledby`). A field affordance should name the action,
  not the glyph ("Clear", "Show password"), and the name must change when the
  action does.
- **Role:** a native `<button>`; `type="button"` by default so it never submits
  the form it sits inside.
- **Keyboard:** reachable by Tab as its own stop after the input it belongs to,
  and activated by Enter / Space.
- **Focus visible:** keyboard focus paints a 3px ring flush to the 20×20 edge —
  `--ui-focus-primary` for `normal`, `--ui-focus-error` for `error`.
- **Toggle affordances:** when the button toggles a field's state (reveal /
  hide), the consumer sets `aria-pressed` and swaps the accessible name;
  `InputPassword` does both.
- **Disabled:** native `disabled` removes it from the tab order; the state is not
  conveyed by color alone (the control is also inert).
- **Not a state indicator:** `variant="error"` is decoration that follows its
  field. The error semantics live on the input (`aria-invalid` +
  `aria-describedby`), not on this button.
- **Contrast:** glyph / container pairs come from the design tokens, authored to
  meet WCAG contrast.
- **WCAG:** 2.1.1 (keyboard), 2.4.7 (focus visible), 1.4.3 / 1.4.11 (contrast),
  4.1.2 (name, role, value).
