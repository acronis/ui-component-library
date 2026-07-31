---
'@constructor-lab/tokens': minor
---

Fix `--ui-text-on-surface-secondary` failing WCAG AA in dark mode

It resolved to `--ui-palette-grayscale-7`, which measures 4.85:1 on the light
surface but only **3.36:1** on the dark one — below the 4.5:1 AA minimum for
normal text. A repo-wide contrast sweep found 287 occurrences across 43+
Storybook pages, making it the single largest source of contrast failures in
the library.

The cause is structural rather than a mistyped value. The grayscale ramp is
mirrored — index _N_'s light value is index _14−N_'s dark value — and 7 is the
midpoint of a 15-step ramp, so it maps onto itself and is the one grey that is
identical in both themes. A foreground that never changes cannot contrast
against surfaces that do.

Retargeted to `--ui-palette-grayscale-8`, one step along the existing ramp:
5.86:1 light, 4.77:1 dark surface, 5.48:1 dark canvas. No colour value was
invented, and the three other semantics that ride `grayscale-7`
(`--ui-background-status-strong-neutral`,
`--ui-border-on-surface-border-active`,
`--ui-glyph-on-backdrop-element-primary`) are untouched.

**Visible change:** secondary/muted text is one step darker in light mode and
one step lighter in dark mode.
