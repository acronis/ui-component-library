# RadarChart — accessibility

- recharts' `accessibilityLayer` is **on by default** (recharts v3), giving the
  chart keyboard focus and an accessible description of the plotted points.
- A radar chart is inherently visual — and harder than most to read precisely
  (area shape, not a linear scale). **Pair it with a text alternative** — a
  caption or an adjacent data table carrying the same per-axis numbers — and give
  the chart an accessible name (`aria-label` / `aria-labelledby`) when it is
  meaningful on its own. The wrapper forwards native `div` attributes, so `aria-*`
  pass through.
- Do **not** rely on color alone to distinguish series. Keep `showLegend` (or the
  tooltip) visible. Overlapping translucent areas are hard to separate — keep the
  series count low and the fill opacity modest.
- The chrome (tooltip, legend, web) resolves to semantic `--ui-*` tokens that meet
  contrast in light and dark. The polar spoke labels are scoped to the
  muted-foreground token locally (the shared container themes cartesian ticks but
  not polar ones — a Chart-primitives gap worked around without editing
  `chart.tsx`). **Series colors are caller-supplied** via `config` — the
  `--ui-chart-*` palette provides distinguishable, theme-stable defaults.
- Watch recharts issue [#4809](https://github.com/recharts/recharts/issues/4809)
  on the a11y layer for heavily-customized charts.

## Contrast

Chart chrome and spoke labels meet contrast in both themes via the semantic
tokens. Area fills/strokes come from `config` (the `--ui-chart-*` palette by
default) and, when overridden, are the caller's responsibility — translucent
fills lower effective contrast against the surface and each other.
