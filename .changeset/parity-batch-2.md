---
'@constructor-lab/ui-react': patch
---

fix(ui-react): Figma parity batch 2 — card-filter ARIA + selected, clear buttons, link, chip

- **CardFilter**: `type="button"` is now gated on `!render`, so
  `render={<a href/>}` no longer stamps an invalid `type` onto the anchor. Added
  a controlled `selected` prop (sets `aria-pressed` + a `data-selected`
  attribute that drives the active border/background) for a clickable card used
  as a toggle. Additive, non-breaking.
- **InputText / Search** clear buttons: a proper 20px hit target (`size-5 p-0.5`)
  with a hover/active background from `--ui-button-icon-global-container-color-*`,
  and the icon now references the component-tier
  `--ui-button-icon-global-icon-color-idle` instead of the generic
  `--ui-glyph-on-surface-primary`.
- **Chip**: `[&_svg]:pointer-events-none` so a click on the icon falls through to
  the chip.
- **Link**: removed the stray `[text-underline-position:from-font]` — redundant
  against the global `text-underline-offset` and divergent from ButtonGhost.
