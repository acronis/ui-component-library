---
'@constructor-lab/ui-react': patch
---

fix(data-grid): the pager's "of N" reports the result total, not the loaded window

Second, independent half of the pager-label defect. `getFilteredRowModel().rows.length`
is the **loaded** row set, so under server pagination the label announced one window as
the whole result set.

It is self-proving: a grid with `server.rowCount: 4821` and a 4-row window rendered
"0 of 4 row(s) selected." while its own page counter rendered "Page 1 of 483" — two
numbers in one component describing the same total, and the component already held the
right one.

Now `table.getRowCount()`, which is `options.rowCount ?? prePaginationRowModel.rows.length`
— the filtered count client-side and the owner's total in server mode. Correct in both
without a branch and without new plumbing, since `server.ts` already forwards
`rowCount`. Client-side grids are unchanged.
