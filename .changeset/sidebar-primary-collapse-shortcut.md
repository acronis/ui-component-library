---
'@constructor-lab/ui-react': patch
---

`SidebarPrimaryCollapseTrigger` accepts a `shortcut` hint

The design's footer row is `Collapse menu ⌘H` (Figma node 2092:5372), but the
primary rail's collapse trigger had no way to render the trailing shortcut —
only its `SidebarSecondaryCollapseTrigger` counterpart did. It now takes the
same optional `shortcut` node, right-aligned via the existing
`--ui-sidebar-primary-menu-item-extras-global-shortcut-*` tokens and hidden
with the label (`sr-only`) in collapsed mode.
