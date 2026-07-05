---
'@spec-lab/ui-react': minor
---

Button: remove the `inverted` variant. It was dropped from the Figma design (the
current variant set is `default` / `secondary` / `ghost` / `destructive` / `ai`)
and referenced a `--ui-button-inverted-*` token tier that no longer exists, so it
rendered unstyled. Consumers using `variant="inverted"` should switch to
`secondary` (the bordered style). Pre-1.0 breaking change.
