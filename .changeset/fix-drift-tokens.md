---
'@constructor-lab/ui-react': patch
---

fix(calendar, widget-table-data): rewire dangling `--ui-*` token references

The `/component-readiness` audit flagged two components referencing tokens that no
longer resolve (silent fallbacks):

- **widget-table-data** — `--ui-table-global-cell-border-color` →
  `--ui-table-global-row-border-color` (thead / row divider / footer borders) and
  `--ui-table-global-row-color-hover` → `--ui-table-data-row-color-hover` (row
  hover). These were live refs, so the borders/hover now render their intended
  colors instead of falling back.
- **calendar** — a comment referenced the retired `--ui-text-on-surface-link`;
  updated to the current `--ui-text-on-surface-link-idle` (comment only, no render
  change).
