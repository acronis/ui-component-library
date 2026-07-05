---
'@spec-lab/ui-react': minor
---

Add `ButtonIconMenu`: an icon-only menu trigger — a 32×32 bordered button with a
fixed ellipsis ("more") glyph. The icon-only sibling of `ButtonMenu`:
presentational, with an `open` prop that applies the active treatment and
reflects `aria-expanded`, composable onto a menu trigger via `render`. Reuses the
ButtonIcon `secondary` token tier; accessible name defaults to "More options".
