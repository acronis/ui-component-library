---
'@constructor-lab/ui-react': minor
---

feat(toolbar): add `Toolbar`

A horizontal action bar for selection / list contexts (Figma node 3897-7199),
built on the Base UI Toolbar primitive — `role="toolbar"` with roving-tabindex
arrow-key navigation. Composable parts: `Toolbar`, `ToolbarGroup`,
`ToolbarButton`, `ToolbarLink`, `ToolbarSeparator`, and a non-interactive
`ToolbarStatus` label. Actions reuse the Button `ghost` tokens (no Toolbar token
tier); the `disabled` prop maps to the Figma `state` (active | disabled) and greys
every action while keeping it focusable (`aria-disabled`).

Also adds `ToolbarActions` — a config-driven, width-aware action list with a
"priority+" overflow menu (the Figma breakpoints behavior, node 6262-28276). It
is backed by the new `FittedActions` component: overflowing actions collapse into
a "More actions" menu, recomputing on resize.
