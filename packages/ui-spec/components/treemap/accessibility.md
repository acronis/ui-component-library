# Treemap — accessibility

- recharts' `accessibilityLayer` is **on by default** (recharts v3), but a
  treemap is a heavily-visual, custom-rendered chart. **Pair it with a text
  alternative** — a caption, a summary, or an adjacent data table carrying the
  same hierarchy and numbers — and give the chart an accessible name
  (`aria-label` / `aria-labelledby`) when it is meaningful on its own. The
  wrapper forwards native `div` attributes, so `aria-*` pass through.
- Keep `showLabels` on so tiles are named in text, not by color/position alone —
  and remember small tiles are unlabeled (too small for text), so the text
  alternative must carry the full set.
- The gutter, the on-tile labels, and the chrome (tooltip) resolve to semantic
  `--ui-*` tokens. On-tile labels use the on-color text token, which is designed
  to meet contrast against a colored fill. **Category colors are caller-supplied**
  via `config` — the `--ui-chart-*` palette provides distinguishable,
  theme-stable defaults; if you supply your own, pick values that keep the
  label legible and stay distinguishable between adjacent categories.
- Watch recharts issue [#4809](https://github.com/recharts/recharts/issues/4809)
  on the a11y layer for heavily-customized charts.

## Contrast

The tooltip meets contrast in both themes via the semantic tokens. On-tile
labels use the on-color text token against the category fill. Category fills come
from `config` (the `--ui-chart-*` palette by default) and, when overridden, are
the caller's responsibility — including keeping the label readable on the fill.
