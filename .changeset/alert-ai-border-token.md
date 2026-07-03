---
'@spec-lab/tokens': patch
'@spec-lab/ui-react': patch
---

Add the missing `--ui-border-on-status-ai` semantic token (the pale violet `{palette.violet.4}` the Figma uses; the tier previously only had the `ai-strong` gradient border), and repoint `Alert`'s ai border/divider from the `--ui-palette-violet-4` primitive stopgap to it.
