---
'@constructor-lab/ui-react': major
'@constructor-lab/tokens': major
'@constructor-lab/icons-react': major
---

Rename the npm scope from `@spec-lab` to `@constructor-lab`.

This is a breaking change for consumers: every import and dependency must be
updated to the new scope (e.g. `@spec-lab/ui-react` → `@constructor-lab/ui-react`,
`@spec-lab/tokens/css` → `@constructor-lab/tokens/css`,
`@spec-lab/icons-react/stroke-mono` → `@constructor-lab/icons-react/stroke-mono`).
Package contents, subpath exports, and the token CSS API are otherwise unchanged.
