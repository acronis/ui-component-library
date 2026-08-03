---
'@constructor-lab/ui-react': minor
---

Every elevated surface now carries the design's shadow.

`shadow-md` and `shadow-lg` were Tailwind's defaults — tight, dark and fixed
(`shadow-md` = `0 4px 6px -1px rgb(0 0 0 / 0.1)`). The token build now bridges the
design's elevations onto that namespace, so the same utilities resolve to the
design's values (`shadow-md` = `0 16px 32px`) in a shadow colour that follows the
theme. This changes the appearance of Popover, Dialog, AlertDialog, ConfirmDialog,
Drawer, Sheet, Command, Tour, Calendar, the select/combobox/autocomplete dropdowns,
Toast and the chart tooltips; no component API changed and no component needed
editing.

`shadow-sm` and `shadow-xs` deliberately keep Tailwind's defaults. All three design
elevations are _surface_ shadows — `sm` is `0 8px 16px` at 30% alpha — and the only
`shadow-sm` call sites here are the auth-layout card and the Slider's 16px thumb,
where a surface shadow renders as a grey smudge. Those two are unchanged until the
design names a control-level elevation.

`Toast` is rebound to its re-emitted token names (`content-text-container`,
`content-actions-container`, `container-background`) after a Figma restructure —
same values, so nothing about it moves beyond the shadow.
