---
'@spec-lab/ui-react': patch
---

Table / DataTable: rewire onto the restructured `--ui-table-*` token tier. The
next-gen sync moved the row fill colors under `data` and the cell border under
`row`, and merged the header cell padding into `global`:
`--ui-table-global-row-color-*` → `--ui-table-data-row-color-*`,
`--ui-table-global-cell-border-color` → `--ui-table-global-row-border-color`,
`--ui-table-header-cell-padding-x` → `--ui-table-global-cell-padding-x`. Both
components referenced the removed names and rendered rows without their fill /
border. Also wires the Table Figma Code Connect to its ready-for-dev node.
