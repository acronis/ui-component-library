# Metric — accessibility

- **DOM order matches reading order**: label → value → unit → trend → supporting
  text → body, so assistive tech reads a coherent "Gross margin 73 % ↓ 5% …".
- The unit stays adjacent to the value so they're announced together.
- **Status is not color-only**: it only tints the icon badge; the real meaning is
  carried by the value, trend, and supporting text (all caller-supplied).
- The icon in the badge is decorative (the badge wrapper is `aria-hidden`).
- **Tooltip affordance**: when `tooltip` is set, the info trigger is a real
  `<button>` named by `tooltipLabel` (default "More information"), so it is
  focusable and announced. The tooltip must not be the only source of essential
  information. Without a `tooltip`, Metric adds no tab stop.
- Abbreviations (ARR, MTTR) may need a `tooltip` / accessible expansion supplied
  by the consumer.
- Dynamically-updating values are not announced via `aria-live` unless the
  consumer wraps them.
- The label truncates when narrow. Pass the full text via the consumer's own
  tooltip (or widen the card) when truncation would lose meaning.

## Keyboard

| Key      | Result                                                        |
| -------- | ------------------------------------------------------------- |
| `Tab`    | Focuses the info affordance **only** when a `tooltip` is set. |
| (focus)  | Opens that tooltip, same as hover.                            |
| `Escape` | Closes an open tooltip (Base UI Tooltip behavior).            |

## Contrast

The value resolves the primary surface-text token and the label / unit /
supporting text the secondary token; the icon badge pairs a light status
background (`--ui-background-status-<s>-pressed`) with its readable status text
color (`--ui-text-on-status-<s>`). Both halves come from the same designed status
family, so the pairing is not an arbitrary text-on-tint combination. All meet
contrast in light and dark.
