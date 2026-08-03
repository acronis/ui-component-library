---
'@constructor-lab/ui-react': minor
---

Bind `Toast` to its own `--ui-toast-*` token tier and add the design's `critical`
status.

The component themed from the shared semantic status vocabulary, so the generated
`--ui-toast-*` tier had no consumer and a brand re-pointing any of its values
changed nothing. Every card metric now comes from the tier (surface, radius,
border width, min-width, paddings, gaps, status-bar width, icon box, content and
actions metrics) plus the per-status `border-color` / `left-line` pairs, and the
dismiss control sits on the ButtonIcon tier.

Reconciled against Figma node `7421:126262` in the process:

- **New `toast.critical(...)`** (and `'critical'` on `ToastType`) — the design's
  fifth status, between `warning` and `error`. `error` keeps its name and binds
  the design's `danger` tokens.
- The status bar now overlays the card's leading edge instead of taking layout
  width, so the text keeps the container's `paddingX` from the card edge.
- An action button aligns with the text instead of with the icon.
- The title uses the design's applied `headings/body-heading` style (16/500).
- The dismiss glyph is `TimesSmall`, the design's mark; plain `Times` filled the
  32px box and read far too heavy.
