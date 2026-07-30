# InputPassword — Accessibility

- **Label association:** the `label` is a real `<label htmlFor>` tied to the
  input's `id` (auto-generated when not supplied), so clicking it focuses the
  input and screen readers announce the field name.
- **Required:** `required` sets `aria-required="true"` on the input; the visual `*`
  marker is `aria-hidden` (the asterisk is decorative — the required semantics come
  from the attribute).
- **Description / error:** whichever message is shown is linked to the input via
  `aria-describedby`, so it is announced with the field. The error message also
  drives `aria-invalid="true"` on the input.
- **Reveal toggle:** a native `<button>` inside the box with `aria-pressed`
  reflecting the reveal state and an accessible name that describes the _next_
  action — "Show password" while masked, "Hide password" while revealed. It also
  carries `aria-controls` pointing at the input.
- **Keyboard:** the input is a native password field; the reveal toggle is a
  separate tab stop after it, activated by Enter / Space.
- **Focus visible:** keyboard focus paints a 3px ring — `--ui-focus-primary`
  normally and `--ui-focus-error` in the error state — flush to the box; the
  reveal toggle has its own ring, which follows the same variant.
- **Password managers:** the field renders a native `<input type="password">` and
  forwards `name` / `autoComplete`, so browser and password-manager autofill work
  unchanged. Revealing swaps `type` to `text` on the same element, keeping the
  value and the field identity.
- **Disabled:** native `disabled` removes the input (and the toggle) from the tab
  order; not used to convey state by color alone (the field is also inert).
- **Contrast:** label / value / placeholder / message / border pairs come from the
  design tokens, authored to meet WCAG contrast.
- **WCAG:** 1.3.1 (info/relationships), 2.1.1 (keyboard), 2.4.7 (focus visible),
  1.4.3 / 1.4.11 (contrast), 3.3.1 / 3.3.2 (error identification + labels), 4.1.2.
