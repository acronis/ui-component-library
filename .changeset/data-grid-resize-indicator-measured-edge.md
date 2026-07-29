---
'@constructor-lab/ui-react': patch
---

fix(data-grid): anchor the column-resize indicator to the column's rendered edge

User-reported, after the resize fix: "for others its shown at place of previous column
but resizing properly". The drag indicator was drawn one column to the left for every
column except the first.

The line's position was `anchor + prospective width`, where the width came from
`columnSizingInfo.startSize` — TanStack's **notional** `column.getSize()`. For a
column with no declared `size` that is the 150px default, while the cell renders at
whatever `table-layout: auto` distributes to it. The two are unrelated, so the line
landed short of the column's true trailing edge by `rendered − 150`: measured
**-198.7px at a 1280px viewport and -412px at 1920px**, which puts it nearer the
column's leading edge — the previous column's boundary — than its own. The first
column looked correct because it declares `size: 200` and renders at exactly 200, so
notional and rendered agree there and nowhere else.

The anchor was never wrong: measured per column, it equals each column's true left
edge. The fix separates the two coordinate systems the calculation had been mixing —
the notional side now contributes only the _displacement_ the commit is allowed to
make (bounded by `minSize`/`maxSize`, as before), and the measured client rect
contributes the _origin_. For a column whose declared size the browser honours the two
are equal and the result is unchanged.

Measured after the fix, +60 drag: the line sits exactly on the column's trailing edge
plus the pointer travel for every column, at both 1280px and 1920px.

**Known residual, for unsized columns only.** The commit is still a notional width, and
because the unsized presentation arm publishes only `min-width`, `table-layout: auto`
redistributes the surplus — so after release the edge lands 6–72px from where the line
was (measured). That is a much smaller and differently-caused error than the -412px it
replaces, and closing it means giving unsized columns a real `width`, which would change
at-rest rendering across the kit.

At-rest rendering is untouched: the indicator only exists during a drag.
