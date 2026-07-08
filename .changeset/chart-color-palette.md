---
'@spec-lab/tokens': minor
---

Add a chart-color palette: nine categorical series colors (`--ui-chart-1` …
`--ui-chart-9`) plus six semantic roles (`--ui-chart-success`,
`--ui-chart-warning`, `--ui-chart-danger`, `--ui-chart-critical`,
`--ui-chart-info`, `--ui-chart-neutral`). Additive — nothing existing changed.

These are repo-authored data-viz colors, not sourced from Figma. They live in
their own `tiers/charts.json` tier (theme-invariant, single `$value`, no
`com.figma.*` discriminator) precisely so the Figma re-emit pipeline — which
overwrites `primitives.json`/`semantics.json`/`components.json` wholesale from
the snapshot — cannot clobber them. Values are preserved from the legacy Acronis
palette; HSL components were chosen to round-trip exactly through the build's
`color/hsl-to-rgb` transform.
