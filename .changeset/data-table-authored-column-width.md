---
'@constructor-lab/ui-react': patch
---

fix(data-table): a chosen column width is honoured as a width, not as a floor

"Restore column preferences" did not restore the width. Storage returned
`columnSizing: { name: 320 }` and the column rendered at **643.1px**, because a column
that declares no `size` took the presentation arm that publishes `min-width` only —
and under `w-full` + `table-layout: auto` a floor below the width the browser already
distributes does nothing at all.

The same mismatch made pointer resizing unreliable on any column without a declared
size, because TanStack computes a drag as `startSize + delta` where `startSize` is
`columnSizing[id] ?? columnDef.size` — a notional number, its own 150px default for an
unsized column, while that column renders at something else entirely. Measured at a
1280px viewport:

|                                      | before             | after              |
| ------------------------------------ | ------------------ | ------------------ |
| restored width of 320 renders at     | 643.1px            | 320.0px            |
| 60px drag moves the edge             | 82.0px             | 60.3px             |
| two consecutive 40px drags move it   | 56.9px then 48.3px | 40.3px then 40.0px |
| 40px drag under `fit: 'container'`   | 0.0px — a no-op    | 40.4px             |
| drag-indicator residual, 1280 / 1920 | 22.0px / 72.2px    | 0.0px / 0.0px      |

Two coupled changes, and neither is correct without the other:

- `columnSizing` holds a width somebody chose — restored from storage, committed by a
  drag, or set through `resizeTo` — so it is now published as a real `width` (with the
  matching `minWidth` floor, so §6.10's "a minimum causes horizontal scroll rather
  than compression" still holds).
- The resize handle's new `onPointerDown` writes the column's rendered width into
  `columnSizing` as the gesture begins, so the engine's notional size and the edge on
  screen are the same number before the engine reads either. `pointerdown` precedes
  `mousedown`, which is what makes it visible to the engine's own read.

A column that declares a `size` is unaffected: it already published a real width and
already resized exactly. A column with no sizing entry is unaffected at rest, so `fit`
and the default floor behave as before.

Composers spreading `resizeHandleProps` onto their handle get this automatically. One
that hand-picks `onMouseDown` will not — `DataTableColumnResizeHandleProps` now
documents that.

**One behaviour change worth knowing about, because it can surprise you.** Pressing a
resize handle and releasing it **without moving** now commits a binding width, which
takes that column out of `fit` redistribution from then on. The state write itself is
not new — the engine has always committed a `columnSizing` entry on release, with a
zero delta, writing its own notional size. What is new is that the value now _binds_.
So a column that stops participating in `fit` after an accidental click on its handle
is doing that for this reason. Reset it with `resetColumnSizing`, or by clearing the
column's entry in the `columnSizing` slice.
