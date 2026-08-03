---
'@constructor-lab/ui-react': patch
---

List popups scroll in a `ScrollArea` instead of a native gutter

`InputSelect` (and its `Select` alias), `Combobox` and `Autocomplete` dropped
`overflow-y-auto` on the Base UI popup in favour of the kit's `ScrollArea`. Its
overlay scrollbar reserves **zero** layout space, so the full-bleed item rows keep
their edge-to-edge background instead of being inset by a native scrollbar gutter
on platforms that reserve one — the same reason `SidebarPrimary`,
`SidebarSecondary`, `Table` and `Tree` already use it. It also makes the bar
consistent with those regions: token-coloured, revealed on hover/scroll.

The height bound moved with it, onto the scroll **viewport** rather than the
popup. That placement matters: `ScrollArea`'s root is `height: auto`, so a
max-height there leaves the viewport's `height: 100%` unresolved, the viewport
grows to the full content height, and the overflow is clipped away unreachable
with no scrollbar at all.

Keyboard behaviour is unchanged — Base UI's scroll-into-view walks the new
scrollable ancestor. Verified in a browser for all three: driving the highlight to
the last item scrolls the viewport to exactly its maximum and leaves that item in
view (`InputSelect` via `End`, `Combobox`/`Autocomplete` via `ArrowUp` wrap-around).
