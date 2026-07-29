---
'@constructor-lab/ui-react': minor
---

feat(ui-react): cross-cutting CSS base reset, breakpoint scale, portal provider, RTL sweep

Four cross-cutting gaps borrowed from upstream `acronis/uikit`, all non-breaking.

- **`@layer base` reset** (`styles/index.css`): font-smoothing on
  `*, *::before, *::after` (widened from `body` so shadow-root content is
  covered), a single global `text-underline-offset: 3px` (retires three ad-hoc
  `underline-offset-*` utilities), and `font-family: Inter, system-ui, sans-serif`
  on `:root, :host` so isolated shadow-DOM mounts get Inter instead of Tailwind
  preflight's generic stack. The font stack matches the generated
  `.ui-typography-*` chain so text agrees inside and outside those classes.

- **Pinned breakpoint scale**, published three ways and kept in sync: a
  compile-time `@theme { --breakpoint-lg..4xl }` block, a runtime-readable
  `:root, :host { --ui-breakpoint-lg..4xl }` mirror, and JS constants in the new
  `breakpoints.ts` (`BREAKPOINT_LG..BREAKPOINT_4XL`, `ROOT_FONT_SIZE_PX`,
  `getViewportWidth()`), re-exported from the barrel. lg/xl equal Tailwind v4's
  defaults; 2xl/3xl/4xl are the design team's wider ranges (1440/1680/1920).

- **`PortalContainerProvider` + `usePortalContainer`** (new `portal-container.tsx`,
  exported from the barrel): a shadow-DOM / micro-frontend host wraps the tree
  once instead of threading `portalContainer` through every call site. Wired as
  the default into all 12 portaling components (`Dialog`, `AlertDialog`,
  `Popover`, `Tooltip`, `Menu`, `InputSelect`, `Drawer`, `Sheet`, `Toast`,
  `Combobox`, `Autocomplete`, `Tour`); each component's explicit `portalContainer`
  prop still wins, so nothing breaks. `NavigationMenu` gains a `portalContainer`
  prop for the first time (it portaled with no escape hatch before).

- **RTL sweep**: converted the remaining physical-direction utilities to logical
  properties across `Toast`, `NavigationMenu`, `AppShell`, `WidgetAlert`,
  `DataTableColumnHeader`, `Calendar`, `Carousel`, `Tour`, `InputText`, `Tree`,
  `Chip`, and `Table`. The `Tree` disclosure chevron now flips under `dir="rtl"`
  and its depth indentation uses `padding-inline-start`. Deliberately physical
  usages (dialog centering, spinner border, `data-[side]` slide animations,
  `Sheet` and `Drawer` documented physical edges) are unchanged.
