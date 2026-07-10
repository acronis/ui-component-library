---
'@spec-lab/ui-react': patch
---

Fix a one-frame flash when a `Sheet` closes. The overlay faded over `duration-200`
while the panel slid over `duration-300`; Base UI keeps the dialog mounted for the
longer panel exit, so the backdrop finished early and reverted to its resting
opacity — flashing fully opaque for the remaining ~100ms. The overlay now uses
`duration-300` to match the panel. (Dialog already used matched durations and
Drawer uses Base UI transitions, so neither was affected.)
