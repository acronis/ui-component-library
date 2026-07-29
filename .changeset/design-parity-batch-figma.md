---
'@constructor-lab/ui-react': patch
---

fix(ui-react): six confirmed Figma design-parity divergences (non-breaking)

- **Avatar sizing.** The 2px separator was a border-box CSS border, so with
  `box-sizing: border-box` it ate 2px off each edge and the painted fill rendered
  at 28px inside the (already 32px) box, against a designed 32px fill (Figma
  stroke is `strokeAlign: OUTSIDE`). It is now a spread-only outset ring via a
  raw `box-shadow` arbitrary property (not `shadow-[…]`, which routes through
  `--tw-shadow-color` and resolves inconsistently for spread-only rings across
  engine versions), so the fill fills the full 32px and the ring sits outside —
  matching upstream #543. This changes only the painted stroke; it does **not**
  change `AvatarGroup` spacing, which is driven by the separate
  `--ui-avatar-global-avatar-group-gap` token (−6px, a 26px step) and is left
  untouched. (Measured in a browser: element box 32×32 before and after; fill
  28→32; group step 26px unchanged.)
- **`Button` / `ButtonMenu` cursor.** Added `cursor-pointer` to each component's
  shared base class so every variant shows the pointer cursor.
- **Ghost button underline.** The ghost variant now wires all four
  `--ui-button-ghost-label-text-decoration-*` states (hover underlines; idle /
  active / disabled are `none`). All four are referenced — even the `none` ones —
  because a brand override is only honored if the matching state token is
  referenced.
- **Checkbox focus ring.** `focus-visible:ring-2` → `ring-[3px]` per Figma.
- **Breadcrumb link.** Underline is now hover-only (removed the focus-visible
  underline); the focus ring is a 3px flush ring on `--ui-focus-primary` (was
  `ring-2` + `ring-offset-2` on `--ui-focus-brand`).
