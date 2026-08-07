---
'@constructor-lab/ui-react': minor
---

**ScrollArea**: the overlay scrollbar is now a translucent, theme-aware hairline
that grows when pointed at, and gains a `tone` prop.

The bar is a 6px track held 2px off the viewport edges (previously a 10px track
with a 1px gutter), and the thumb grows to 10px while pointed at or dragged,
matching the legacy Vue kit. The growth is inward — the thumb's outer edge stays
flush with the viewport edge — so the target never shifts under the pointer. The
radius follows the size (3px, then 5px) out of `rounded-full`.

The thumb was an opaque border grey (`--ui-border-on-surface-border`), which
disappeared over content of a similar tone — a real hazard for a bar that floats
over content it does not control. It now mixes `--ui-background-inverse-primary`
down to 40% alpha (60% on hover), reproducing the legacy Vue kit's
`--av-scroll-thumb` treatment through the token system: that token is already
near-black in light mode and white in dark, so one token covers the light/dark
flip the Vue kit needed a second variable for.

`tone="inverse"` covers what the theme cannot decide on its own — a surface that
is dark in **both** themes, where the light-mode value would paint near-black on
brand. It pins the thumb to `--ui-glyph-on-brand-primary` (white, fixed) at the
same alphas. `SidebarPrimary` now sets it, since its container is
`--ui-background-brand-primary`.
