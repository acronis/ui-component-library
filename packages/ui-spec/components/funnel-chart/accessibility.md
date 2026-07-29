# FunnelChart — accessibility

- recharts' `accessibilityLayer` is **on by default** (recharts v3), giving the
  chart keyboard focus and an accessible description of the plotted stages.
- A funnel chart is inherently visual. **Pair it with a text alternative** — a
  caption, a summary sentence, or an adjacent data table carrying the same
  numbers (and, usually most useful, the stage-to-stage conversion rates) — and
  give the chart an accessible name (`aria-label` / `aria-labelledby`) when it is
  meaningful on its own. The wrapper forwards native `div` attributes, so
  `aria-*` pass through.
- Keep `showLabels` on (or the tooltip visible) so each stage is named in text,
  not by color/position alone.
- The chrome (tooltip) and the on-chart labels resolve to semantic `--ui-*`
  tokens that meet contrast in light and dark. **Stage colors are
  caller-supplied** via `config` — the `--ui-chart-*` palette provides
  distinguishable, theme-stable defaults; if you supply your own, pick values
  that meet 3:1 against the surface and stay distinguishable between adjacent
  stages.
- Watch recharts issue [#4809](https://github.com/recharts/recharts/issues/4809)
  on the a11y layer for heavily-customized charts.

## Contrast

Chart chrome and labels meet contrast in both themes via the semantic tokens.
Segment fills come from `config` (the `--ui-chart-*` palette by default) and,
when overridden, are the caller's responsibility.
