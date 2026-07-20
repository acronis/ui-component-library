---
'@constructor-lab/ui-react': minor
---

feat(search-global): deprecate `SearchGlobal`

`SearchGlobal` is retired — it is gone from the app-shell layouts (Figma nodes
6226-24149 / 6226-24150), where search now lives in the sidebar rather than the
top bar. The component and its `SearchGlobalProps` are marked `@deprecated` (IDE
strikethrough + a deprecation note); it still renders for now but should not be
used in new work, and existing usages should move to their surface's own search
affordance. Slated for removal in a future major.
