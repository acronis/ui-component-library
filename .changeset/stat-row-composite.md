---
'@constructor-lab/ui-react': minor
---

Add `StatRow` — a config-driven KPI / stat row composite (`<StatRow stats={…} />`) over the `CardFilter` primitive. It renders a flat stat list as consistent tiles, deriving each tile's variant from the descriptor (empty placeholder, clickable filter, or static), in a wrapping row or an equal-width grid — so a dashboard's stat tiles stay uniform. An opinionated composite (see the opinionated-composites proposal). Initial version; design reconciliation pending.
