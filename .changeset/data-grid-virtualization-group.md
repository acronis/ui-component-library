---
'@constructor-lab/ui-react': minor
---

DataGrid: add the public `virtualization` prop — row windowing over the engine's
existing seam.

`DataGrid` gains `virtualization` (`estimateRowHeight`, `measure`, `overscan`,
`scrollToIndex`; every member optional). The windowing mechanism already shipped in
`DataTable`; this is the config route to it, so a grid virtualizes with
`virtualization={{}}` plus a bounded height.

- **A bounded height is required** — either `appearance.height` or
  `appearance.maxHeight`. Without a bound there is no viewport to window against and
  every row renders. The value must be an **absolute length**: a percentage resolves
  against an indefinite containing block, so the scroll viewport grows to its content,
  reports itself bounded, and never scrolls. The engine reports both failures against
  the DOM rather than guessing from the config.
- **`virtualization={{}}` is a complete configuration.** Design §5.2's defaults (40px
  row estimate, `fixed` measurement, overscan 8) live in the engine, and this layer
  passes through only what the caller set rather than restating them — so one default
  has one home, and "the caller chose 40" stays distinguishable from "nobody chose".
- **No `getRowId` required.** Windowing is presentation keyed by row index, not by row
  identity.
- Windowing applies to the **display-row** list rather than to the records, so row
  index and count metadata survive (design §7), and pagination plus virtualization
  windows the current page.

`measure: 'dynamic'` measures each rendered row instead of trusting the estimate; use
it for variable-height content. `scrollToIndex` scrolls a row into view and again
whenever the value changes, so it reads as state rather than as a one-shot command.
