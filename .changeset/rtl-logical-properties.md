---
'@spec-lab/ui-react': patch
---

Replace physical CSS utilities with their logical equivalents for RTL support so
components render correctly in both LTR and RTL directions. Covers avatar,
breadcrumb, resizable, select/input-select, sidebar-primary, sidebar-secondary,
switch (the upstream set) plus this repo's additional components: tabs,
button-group, calendar, table, data-table, dropdown-menu, command, tree,
input-date-picker, alert, alert-dialog, toast, navigation-menu, and
widget-table-data.

Changes are `ml/mr → ms/me`, `pl/pr → ps/pe`, `left/right → start/end`,
`text-left → text-start`, `border-l/r → border-s/e`, `rounded-l/r → rounded-s/e`,
`[border-right-width] → [border-inline-end-width]`, direction-aware `translate-x`
(switch thumb, toast slide), and `rtl:rotate-180` on directional chevrons.
Centered modals (dialog/alert-dialog), the spinner arc, `side`-prop sheets, and
primitive-resolved popover/menu slide animations are intentionally left physical.
