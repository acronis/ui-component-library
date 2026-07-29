---
'@constructor-lab/ui-react': minor
---

`Avatar`: expose all eight color schemes the `--ui-avatar-*` tier emits. The
token tier defines `--ui-avatar-color-*` / `--ui-avatar-label-color-*` for
`blue`, `gray` and `green` as well, but `avatarVariants` only surfaced five
(`teal`, `violet`, `red`, `yellow`, `orange`) — so those six tokens were dead:
emitted by the pipeline and referenced by nothing. Widening the enum is purely
additive (no existing `color` value changes meaning or rendering) and needs no
token work.
