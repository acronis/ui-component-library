# StatRow — Accessibility

- **Structure:** a plain container of `CardFilter` tiles. Static tiles are
  non-interactive `<div>`s; clickable tiles render real `<button>`s (from
  CardFilter's `clickable` variant), so only interactive tiles enter the tab
  order and expose a button role.
- **Interactive tiles:** each clickable tile is keyboard-operable (Enter/Space)
  and shows a focus-visible ring (from CardFilter). Its accessible name comes from
  the label + value content; give the stat a clearer label if the value alone is
  ambiguous.
- **Empty tiles:** the `static-empty` placeholder is non-interactive and shows an
  em-dash — it conveys "no value yet", not an action.
- **Icons:** a per-stat `icon` is decorative context; the value carries the
  meaning, so status is never conveyed by icon color alone.
- **Contrast:** label/value colors come from the `--ui-card-filter-*` tier and any
  status icon colors from `--ui-glyph-on-status-*` — all token-based and authored
  to meet WCAG contrast.
- **WCAG:** 2.1.1 (keyboard — clickable tiles), 2.4.7 (focus visible), 1.4.3
  (contrast), 4.1.2 (name/role/value).
