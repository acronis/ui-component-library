---
'@constructor-lab/ui-react': patch
---

fix(ui-react): declare cursor-pointer on the base class of every interactive component

`cursor-pointer` was missing from the base class of several always-interactive
surfaces — a native `<button>`'s UA cursor reset hides the gap in code review
while it renders wrong in the browser. Moved/added it to the **base** (not a
subset of variants) for `ButtonIcon`, `Chip` (base + remove button),
`DialogCloseButton`, `InputText`'s clear button, `SidebarSecondary` rows +
section-label trigger, `Filter`, `Link`, and the `NavigationMenu` trigger.
(`Button`/`ButtonMenu` were fixed in the prior parity batch.) Cursor is not
captured by visual regression, so no baselines move.

Guarded against regression by a new `@constructor-lab/ui-spec` grammar rule
(`interaction/interactive-cursor`, checklist I7) with a static `kit-lint`
detector that flags a `cva()` base carrying a `hover:` state but no `cursor-*`.
