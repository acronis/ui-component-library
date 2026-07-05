---
'@spec-lab/ui-react': minor
---

Resizable: remove the `withHandle` grab-bar grip to match the current Figma
design. The design dropped the grip, so the `withHandle` prop and the grip's
`--ui-resizable-bar-*` tokens (bar color/width/height/border-radius, since
removed from `@spec-lab/tokens`) are gone — the handle now renders the divider
line only (idle gray via `--ui-border-on-surface-border`, hover/active blue).
This also fixes the handle rendering at 0 width: it referenced the now-deleted
`--ui-resizable-bar-width`, so the hit-area is now a literal 9px.

Breaking (pre-1.0): drop `withHandle` from any `<ResizableHandle>` usage.
