---
'@spec-lab/ui-react': patch
---

Dialog / Sheet / AlertDialog: rewire the modal overlay onto the current
`--ui-background-backdrop-screen` token. The previous `--ui-background-overlay-primary`
was renamed to the `--ui-background-backdrop-*` family in the next-gen sync,
leaving the backdrop referencing a dead variable that resolved to transparent
(no dim). The scrim now renders again.
