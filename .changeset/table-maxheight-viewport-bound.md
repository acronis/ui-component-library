---
'@constructor-lab/ui-react': patch
---

fix(Table): `maxHeight` now bounds the element that scrolls, so a bounded table
can actually scroll.

`maxHeight` alone produced a table that **clipped instead of scrolling**. The
constraint was applied to the scroll container's outer box, leaving that box
`max-height: 320px` with `height: auto` — and the inner viewport's `height: 100%`
needs a _definite_ parent height, so it resolved to auto and grew to its content.
Measured in a browser with 60 rows in a 320px box: box 320px against a **2440px**
viewport whose `scrollHeight === clientHeight`, so `scrollTop` never left 0 and
the box's `overflow: hidden` clipped the remaining rows.

`height` was unaffected, because a definite length is inheritable — which is why
the two placements looked interchangeable when only `height` was measured.

Three consequences of the fix:

- **Any `maxHeight` table whose content exceeds the bound now scrolls.** This was
  never virtualization-specific, though it did make windowed rendering inert:
  `data-bounded` read `true` throughout, so every precondition guard keyed on it
  passed while the feature was dead.
- **`height`/`maxHeight` now land on the viewport; `width` stays on the outer
  box.** `data-slot="table-container"` stays on the box (an element carries one
  slot and the viewport already has ScrollArea's), and `data-bounded` plus
  `containerRef` stay on the viewport. If you assert on inline styles, a height
  constraint you used to read off `[data-slot="table-container"]` is now on
  `[data-slot="scroll-area-viewport"]`.
- **`containerProps.style` moves with them**, onto the scrolling element that prop
  is documented to reach — it previously landed on the outer box.

Sticky headers, sticky footers and pinned columns were re-verified in a browser
under simultaneous vertical and horizontal scroll: the sticky header holds at the
top of the scrollport and the start/end-pinned columns hold at its edges while the
unpinned columns scroll under them.

Three stories were added whose content actually overflows
(`BoundedByHeightOverflowing`, `BoundedByMaxHeightOverflowing`,
`BoundedByMaxHeightBothAxes`). Their absence is why this shipped: every existing
bounded story holds eight rows in a 200–240px box, and a story that cannot exhibit
a failure certifies its absence.
