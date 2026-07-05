---
'@spec-lab/ui-react': minor
---

Link: add an `inverse` variant and rewire onto the restructured token tier. The
`--ui-link-*` tokens were reorganised in the next-gen sync into `--ui-link-global-*`
(gap/height, per-state text decoration) plus `--ui-link-normal-*` / `--ui-link-inverse-*`
color sets; the component referenced the removed flat names and rendered unstyled.
It now uses a `variant` prop (`'normal' | 'inverse'`, default `normal`, mapping the
Figma `background` property) — `inverse` is for links on a dark surface (no disabled
state, per the design).
