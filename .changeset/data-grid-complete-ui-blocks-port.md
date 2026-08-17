---
'@constructor-lab/ui-react': minor
---

**DataGrid / DataTable / Table**: finish the ui-blocks port. Three features had
arrived as configuration with no implementation behind them — each accepted a
prop, resolved it, threaded it onward, and then did nothing.

- **`columnsFeatures.pinnedDivider` (PLTFRM-93276) now draws.** A pinned cell
  paints an opaque surface, so columns scrolling beneath it had no seam and
  simply stopped existing. The boundary column of each pinned region takes a 1px
  divider on its inner edge — `'auto'` (the default) only while columns are
  actually hidden past that edge, `'always'` whenever a boundary exists, which is
  also the one way to keep it under `borders={false}`. What was missing here was
  the whole engine: `Table` had no such prop, `data-overflow-start`/`-end` existed
  nowhere, no code computed which pinned column is the boundary, and
  `DataTableView` forwarded neither the mode nor the per-cell flag.

- **`grouping.pageSize` (PLTFRM-93295) now pages.** Each group pages its members
  independently, as its own `groupPagination` state slice keyed by group ID —
  configuration for the size, state for the indices, the same split grid-wide
  `pagination` makes. Omitted or `0` is off, so every existing caller keeps the
  behaviour it had. Previously the value was validated, floored, threaded into
  controller options and ignored, while still warning you not to combine it with
  `pagination` — which implied it worked.

- **`meta.truncate: 'middle'` now truncates in the middle.** The `TruncateText`
  component it needs was never ported, so the declared `'middle' | 'end'` union
  fell back to CSS end-truncation. `TruncateText` ships now (middle/end, canvas
  text measurement, binary search over the kept-character count) and is exported.

`Table`'s cell `box-shadow` is now **composed from custom-property slots**
(`--table-shadow-y`, `--table-shadow-x`, `--table-shadow-marker`) rather than
written directly. Four features want a piece of one property — the sticky
header's line, the sticky footer's line, the current-row marker, and this divider
— and whoever wrote it last won. The collision that matters is a boundary pinned
cell inside a sticky header, where one of the two lines silently disappeared.
`borders={{ horizontal: false }}` correspondingly empties the y slot instead of
using `shadow-none`, which would also erase a divider the caller asked for
explicitly. Verified behaviour-preserving: all 148 existing table-family visual
baselines pass unchanged in both colour modes, with 4 new ones added for the
divider.

Also recovers test coverage the port had left behind: `data-grid-labels`
(15 assertions — the labels group previously had type coverage only),
`data-table-pinned-divider` (9), `data-table-group-pagination` (10), and the 7
browser assertions that were skipped because the features they describe did not
exist yet.
