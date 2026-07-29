# ConfidenceCone — accessibility

- recharts' `accessibilityLayer` is **on by default** (recharts v3), giving the
  chart keyboard focus and an accessible description of the plotted points.
- A confidence cone is inherently visual, and the band encodes uncertainty that
  is easy to miss. **Pair it with a text alternative** — a caption, a summary,
  or an adjacent data table carrying the estimate and both bounds — and give the
  chart an accessible name (`aria-label` / `aria-labelledby`) when it is
  meaningful on its own. The wrapper forwards native `div` attributes, so
  `aria-*` pass through.
- Name the projection boundary in text (via `forecastLabel`) so "this part is a
  forecast" does not rely on the dashed divider alone.
- The divider, axes, grid, and chrome (tooltip, legend) resolve to semantic
  `--ui-*` tokens that meet contrast in light and dark. **The line + band colors
  are caller-supplied** via `config` — the `--ui-chart-*` palette provides a
  distinguishable, theme-stable default; if you supply your own, keep the line
  legible against the translucent band and the surface (3:1).
- Watch recharts issue [#4809](https://github.com/recharts/recharts/issues/4809)
  on the a11y layer for heavily-customized charts.

## Contrast

The divider, chrome, axes, and grid meet contrast in both themes via the semantic
tokens. The line and band fills come from `config` (the `--ui-chart-*` palette by
default) and, when overridden, are the caller's responsibility.
