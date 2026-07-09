# Meter — Accessibility

## Roles

- The root is `role="meter"` with `aria-valuenow`, `aria-valuemin`, and
  `aria-valuemax`. Provide `aria-valuetext` (or the root's `getAriaValueText`)
  when the numeric value alone isn't meaningful (e.g. "3 of 5 — strong").
- `MeterLabel` names the meter and is associated with the root; `MeterValue`
  presents the same reading visually.

## Meter vs. Progress

- Use `meter` for a **static measurement** of a known quantity (disk usage,
  quota, score). Use `progress` (`role="progressbar"`) for **task advancement**
  over time, which can also be indeterminate. Choosing the right role is the key
  a11y decision — they are announced differently.

## Screen reader

- Announced with its label and current value (formatted / `aria-valuetext` when
  provided) relative to its range.
- The meter is not interactive; there is no keyboard interaction.

## Contrast

- The indicator fill (`bg-secondary`) against the track (`bg-input`) meets 3:1
  for non-text UI; don't rely on the fill color alone to convey meaning — pair it
  with the label/value text. Value text uses the muted foreground, meeting 4.5:1
  on the surface.
