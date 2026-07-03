---
'@spec-lab/ui-react': minor
---

Port the components that were unique to the legacy `@spec-lab/shadcn-uikit`
library into ui-react as design-pending v1s (Base UI + semantic `--ui-*`
tokens), filling the last real component gaps:

- **Dashboard widgets** — `Widget` (container family), `WidgetAlert`,
  `WidgetText`, `WidgetTableData`, `WidgetProtectionStatus`,
  `WidgetProtectionSummary`, `WidgetProgressChunks`, `WidgetProgressTiers`.
- **`NavigationMenu`** — horizontal top-nav, reimplemented on Base UI
  (`@base-ui/react/navigation-menu`) instead of Radix.
- **`Filter`** — filter button with count badge (distinct from `CardFilter`).
- **`AlertDialog`** — confirmation dialog on Base UI (`@base-ui/react/alert-dialog`).

Each ships a component, tests, and stories, and carries a doc-comment noting the
`--av-*` → `--ui-*` token mapping and a `/figma-component <Name> --update`
reconcile note for when Figma mockups land.
