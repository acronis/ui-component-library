# TruncatedText — Accessibility

- **Role:** the text element is a plain `<span>` with no ARIA role — it is
  content, not a control. When the text is clipped it is wrapped in a Base UI
  Tooltip trigger, which adds the tooltip relationship.
- **Full value is always available:** the tooltip body is the same string as the
  visible text, so assistive tech and sighted users on hover / focus both reach
  the complete, untruncated value even though it is visually clipped.
- **Keyboard:** when truncated the trigger is focusable and the tooltip opens on
  focus (Base UI Tooltip), so the full value is reachable without a pointer. When
  the text fits there is no trigger and nothing extra enters the tab order.
- **Screen reader:** the visible text is exposed as-is; CSS truncation does not
  alter the accessible text, so the full string is announced regardless of
  clipping.
- **Contrast:** the tooltip's label / background pair comes from the
  `--ui-tooltip-*` tokens, which are authored to meet WCAG contrast. The text
  element inherits the surrounding text color.
- **WCAG:** 1.4.13 (content on hover or focus — dismissable, hoverable,
  persistent via Base UI Tooltip), 2.1.1 (keyboard), 1.4.3 (contrast).
