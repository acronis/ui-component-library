---
'@constructor-lab/ui-react': patch
---

docs(data-grid): `columnsFeatures.fit` and `.overflowTooltip` document what they actually do

Both prop docstrings ship in the `.d.ts`, so this is what an editor shows a consumer —
and both were making a promise the props do not keep.

**`overflowTooltip`** said "Show a tooltip when a cell's content is truncated", which
reads as "this flag produces truncation". It does not. It adds `truncate`
(`white-space: nowrap` + `text-overflow: ellipsis`), and `nowrap` makes the column's
min-content width the entire string — so under `w-full` + `table-layout: auto` the
browser widens the column to fit it and nothing ever reaches an overflow edge.
Measured on deliberately long values with no `maxSize`: the table grew past its
container and **0 of 16 body cells clipped**. `appearance.width` is not a way round it
either — that width lands on the bordered box and the table scrolls inside it,
unclipped. **Declare `maxSize` on the columns that should truncate**; with every column
capped, 12 of those same 16 cells clip.

**`fit`** did not say that `'content'` and `'container'` render identically today.
They produce byte-identical captures (0 of 1,024,000 pixels) with column widths
agreeing to the decimal: `'content'` emits `min-width: fit-content` and `'container'`
emits nothing, and a `min-width` floor below the width auto-layout already distributes
is inert. What both arms _do_ change is dropping the default `min-width: 150px` floor,
which visibly redistributes unsized columns from even to content-driven — so `fit` is
worth setting, just not for a difference between its two string values.

No behaviour change. The two `columnsFeatures` stories added alongside this exercise
both props standalone, which no story did before.
