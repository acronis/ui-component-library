---
'@constructor-lab/ui-react': minor
---

Table: the scroll container is now `ScrollArea`, so table scrollbars match the
rest of the kit.

Previously the container was a plain `div` with `overflow: auto`, which meant
every table showed whatever scrollbar the platform draws. It is now the kit's own
`ScrollArea`, with overlay scrollbars that reserve no layout space.

**`containerRef` and `containerProps` now reach the element that actually
scrolls.** `ScrollArea`'s outer box is `overflow: hidden`; the viewport inside it
is the scroller. Both are wired to the viewport, so a ref you hold reports real
`scrollTop`/`scrollHeight` and an `onScroll` you pass fires for the scroll you can
observe. `data-bounded` moved to the viewport for the same reason — it marks the
element an owner is given, not the wrapper around it.

**`containerClassName`, `width`, `height` and `maxHeight` still apply to the outer
box**, which is what sizes the region.

**Why the container is two elements.** The box that sizes the region and the
element that scrolls cannot be the same node: an element carries exactly one
`data-slot`, the viewport already carries `data-slot="scroll-area-viewport"`, and
overriding that would break `ScrollArea`'s own contract. So
`data-slot="table-container"` names the outer box and the viewport does the
scrolling. This is not a side effect of where the box styles went — putting
`height`/`maxHeight` on the viewport measures identically and would still leave
the slot on the box.

**Breaking for anyone attached to the container element.** `Table` is published,
and the element that scrolls has moved _inside_ the chain: it is now
`ScrollArea`'s viewport rather than the outer box. A scroll listener, an
`IntersectionObserver`, a `scrollTo` call, or CSS written against the container
now targets a node that no longer scrolls, and will silently do nothing rather
than error. Use `containerRef` — it points at the scrolling element — or query
`[data-slot="scroll-area-viewport"]`.

Migration, for anyone reaching into the DOM:

- `table.parentElement` is **no longer** the scroll container — the table's parent
  is `ScrollArea`'s content wrapper. Use `[data-slot="table-container"]` for the
  box, or `[data-slot="scroll-area-viewport"]` for the scroller.
- The box no longer has `overflow-auto`; it is `overflow-hidden`, and the viewport
  scrolls.
- The box always carries an inline `style` now (`ScrollArea` sets its position and
  corner-size custom properties), so asserting the style attribute is absent no
  longer works — assert on the specific properties you care about.

Sticky headers, sticky footers, sticky group rows and both column pin directions
are unaffected: verified in a browser under simultaneous vertical and horizontal
scroll, positioned identically to the previous container. `ScrollArea` isolates
its stacking context rather than using `contain` or a `transform`, which would
create a containing block and break sticky.
