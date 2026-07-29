---
'@constructor-lab/ui-react': patch
---

fix(data-table): give the keyboard-focusable row the kit focus ring

Current-row navigation puts a roving `tabIndex` on the `<tr>`, making the row
itself focusable — but the row carried no focus style, so browsers painted their
own default outline (a solid black box in Chromium light mode) instead of the
kit's focus treatment.

The row now takes `--ui-focus-primary` on `focus-visible`, matching the sortable
column header and every other focusable control. It uses `outline` rather than
`ring` because box-shadow on a `<tr>` is unreliable across engines, and the
outline is inset so a focused first/last row is not clipped by the table border.
Rows are left untouched when row navigation is off.
