---
'@constructor-lab/tokens': patch
---

Fixed the dark value of `palette.transparent.dark.fixed.90`, which drives the
screen backdrop scrim (`--ui-background-backdrop-screen`).

Its dark mode resolved to a mid gray (hsl `212.73 4.8% 44.9%`) while every other
step in the `transparent.dark.fixed` ramp — 60, 70, 80, 100 — is
`228 16.67% 11.76%` in **both** modes, as a `fixed` (mode-invariant) token should
be. The odd value washed out the backdrop behind every dark-mode overlay: Dialog,
AlertDialog, Drawer, Sheet, SheetDetails, ConfirmDialog, and the Tour scrim. Its
dark value now matches the rest of the ramp, so the scrim is the intended
near-black again.

Meaning is unchanged, so this is a patch.

The value came in from a Figma sync, so the source variable was corrected too:
`Transparent/dark/fixed-90` in the **Theme** collection of the `ui-react` file now
carries the same channels as the rest of its ramp in the Dark mode, and
`semantics/colors/background/backdrop/screen` resolves through it to
`rgb(25 27 35 / 0.9)` in both modes. A future sync will therefore reproduce this
value instead of reintroducing the regression. The library still needs publishing
in Figma for the corrected scrim to reach consuming design files.
