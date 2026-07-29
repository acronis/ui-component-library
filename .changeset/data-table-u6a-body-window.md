---
'@constructor-lab/ui-react': minor
---

feat(data-table): window the body over `@tanstack/react-virtual` (U6a)

`DataTable`'s body-window seam is now a real windowing implementation. Reachable
today through the controller — `useDataTable({ virtualization: { … } })`; the public
`DataGrid` `virtualization` prop is deliberately **not** declared yet (U6b), so that
it never ships with a known gap in the focus rules the kit enforces on itself.

```tsx
const controller = useDataTable({
  columns,
  data: rows, // 10,000 of them
  virtualization: { estimateRowHeight: 40, measure: 'fixed', overscan: 8 },
});
// height, NOT maxHeight — see the precondition below.
<DataTableView height={400} />;
```

Defaults are `api.yaml`'s: **40px / `fixed` / overscan 8**. `measure: 'dynamic'`
re-measures each rendered row and corrects the reserved scroll height; `scrollToIndex`
scrolls when it changes. Windowing applies to the **display-row** list, so record
counts, selection, filtering, expansion and page counts continue to use the full row
model — verified with a 500-row table selecting a row far outside the window.

The pre-declared **`measure-layout`** and **`scroll-to-row`** toggle actions now reach
the seam through the view bridge instead of throwing. They still throw with the
feature off, and again after the view unmounts, rather than quietly no-opping.

**The bounded-container precondition is `height`, not `maxHeight` — and this is a
correction to `api.yaml`, which says either will do.** A `maxHeight` on its own clamps
the scroll container but leaves its `height` at `auto`, so the viewport's `height: 100%`
has no definite parent to resolve against and grows to its content instead. Measured in
a browser at `maxHeight={400}` over 10,000 rows: container 400px, **viewport 400040px**,
no spacers, all 10,000 rows in the DOM — and the table could not be scrolled at all.
Virtualization is completely inert in that configuration.

Two development errors therefore guard it, because one of them can pass while the
feature is dead:

- no `height`/`maxHeight` at all — the container never asked to be bounded;
- **the viewport is taller than the container that bounds it** — it asked, but the
  geometry did not follow. This is the one that catches the `maxHeight` case, and it
  names both measured heights, because the failure is otherwise silent.

The underlying container behaviour belongs to `Table`/`ScrollArea` rather than to the
seam, and is filed separately; the second error makes it loud in the meantime.

**Design §7 focus clauses 1 and 2**, which are one mechanism rather than two — "pinning
cannot retain the focused row" is the same condition as "the pin budget is exhausted":

- A focused row is **pinned outside the overscan** by _extending the contiguous range_
  through the virtualizer's own `rangeExtractor`, never by appending out of order.
  `bodyWindow.rows` stays one flat index space, and the spacers stay exact by
  construction rather than by care. Verified in a browser with `overscan: 2` over 10,000
  rows: the window extended to keep the focused row mounted and `document.activeElement`
  unchanged.
- Past a bounded pin budget the row is released and **focus moves to the scroll
  container**, without touching the logical current row — the seam cannot reach that
  state at all. The guard is "focus was ours and has since been lost to `<body>`", not
  "focus is still inside the container": by the time any effect runs the row is gone and
  the browser has already moved focus to `<body>`, so the latter is false exactly when
  the hand-off is needed.

Focus is tracked from a `focusin` listener on the scroll container. Recording it while
attaching row refs cannot work — that happens during commit, but the range is decided
during render, and focusing a row causes no render, so the value would always be one
render stale and in practice never set at all.

`@tanstack/react-virtual` moves from `devDependencies` to **`dependencies`**, matching
`@tanstack/react-table`. It was already imported by shipped source (`tree.tsx`) and
resolved only because the bundler inlines it; this seam adds a second import. It is
deliberately still not externalised — that is a separate question about consumer
bundles.

Clauses 3 and 4 of §7 (the same-index → previous-last → toolbar → scroll-container
fallback after data removes the focused row, and the single `data-reconcile` event) are
**not** in this change.
