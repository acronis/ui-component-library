---
'@constructor-lab/ui-react': minor
---

`Calendar` reconciled with its design, on a real `--ui-calendar-*` tier

Figma node 8148:10167 defines a `components/Calendar/*` variable tier that
`@constructor-lab/tokens` had never emitted (`Calendar` was missing from the
token-emit allowlist), so the v1 port approximated the design with semantic
tokens. With the tier emitted, the component now binds it — and follows the
design's anatomy, which changes several defaults:

- **The caption is two `InputSelect`s** (month + year) and the chevron nav is
  hidden, because that is how the design navigates. `captionLayout="label"`
  restores react-day-picker's caption label plus prev/next buttons.
- **Weeks start on Monday** (`weekStartsOn` defaults to `1`) with two-letter
  weekday labels. A `locale` still overrides both.
- **`mode="range"` shows two months** side by side (`numberOfMonths` defaults to
  2 in that mode).
- **The panel is bordered**: container fill, 1px border and 4px radius, a ruled
  caption band and a padded body band.
- **Day cells are the tier's 32×32 box** — transparent idle, surface-hover on
  hover, the active fill when selected, with value colors split
  primary / secondary (outside) / active / disabled and tabular numerals.
- **`footer` is banded with the Footer tier**, for the design's Cancel/Apply row
  on the multiple and range variants. The buttons stay the host's.
- **Today no longer carries a marker.** The v1 port underlined it; the design's
  item has idle / hover / active / disabled and no today state. The cell is still
  marked `.rdp-today`, so a host that wants a marker can style it.
