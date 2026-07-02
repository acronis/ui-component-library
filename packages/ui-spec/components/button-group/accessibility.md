# ButtonGroup — accessibility

## Role & semantics

- The root is a `role="group"` container. Give it an accessible name when the
  grouping isn't obvious from context — `aria-label` (e.g. "Text alignment") or
  `aria-labelledby` referencing a visible label.
- `data-orientation` reflects the layout axis; it is presentational (the visual
  order matches the DOM order, so screen-reader order is correct).

## Children

- The interactive semantics come from the children — each `Button` is a real
  `<button>` (or `<a>` via its `render`) with its own accessible name. **Icon-only
  buttons in a group must carry an `aria-label`** (there is no visible text).
- `ButtonGroupText` is a static, non-interactive addon; it is read inline as text
  and needs no role. When it labels an adjacent control, associate it explicitly
  (e.g. render it as a `<label htmlFor>`).
- `ButtonGroupSeparator` uses the `Separator` primitive (`role="separator"` +
  `aria-orientation`); it is decorative between controls.

## Keyboard & focus

- Focus order follows DOM order; each child manages its own tab stop and
  activation. The group lifts the focused child's z-index so its focus-visible
  ring is never clipped by a neighbor's collapsed border.
- ButtonGroup does not implement roving-tabindex or arrow-key navigation — each
  button is individually tabbable, matching the legacy behavior.

## Contrast

- Colors come from the shared semantic tokens (buttons: `--ui-button-*`; the text
  addon: muted surface + primary text), which the design system defines to meet
  WCAG AA. Don't override the token-driven colors with custom classes.
