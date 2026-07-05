---
'@spec-lab/ui-react': patch
---

Avatar: rewire the corner radius onto the current
`--ui-avatar-global-avatar-border-border-radius` token. The previous
`--ui-avatar-global-avatar-border-radius` name was moved under the border group
in the next-gen token sync, leaving the component referencing a dead variable
that resolved to no radius (rendering avatars as squares instead of circles).
