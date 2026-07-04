---
'@spec-lab/ui-react': minor
---

Sheet: add direction-aware `start` / `end` `side` variants. They anchor to the
inline-start / inline-end edge (using logical `start-0`/`end-0` + `border-e`/
`border-s`) and flip side and slide direction under RTL, unlike the fixed
physical `left` / `right`. Prefer `start`/`end` for locale-agnostic layouts.
