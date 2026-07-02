# Calendar — accessibility

Most a11y is provided by `react-day-picker`, which implements the WAI-ARIA
grid/date-picker patterns. Notes specific to this port:

## Structure & roles

- The month is a `role="grid"` table; days are `gridcell` buttons; the weekday
  header row labels the columns. react-day-picker sets the `aria-label` on each
  day (the full date), the selected state (`aria-selected`), and disabled
  (`aria-disabled`) — do not override these.
- The previous/next controls are real `<button>`s with month labels; the chevron
  icons are decorative (`aria-hidden` via the icon components).

## Keyboard

- Arrow keys move day-to-day / week-to-week; `PageUp`/`PageDown` change month;
  `Home`/`End` jump to the start/end of the week; `Enter`/`Space` select. Focus
  is managed by react-day-picker (roving tabindex); the ported `CalendarDayButton`
  restores focus to the focused day after a re-render.

## Focus visibility

- Day and nav buttons show a 2px `--ui-focus-primary` focus-visible ring; the
  focused day is lifted above neighbors (`z-index`) so the ring isn't clipped.

## Contrast

- Selected days pair `--ui-background-brand-primary` with
  `--ui-glyph-on-brand-primary`; muted days use `--ui-text-on-surface-secondary`.
  These are design-system pairs meeting WCAG AA — don't override with custom
  colors. Selection is never conveyed by color alone (it also sets
  `aria-selected`).
