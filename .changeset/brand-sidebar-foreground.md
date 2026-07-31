---
'@constructor-lab/tokens': minor
---

Wire per-brand sidebar foregrounds for telstra, light-gray and yellow-1c

`SidebarPrimary` menu items took their label and icon colour from
`--ui-text-on-brand-{primary,secondary}` — white for all 21 brands — while their
container took each brand's own fill. Fine on a dark brand; on the three brands
with light sidebar fills it produced unreadable or invisible text. `telstra`
rendered **white on white**: three of four nav items were gone, at 1.00:1.

The token bundle already shipped the fix. `--ui-palette-branding-<brand>-
sidebarprimary-{label,icon}-{idle,active}` exists for exactly those three
brands — the ones that need it — and the component tier never referenced it.

Now wired, per brand and per variant, because the two variants sit on different
fills: `unselected` on `background-idle`/`-hover` takes the `-idle` foreground,
`selected` on `background-active` takes `-active`.

| brand               | before | after |
| ------------------- | ------ | ----- |
| telstra unselected  | 1.00   | 7.09  |
| light-gray selected | 1.30   | 13.19 |
| yellow-1c selected  | 1.72   | 9.98  |

The other 18 brands are unchanged: they ship no per-brand foreground, so there
is nothing to wire. Several still fail with white (`red-home-pl` 1.53,
`virtual-one` 2.07, `sand` 2.85) and need design to supply the values.
