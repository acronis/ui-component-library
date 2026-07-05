---
'@spec-lab/ui-react': patch
---

Fix `SidebarPrimary` layout drift from Figma: the first `SidebarPrimarySection`
no longer gets an extra top padding/divider (only bottom padding, matching
Figma's `firstSection` split), `SidebarPrimaryFooter` no longer double-pads its
rows on top of each item's own padding, and `SidebarPrimaryCollapseTrigger`'s
icon now rotates 180° between the expanded and collapsed rail states.
