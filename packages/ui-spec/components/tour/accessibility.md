# Tour — accessibility

The coach-mark is built on the Base UI Popover primitive, which supplies focus
management, dismissal, and ARIA wiring.

## Roles & ARIA

- The `content` panel is a `role="dialog"`. It is labelled by the `title`
  (`aria-labelledby`) and, when present, described by the `description`
  (`aria-describedby`).
- The `beacon` is purely decorative and is `aria-hidden`; it must not be the only
  cue for a step — the target itself should remain perceivable.
- The `scrim` is a decorative backdrop and conveys no semantics.
- The `close` button carries an `sr-only` "Close" label.

## Keyboard

- **Tab / Shift+Tab** move between the interactive controls (close, Skip, Back,
  Next). Base UI moves focus into the panel when it opens and restores it to the
  trigger on close.
- **Esc** dismisses the coach-mark.
- **Enter / Space** activate the focused control.
- The **Back** button is `disabled` on the first step and is skipped in the tab
  order.

## Screen reader

- On open, the dialog's accessible name (title) and description are announced.
- The step counter ("2 of 5") is plain text within the dialog and is read as part
  of the footer; it gives the reader the sense of progress through the tour.

## Contrast & motion

- Text and controls resolve to semantic tokens that meet contrast in light and
  dark themes; the panel border uses the brand color.
- The beacon's pulsing ring is decorative animation. Pass `pulse={false}` to
  render a static dot for reduced-motion preferences.
