# DetailList — Accessibility

- **Structure:** renders semantic HTML — a `<dl>` of `<dt>` (label) / `<dd>`
  (value) pairs (via the DescriptionList primitive), so the label↔value
  relationship is conveyed natively to assistive tech.
- **Icons:** a per-item `icon` is decorative context beside the value; the value
  text carries the meaning, so status is never conveyed by the icon (color) alone.
- **Actions:** inline actions are real links/buttons (compose `Link`), keyboard
  focusable in reading order.
- **Contrast:** label/value use the primary surface text token, descriptions the
  muted secondary token, and dividers the border token — all authored to meet WCAG
  contrast. Caller-provided status icon colors (`--ui-glyph-on-status-*`) are
  likewise token-based.
- **WCAG:** 1.3.1 (info & relationships — the description-list semantics), 1.4.3
  (contrast), 1.4.1 (use of color — value text, not just the icon, conveys state).
