---
'@constructor-lab/ui-react': patch
---

**DataGrid/DataTable: `appearance.width` now bounds the bordered box, and the
generated chrome columns are 40px instead of ~100–210px.**

Two instances of one defect — a sizing constraint landing on a different element
than the one that presents the region.

`appearance.width` reached the scroll container while the border was drawn by a
wrapper `<div>` that took no width, so a narrow grid rendered as a full-width
bordered box containing a narrow scroll region, with the horizontal scrollbar
ending short of the border it appeared to belong to. The wrapper is gone: the
scroll container carries the border, the radius and the width. Two consequences
worth knowing — the width now _includes_ the 2px border (`box-sizing:
border-box`), and `ScrollArea`'s viewport `rounded-[inherit]` finally resolves to
the container's radius instead of `0`.

The generated selection, detail-expander and row-actions columns declared no
width, so they inherited TanStack's 150px default and rendered 92.6–209.2px
around 16–24px controls. They are now pinned to 40px — square to the table's
row-height floor (`h-10`) at the default `medium` density.

Also fixes a second case of the same root cause: **a caller's `size` on a column
now reaches the DOM in a plain `<DataGrid>`.** Column widths were published only
when `columnsFeatures` enabled one of `visibility`/`pinning`/`resizing`/
`reordering`, so `size: 200` on an otherwise plain grid silently did nothing. An
_unsized_ column is unchanged and still publishes no width.

**Behaviour change, stated because it is not a side effect:** the detail-expander
column (`__detail__`) is now **locked by default** alongside the selection and
actions columns — it can no longer be moved, pinned or resized unless the caller
sets `columnsFeatures.lockSystemColumns: false`. Its absence from that set was an
oversight rather than a decision: the expander was the only generated chrome
column a user could drag out of place. The invariant is now that the locked set
matches the generated set. This reaches the column-settings menu and the column
announcer; the menu's visual baseline captures it closed, so no pixel change is
expected there.
