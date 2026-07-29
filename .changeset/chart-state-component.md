---
'@constructor-lab/ui-react': minor
---

Add `ChartState` — a shared loading / empty / error placeholder for the chart
types, rendered in place of a chart inside the same sized slot. A compact status
block (spinner / inbox / warning glyph over a centered label) with an optional
retry action for the error state. Themes from the status/text semantic tokens;
the `--ui-chart-*` data-viz palette is deliberately reserved for series identity.
