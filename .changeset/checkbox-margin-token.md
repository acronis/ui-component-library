---
'@spec-lab/ui-react': patch
---

Checkbox: match the Figma design more faithfully.

- Draw the check / indeterminate glyph inline at Figma's exact geometry (an 8px
  mark centered in the 16px box with a 1.6px stroke) instead of the general
  `@spec-lab/icons-react` check rendered at box size, which was full-bleed and
  ~65% too large.
- Rewire the box alignment offset onto the current `--ui-checkbox-global-box-margin-y`
  token (the previous `--ui-checkbox-global-box-margin-x` name was renamed in the
  next-gen token sync, leaving the label/description layout referencing a dead
  variable that silently fell back to no offset).
