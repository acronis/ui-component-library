---
'@constructor-lab/ui-react': minor
---

feat(alert): reconcile against the redesigned Figma (node 6768-67288)

Restyle `Alert` to the new design language — non-breaking (all 7 variants and all
exports retained):

- **White surface** (`bg-background`) with a **strong status border**
  (`--ui-border-on-status-*-strong`) and a **6px left accent bar** in the strong
  status background (`--ui-background-status-strong-*`) — replacing the previous
  pale status fill.
- **Variant-driven full-color status icon**: an empty `<AlertIcon />` now renders
  the variant's default multicolor glyph (CircleInfoBlue, CircleCheckGreen,
  TriangleWarningYellow, CircleWarningOrange, DiamondWarningRed, CircleMinusGray,
  AcronisAiMulti); pass children to override.
- **Compact dismiss button**: `AlertClose` is now a 32px `ButtonIcon` (neutral
  glyph, hover surface, focus ring) instead of a full-height edge cell.
- `ai` keeps its branded treatment (pale border + gradient accent bar) since it
  has no solid `-strong` token pair.

Code Connect completed against the new node; ui-spec (anatomy/tokens/index)
updated; visual-regression baselines regenerated.
