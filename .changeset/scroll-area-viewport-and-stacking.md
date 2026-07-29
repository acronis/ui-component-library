---
'@constructor-lab/ui-react': minor
---

ScrollArea: expose the viewport, and stop scrolled content painting over the
scrollbar.

**`viewportRef` and `viewportProps`.** `ref` reaches the root, which is
`overflow: hidden` and never scrolls — it reports `scrollTop: 0` and
`scrollHeight === clientHeight` forever. Anything that measures, observes or
programmatically scrolls the region needs the viewport: a virtualizer's scroll
element, an infinite-scroll observer, a scroll-to-item call. `viewportProps`
carries a scroll handler, a tab index, or `data-*` attributes that have to sit on
the element that actually scrolls.

**Fix: the scrollbar is no longer painted over by scrolled content.** `ScrollBar`
was `z-index: auto` and the root was `position: relative` with no z-index —
therefore not a stacking context — so any z-index used by content _inside_ the
scroll area outranked the scrollbar, and outranked everything outside the scroll
area too. A sticky table header is the case that surfaced it: the header stacked
above the bar and hid its top edge exactly where a long table is most likely to be
scrolled.

Two changes together: the root now sets `isolation: isolate`, and `ScrollBar`
takes a z-index above content. Isolating is what keeps the second change local —
the scrollbar only outranks content in its own scroll area, and content inside can
no longer outrank overlays outside.

`isolation` is used deliberately rather than `contain` or a `transform`: those
create a containing block and would break `position: sticky` inside the viewport.
Verified in a browser that sticky positioning and both horizontal pin directions
are unaffected.

**Possible behavior change for consumers:** if you relied on a z-index inside a
`ScrollArea` to paint above something outside it, it no longer will. In practice
the root has always been `overflow: hidden`, so non-portalled content could never
escape the box anyway; Base UI overlays portal out and are unaffected.

**Measured, not assumed: nothing in this kit changes appearance.** Isolating can
only alter painting where a descendant inside the scroll area carries a `z-index`.
Every current consumer was checked in a browser — `SidebarSecondary`,
`SidebarPrimary`, `AppShell` and `Tree` — and **none has a single z-indexed
descendant inside a scroll area**, so for all of them the change is provably inert.
Screenshots with and without `isolation` are byte-identical for `SidebarSecondary`
and `AppShell`. `Table` is the only consumer that stacks inside its scroll area,
which is the case this exists for.
