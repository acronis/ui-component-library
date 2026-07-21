---
'@constructor-lab/ui-react': minor
---

feat(fitted-actions): add `FittedActions`

A responsive action row that collapses overflowing actions into a "More" dropdown
menu, recomputing on resize (ResizeObserver + off-screen measurement). Config-driven
via an `actions` array (`{ id, label, icon?, isDisplayed?, divided?, disabled?,
onSelect? }`), with `renderAction` / `renderTrigger` overrides and a `showDropdown`
toggle; the pure fit math is exported as `computeFittedVisibleCount`. A React
reimplementation of the ui-kit Vue `AvFittedActions`; it also backs the Toolbar's
`ToolbarActions` responsive overflow. Initial version; design reconciliation pending.
