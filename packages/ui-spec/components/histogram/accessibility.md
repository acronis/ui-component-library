# Histogram — accessibility

- recharts' `accessibilityLayer` is **on by default** (recharts v3), giving the
  chart keyboard focus and an accessible description of the plotted buckets.
- A histogram is inherently visual. **Pair it with a text alternative** — a
  caption, a summary (n, range, shape), or an adjacent data table of the bucket
  counts — and give the chart an accessible name (`aria-label` /
  `aria-labelledby`) when it is meaningful on its own. The wrapper forwards
  native `div` attributes, so `aria-*` pass through.
- Use `xAxisLabel` / `yAxisLabel` so the axes name what is being counted, not
  color/position alone.
- The axes, grid, and chrome (tooltip) resolve to semantic `--ui-*` tokens that
  meet contrast in light and dark. **The bar color is caller-supplied** via
  `config` — the `--ui-chart-*` palette provides a distinguishable, theme-stable
  default; if you supply your own, pick a value that meets 3:1 against the
  surface.
- Watch recharts issue [#4809](https://github.com/recharts/recharts/issues/4809)
  on the a11y layer for heavily-customized charts.

## Contrast

Chart chrome, axes, and grid meet contrast in both themes via the semantic
tokens. The bar fill comes from `config` (the `--ui-chart-*` palette by default)
and, when overridden, is the caller's responsibility.
