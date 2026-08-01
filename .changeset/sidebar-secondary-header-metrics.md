---
'@constructor-lab/ui-react': patch
---

`SidebarSecondary` header metrics now come from the design's tokens

Two silent geometry drifts against Figma node 2468:59502, both invisible to
visual regression (each delta sits under the 0.5%-of-canvas threshold):

- **Panel header was 16px short.** It applied the per-variant
  `--ui-sidebar-secondary-expanded-container-header-padding-y` (8px), but the
  design binds one pair for both variants —
  `--ui-sidebar-secondary-global-container-header-padding-{x,y}` (16/16) — which
  is what makes the header 64px tall around its 32px title. (The per-variant
  tokens belong to `SidebarPrimary`, whose design does reference them.)
- **Section headers were 36px instead of 40px, with no vertical padding.** The
  floor was a hardcoded `min-h-9` under a comment claiming no header-height token
  existed; `--ui-sidebar-secondary-section-container-header-min-width` (40px) had
  been generated all along — Figma names the variable `minWidth` although it
  drives the row's min _height_. `…-header-padding-y` (2px) was likewise defined
  but unused.
