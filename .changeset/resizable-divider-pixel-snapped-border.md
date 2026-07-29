---
'@constructor-lab/ui-react': patch
---

fix(ui-react): pixel-snap the resizable divider with a logical border

The `ResizableHandle` divider line was a 1px-wide background box centred with a
`-translate-x-1/2` transform, so at fractional handle positions the line
straddled two device pixels and rendered blurry. It is now a zero-width box
painted by its logical `border-inline-start` (block-start for the stacked
orientation), which the browser snaps to the pixel grid. Keyboard focus paints a
3px `--ui-focus-primary` ring as a `box-shadow` on the line itself (auto-centred),
removed while dragging (`active:after:shadow-none`). Same tokens, same geometry —
crisper line. No API change.
