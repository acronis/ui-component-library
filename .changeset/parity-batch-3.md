---
'@constructor-lab/ui-react': patch
---

fix(ui-react): parity batch 3 — chart tooltip tokens, menu focus ring, view options

- Chart tooltip: radius and padding now come from the Tooltip tier tokens
  (`--ui-tooltip-container-border-radius` / `-padding-x` / `-padding-y`),
  `shadow-xl` → `shadow-md`, and the value span drops `font-mono`. Added a
  `TooltipOpen` story (the tooltip is hover-only, so `defaultIndex` forces it
  open for the visual-regression snapshot).
- Menu items: a 3px inset keyboard-only focus ring
  (`focus-visible:not(:hover)`), which they lacked.
- DataTableViewOptions: removed the "Toggle columns" heading (and its orphaned
  separator) that the current Figma does not have. Kept
  `DropdownMenuCheckboxItem` — it already renders a checkmark, stays open across
  toggles, and carries `aria-checked`, so it _is_ the design's "item with a
  checkmark"; a plain item would lose all three. Exports unchanged.
