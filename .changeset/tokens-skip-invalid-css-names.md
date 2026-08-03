---
'@constructor-lab/tokens': patch
---

Generated CSS no longer breaks on a malformed Figma variable name

A Figma variable whose name contains a space — a duplicate like `content/gap 2`
in the `Notification` tier — emitted as `--ui-notification-global-content-gap 2`,
which postcss cannot parse. That did not merely lose one token: it failed the
whole stylesheet, so `@import`-ing `@constructor-lab/tokens/css` took down every
consumer's build (`Unknown word 2`). The CSS builder now skips any token whose
name is not a valid CSS ident and reports it in the build's skipped-token
summary, so one bad name upstream costs that token instead of the bundle.

Also regenerates the committed CSS/SCSS/JS/DTCG output from the current tiers.
It had drifted: ten newly-allowlisted component tiers had never been rendered,
and several `Button` / `ButtonIcon` / `ButtonMenu` / `Chip` / `InputSelect` /
`SidebarSecondary` brand override blocks referenced brands the tiers no longer
declare.
