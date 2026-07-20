# @constructor-lab/ui-react

## 2.3.0

### Minor Changes

- [#44](https://github.com/constructor-lab/ui-component-library/pull/44) [`e4b7a70`](https://github.com/constructor-lab/ui-component-library/commit/e4b7a7055739c2606e33e4c1ae7230221678ef32) Thanks [@leonid](https://github.com/leonid)! - Add `CardGrid` — a config-driven card grid composite (`<CardGrid items renderItem />`) over the `Grid` + `Card` primitives. It lays a list of peer items out as uniform Cards in a responsive grid — a fixed responsive column count (`cols`) or an auto-filling track (`minColumnWidth`) — wrapping each item's content in a Card shell so catalog / gallery / picker tiles align and reflow consistently. An opinionated composite (see the opinionated-composites proposal). Initial version; design reconciliation pending.

- [#39](https://github.com/constructor-lab/ui-component-library/pull/39) [`11716a7`](https://github.com/constructor-lab/ui-component-library/commit/11716a7159809d21896379f8d5d3eb1b644a66b1) Thanks [@leonid](https://github.com/leonid)! - Add `ConfirmDialog` — a config-driven confirmation composite (`<ConfirmDialog title description confirmLabel destructive onConfirm />`) over the `AlertDialog` primitive. It bakes in the approved confirmation shape (title + consequence + a secondary Cancel and a default/destructive Confirm), traps focus, defaults focus to Cancel, and can't be dismissed by clicking outside. Supports controlled/uncontrolled open and an optional trigger. An opinionated composite (see the opinionated-composites proposal). Initial version; design reconciliation pending.

- [#42](https://github.com/constructor-lab/ui-component-library/pull/42) [`4a4fb5f`](https://github.com/constructor-lab/ui-component-library/commit/4a4fb5fccfaef1bacd87aa143cf8341fa4036143) Thanks [@leonid](https://github.com/leonid)! - Add `DetailList` — a config-driven label/value list composite (`<DetailList items={…} />`) over the `DescriptionList` primitive. It renders a flat item list (label, value, optional icon/description/actions) as the approved key/value details panel, in one or two responsive columns — the properties panel behind the detail-drawer / sheet-detail-panel patterns. An opinionated composite (see the opinionated-composites proposal). Initial version; design reconciliation pending.

- [#41](https://github.com/constructor-lab/ui-component-library/pull/41) [`a416fe0`](https://github.com/constructor-lab/ui-component-library/commit/a416fe0f28ce6e8a167210a79955bb46f96c3790) Thanks [@leonid](https://github.com/leonid)! - Add `FormLayout` — a config-driven form composite (`<FormLayout fields={…} values onValueChange />`) over the `Form` / `Field` / `Grid` primitives. It maps a flat field-descriptor list onto the right control (text/email/password/textarea/select/number/checkbox/switch/radio), normalizes each control's differing change convention behind one uniform `onValueChange(name, value)`, and lays fields out in one or two responsive columns with required markers and per-field errors. An opinionated composite (see the opinionated-composites proposal). Initial version; design reconciliation pending.

- [#43](https://github.com/constructor-lab/ui-component-library/pull/43) [`69be886`](https://github.com/constructor-lab/ui-component-library/commit/69be886ec40e6cf53f781da0c16af8b50db22e3a) Thanks [@leonid](https://github.com/leonid)! - Add `StatRow` — a config-driven KPI / stat row composite (`<StatRow stats={…} />`) over the `CardFilter` primitive. It renders a flat stat list as consistent tiles, deriving each tile's variant from the descriptor (empty placeholder, clickable filter, or static), in a wrapping row or an equal-width grid — so a dashboard's stat tiles stay uniform. An opinionated composite (see the opinionated-composites proposal). Initial version; design reconciliation pending.

## 2.2.0

### Minor Changes

- [#37](https://github.com/constructor-lab/ui-component-library/pull/37) [`4949493`](https://github.com/constructor-lab/ui-component-library/commit/494949346e0d5640a000a50d895ec1500439ac3e) Thanks [@leonid](https://github.com/leonid)! - Add `DataGrid` — the batteries-included, config-driven data grid (`<DataGrid columns rows />`). Built on the `Table` primitive and the `DataTable*` parts, it assembles the whole approved grid layout in one component: an optional toolbar (search + column visibility), a selection column, loading/empty states, and pagination. The first opinionated composite (see the opinionated-composites proposal). Initial version; design reconciliation pending.

## 2.1.0

### Minor Changes

- [#35](https://github.com/constructor-lab/ui-component-library/pull/35) [`691fd84`](https://github.com/constructor-lab/ui-component-library/commit/691fd84c84ed78a7a6df31ab386c6bbfa280f15d) Thanks [@leonid](https://github.com/leonid)! - Add `TruncatedText` — text that truncates with an ellipsis and reveals its full value in a tooltip only when it's actually clipped, with single-line and multi-line (`lines`) clamping. Initial version; design reconciliation pending.

## 2.0.0

### Major Changes

- [#33](https://github.com/constructor-lab/ui-component-library/pull/33) [`a30f14f`](https://github.com/constructor-lab/ui-component-library/commit/a30f14fcc92e0604848d2fd37c65bae8b5958bde) Thanks [@leonid](https://github.com/leonid)! - Rename the npm scope from `@spec-lab` to `@constructor-lab`.

  This is a breaking change for consumers: every import and dependency must be
  updated to the new scope (e.g. `@spec-lab/ui-react` → `@constructor-lab/ui-react`,
  `@spec-lab/tokens/css` → `@constructor-lab/tokens/css`,
  `@spec-lab/icons-react/stroke-mono` → `@constructor-lab/icons-react/stroke-mono`).
  Package contents, subpath exports, and the token CSS API are otherwise unchanged.

### Patch Changes

- [`d25dd08`](https://github.com/constructor-lab/ui-component-library/commit/d25dd08f1f8a45fad98707cbbe89a97ed632f83f) Thanks [@m231-a](https://github.com/m231-a)! - Fix fallout from the latest design-token regeneration.

  **tokens** — normalize the `deep-sky-itkontoret` brand slug (the regeneration
  had duplicated it as `deep_sky_itkontoret`, which violates the tier schema's
  kebab-case `Modes` contract and breaks with every other brand's naming), drop
  the placeholder `"String value"` overrides on the ButtonMenu dropdown item
  label text-style, and re-sync per-brand overrides from the current Figma
  snapshot. No default-brand values change — only `[data-brand]` override blocks
  are affected.

  **ui-react** — repoint components at tokens renamed/removed by the
  regeneration: Chip icon size (`--ui-chip-global-icon-size` →
  `--ui-chip-global-box-icon-size`) and the Search / InputText clear-button icon
  color (dropped `--ui-input-*-clear-icon-color` → `--ui-glyph-on-surface-primary`).

- Updated dependencies [[`d25dd08`](https://github.com/constructor-lab/ui-component-library/commit/d25dd08f1f8a45fad98707cbbe89a97ed632f83f), [`a30f14f`](https://github.com/constructor-lab/ui-component-library/commit/a30f14fcc92e0604848d2fd37c65bae8b5958bde)]:
  - @constructor-lab/tokens@3.0.0
  - @constructor-lab/icons-react@1.0.0

## 1.2.3

### Patch Changes

- [#17](https://github.com/constructor-lab/ui-component-library/pull/17) [`f6fb07b`](https://github.com/constructor-lab/ui-component-library/commit/f6fb07b2d0e77c9230c40f48306adff2abb644c6) Thanks [@leonid](https://github.com/leonid)! - Bump `react-resizable-panels` 4.11.2 → 4.12.1 (the `Resizable` component's
  runtime dependency). Part of a broader dev/tooling dependency refresh (Storybook
  10.5, Playwright 1.61, happy-dom, vite-plugin-dts, fumadocs, next, and others)
  that doesn't affect the published output.

## 1.2.2

### Patch Changes

- [#12](https://github.com/constructor-lab/ui-component-library/pull/12) [`370f7ea`](https://github.com/constructor-lab/ui-component-library/commit/370f7ea0a395770659c99ff25b6094d4ffcc1329) Thanks [@leonid](https://github.com/leonid)! - Bump low-risk shared dependencies via the catalog. The only change to ui-react's
  shipped surface is `recharts` 3.8.1 → 3.9.2 (a runtime dependency); the rest are
  dev/tooling bumps shared through the catalog: `vitest` 4.1.10,
  `@tanstack/react-virtual` 3.14.5, `date-fns` 4.4.0, `tailwindcss` /
  `@tailwindcss/postcss` 4.3.2, `ajv` 8.20.0, `style-dictionary` 5.5.0.

  This is the safe subset of Dependabot's grouped PR. The risky majors —
  TypeScript 7 (breaks the `unplugin-dts` declaration build), Vite 8 (rolldown CJS
  interop; already held by a catalog note), ESLint 10, `@types/node` 26 — and the
  React ecosystem (react/react-dom/@types-react/react-hook-form, whose bump
  regresses `apps/demo` form typing) are intentionally held for separate,
  individually-verified PRs.

## 1.2.1

### Patch Changes

- [#6](https://github.com/constructor-lab/ui-component-library/pull/6) [`d1a26db`](https://github.com/constructor-lab/ui-component-library/commit/d1a26db8403321c61f6725a6a70ed04076e5ede3) Thanks [@leonid](https://github.com/leonid)! - Fix a one-frame flash when a `Sheet` closes. The overlay faded over `duration-200`
  while the panel slid over `duration-300`; Base UI keeps the dialog mounted for the
  longer panel exit, so the backdrop finished early and reverted to its resting
  opacity — flashing fully opaque for the remaining ~100ms. The overlay now uses
  `duration-300` to match the panel. (Dialog already used matched durations and
  Drawer uses Base UI transitions, so neither was affected.)

## 1.2.0

### Minor Changes

- [#5](https://github.com/constructor-lab/ui-component-library/pull/5) [`3fb91b5`](https://github.com/constructor-lab/ui-component-library/commit/3fb91b55f931d6af2b6b56e7ac040da371ac8197) Thanks [@leonid](https://github.com/leonid)! - Add four Base UI form primitives so more of the form/field surface is covered:
  - `CheckboxGroup` — shared state for a set of `Checkbox`es (reads/writes a
    `string[]` of the ticked names); pairs with `Field` / `FieldSet`.
  - `OTPField` (`OTPFieldInput`, `OTPFieldSeparator`) — a segmented one-time-code
    input for verification / 2FA, with paste-to-fill and optional masking.
  - `Autocomplete` (`AutocompleteInput`, `AutocompleteContent`, `AutocompleteList`,
    `AutocompleteItem`, `AutocompleteEmpty`, `AutocompleteGroup`,
    `AutocompleteGroupLabel`) — a free-text input with filtered suggestions, reusing
    the `--ui-input-select-*` tokens.
  - `Meter` (`MeterLabel`, `MeterValue`, `MeterTrack`, `MeterIndicator`) — a static
    measurement bar (quota, usage, strength) distinct from `Progress`.

## 1.1.0

### Minor Changes

- [`6c018e5`](https://github.com/constructor-lab/ui-component-library/commit/6c018e5764449e6bf7f59f03a06c5a556ce0f6b2) Thanks [@m231-a](https://github.com/m231-a)! - Add `Tour` — a composable guided-onboarding coach-mark built on Base UI
  `Popover`: a stepped popover with a title/body, a step counter, and Next / Back /
  Skip controls, plus a pulsing beacon ("green light") and an optional dimming
  scrim. Initial version; design reconciliation pending.

### Patch Changes

- Updated dependencies [[`c601e91`](https://github.com/constructor-lab/ui-component-library/commit/c601e91333147da55b3f4497f885216bc972d5af)]:
  - @constructor-lab/tokens@2.1.0

## 1.0.0

### Major Changes

- [`802e657`](https://github.com/constructor-lab/ui-component-library/commit/802e657f473e5a89eb28939abde7a267c438c59d) Thanks [@m231-a](https://github.com/m231-a)! - Merge `@constructor-lab/design-tokens` and `@constructor-lab/tokens-pd` into a single published package, `@constructor-lab/tokens`, and rework token/theme delivery to be reference-based.
  - **New package `@constructor-lab/tokens`** holds the DTCG source tiers (`tiers/*.json`) **and** the generated, committed CSS/SCSS/JS. `@constructor-lab/design-tokens` and `@constructor-lab/tokens-pd` are removed.
  - **Reference-based CSS, no value duplication.** `css/primitives.css` is the only layer with raw values + `light-dark()`; the semantic and per-component tiers emit `var(--…)` references onto it, so each value is stated once. Brand switches via `[data-brand]`, light/dark via `[data-theme]` — both carried in one bundle (no per-brand files, no runtime stylesheet injection).
  - **Single import.** `@constructor-lab/tokens/css` pulls in primitives + semantics + every component tier (replaces the ~24 per-component `@import`s). Adds SCSS mixins (`@constructor-lab/tokens/scss/mixins`) and a JS token map (`@constructor-lab/tokens/js`).
  - **Tailwind bridge is generated** as `@constructor-lab/tokens/css/tailwind-theme.css` (previously hand-maintained in ui-react). The per-brand / per-component baked Tailwind presets are dropped.

  Migration: replace `@constructor-lab/tokens-pd` and `@constructor-lab/design-tokens` with `@constructor-lab/tokens`; `@import '@constructor-lab/tokens/css'` once (plus `@import '@constructor-lab/tokens/css/tailwind-theme.css'` for the Tailwind bridge); select a brand with `[data-brand="deep-sky"]` instead of importing a per-brand stylesheet.

### Minor Changes

- [`4f65138`](https://github.com/constructor-lab/ui-component-library/commit/4f6513821afe23bbef133abdbc2100af15649a08) Thanks [@m231-a](https://github.com/m231-a)! - Reconcile `Alert` with the Figma design and add a dismiss button. Retheme the variant border and icon to the correct status tokens (`--ui-border-on-status-*` subtle border + `--ui-glyph-on-status-*` icon) instead of the saturated `--ui-background-status-strong-*` fill, and add an optional `AlertClose` (×) part tinted by the variant. Completes the Figma Code Connect.

- [`64e627d`](https://github.com/constructor-lab/ui-component-library/commit/64e627db3fdb31cdf7510f84e7960663fbce65be) Thanks [@m231-a](https://github.com/m231-a)! - Add `AspectRatio` — a layout primitive that constrains its content to a fixed width-to-height `ratio` via the native CSS `aspect-ratio` property. Initial version ported from `ui-legacy` (modernized off the padding-bottom hack); design reconciliation pending.

- [`2bd49b0`](https://github.com/constructor-lab/ui-component-library/commit/2bd49b0d3689f728f5dadd3081cd5345b7ac151c) Thanks [@m231-a](https://github.com/m231-a)! - Button: remove the `inverted` variant. It was dropped from the Figma design (the
  current variant set is `default` / `secondary` / `ghost` / `destructive` / `ai`)
  and referenced a `--ui-button-inverted-*` token tier that no longer exists, so it
  rendered unstyled. Consumers using `variant="inverted"` should switch to
  `secondary` (the bordered style). Pre-1.0 breaking change.

- [`6b72586`](https://github.com/constructor-lab/ui-component-library/commit/6b725861ca2013c9438c1ae1f66b356e518bf41c) Thanks [@m231-a](https://github.com/m231-a)! - Add `ButtonGroup` (with `ButtonGroupText` and `ButtonGroupSeparator`) — a segmented container that collapses the shared inner edges of adjacent buttons, in horizontal or vertical orientation. Initial version ported from `ui-legacy`; design reconciliation pending. Radix `Slot`/`asChild` is replaced by the Base UI `render` prop, and the divider reuses `Separator`.

- [`1d02b6c`](https://github.com/constructor-lab/ui-component-library/commit/1d02b6c8ef99ed196df1c10788da3ce00e845846) Thanks [@m231-a](https://github.com/m231-a)! - Add `ButtonIconMenu`: an icon-only menu trigger — a 32×32 bordered button with a
  fixed ellipsis ("more") glyph. The icon-only sibling of `ButtonMenu`:
  presentational, with an `open` prop that applies the active treatment and
  reflects `aria-expanded`, composable onto a menu trigger via `render`. Reuses the
  ButtonIcon `secondary` token tier; accessible name defaults to "More options".

- [`2ac43cc`](https://github.com/constructor-lab/ui-component-library/commit/2ac43cc68bca0a239cb803ebba32fb35352e85ed) Thanks [@m231-a](https://github.com/m231-a)! - Add `ButtonMenuDropdown` — the themed dropdown panel a `ButtonMenu` opens. A
  composable set of Base UI Menu parts (`ButtonMenuDropdown`,
  `ButtonMenuDropdownTrigger`, `ButtonMenuDropdownContent`,
  `ButtonMenuDropdownSection`, `ButtonMenuDropdownItem`) themed from the dedicated
  `--ui-button-menu-dropdown-*` token tier: a bordered panel of divided sections
  whose items support a leading icon, a trailing shortcut hint, and a cascade
  chevron indicator. The optional search field and live submenu are deferred.

- [`cd23e63`](https://github.com/constructor-lab/ui-component-library/commit/cd23e634819f8f57d014c86f4e8ce2b4f44207b2) Thanks [@m231-a](https://github.com/m231-a)! - Add `Calendar` — a themed date calendar (single / multiple / range selection, month & dropdown captions, disabled/outside days) wrapping `react-day-picker`, styled with `--ui-*` tokens. Initial version ported from `ui-legacy`; design reconciliation pending. Adds `react-day-picker@10` as a dependency of `@constructor-lab/ui-react`.

- [`a1b9ca2`](https://github.com/constructor-lab/ui-component-library/commit/a1b9ca2bea46d11f251f5550cfb0725401e8a07a) Thanks [@m231-a](https://github.com/m231-a)! - Add `Carousel` — a slideshow built on the headless `embla-carousel-react` engine (drag, snap, loop, orientation, autoplay plugins) with composable parts (`Carousel`, `CarouselContent`, `CarouselItem`) and a `CarouselNavigation` bar (← Prev link · pagination dots · Next → link) matching the design mockup. Styled with `--ui-*` tokens. Adds `embla-carousel-react` as a dependency of `@constructor-lab/ui-react`. Initial version ported from `ui-legacy`; design reconciliation pending.

- [`bec9e35`](https://github.com/constructor-lab/ui-component-library/commit/bec9e35f254fae6a1cf29037a2fedb42d12bfa8b) Thanks [@m231-a](https://github.com/m231-a)! - Chip: add the `operational` action variant (semibold brand-blue action chip —
  `role="button"`, keyboard-activatable, no toggle / no remove) and re-theme all
  variants onto the current `--ui-chip-*` token tier (the dead `--ui-chips-*`
  names introduced silent color fallbacks after the next-gen token sync).

- [`aea1c3d`](https://github.com/constructor-lab/ui-component-library/commit/aea1c3dc3e84f887350de2c693b66cedd103b003) Thanks [@m231-a](https://github.com/m231-a)! - Add `Command` — a data-driven command palette (`Command` inline + `CommandDialog` for the ⌘K overlay) with grouped commands, per-command icons/shortcuts/disabled, filtering, and keyboard navigation. Built on the Base UI `Combobox` primitive + `Dialog` (no `cmdk` dependency), styled with `--ui-*` semantic tokens. Initial version ported from `ui-legacy`; design reconciliation pending.

- [`085ea2e`](https://github.com/constructor-lab/ui-component-library/commit/085ea2e00ca13da9d0ad6fb055a07de4c07ff383) Thanks [@m231-a](https://github.com/m231-a)! - Add `Drawer` — a panel that slides in from a screen edge with swipe-to-dismiss gestures, wrapping Base UI's `Drawer` primitive. Composable parts (`DrawerTrigger`, `DrawerContent`, `DrawerSwipeArea`, `DrawerHeader`, `DrawerTitle`, `DrawerCloseButton`, `DrawerBody`, `DrawerDescription`, `DrawerFooter`, plus granular `DrawerPopup`/`DrawerViewport`/`DrawerBackdrop`), with a `side` prop (`top`/`bottom`/`left`/`right`) mapped to Base UI's `swipeDirection`. Standalone from `Sheet`. Initial version; design reconciliation pending.

- [`a569e76`](https://github.com/constructor-lab/ui-component-library/commit/a569e7626c15a6fe2c237267fa0fe5e2df29a9b8) Thanks [@m231-a](https://github.com/m231-a)! - Link: add an `inverse` variant and rewire onto the restructured token tier. The
  `--ui-link-*` tokens were reorganised in the next-gen sync into `--ui-link-global-*`
  (gap/height, per-state text decoration) plus `--ui-link-normal-*` / `--ui-link-inverse-*`
  color sets; the component referenced the removed flat names and rendered unstyled.
  It now uses a `variant` prop (`'normal' | 'inverse'`, default `normal`, mapping the
  Figma `background` property) — `inverse` is for links on a dark surface (no disabled
  state, per the design).

- [`95e4e35`](https://github.com/constructor-lab/ui-component-library/commit/95e4e357ccaaf7e243ecbe29546f1535127a0e11) Thanks [@m231-a](https://github.com/m231-a)! - Add a canonical `Menu` component and make `ButtonMenuDropdown` and `DropdownMenu` aliases of it.

  `Menu` is the full Base UI Menu wrapper — `Menu`, `MenuTrigger`, `MenuPortal`, `MenuContent`, `MenuGroup`, `MenuSection`, `MenuItem` (`icon` / `shortcut` / `cascade` / `inset`), live cascaded submenus (`MenuSubmenu` / `MenuSubmenuTrigger` / `MenuSubmenuContent`), `MenuCheckboxItem`, `MenuRadioItem`, `MenuRadioGroup`, `MenuLabel`, `MenuSeparator`, `MenuShortcut` — styled from the `--ui-button-menu-dropdown-*` token tier.
  - **`ButtonMenuDropdown`** re-exports `Menu`'s parts under the existing names and now gains **live submenus** (`ButtonMenuDropdownSubmenu` / `…SubmenuTrigger` / `…SubmenuContent`); the previous submenu deferral is lifted. Renders identically to before.
  - **`DropdownMenu`** re-exports `Menu`'s parts (its full checkbox/radio/label/separator/shortcut/submenu API is preserved) and is now **restyled** from the shared `--ui-button-menu-dropdown-*` tokens instead of the generic semantic tokens — a visual change. Prefer the `shortcut` prop on `DropdownMenuItem` over a `DropdownMenuShortcut` child.

- [`a6615c6`](https://github.com/constructor-lab/ui-component-library/commit/a6615c69f05bb6892eec399af492911392fcbff4) Thanks [@m231-a](https://github.com/m231-a)! - Port the components that were unique to the legacy `@constructor-lab/shadcn-uikit`
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

- [`bc964df`](https://github.com/constructor-lab/ui-component-library/commit/bc964dfac4587c8240e49f445d48e5acef4adeb4) Thanks [@m231-a](https://github.com/m231-a)! - Resizable: remove the `withHandle` grab-bar grip to match the current Figma
  design. The design dropped the grip, so the `withHandle` prop and the grip's
  `--ui-resizable-bar-*` tokens (bar color/width/height/border-radius, since
  removed from `@constructor-lab/tokens`) are gone — the handle now renders the divider
  line only (idle gray via `--ui-border-on-surface-border`, hover/active blue).
  This also fixes the handle rendering at 0 width: it referenced the now-deleted
  `--ui-resizable-bar-width`, so the hit-area is now a literal 9px.

  Breaking (pre-1.0): drop `withHandle` from any `<ResizableHandle>` usage.

- [`f65aba5`](https://github.com/constructor-lab/ui-component-library/commit/f65aba5d6320b524ac899a7e4404772a764a9f26) Thanks [@m231-a](https://github.com/m231-a)! - Sheet: add direction-aware `start` / `end` `side` variants. They anchor to the
  inline-start / inline-end edge (using logical `start-0`/`end-0` + `border-e`/
  `border-s`) and flip side and slide direction under RTL, unlike the fixed
  physical `left` / `right`. Prefer `start`/`end` for locale-agnostic layouts.

- [`410215a`](https://github.com/constructor-lab/ui-component-library/commit/410215a87ec6ded52664c7493be6d692d928590f) Thanks [@m231-a](https://github.com/m231-a)! - Add `Tree` — a hierarchical tree menu with composable parts (`Tree`, `TreeItem`, `TreeItemTrigger`, `TreeItemLabel`, `TreeItemGroup`, `TreeItemCheckbox`, `TreeItemIcon`) and a data-driven `TreeView` wrapper. Supports expand/collapse, single selection, multi-checkbox, leading icons, and trailing slots (e.g. `Tag`), with roving-tabindex keyboard navigation and full WAI-ARIA tree roles. `TreeView` can virtualize long trees (`virtualized` + `height`) so thousands of nodes stay fast. Styled with `--ui-*` semantic tokens (the blue selection gamma). Initial version ported from `ui-legacy` and reconciled against the Figma "Tree" component set; design reconciliation of a dedicated token tier is pending.

### Patch Changes

- [`082deb3`](https://github.com/constructor-lab/ui-component-library/commit/082deb3e050b62575427acb2ed6aa079635838b4) Thanks [@m231-a](https://github.com/m231-a)! - Add the missing `--ui-border-on-status-ai` semantic token (the pale violet `{palette.violet.4}` the Figma uses; the tier previously only had the `ai-strong` gradient border), and repoint `Alert`'s ai border/divider from the `--ui-palette-violet-4` primitive stopgap to it.

- [`383853d`](https://github.com/constructor-lab/ui-component-library/commit/383853deb4a7548068ac57de1cbfa277ef1ae413) Thanks [@m231-a](https://github.com/m231-a)! - Avatar: rewire the corner radius onto the current
  `--ui-avatar-global-avatar-border-border-radius` token. The previous
  `--ui-avatar-global-avatar-border-radius` name was moved under the border group
  in the next-gen token sync, leaving the component referencing a dead variable
  that resolved to no radius (rendering avatars as squares instead of circles).

- [`41db262`](https://github.com/constructor-lab/ui-component-library/commit/41db26252ce1b734dfff6ae6ce158f4d8e7e2e88) Thanks [@m231-a](https://github.com/m231-a)! - Bump `@base-ui/react` to `1.6.0` (from the catalog). No API changes in the kit; tests, types, and the library build all pass on the new version.

- [`f1b61bc`](https://github.com/constructor-lab/ui-component-library/commit/f1b61bca3aa36ddd49aa33fe23fd21f75b574b44) Thanks [@m231-a](https://github.com/m231-a)! - Checkbox: match the Figma design more faithfully.
  - Draw the check / indeterminate glyph inline at Figma's exact geometry (an 8px
    mark centered in the 16px box with a 1.6px stroke) instead of the general
    `@constructor-lab/icons-react` check rendered at box size, which was full-bleed and
    ~65% too large.
  - Rewire the box alignment offset onto the current `--ui-checkbox-global-box-margin-y`
    token (the previous `--ui-checkbox-global-box-margin-x` name was renamed in the
    next-gen token sync, leaving the label/description layout referencing a dead
    variable that silently fell back to no offset).

- [`137f664`](https://github.com/constructor-lab/ui-component-library/commit/137f66477c9fa7d5631b8aadca5a4d7625410de3) Thanks [@m231-a](https://github.com/m231-a)! - Dialog / Sheet / AlertDialog: rewire the modal overlay onto the current
  `--ui-background-backdrop-screen` token. The previous `--ui-background-overlay-primary`
  was renamed to the `--ui-background-backdrop-*` family in the next-gen sync,
  leaving the backdrop referencing a dead variable that resolved to transparent
  (no dim). The scrim now renders again.

- [`6abe4df`](https://github.com/constructor-lab/ui-component-library/commit/6abe4dff5f3a205d971a4bc4a2ceef821fbe3e04) Thanks [@m231-a](https://github.com/m231-a)! - Replace physical CSS utilities with their logical equivalents for RTL support so
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

- [`8f195fc`](https://github.com/constructor-lab/ui-component-library/commit/8f195fce1b7bce04752beac4fd594c5e9049ccc7) Thanks [@m231-a](https://github.com/m231-a)! - Fix `SidebarPrimary` layout drift from Figma: the first `SidebarPrimarySection`
  no longer gets an extra top padding/divider (only bottom padding, matching
  Figma's `firstSection` split), `SidebarPrimaryFooter` no longer double-pads its
  rows on top of each item's own padding, and `SidebarPrimaryCollapseTrigger`'s
  icon now rotates 180° between the expanded and collapsed rail states.

- [`a7de48b`](https://github.com/constructor-lab/ui-component-library/commit/a7de48b5a00e40258ff83931c1982c71e6c2a97a) Thanks [@m231-a](https://github.com/m231-a)! - Table / DataTable: rewire onto the restructured `--ui-table-*` token tier. The
  next-gen sync moved the row fill colors under `data` and the cell border under
  `row`, and merged the header cell padding into `global`:
  `--ui-table-global-row-color-*` → `--ui-table-data-row-color-*`,
  `--ui-table-global-cell-border-color` → `--ui-table-global-row-border-color`,
  `--ui-table-header-cell-padding-x` → `--ui-table-global-cell-padding-x`. Both
  components referenced the removed names and rendered rows without their fill /
  border. Also wires the Table Figma Code Connect to its ready-for-dev node.
- Updated dependencies [[`082deb3`](https://github.com/constructor-lab/ui-component-library/commit/082deb3e050b62575427acb2ed6aa079635838b4), [`802e657`](https://github.com/constructor-lab/ui-component-library/commit/802e657f473e5a89eb28939abde7a267c438c59d)]:
  - @constructor-lab/tokens@2.0.0

## 0.54.0

### Minor Changes

- [#480](https://github.com/acronis/uikit/pull/480) [`79b5e65`](https://github.com/acronis/uikit/commit/79b5e650d5646097f8a5a971d0f9173ecbdd948f) Thanks [@leonid](https://github.com/leonid)! - Add `ScrollArea` (and `ScrollBar`): a scrollable region with a custom overlay
  scrollbar built on Base UI's Scroll Area. The bar floats over the content and
  reserves no layout space, so full-bleed content is never cropped by a scrollbar
  gutter on any OS/browser; it is hidden at rest and revealed on hover/scroll.
  Supports `orientation` (`vertical` | `horizontal` | `both`). Initial version
  ported from ui-legacy; design reconciliation pending.

### Patch Changes

- [#481](https://github.com/acronis/uikit/pull/481) [`e947aff`](https://github.com/acronis/uikit/commit/e947aff18abbcf28acbb32e377e51ddb19093a56) Thanks [@leonid](https://github.com/leonid)! - SidebarSecondary group headers (`SidebarSecondarySectionLabel`) are now at least
  36px tall with the label vertically centered, matching the Figma spec
  (node 4011-4472).

- [#477](https://github.com/acronis/uikit/pull/477) [`3d6d6dc`](https://github.com/acronis/uikit/commit/3d6d6dcc7c5d2eda19a0823f2a23a7e9737d124d) Thanks [@leonid](https://github.com/leonid)! - SidebarPrimary and SidebarSecondary now scroll their section list inside a
  `ScrollArea`, so the overlay scrollbar floats over the content and reserves no
  gutter — the full-bleed selected row is no longer cropped (on any OS), and the
  bar is revealed on hover/scroll instead of always shown.

## 0.53.0

### Minor Changes

- [#474](https://github.com/acronis/uikit/pull/474) [`609740c`](https://github.com/acronis/uikit/commit/609740cfd31f4f43e4d636efb73be34431bae1ba) Thanks [@leonid](https://github.com/leonid)! - feat(grid): add container-query mode

  Grid gains a `container` prop — columns respond to the grid's own width (container
  queries via a `@container/grid` wrapper) instead of the viewport. Ideal for widget
  grids inside variable-width areas like App Shell main. (DashboardLayout was dropped
  as redundant with Stack + Grid; "dashboard" is now an App Shell + container-Grid
  pattern.)

## 0.52.0

### Minor Changes

- [#469](https://github.com/acronis/uikit/pull/469) [`d7358ca`](https://github.com/acronis/uikit/commit/d7358ca5312722510082d1297d4884d189833267) Thanks [@leonid](https://github.com/leonid)! - feat(app-shell): add AppShell layout scaffold (from Figma)

  The full-page application scaffold — a slot-based layout (AppShell / AppShellSidebar
  / AppShellBody / AppShellHeader / AppShellMain / AppShellFooter) for dropping
  SidebarPrimary / SidebarSecondary / SearchGlobal and page content into. Mapped to
  the App Shell Figma (node 2782-1495) with a COMPLETE Code Connect. Establishes a
  dedicated "Layouts" docs section (App Shell + Stack/Grid/Section) and an App Shell
  composition pattern.

- [#471](https://github.com/acronis/uikit/pull/471) [`7c6eb81`](https://github.com/acronis/uikit/commit/7c6eb81d6dc8d5054cba19153b98d31aad83268d) Thanks [@leonid](https://github.com/leonid)! - feat(auth-layout): add AuthLayout (from Figma)

  A centered-card layout for authentication flows (sign-in / sign-up /
  forgot-password / 2FA) — AuthLayout / AuthLayoutCard / AuthLayoutLogo /
  AuthLayoutFooter. Mapped to the Main-menu-improvements Figma (node 4906-362342)
  with a COMPLETE Code Connect. Token fixes vs legacy: card uses bg-background
  (legacy bg-card is unbridged) + border-border. Joins the Layouts docs section.

- [#467](https://github.com/acronis/uikit/pull/467) [`69c54ae`](https://github.com/acronis/uikit/commit/69c54ae53a89a5e198cb9b1d6098c61048806a94) Thanks [@leonid](https://github.com/leonid)! - feat(stack,grid,section): add layout primitives (ported from ui-legacy)
  - **Stack** — a flexbox primitive (direction / gap / align / justify / wrap).
  - **Grid** — a responsive CSS-grid primitive (cols / gap, stepping down at smaller breakpoints).
  - **Section** — a titled content block (Section / Header / Title / Description / Content).

  Layout-only (no color except Section's muted description). Design reconciliation pending.

- [#470](https://github.com/acronis/uikit/pull/470) [`86422a0`](https://github.com/acronis/uikit/commit/86422a06403be6dffdbaa114eac9a866917b42cf) Thanks [@leonid](https://github.com/leonid)! - feat(page-header,page-content): add Page Header and Page Content layout components
  - **PageHeader** — the page header region (breadcrumb, title row with actions, description),
    mapped to the shadcn-uikit Figma (node 2850-701) with a COMPLETE Code Connect.
  - **PageContent** — the padded gutter for a page body; a <div> that nests inside
    AppShellMain (no duplicate main landmark).

  Both join the Layouts docs section (category: layout). Design reconciliation pending for PageContent.

- [#466](https://github.com/acronis/uikit/pull/466) [`834a3a1`](https://github.com/acronis/uikit/commit/834a3a1279d9a96055bc103ad1510a4b335526f4) Thanks [@leonid](https://github.com/leonid)! - feat(pagination): add Pagination (ported from ui-legacy)

  Navigation for paged content — previous/next controls, numbered page links with an
  aria-current marker, and an ellipsis for skipped ranges. Markup-only; page links
  styled with semantic tokens (foreground numbers, active surface for the current
  page). Use DataTablePagination inside a DataTable. Design reconciliation pending.

- [#465](https://github.com/acronis/uikit/pull/465) [`2933909`](https://github.com/acronis/uikit/commit/2933909fd1b46832e08cc3bf0bb1a907135d43ca) Thanks [@leonid](https://github.com/leonid)! - feat(toggle-group): add ToggleGroup and Toggle (ported from ui-legacy)

  A set of pressable toggle buttons (single/multiple selection) plus a standalone
  Toggle, on Base UI's Toggle / ToggleGroup. Semantic tokens: transparent idle, the
  hover surface on hover, and the active surface + foreground when pressed. Design
  reconciliation pending.

## 0.51.0

### Minor Changes

- [#461](https://github.com/acronis/uikit/pull/461) [`f58b48f`](https://github.com/acronis/uikit/commit/f58b48ff6475da25f0501996ba92fcd68cb86859) Thanks [@leonid](https://github.com/leonid)! - feat(accordion,collapsible): add Accordion and Collapsible (ported from ui-legacy)
  - **Collapsible** — a disclosure primitive (trigger toggles a height-animating
    panel) on Base UI's Collapsible; the primitive behind Accordion and the sidebars.
  - **Accordion** — a vertical set of disclosure sections (header trigger + panel),
    single or `multiple` open, on Base UI's Accordion.

  Design reconciliation pending.

- [#463](https://github.com/acronis/uikit/pull/463) [`c60861f`](https://github.com/acronis/uikit/commit/c60861f5a33d3e145a642a0095cccce5159787e2) Thanks [@leonid](https://github.com/leonid)! - feat(number-field): add NumberField (ported from ui-legacy)

  A numeric input with decrement / increment steppers, min/max/step, and keyboard
  stepping, built on Base UI's NumberField. The field box reuses the --ui-input-text-\*
  token tier so it matches InputBox / InputText; steppers default to minus/plus icons.
  Design reconciliation pending.

- [#462](https://github.com/acronis/uikit/pull/462) [`8ae5750`](https://github.com/acronis/uikit/commit/8ae5750ab5058857b3f3e0c688e25439aff12d91) Thanks [@leonid](https://github.com/leonid)! - feat(slider): add Slider (ported from ui-legacy)

  A slider for choosing a number — or a range (array value, two thumbs) — within a
  min/max by dragging, built on Base UI's Slider. The filled indicator and thumb
  border use the brand action blue (--ui-background-brand-secondary). Design
  reconciliation pending.

## 0.50.0

### Minor Changes

- [#459](https://github.com/acronis/uikit/pull/459) [`12578c5`](https://github.com/acronis/uikit/commit/12578c50b271e8c47961a5493388acfd9149f0e3) Thanks [@leonid](https://github.com/leonid)! - feat(combobox): add Combobox (searchable select on Base UI)

  A real, reusable searchable select built on Base UI's Combobox primitive — a
  typeable input that filters a list of items in a dropdown — replacing the legacy
  hardcoded Popover + cmdk demo. Parts: Combobox / ComboboxInput / ComboboxContent /
  ComboboxList / ComboboxItem / ComboboxEmpty / ComboboxGroup / ComboboxGroupLabel.
  Themed with the existing --ui-input-select-\* tokens so it matches InputSelect.
  Design reconciliation pending.

## 0.49.0

### Minor Changes

- [#457](https://github.com/acronis/uikit/pull/457) [`f89b7aa`](https://github.com/acronis/uikit/commit/f89b7aa88881c02cdb96d8932ed888ad1bf3a5ff) Thanks [@leonid](https://github.com/leonid)! - feat(alert,skeleton): add Alert and Skeleton (ported from ui-legacy)
  - **Alert** — a status banner (`role="alert"`) with seven severity variants
    (info / success / warning / critical / destructive / ai / neutral) and
    composable `AlertIcon` / `AlertContent` / `AlertTitle` / `AlertDescription`
    parts. Each variant maps to the `--ui-*` status tokens.
  - **Skeleton** — a pulsing placeholder box for loading states; shape/size via
    className.

  Design reconciliation pending.

- [#456](https://github.com/acronis/uikit/pull/456) [`f80f3ca`](https://github.com/acronis/uikit/commit/f80f3ca5566b1aec5db7b4a296cb4f4f4ef269e8) Thanks [@leonid](https://github.com/leonid)! - feat(form): add Form (initial version ported from ui-legacy)

  A native `<form>` with consolidated validation, rebuilt on Base UI's Form: it
  collects values by each `Field`'s name, validates on submit (or per
  `validationMode`), surfaces server `errors` keyed by field name, and calls
  `onFormSubmit(values)` when every field is valid. The legacy form wrapped
  react-hook-form; this version drops that dependency and composes the ui-react
  `Field` directly. Design reconciliation pending.

## 0.48.0

### Minor Changes

- [#454](https://github.com/acronis/uikit/pull/454) [`6870a94`](https://github.com/acronis/uikit/commit/6870a9427a20c728bf0e5f32a7e6b2e53a5deb0f) Thanks [@leonid](https://github.com/leonid)! - feat(field): add Field (initial version ported from ui-legacy)

  A form-field wrapper rebuilt on Base UI's Field primitive: `Field` / `FieldLabel`
  / `FieldControl` / `FieldDescription` / `FieldError` auto-wire the
  label↔control↔description↔error associations and validity state, plus structural
  parts (`FieldSet`, `FieldLegend`, `FieldGroup`, `FieldContent`, `FieldTitle`,
  `FieldSeparator`) for composing and grouping fields. Also exports the bare
  `InputBox` primitive (the control you render through `FieldControl`). Design
  reconciliation pending.

## 0.47.0

### Minor Changes

- [#452](https://github.com/acronis/uikit/pull/452) [`ed63db5`](https://github.com/acronis/uikit/commit/ed63db55e7c447ecf3a10d368953f60edf47731a) Thanks [@leonid](https://github.com/leonid)! - feat(chart): add Chart (initial version ported from ui-legacy)

  A theming layer over recharts: `ChartContainer` supplies per-series colors and
  themes recharts' internals with the semantic token vocabulary, plus
  `ChartTooltipContent` / `ChartLegendContent` chrome (and `ChartTooltip` /
  `ChartLegend` re-exports). recharts is externalized from the bundle and resolved
  as a dependency. Design reconciliation pending.

- [#451](https://github.com/acronis/uikit/pull/451) [`080d486`](https://github.com/acronis/uikit/commit/080d486590dcc4a0fcc8d35318245cf0469bf4aa) Thanks [@leonid](https://github.com/leonid)! - feat(data-table): single-click column sorting

  `DataTableColumnHeader` now sorts in a single click. The dropdown menu
  (Asc / Desc / Hide) is replaced by a toggle button whose trailing arrow shows the
  sort state — an up or down arrow in the brand blue when sorted, a muted up/down
  arrow when unsorted — matching the `Table` primitive's sortable header. Column
  hiding remains available via the toolbar's `DataTableViewOptions` menu.

## 0.46.0

### Minor Changes

- [#448](https://github.com/acronis/uikit/pull/448) [`69243eb`](https://github.com/acronis/uikit/commit/69243eb996d891322c04e1dd41d91382cd8fcbbe) Thanks [@leonid](https://github.com/leonid)! - feat(progress-circle): add ProgressCircle — circular/radial progress

  A compact circular progress ring — an SVG arc that fills with `value` and whose
  color tracks the level (danger → critical → warning → success), with an optional
  numeric or icon center. Wraps the Base UI Progress primitive for
  `role="progressbar"` semantics. Sizes `tiny` / `sm` / `md` / `lg`; status
  derived from value (overridable). The sibling of the linear `Progress`, for
  at-a-glance scores in table cells, cards, and widgets. Implements [#446](https://github.com/acronis/uikit/issues/446);
  design-pending v1 on the shared status tokens (no new tier).

## 0.45.0

### Minor Changes

- [#444](https://github.com/acronis/uikit/pull/444) [`a5f4dbf`](https://github.com/acronis/uikit/commit/a5f4dbf4e41c8b2ed3d43feab250943cdd892ce8) Thanks [@leonid](https://github.com/leonid)! - feat(description-list): add DescriptionList — key/value data list

  A composable, semantic `<dl>` for key/value data: rows of label → value, where
  the value can be plain text, a status (leading icon + value + a muted
  description), or action links. Parts: `DescriptionList`, `DescriptionListItem`,
  `DescriptionListLabel`, `DescriptionListValue`, `DescriptionListValueDescription`,
  `DescriptionListActions`. Built from the Cyber-Compliance "Service status" design
  (Figma node 3001-20448, COMPLETE Code Connect); composes the shared semantic
  tokens — no new tier. `SheetDetails` and the `sheet-detail-panel` pattern now
  render their property list through it instead of an ad-hoc grid.

- [#442](https://github.com/acronis/uikit/pull/442) [`53c5207`](https://github.com/acronis/uikit/commit/53c52078797643c0f21e78c497b5e0352999b6f9) Thanks [@leonid](https://github.com/leonid)! - feat(sheet): add the SheetDetails preset (sheet-detail-panel pattern)

  `SheetDetails` is the "easy path that is the pattern" for the sheet-detail-panel
  recipe: a right-anchored Sheet whose header (title + close), body, and optional
  footer are driven by props. The body switches by `contentState` —
  `loading` → Spinner, `empty`/`error` → Empty, else a key/value `properties` list
  or custom children. Composes the existing `Sheet*` parts; reach for those
  directly only for layouts the preset doesn't cover.

## 0.44.0

### Minor Changes

- [#439](https://github.com/acronis/uikit/pull/439) [`4d0e568`](https://github.com/acronis/uikit/commit/4d0e56852c5d51753bb6fcbfcb6797fc51857eab) Thanks [@leonid](https://github.com/leonid)! - feat(sheet): add Sheet (modal side panel) + Details alias

  A modal side panel anchored to a screen edge, built on the Base UI Dialog
  primitive (the same one `Dialog` uses) with a slide transition. Composable parts:
  `Sheet`, `SheetTrigger`, `SheetContent` (with a `side` prop — `top`/`right`/
  `bottom`/`left`, default `right`), `SheetHeader`, `SheetTitle`, `SheetCloseButton`,
  `SheetBody`, `SheetDescription`, `SheetFooter`, `SheetClose`. Design-pending v1
  ported from the legacy library; themed on the shared semantic tokens like the
  Dialog family (no `--ui-sheet-*` tier yet).

  The Vue UI kit called this `Details`, so the full part family is also re-exported
  under `Details*` aliases (`Details`, `DetailsContent`, …) for a 1:1 migration.

## 0.43.1

### Patch Changes

- [#435](https://github.com/acronis/uikit/pull/435) [`3569de6`](https://github.com/acronis/uikit/commit/3569de6a64fae4acdacc5af10d067d0e09b2b977) Thanks [@leonid](https://github.com/leonid)! - refactor(checkbox): center the checkbox box inline (align-middle)

  Move `align-middle` onto the `Checkbox` root so the box stays vertically centered
  whenever it sits inline next to text (it previously defaulted to the text
  baseline and sat high). This replaces the table-scoped
  `[&_[role=checkbox]]:align-middle` rule added in the cell-alignment fix — the
  Table no longer needs it, and any inline checkbox now centers everywhere, not
  just in tables. No visual change to existing baselines (the computed alignment is
  identical; just declared on the component instead of the cell).

- Updated dependencies [[`981200c`](https://github.com/acronis/uikit/commit/981200c12a00ffea797446b2c716aef58db93123)]:
  - @constructor-lab/icons-react@0.5.0

## 0.43.0

### Minor Changes

- [#430](https://github.com/acronis/uikit/pull/430) [`2f4ed53`](https://github.com/acronis/uikit/commit/2f4ed53381a440623a36a93e24ec7d7866f4ec94) Thanks [@leonid](https://github.com/leonid)! - feat(data-table): add striped / bordered / current-row / skeleton flags

  Borrow presentational features from the Vue `AvTable` onto `DataTable`:
  - `striped` — alternating row backgrounds.
  - `bordered` — vertical borders between columns (rows already have horizontal).
  - `highlightCurrentRow` — highlight the row the user last clicked.
  - `skeleton` (+ `skeletonRows`) — placeholder loading rows.

  All reuse the existing `--ui-table-*` tier (current row = the active-row color,
  stripes/skeleton = the secondary surface) — no new tokens. Behavioral features
  (sorting, filtering, selection, expansion, pagination) already come from TanStack;
  selection-driven bulk actions are documented as a new **data-table-bulk-actions**
  usage pattern rather than a monolithic feature-flag prop.

### Patch Changes

- [#432](https://github.com/acronis/uikit/pull/432) [`83820c5`](https://github.com/acronis/uikit/commit/83820c5fb73e1647d5dbccf15b12939bdaba7686) Thanks [@leonid](https://github.com/leonid)! - fix(data-table,table): align header padding + center checkbox/cell contents
  - `DataTableColumnHeader`: the sort button used the legacy `-ml-3`, which (with
    ui-react's 0-padding ghost button) pulled the header label 12px left of the
    body cells. Now `-ml-2 px-2`, so the label sits flush at the same horizontal
    padding as the cells below it.
  - `Table`: cells gave checkboxes the default `baseline` vertical alignment, so
    they sat high relative to the centered text/tags. Header and body cells now
    apply `align-middle` to any `[role=checkbox]`, vertically centering checkboxes
    with the rest of the row content.

## 0.42.0

### Minor Changes

- [#428](https://github.com/acronis/uikit/pull/428) [`eaaba11`](https://github.com/acronis/uikit/commit/eaaba116195e110fc7f30bd78ec63e2424cac7fa) Thanks [@leonid](https://github.com/leonid)! - feat(data-table): add DataTable (TanStack data grid)

  A data grid built on TanStack react-table v8, composed over the Table primitives —
  sorting, filtering, column visibility, row selection, pagination, and optional row
  expansion. Ported from the legacy library. Exports `DataTable` plus the companion
  parts `DataTableColumnHeader`, `DataTableToolbar`, `DataTablePagination`, and
  `DataTableViewOptions` (which operate on a TanStack `table` instance). Adds
  `@tanstack/react-table` as a dependency. Design-pending v1: it reuses the Table
  component's `--ui-table-*` tokens (the wrapper border matches the cell borders)
  and composes the already-themed Button / ButtonIcon / Checkbox / DropdownMenu /
  InputSelect / InputText components.

- [#427](https://github.com/acronis/uikit/pull/427) [`a84fe67`](https://github.com/acronis/uikit/commit/a84fe670c104d0ee14f0f2fe6703368df3f765c5) Thanks [@leonid](https://github.com/leonid)! - feat(toast): add Toast (Toaster + imperative toast API)

  Transient corner-stack notifications. Render one `<Toaster />` near the app root
  and trigger toasts imperatively from anywhere with `toast(title, options)` —
  including `toast.success` / `info` / `warning` / `error` / `loading`,
  `toast.dismiss`, and `toast.promise`. Rebuilt on the Base UI toast manager (no
  Sonner dependency), replacing the legacy `sonner` wrapper. Each toast shows a
  status-colored icon, title, optional description, optional action button, and a
  close button; auto-dismisses after `timeout` (default 5000ms), with `loading`
  toasts persisting until updated or dismissed. Design-pending v1 on semantic
  tokens (no `--ui-toast-*` tier yet). `Toaster` accepts `timeout`, `limit`, and
  `portalContainer`.

## 0.41.0

### Minor Changes

- [#423](https://github.com/acronis/uikit/pull/423) [`fa6d61e`](https://github.com/acronis/uikit/commit/fa6d61ea4b184ba91ab7f3fe228f4c6a7e910ab7) Thanks [@leonid](https://github.com/leonid)! - feat(label,progress,badge): add Label and Progress components, alias Badge to Tag
  - **Label** — a caption for a form control (native `<label>`, small
    medium-weight type, `peer-disabled:` dimming). Design-pending v1 ported from
    the legacy library; inherits `text-foreground` (no `--ui-label-*` tier yet).
  - **Progress** — a determinate/indeterminate progress bar wrapping the Base UI
    Progress primitive. Design-pending v1; track uses `bg-input`, the indicator the
    brand blue (`bg-secondary`), with a sliding `indeterminate-progress` animation
    when `value` is `null`.
  - **Badge** — re-exported as an alias of `Tag`. The generic legacy shadcn Badge
    is replaced by the design-system-native `Tag` (its own `--ui-tag-*` token tier,
    icon slot, and sizes); `import { Badge }` returns `Tag`.

- [#425](https://github.com/acronis/uikit/pull/425) [`93eb023`](https://github.com/acronis/uikit/commit/93eb02326571a95738179f953b890e531248c435) Thanks [@leonid](https://github.com/leonid)! - feat(widget-placeholder): add WidgetPlaceholder component

  A composable empty-state for a dashboard widget — a bordered card with a header
  (icon + title), a centered illustration / message / action, and an optional
  footer. The root takes an `interactive` prop that makes the whole card focusable
  and clickable (hover/active surface tints + a focus ring). Design-pending v1
  ported from the legacy library; themed on semantic tokens (no
  `--ui-widget-placeholder-*` tier yet — the icon/action use the brand action blue,
  the illustration a muted placeholder tone). Parts: `WidgetPlaceholder`,
  `WidgetPlaceholderHeader`, `WidgetPlaceholderIcon`, `WidgetPlaceholderTitle`,
  `WidgetPlaceholderContent`, `WidgetPlaceholderImage`, `WidgetPlaceholderText`,
  `WidgetPlaceholderAction`, `WidgetPlaceholderFooter`.

## 0.40.0

### Minor Changes

- [#421](https://github.com/acronis/uikit/pull/421) [`b9df0c2`](https://github.com/acronis/uikit/commit/b9df0c288100503b6f67fb41b55e76270574c7f7) Thanks [@leonid](https://github.com/leonid)! - Add `Separator` and `Spinner` (initial versions ported from ui-legacy).
  - `Separator` — a 1px divider (`horizontal` / `vertical`) on the Base UI Separator primitive, using the shared `bg-border` token (replacing the legacy `bg-primary/10` hack).
  - `Spinner` — a CSS loading ring (`role="status"`) in four sizes (`sm`/`md`/`lg`/`xl`), defaulting to the brand blue via `currentColor` and overridable with a `text-*` class.

  Both are design-pending until dedicated token tiers exist.

## 0.39.0

### Minor Changes

- [#420](https://github.com/acronis/uikit/pull/420) [`17498f6`](https://github.com/acronis/uikit/commit/17498f6545fe38f6a33c46823cd6bac21ce62bf6) Thanks [@leonid](https://github.com/leonid)! - Add `DropdownMenu` (initial version ported from ui-legacy). A menu of actions on the Base UI Menu primitive, composed from `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioGroup`/`DropdownMenuRadioItem`, `DropdownMenuLabel`, `DropdownMenuSeparator`, `DropdownMenuShortcut`, and nested `DropdownMenuSub`/`DropdownMenuSubTrigger`/`DropdownMenuSubContent`. Keyboard nav, typeahead, focus management, and dismissal come from Base UI; `DropdownMenuContent` accepts `side`/`align`/`sideOffset` and `portalContainer`. Themed from the shared semantic tokens (surface/highlight/separator/shortcut); enter/exit animations use `tw-animate-css`. Design-pending until a `--ui-menu-*` tier exists.

- [#419](https://github.com/acronis/uikit/pull/419) [`ae5867e`](https://github.com/acronis/uikit/commit/ae5867ee726a9d196582d497abfd948e97ad1336) Thanks [@leonid](https://github.com/leonid)! - Add `Empty` (initial version ported from ui-legacy). A centered empty-state placeholder composed from parts — `Empty`, `EmptyIcon`, `EmptyHeader`, `EmptyTitle`, `EmptyDescription`, `EmptyActions`, `EmptyLinks`. Themed from the shared semantic text tokens (emphasized `text-foreground` title over a muted `text-muted-foreground` description/icon); a `--ui-empty-*` tier is deferred to a Figma pass.

- [#416](https://github.com/acronis/uikit/pull/416) [`6407723`](https://github.com/acronis/uikit/commit/6407723e3ab704f1544beb729a92acbc45658edf) Thanks [@leonid](https://github.com/leonid)! - Add `Popover` (initial version ported from ui-legacy). A floating panel anchored to a trigger — `Popover`, `PopoverTrigger`, `PopoverContent` (+ `PopoverPortal`) — built on the Base UI Popover primitive (positioning, focus management, outside-press / Esc dismissal). `PopoverContent` accepts `side` / `align` / `sideOffset`, `portal`, and `portalContainer` (for isolated-style mounts). Themed from the shared semantic surface tokens (`bg-background` / `text-foreground` / `border-border`); enter/exit animations use `tw-animate-css`. Design-pending until a `--ui-popover-*` tier exists.

- [#415](https://github.com/acronis/uikit/pull/415) [`f95bde5`](https://github.com/acronis/uikit/commit/f95bde5385b60ef7ff4c510bcabc7d4d8b60a4a9) Thanks [@leonid](https://github.com/leonid)! - Add `Tabs` (initial version ported from ui-legacy). A bordered segmented-control tab group — `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` — built on the Base UI Tabs primitive (roving focus, arrow-key navigation, ARIA). Themed from the shared brand tokens: idle triggers are outlined in the `secondary` brand blue (the same blue Button uses), and the active trigger fills with that blue and a pure-white `text-primary-foreground` label. Sorting/selection of content is the consumer's; design-pending until a `--ui-tabs-*` tier exists.

## 0.38.0

### Minor Changes

- [#411](https://github.com/acronis/uikit/pull/411) [`c1adde9`](https://github.com/acronis/uikit/commit/c1adde90beff0f887fd83b2abcf1566a67b4a42c) Thanks [@leonid](https://github.com/leonid)! - Add `Card` (initial version ported from ui-legacy; design reconciliation pending). A composable surface — `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` — built on Base UI `useRender` with a `render` prop on every part. Colors resolve to the shared semantic tokens (`bg-background` / `text-foreground` / `border-border` / `text-muted-foreground`); a `--ui-card-*` tier will be wired in once a Figma reference exists.

- [#412](https://github.com/acronis/uikit/pull/412) [`e2b3335`](https://github.com/acronis/uikit/commit/e2b3335a4e33ba3892f08b63e0d4bad02d682871) Thanks [@leonid](https://github.com/leonid)! - Add `Dialog` (initial version ported from ui-legacy; design reconciliation pending). A modal overlay built on the Base UI Dialog primitive, composed from `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogCloseButton`, `DialogBody`, `DialogDescription`, `DialogFooter`, plus the lower-level `DialogOverlay` / `DialogPortal` / `DialogClose` parts. Focus trap, scroll lock, and `Esc`/outside-press dismissal come from Base UI; `DialogContent` accepts a `size` prop (six widths — `xs`/`sm`/`md`/`lg`/`xl`/`2xl`, 464–1136px, default `sm`) and `portalContainer` for isolated-style mounts. Colors resolve to the shared semantic tokens (overlay/surface/text/border); enter/exit animations use `tw-animate-css` (overlay fade, popup fade + zoom); a `--ui-dialog-*` token tier is deferred to a Figma pass.

- [#413](https://github.com/acronis/uikit/pull/413) [`4e713d4`](https://github.com/acronis/uikit/commit/4e713d46c36aa8de8506e2b18f1357cb288f8fd6) Thanks [@leonid](https://github.com/leonid)! - Add `Table` (initial version ported from ui-legacy, informed by the pre-release Table design). Composable from native table parts — `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`, `TableCaption` — with **sortable column headers** (`sortable` + `sortDirection` + `onSort`, with a sort icon and `aria-sort`) and a **selectable** `TableRow` (`selected`). Themed by the existing `--ui-table-*` token tier (now imported in ui-react's styles). Sorting/selection logic stays with the consumer; a TanStack-backed `DataTable` over these primitives is a planned follow-up.

- [#412](https://github.com/acronis/uikit/pull/412) [`e2b3335`](https://github.com/acronis/uikit/commit/e2b3335a4e33ba3892f08b63e0d4bad02d682871) Thanks [@leonid](https://github.com/leonid)! - Add `tw-animate-css` to ui-react's stylesheet, enabling enter/exit animation utilities (`animate-in` / `animate-out` / `fade-*` / `zoom-*` / `slide-*`) — the same library the legacy package uses. Components wrapping Base UI primitives can now animate against the `data-[open]` / `data-[closed]` state attributes (e.g. `Dialog`'s overlay fade and popup fade + zoom). VR-safe: the visual-regression runner screenshots with animations disabled, so baselines capture the settled end state.

## 0.37.0

### Minor Changes

- [#407](https://github.com/acronis/uikit/pull/407) [`2239301`](https://github.com/acronis/uikit/commit/2239301d72ed2aa3f08ab95b4c851207f8a3d48d) Thanks [@leonid](https://github.com/leonid)! - **Breaking:** `Input` and `Search` are now aliases of the full field components
  `InputText` and `InputSearch`. Previously they were the bare input/search boxes.

  The bare boxes are now internal primitives (`InputBox` / `SearchBox`) consumed by
  the field components and are no longer exported. Consumers that used `Input` /
  `Search` as a plain control now get the labelled field (a wrapping element, with
  optional label/clear/error furniture). To keep a bare control, compose the field
  without a `label`, or migrate to `InputText` / `InputSearch` directly (same
  components). `InputProps` / `SearchProps` now alias `InputTextProps` /
  `InputSearchProps`.

- [#408](https://github.com/acronis/uikit/pull/408) [`cda0168`](https://github.com/acronis/uikit/commit/cda016837931ae927b114b7474b035935bb83c16) Thanks [@leonid](https://github.com/leonid)! - Add a `Textarea` alias (and `TextareaProps`) for `InputTextArea`, mirroring the
  `Input` / `Search` aliases of `InputText` / `InputSearch`. `InputTextArea`
  remains the canonical export; `Textarea` is an additional name for discovery.

## 0.36.0

### Minor Changes

- [#404](https://github.com/acronis/uikit/pull/404) [`9c7bffb`](https://github.com/acronis/uikit/commit/9c7bffb1ef8edba94e5de8e69bda281218fcbe5f) Thanks [@leonid](https://github.com/leonid)! - Add `Chip`: a compact interactive label with two variants — `removable` (a
  trailing × remove button that emits `onRemove`) and `selectable` (a toggle that
  shows the active style when `selected`, exposed as `role="button"` +
  `aria-pressed`). Supports an optional leading icon and is themed by the
  `--ui-chips-*` token tier.

### Patch Changes

- Updated dependencies [[`c686666`](https://github.com/acronis/uikit/commit/c686666ff880d8adc647c7c5b47c3b01bce2c88d)]:
  - @constructor-lab/tokens-pd@1.9.0

## 0.35.1

### Patch Changes

- [#398](https://github.com/acronis/uikit/pull/398) [`d9dfac1`](https://github.com/acronis/uikit/commit/d9dfac1b0e4a2ef4fe229aaa17648c5604ec637f) Thanks [@leonid](https://github.com/leonid)! - Declare `"sideEffects": ["**/*.css"]` in package.json. This lets bundlers
  tree-shake unused component modules (the JS is side-effect-free) while still
  preserving the stylesheet entry (`@constructor-lab/ui-react/styles`), which
  must not be dropped. Consumers importing a subset of components now get a
  smaller bundle with no configuration.

## 0.35.0

### Minor Changes

- [#396](https://github.com/acronis/uikit/pull/396) [`051f91c`](https://github.com/acronis/uikit/commit/051f91ce89129acc1e572925a152637477f82b1e) Thanks [@leonid](https://github.com/leonid)! - Add an optional `portalContainer` prop to `InputSelectContent` (mirroring
  `TooltipContent`). It forwards to the underlying Base UI `Select.Portal`'s
  `container`, so the dropdown can be portaled into a scoped root (e.g. a shadow
  root) and inherit styles defined there instead of always mounting on
  `document.body`.

## 0.34.0

### Minor Changes

- [#394](https://github.com/acronis/uikit/pull/394) [`071934c`](https://github.com/acronis/uikit/commit/071934c11ac0b9dc100a7190ae9b008944a03dac) Thanks [@leonid](https://github.com/leonid)! - Fix `SidebarPrimaryMenuItem` / `SidebarSecondaryMenuItem` trailing-extras layout: tags, shortcuts, and external-link icons passed as children are now split from the label and pinned to the right edge of the row (`shrink-0`), while the title takes the remaining width and truncates with an ellipsis (`min-w-0`). Previously the extras flowed inline after the label, so a long title pushed them off the row instead of truncating.

  Fix the `SidebarSecondary` collapsed rail: the breadcrumb labels now read vertically (`writing-mode: vertical-rl`, separator chevron turned to point down) so they run down the ~48px rail instead of clipping into single letters, and `SidebarSecondaryHeader` is hidden when collapsed (the breadcrumb's parent label carries the section context), matching the Figma collapsed design. The footer is now pinned to the bottom of the rail in the collapsed state, and `SidebarSecondaryCollapseTrigger`'s chevron auto-flips 180° when collapsed so a chevron-left ("collapse") becomes a chevron-right ("expand").

  Add an optional `shortcut` prop to `SidebarSecondaryCollapseTrigger` — a right-aligned keyboard-shortcut hint (e.g. `⌘J`) that is hidden alongside the label in the collapsed rail.

## 0.33.1

### Patch Changes

- [#389](https://github.com/acronis/uikit/pull/389) [`f4ed1f8`](https://github.com/acronis/uikit/commit/f4ed1f83e587ed103a8135dc63ff08fdfd54ca92) Thanks [@leonid](https://github.com/leonid)! - Fix `SidebarPrimaryMenuItem` / `SidebarSecondaryMenuItem` trailing-extras layout: tags, shortcuts, and external-link icons passed as children are now split from the label and pinned to the right edge of the row (`shrink-0`), while the title takes the remaining width and truncates with an ellipsis (`min-w-0`). Previously the extras flowed inline after the label, so a long title pushed them off the row instead of truncating.

## 0.33.0

### Minor Changes

- [#382](https://github.com/acronis/uikit/pull/382) [`18d39e4`](https://github.com/acronis/uikit/commit/18d39e434605bac39ad484b66d691b227e6d701c) Thanks [@leonid](https://github.com/leonid)! - Add `Link`: an inline text link (semibold) that underlines on hover, with an optional trailing external-link icon (`external`). Polymorphic via Base UI `useRender` (`render` prop) to render a router link instead of the default `<a>`; `disabled` makes it inert (disabled color, removed from the tab order, no navigation). Themed by the `--ui-link-*` tier (text color / text decoration / external-icon color per state) + a 3px `--ui-focus-primary` focus ring.

## 0.32.0

### Minor Changes

- [#380](https://github.com/acronis/uikit/pull/380) [`71c5b42`](https://github.com/acronis/uikit/commit/71c5b4220b768d2aba7ec547d1f1a3b32f544701) Thanks [@leonid](https://github.com/leonid)! - Add `InputDatePicker`: the date-field trigger — a button box that displays a formatted date (or a `start – end` range via `pickerType="dateRange"`) and a trailing calendar icon, with the field furniture (`label` + required `*`, `description` / `error`). The box border is wired per state (idle / hover / open / focus + ring / disabled), and `error` (or `aria-invalid`) switches to the error border + `--ui-focus-error` ring. Themed by the `--ui-input-date-picker-*` tier. Scope is the trigger only — the consumer formats dates and wires their own calendar popup to `open` / `onClick` (the calendar is not designed/tokenized yet).

## 0.31.0

### Minor Changes

- [#377](https://github.com/acronis/uikit/pull/377) [`734775c`](https://github.com/acronis/uikit/commit/734775caa5befeb382a3cde3c74ef1b30099070b) Thanks [@leonid](https://github.com/leonid)! - `InputTextArea`: expand into a full field and link it to Figma. It now renders the field furniture — an optional `label` (with an optional required `*`), and an optional `description` or `error` message below the textarea — mirroring `InputText`. Passing `error` switches the field to its error treatment, and the error state now paints the red `--ui-input-text-area-error-msg-box-border-color-*` border (previously only the focus ring changed). `ref` and `className` still target the underlying `<textarea>`, so the bare usage (`<InputTextArea placeholder=… />`) is unchanged. Adds the Figma Code Connect mapping (node 2797-2876).

## 0.30.0

### Minor Changes

- [#374](https://github.com/acronis/uikit/pull/374) [`3289f94`](https://github.com/acronis/uikit/commit/3289f9439dbc61506fefda1e90d7770454f1fb1b) Thanks [@leonid](https://github.com/leonid)! - Add `InputSelect`: the next-gen select field, composing Base UI `Select` and the `--ui-input-select-*` token tier. It ships the full field furniture (`InputSelectField`/`InputSelectLabel` with required marker/`InputSelectDescription`/`InputSelectError`), the themed trigger (`InputSelectTrigger`/`InputSelectValue` with an `aria-invalid` error treatment), and the dropdown machinery (`InputSelectContent`, in-dropdown `InputSelectSearch`, `InputSelectSection`/`InputSelectSectionLabel`, single + multiple `InputSelectItem`, and `InputSelectStatus` for loading/empty/error).

  `Select` is now an alias of the `InputSelect*` parts — this re-points it off the deleted `--ui-form-*` tier (which left it rendering with unresolved colors) onto `--ui-input-select-*`, resolving [#333](https://github.com/acronis/uikit/issues/333). The composable `Select*` API is unchanged.

## 0.29.0

### Minor Changes

- [#367](https://github.com/acronis/uikit/pull/367) [`837f174`](https://github.com/acronis/uikit/commit/837f1747fa83edc7bdf02f3fc1b0e716f0ecbbb5) Thanks [@leonid](https://github.com/leonid)! - Add `InputSearch`: a full search field that composes the bare `Search` box and adds an optional label (with an optional required marker) above it. The label is associated via `htmlFor`/`id` and clears `Search`'s default `aria-label` so it doesn't shadow the visible label; all other props (`placeholder`, `value`, `disabled`, `onClear`, …) pass through to `Search`. Themed by the `--ui-input-search-*` token tier.

## 0.28.0

### Minor Changes

- [#361](https://github.com/acronis/uikit/pull/361) [`c62ec0a`](https://github.com/acronis/uikit/commit/c62ec0a8c8b5516e00f413a96ec10883b5706c7e) Thanks [@leonid](https://github.com/leonid)! - Add `InputText`: a full single-line text field built around the bare `Input`
  primitive — an optional `label` (with an optional `required` marker), the input
  box, an optional clear (✕) button (`clearable` + `onClear`), and an optional
  `description` or `error` message. Passing `error` switches the field to its error
  treatment (red box border via `aria-invalid` + red message). Label/description/error
  are wired with `htmlFor`/`aria-describedby`/`aria-required` for accessibility, and
  all colors come from the `--ui-input-text-*` token tier.

## 0.27.0

### Minor Changes

- [#359](https://github.com/acronis/uikit/pull/359) [`dff869e`](https://github.com/acronis/uikit/commit/dff869e61e6a03a2d68687be08f44be9d74aa1e0) Thanks [@leonid](https://github.com/leonid)! - Add `CardFilter`: a compact stat/filter card — a caption `label` above a prominent
  `value`, with an optional leading `icon`. Three variants: `static` (presentational),
  `static-empty` (placeholder with an em-dash, no icon), and `clickable` (renders an
  interactive `<button>` with hover / active / focus states and a link-colored value).
  Themed entirely by the `--ui-card-filter-*` tokens; focus is a 3px `--ui-focus-primary`
  ring flush to the edge. Supports Base UI `render`-prop composition (e.g. render a
  clickable filter as a link).

## 0.26.0

### Minor Changes

- [#357](https://github.com/acronis/uikit/pull/357) [`a79abf1`](https://github.com/acronis/uikit/commit/a79abf17387b6e43fb2fd67fab5601c9a590411a) Thanks [@leonid](https://github.com/leonid)! - **Breaking:** rename `ButtonDropdown` → `ButtonMenu` to match the Figma component
  set (named "ButtonMenu") and its `--ui-button-menu-*` token tier. The exports
  `ButtonDropdown`, `ButtonDropdownProps`, and `buttonDropdownVariants` are now
  `ButtonMenu`, `ButtonMenuProps`, and `buttonMenuVariants`; update imports
  accordingly. The API (props, variants, behavior) is otherwise unchanged.

  Also fixes the focus ring to match the current Figma design — was a 2px
  `--ui-focus-brand` ring with a 2px offset; now a 3px `--ui-focus-primary` ring
  flush to the button edge (no offset), matching `Button` and `ButtonIcon`.

## 0.25.2

### Patch Changes

- [#355](https://github.com/acronis/uikit/pull/355) [`20ebf63`](https://github.com/acronis/uikit/commit/20ebf63008ed3b64afc10a71470436f1df4866b6) Thanks [@leonid](https://github.com/leonid)! - `ButtonIcon`: fix the focus ring to match the Figma design — was a 2px
  `--ui-focus-brand` ring with a 2px offset; now a 3px `--ui-focus-primary` ring
  flush to the button edge (no offset), matching the Figma focus state (same fix as
  `Button`). Also drops the blanket transparent `border` so only the `secondary`
  variant draws one (the Figma `ghost` has no border); the centered icon's geometry
  is unchanged.

## 0.25.1

### Patch Changes

- [#353](https://github.com/acronis/uikit/pull/353) [`5b430b1`](https://github.com/acronis/uikit/commit/5b430b17123176c1d279aaaaff6e69d9f2c778b8) Thanks [@leonid](https://github.com/leonid)! - `Button`: fix the focus ring and horizontal padding to match the Figma design.
  - **Focus ring**: was a 2px `--ui-focus-brand` ring with a 2px offset; now a 3px
    `--ui-focus-primary` ring flush to the button edge (no offset), matching the
    Figma focus state.
  - **Horizontal padding**: the blanket transparent `border` was insetting the
    content of borderless variants (primary / ghost / destructive / ai) by 1px, so
    their effective padding was 13px instead of the design's 12px. The 1px border is
    now applied only to the variants that actually have one (`secondary` /
    `inverted`), so every variant's `px` matches the design.

## 0.25.0

### Minor Changes

- [#350](https://github.com/acronis/uikit/pull/350) [`d9d19a7`](https://github.com/acronis/uikit/commit/d9d19a7ed8bda545a801d5dbe494df6185529eee) Thanks [@leonid](https://github.com/leonid)! - `SidebarSecondary`: add **expandable sections**. `SidebarSecondarySection` gains
  an `expandable` prop (plus `open` / `defaultOpen` / `onOpenChange`) that turns the
  section into a Base UI Collapsible — the `SidebarSecondarySectionLabel` becomes a
  chevron toggle and the `SidebarSecondaryMenu` its collapsible panel. The label
  also accepts an `actions` slot (e.g. a ghost `ButtonIcon`, kept outside the toggle)
  and an `unreadRollup` badge shown only while the section is collapsed. Item-level
  submenus (`SidebarSecondaryMenuSub`) nest inside expandable sections. Static
  sections are unchanged.

## 0.24.0

### Minor Changes

- [#346](https://github.com/acronis/uikit/pull/346) [`769a142`](https://github.com/acronis/uikit/commit/769a142e1ebe20e60207eac43d3407f0068a18c3) Thanks [@leonid](https://github.com/leonid)! - Add `SearchGlobal`: a prominent global "search anything" field — a 48px pill with
  a gradient brand border (`--ui-search-global-*` token tier), a leading magnifier,
  a borderless search input, and a decorative trailing keyboard-shortcut hint (`⌘K`,
  hideable via `shortcut={null}`). Border swaps idle/hover/active gradients and shows
  a `--ui-focus-primary` ring on focus; forwards a ref to the input for shortcut
  wiring.

## 0.23.0

### Minor Changes

- [#344](https://github.com/acronis/uikit/pull/344) [`01a4ae9`](https://github.com/acronis/uikit/commit/01a4ae9da2b0623a844509e0700a7afdb62ea8d1) Thanks [@leonid](https://github.com/leonid)! - Add `Resizable`: a panel-group component (`ResizablePanelGroup` / `ResizablePanel`
  / `ResizableHandle`) wrapping `react-resizable-panels`, themed with the
  `--ui-resizable-*` token tier. The handle is a draggable divider with an optional
  grab-bar grip (`withHandle`); supports horizontal and vertical orientation,
  min/max sizes, collapsible and nested panels. Keyboard-resizable, with the handle
  exposed as an ARIA `separator`.

## 0.22.3

### Patch Changes

- Updated dependencies [[`0492758`](https://github.com/acronis/uikit/commit/04927588678c058275a3911579a476b73eba12bf)]:
  - @constructor-lab/tokens-pd@1.8.1

## 0.22.2

### Patch Changes

- Updated dependencies [[`62e2a0d`](https://github.com/acronis/uikit/commit/62e2a0df33293b5efd946af2e68ad38757964e69)]:
  - @constructor-lab/tokens-pd@1.8.0

## 0.22.1

### Patch Changes

- [#338](https://github.com/acronis/uikit/pull/338) [`6ac0cc9`](https://github.com/acronis/uikit/commit/6ac0cc9f7ca1af368be43e8e87912513d495f123) Thanks [@leonid](https://github.com/leonid)! - Storybook dev experience: add brand (acronis / deep-sky), light/dark,
  direction (auto / ltr / rtl), and locale toolbars driven by the tokens-pd
  delivery model (`[data-theme]` + `color-scheme` for dark mode, injected
  override CSS for brand), enrich every hand-authored story's `argTypes` with
  full controls + descriptions, and add a demo-only i18n message catalog so the
  locale toolbar can render localized (and RTL) sample content. Also adds the
  conventional `vite/client` type reference the package was missing. No change to
  the published component API.

## 0.22.0

### Minor Changes

- [#334](https://github.com/acronis/uikit/pull/334) [`fc1cb92`](https://github.com/acronis/uikit/commit/fc1cb92d406186b3a422c2a2ef3118f9631c7c73) Thanks [@leonid](https://github.com/leonid)! - Add `Avatar`: a circular user/entity badge showing an image or initials, in five
  color schemes (`teal` / `violet` / `red` / `yellow` / `orange`), themed by the
  `--ui-avatar-*` token tier. Ships `Avatar`, `AvatarImage`, `AvatarFallback`
  (Base UI Avatar under the hood), and `AvatarGroup` for an overlapping row.

### Patch Changes

- Updated dependencies [[`fc1cb92`](https://github.com/acronis/uikit/commit/fc1cb92d406186b3a422c2a2ef3118f9631c7c73)]:
  - @constructor-lab/tokens-pd@1.7.0

## 0.21.2

### Patch Changes

- Updated dependencies [[`878689b`](https://github.com/acronis/uikit/commit/878689b7fe7d62ba297381857249fe1e9c4cef88)]:
  - @constructor-lab/tokens-pd@1.6.0

## 0.21.1

### Patch Changes

- Updated dependencies [[`0d66857`](https://github.com/acronis/uikit/commit/0d66857127ac07df5ae5cbe95fbad6c7bc81e76d)]:
  - @constructor-lab/tokens-pd@1.5.0

## 0.21.0

### Minor Changes

- [#314](https://github.com/acronis/uikit/pull/314) [`360d80e`](https://github.com/acronis/uikit/commit/360d80efc543e9d4b1c1e4b8bd5b4d52312175cb) Thanks [@leonid](https://github.com/leonid)! - Rewire components to the next-gen token tiers shipped by the Figma sync and add a
  multiline text-area.

  ### Fixed — components were binding to `--ui-*` variables that no longer exist
  - **Radio** — rewired from the legacy `--ui-form-*` tier (never shipped) to the
    dedicated `--ui-radio-*` tier, with each box/icon state wired to its own token
    (mirrors Checkbox).
  - **Search** — rewired from `--ui-form-*` to `--ui-input-search-*`.
  - **Input** — remapped from the old `--ui-input-{global,normal,content,error}-*`
    names to `--ui-input-text-*` (incl. `content-value` → `global-value-color`,
    `content-placeholder` → `global-placeholder-color`, `error-*` → `error-msg-*`).
  - **SidebarSecondary** — re-themed for the redesigned tier: the per-state
    menu-item icon/label colors collapsed to single `…-color-color` tokens,
    `container-height` → `container-height-min`, section-header padding renamed; the
    removed inter-section divider and dedicated level-2 indent tokens are dropped
    (the level-2 indent is now derived from surviving tokens).

  `Radio` and `InputSearch` token tiers are now imported in `src/styles/index.css`
  so their custom properties resolve.

  ### Added
  - **InputTextArea** — new multiline text-area component themed by the
    `--ui-input-text-area-*` tier.

  ### Known gap
  - **Select** still binds to the legacy `--ui-form-*` tier; `tokens-pd` ships no
    `--ui-select-*` tier yet, so it is left stranded and documented in-source until
    those tokens land.

## 0.20.1

### Patch Changes

- Updated dependencies [[`6d9bf1a`](https://github.com/acronis/uikit/commit/6d9bf1ae0ca447ae7ed5ee6d1e91b776edff6bde)]:
  - @constructor-lab/tokens-pd@1.4.0

## 0.20.0

### Minor Changes

- [#300](https://github.com/acronis/uikit/pull/300) [`7782af7`](https://github.com/acronis/uikit/commit/7782af7c4ea61728edc65b6c2d6d3b19e720ec63) Thanks [@leonid](https://github.com/leonid)! - Add `ButtonDropdown`: a button that opens a dropdown menu — a label followed by a
  chevron that flips up while `open`. Two variants (`primary` solid / `secondary`
  bordered) across idle, hover, open, and disabled states, wired to the
  `--ui-button-dropdown-*` tokens. The `open` prop drives the chevron direction,
  the open (`*-active`) treatment, and `aria-expanded`; compose it with a menu
  trigger via the `render` prop.

### Patch Changes

- Updated dependencies [[`7782af7`](https://github.com/acronis/uikit/commit/7782af7c4ea61728edc65b6c2d6d3b19e720ec63)]:
  - @constructor-lab/tokens-pd@1.3.0

## 0.19.0

### Minor Changes

- [#305](https://github.com/acronis/uikit/pull/305) [`431b331`](https://github.com/acronis/uikit/commit/431b3317636131fd85a24b5fb7501986529767ce) Thanks [@leonid](https://github.com/leonid)! - `Tag`: migrate to the dedicated `--ui-tag-*` component tier and add an `ai`
  variant. Each variant now wires its container fill, border, label, and icon to
  `--ui-tag-<variant>-*` (previously the shared `--ui-background-status-*` /
  `--ui-border-on-status-*` / `--ui-text-on-status-*` semantic tokens), and
  geometry (radius, border width, gap, padding, max/min width, heights, icon size)
  comes from `--ui-tag-global-*`. The new `ai` variant paints a gradient border
  over a tinted fill. `size` now only changes the height; padding is uniform.

## 0.18.0

### Minor Changes

- [#303](https://github.com/acronis/uikit/pull/303) [`53fe8ef`](https://github.com/acronis/uikit/commit/53fe8ef946f4486bad3bea68551d13a81d96dcbf) Thanks [@leonid](https://github.com/leonid)! - Re-theme `Switch` against the next-gen tokens and add an optional `label`.
  - Fixed dead token refs: the track and thumb fills referenced
    `--ui-switch-{off,on}-box-{state}` / `--ui-switch-global-tick-{state}`, which
    were renamed to `*-box-color-{state}` / `*-tick-color-{state}` — so the track
    and thumb silently fell back to inherited colors. Now wired to the current
    `--ui-switch-*` tokens.
  - Added an optional `label` prop. When provided, the toggle and its label
    compose a clickable `<label>` row (wired via aria-labelledby) using
    `--ui-switch-global-{container-gap,label-color}`. With no label, the bare
    toggle renders as before — name it with `aria-label`.
  - Corrected Code Connect to the real Figma props (variant/state/label).

## 0.17.0

### Minor Changes

- [#301](https://github.com/acronis/uikit/pull/301) [`9a20554`](https://github.com/acronis/uikit/commit/9a205544dea2f16a3091828d2955d0175d6e2917) Thanks [@leonid](https://github.com/leonid)! - Re-theme `Checkbox` against the next-gen tokens and grow it into the full Figma
  field.
  - Fixed dead token refs: the box fill and glyph referenced `--ui-checkbox-*-box-{state}`
    / `--ui-checkbox-*-icon-{state}`, which were renamed to `*-box-color-{state}` /
    `*-icon-color-{state}` — so fills and glyphs silently fell back to inherited
    colors. Every state (unchecked / checked / indeterminate × idle / hover / active
    / disabled) is now wired to its current `--ui-checkbox-*` token.
  - Added optional `label` and `description` props. When provided, the box, label,
    and description compose a clickable `<label>` row (wired via aria-labelledby /
    aria-describedby) using the `--ui-checkbox-global-{label,description,container}-*`
    tokens. With neither, the bare box renders as before — name it with `aria-label`.

## 0.16.4

### Patch Changes

- [#294](https://github.com/acronis/uikit/pull/294) [`2acfc52`](https://github.com/acronis/uikit/commit/2acfc52d686114c9a97a560b8ce4db4b393f64d5) Thanks [@leonid](https://github.com/leonid)! - Fix `Button` colors: wire every variant's container fill, label, and icon to the
  renamed `--ui-button-*-color-*` tokens (the next-gen token sync added a `-color-`
  segment — e.g. `--ui-button-primary-container-idle` → `…-container-color-idle`).
  The component still referenced the old names, which no longer exist in
  `@constructor-lab/tokens-pd`, so every variant rendered with no fill/text color.
  Border, geometry, and padding tokens were already correct and are unchanged.

## 0.16.3

### Patch Changes

- [#296](https://github.com/acronis/uikit/pull/296) [`77b1c3c`](https://github.com/acronis/uikit/commit/77b1c3c7110d58dbb5850f84b17bc4f508f32e38) Thanks [@leonid](https://github.com/leonid)! - Re-theme `ButtonIcon` against the next-gen Figma tokens. The component referenced
  renamed color tokens (`--ui-button-icon-global-container-idle` →
  `…-container-color-idle`, same for the icon color) that no longer existed, so
  fills and glyph colors silently fell back to inherited values. Each state is now
  wired to its current `--ui-button-icon-global-*` token.

  Adds a `variant` prop: `ghost` (borderless, the default — unchanged from the
  previous look) and `secondary` (a 1px container border from the
  `--ui-button-icon-secondary-container-border-color-*` tokens).

## 0.16.2

### Patch Changes

- Updated dependencies [[`cfd9945`](https://github.com/acronis/uikit/commit/cfd99452a21786ebdaa54e1138f231579895ad27)]:
  - @constructor-lab/tokens-pd@1.2.1

## 0.16.1

### Patch Changes

- [#289](https://github.com/acronis/uikit/pull/289) [`2488240`](https://github.com/acronis/uikit/commit/2488240bd78243d59626e45a958a34d86ef70757) Thanks [@leonid](https://github.com/leonid)! - Fix `Breadcrumb` link colors: wire link/ellipsis text to the renamed
  `--ui-breadcrumb-link-label-color-{idle,hover,active}` tokens (previously
  referenced the stale `--ui-breadcrumb-link-label-{idle,hover,active}` names,
  which no longer exist in `@constructor-lab/tokens-pd`, so links rendered with
  no color).

## 0.16.0

### Minor Changes

- [#283](https://github.com/acronis/uikit/pull/283) [`31cc6e7`](https://github.com/acronis/uikit/commit/31cc6e73168df4cd792e460b64eea17d60f83944) Thanks [@leonid](https://github.com/leonid)! - Add `SidebarPrimary` and `SidebarSecondary` — composable, next-gen sidebar
  components themed by the `--ui-sidebar-primary-*` / `--ui-sidebar-secondary-*`
  token tiers.

  Both are multi-part component families (mirroring the `Breadcrumb` pattern) with
  an `expanded` / `collapsed` model exposed as a controlled **and** uncontrolled
  prop (`expanded` / `defaultExpanded` / `onExpandedChange`), driven by a dedicated
  `…CollapseTrigger` part (the Figma "Collapse menu" affordance). The rail reflows
  width/padding/logo between states via the per-state metric tokens; collapsed-mode
  labels stay in the DOM as `sr-only` so icon-only rows keep an accessible name.
  - **`SidebarPrimary`** — `SidebarPrimary`, `…Header`, `…Content`, `…Footer`,
    `…Section`, `…Menu`, `…MenuItem` (cva `variant: selected | unselected`,
    recoloring container + icon + label per state), `…MenuItemExtras` (shortcut +
    external-link icon), `…CollapseTrigger`.
  - **`SidebarSecondary`** — adds a `…CollapsedBreadcrumb` (shown in rail mode),
    a `…SectionLabel`, and an expandable disclosure group (`…MenuSub` /
    `…MenuSubTrigger` / `…MenuSubContent` / `…MenuSubItem`) built on the Base UI
    `Collapsible` primitive, with a Level-2 indent. Its menu-item cva swaps only the
    container fill; icon/label use the shared global state tokens.

  Polymorphic link parts use Base UI `useRender` + `mergeProps` (no Radix
  `asChild`). Tokens-only (no hardcoded colors); the focus ring reuses
  `--ui-focus-brand`. `ui-react/styles` imports the two new
  `@constructor-lab/tokens-pd/css/Sidebar{Primary,Secondary}/acronis.css` tiers.
  Includes unit tests, Storybook stories (+ generated state stories), Figma Code
  Connect, ui-spec specs, and Docker visual-regression baselines.

## 0.15.4

### Patch Changes

- Updated dependencies [[`4e13963`](https://github.com/acronis/uikit/commit/4e139630719ebb51eedc99494b351aa657a75c78), [`4e13963`](https://github.com/acronis/uikit/commit/4e139630719ebb51eedc99494b351aa657a75c78)]:
  - @constructor-lab/tokens-pd@1.2.0

## 0.15.3

### Patch Changes

- [#273](https://github.com/acronis/uikit/pull/273) [`1ef2702`](https://github.com/acronis/uikit/commit/1ef27023038cbc4194dac666b4f020e105670b91) Thanks [@leonid](https://github.com/leonid)! - Refresh design tokens from Figma and migrate the component tier to the next-gen Figma component architecture.

  **Primitives / semantic (breaking, pre-1.0):** rename semantic `status-inverted.*` → `status-strong.*`, `inverted-surface.*` → `inverted.*`, and `border.on-status.*-dark` → `*-strong`. Add the `ink` palette, `units.size-20`, a `transparent.clear` stop, semantic `glyph.on-status.ai`, the `status-strong` background family, `background.status.ai{,-hover,-pressed}`, `background.brand.primary-focus`, and `typography.link.default` / `link.default-underline`. The `brand-b` mode is removed (its values were dropped upstream in Figma); `tokens-pd` no longer emits `brand-b.css` / `brand-b` presets.

  **Component tier (breaking, pre-1.0):** the component tokens now source the next-gen `brand.components` Figma tier instead of the retired `componentLegacy` group. Components emitted: `breadcrumb`, `button`, `button-icon`, `checkbox`, `input`, `menu-item`, `sidebar-primary`, `sidebar-secondary`, `switch`, `tag`, `tooltip` (plus `icon` / `tree`, retained from legacy — no next-gen equivalent yet). This replaces the previous `chip` / `form` / `sidebar` / `item` components.

  Naming follows the next-gen contract ("Option A — faithful"): PascalCase component → kebab (`ButtonIcon` → `button-icon`), camelCase leaf → kebab (`borderRadius` → `border-radius`, `paddingX` → `padding-x`), `_global` → `global`, and the redundant `color` property word is dropped for color tokens only (`Button/ai/container/color/idle` → `--ui-button-ai-container-idle`; compound names like `borderColor` keep their suffix → `border-color`). The token shape is deeply nested: `<component>-<variant|global>-<role>-<property>[-<state>]`.

  The `colors.background.ai.*` gradients keep their intended **horizontal** (`90deg`) orientation; component AI references (`button.ai.*`, `tag.ai.*`) resolve to them via an alias rewrite (`{semantics.gradients.ai.*}` → `colors.background.ai.*`). `textStyle` literals resolve to `typography.*`.

  **Known gaps (warned, not fatal):** 8 `$type:string` component tokens are skipped because the token schema has no `string` type — `Button.*.container.borderStyle` (`"solid"`), `Switch._global.box.borderStyle`, and `Button.ghost.label.textDecoration.*` (`"underline"`/`"none"`); consumers hard-code these for now. Fully-transparent `#FF00FF00` stops inline as `rgb(255 0 255 / 0)` (hue irrelevant at alpha 0).

  Regenerated all `tokens-pd` artifacts (CSS, DTCG, Tailwind presets). The Tailwind preset builder skips unroutable component-tier color/gradient tokens with a warning instead of failing the build (semantic tokens still must route), so deeply-nested component roles (`box`, `tick`, `container`) stay in the CSS/tiers — consumers bind `var(--ui-*)` directly — but are omitted from the Tailwind preset.

  `ui-react`: re-theme the `Switch` and `Tooltip` components to the next-gen token names. `Tooltip` moves to `--ui-tooltip-container-border-radius`. `Switch` moves to the new `box`/`tick` model — track fill wired per checked-state (`--ui-switch-off-box-idle` / `--ui-switch-on-box-idle`, green), disabled to `--ui-switch-{on,off}-box-disabled` + `--ui-switch-global-tick-disabled` with a 1px inset `--ui-switch-global-box-border-color-disabled` border; the thumb is the single `--ui-switch-global-tick-*` color regardless of on/off (hover/active stops equal idle, so no hover color change). `ui-react/styles` swaps its dead `css/form` import for `css/input` + `css/checkbox` and adds `css/button-icon`.

  `ui-react` (continued): re-theme `Button`, `ButtonIcon`, `Breadcrumb`, `Checkbox`, and `Input` to the next-gen component tokens — they previously referenced dead token names (the retired `componentLegacy` / `--ui-form-*` tiers) and rendered unstyled. `Button` maps `background` → `container`, keeps `label`, adds per-state `icon` colors, and now only `secondary` / `inverted` carry a container border (others are borderless); geometry is tokenized via `--ui-button-global-container-*` and per-variant `padding-x` / `width-min` (`ghost` has 0 padding-x and no min-width). `ButtonIcon` moves to the borderless `--ui-button-icon-global-*` container/icon tokens. `Breadcrumb` moves to `link-label-<state>` (now darkening on hover/active), `page-label-color`, `separator-icon-{color,size}`, and `list-gap`. `Checkbox` moves to the dedicated `--ui-checkbox-{unchecked,checked,indeterminate}-box[-border-color]-<state>` + `-icon-` tiers with `global-box-*` geometry. `Input` moves to `--ui-input-{global-box,normal-box-border-color,error-box-border-color,content-value,content-placeholder}-*`. Visual-regression baselines regenerated in Docker for all re-themed components. Still pending: `Radio`, `Search`, `Select` remain on the removed `--ui-form-*` tier (Figma has no next-gen tokens for them yet) — a design prerequisite, tracked separately.

- Updated dependencies [[`1ef2702`](https://github.com/acronis/uikit/commit/1ef27023038cbc4194dac666b4f020e105670b91)]:
  - @constructor-lab/tokens-pd@1.1.0

## 0.15.2

### Patch Changes

- Updated dependencies [[`d95fc1e`](https://github.com/acronis/uikit/commit/d95fc1e809f3f4fe0c62f0c92d0f48b81976765d)]:
  - @constructor-lab/tokens-pd@1.0.0

## 0.15.1

### Patch Changes

- Updated dependencies [[`9ce1b45`](https://github.com/acronis/uikit/commit/9ce1b4585571aa96c136d200489d0939749b2ece)]:
  - @constructor-lab/icons-react@0.4.0

## 0.15.0

### Minor Changes

- [#262](https://github.com/acronis/uikit/pull/262) [`78fe4ff`](https://github.com/acronis/uikit/commit/78fe4ff0699510e787ac32a299864d7c80c09e1c) Thanks [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)! - Add ui-react Tooltip controlled/delay coverage and a portal container escape hatch on `TooltipContent` via the new `portalContainer` prop.

## 0.14.0

### Minor Changes

- [#255](https://github.com/acronis/uikit/pull/255) [`c11f987`](https://github.com/acronis/uikit/commit/c11f9878b8920259223a4622dd0efc96d6a83d2a) Thanks [@leonid](https://github.com/leonid)! - **Button: removed the `size` prop.** The Figma button has a single size, so
  `Button` no longer accepts `size` (`sm` / `default` / `lg`) — it always renders
  the 32px-tall size (`h-8 px-3`). This is a breaking change for any consumer
  passing `size`; drop the prop. `ButtonIcon` is unaffected.

## 0.13.0

### Minor Changes

- [#253](https://github.com/acronis/uikit/pull/253) [`1a9281b`](https://github.com/acronis/uikit/commit/1a9281b69e4fe763fb742fcf9a802b87a76e1169) Thanks [@leonid](https://github.com/leonid)! - Add `Tooltip`: a contextual hint shown on hover/focus, built on the Base UI
  Tooltip primitive and themed with the `--ui-tooltip-*` tokens (dark bubble,
  light label, no arrow). Exports `Tooltip`, `TooltipTrigger`, `TooltipContent`,
  and `TooltipProvider` (shared open/close delays); `TooltipContent` takes
  `side` / `align` / `sideOffset` for placement.

## 0.12.0

### Minor Changes

- [#251](https://github.com/acronis/uikit/pull/251) [`e5ce3de`](https://github.com/acronis/uikit/commit/e5ce3de0d53d9c3bad17c1dba03a6a23777a115b) Thanks [@leonid](https://github.com/leonid)! - Add `Tag`: a compact status/category label with six variants (`info`,
  `success`, `warning`, `critical`, `danger`, `neutral`) across two sizes
  (`default`, `sm`) and an optional leading icon. Colors reference the shared
  semantic status tokens; the label truncates at the 256px max width.

  (The Figma "AI" variant is not included yet — its background tint has no design
  token, pending an upstream `--ui-background-status-ai` sync.)

### Patch Changes

- [#250](https://github.com/acronis/uikit/pull/250) [`d3541f9`](https://github.com/acronis/uikit/commit/d3541f9c40c5d12f1c464ad68bf42709b89948e5) Thanks [@leonid](https://github.com/leonid)! - Fix the AI background gradient to run **left-to-right** (90deg) instead of
  top-to-bottom, matching the Figma design. The `background.ai` gradient transform
  in design-tokens carried a stale vertical matrix (`[[0,1,0],[-1,0,1]]` → 180deg);
  it is now identity (`[[1,0,0],[0,1,0]]` → 90deg), and `tokens-pd` is regenerated.

  The AI `Button` variant now always leads with the `Sparkles` icon before its
  label, matching the Figma "Ai" button, and sets `bg-origin-border` so the
  gradient covers the full button box (previously a 1px sliver of the gradient's
  opposite end showed on the left and right border edges).

- Updated dependencies [[`d3541f9`](https://github.com/acronis/uikit/commit/d3541f9c40c5d12f1c464ad68bf42709b89948e5)]:
  - @constructor-lab/tokens-pd@0.7.3

## 0.11.1

### Patch Changes

- [#246](https://github.com/acronis/uikit/pull/246) [`4520292`](https://github.com/acronis/uikit/commit/4520292e06b6e4f6ca022c30ac96ed843f7e1ed1) Thanks [@leonid](https://github.com/leonid)! - Re-theme `Switch` to the design's `--ui-switch-*` token tier. It now matches the
  Figma component: a 32×16 track with a 12px circle, green `--ui-switch-background-active`
  (on) / `--ui-switch-background-inactive` (off) / dedicated disabled tokens
  (replacing the placeholder shadcn `bg-primary`/`bg-input` colors and
  `opacity-50` disabled), with a 3px `--ui-focus-primary` focus ring. No API
  change. Also completes the Figma Code Connect mapping.

## 0.11.0

### Minor Changes

- [#245](https://github.com/acronis/uikit/pull/245) [`0e5760d`](https://github.com/acronis/uikit/commit/0e5760d80ac4728826e20e7a0d64571a44a3c86b) Thanks [@leonid](https://github.com/leonid)! - Add `Select`: a composable select control built on the Base UI Select primitive
  and themed with the shared `--ui-form-*` token tier. Exports `Select`,
  `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`, `SelectGroup`, and
  `SelectGroupLabel`, with single/multiple selection, keyboard support, and a
  trigger matching the Figma "Select" states (idle / hover / open+focus /
  disabled).

## 0.10.0

### Minor Changes

- [#242](https://github.com/acronis/uikit/pull/242) [`fa22177`](https://github.com/acronis/uikit/commit/fa2217700b5dae6105c9c63c7d2e973d752d09a9) Thanks [@leonid](https://github.com/leonid)! - Add `Search`: a search field — a leading magnifier (`SearchIcon`), a borderless
  text input, and a clear (×) button that appears once there's a value. Themed by
  the shared `--ui-form-*` token tier; the box owns the visual state via
  `focus-within` (active border + 3px `--ui-focus-primary` ring), with hover and
  disabled wired to their own tokens. The clear button empties the field (firing
  `onChange` with an empty value plus `onClear`) and refocuses the input. Includes
  tests, Storybook stories, visual-regression baselines, and a Figma Code Connect
  mapping.

### Patch Changes

- Updated dependencies [[`a85d629`](https://github.com/acronis/uikit/commit/a85d6291933854a99af8825b985c325bfb80725c)]:
  - @constructor-lab/design-assets@0.4.0
  - @constructor-lab/icons-react@0.3.0

## 0.9.0

### Minor Changes

- [#240](https://github.com/acronis/uikit/pull/240) [`dbdc2fc`](https://github.com/acronis/uikit/commit/dbdc2fcb566b8aaf1f5ddb91d9d977051b65e9e7) Thanks [@leonid](https://github.com/leonid)! - Add `RadioGroup` and `Radio`: a mutually-exclusive option group wrapping Base
  UI's RadioGroup / Radio primitives. The group owns the selected value; each
  `Radio` takes a `value`. Themed by the shared `--ui-form-*` token tier from
  `@constructor-lab/tokens-pd` — the 16px circle uses idle / hover / active /
  disabled border + background, the 8px dot uses `--ui-form-circle-active` (and
  `--ui-form-circle-disabled` when disabled), and the focus ring uses
  `--ui-focus-primary`; the checked fill is scoped with `not-data-[disabled]` so
  disabled wins. Includes tests, Storybook stories, visual-regression baselines,
  and a Figma Code Connect mapping. Labels are composed by the consumer (a Field
  component is future work).

## 0.8.0

### Minor Changes

- [#237](https://github.com/acronis/uikit/pull/237) [`f0f4ab6`](https://github.com/acronis/uikit/commit/f0f4ab676513d1e4ec4d1014ce15a8ae0cf0b8c6) Thanks [@leonid](https://github.com/leonid)! - Add `Input`: a single-line text input themed by the shared `--ui-form-*` token
  tier from `@constructor-lab/tokens-pd`. Each state is wired to its own token —
  idle / hover / focus (active border + a 3px `--ui-focus-primary` ring) /
  disabled — and the error state is driven by `aria-invalid` (red border, and a
  `--ui-focus-error` ring on focus) scoped so it wins over the hover/focus border.
  Includes tests, Storybook stories, visual-regression baselines, and a Figma
  Code Connect mapping. Label / description / error message are composed by the
  consumer (a Field component is future work).

## 0.7.0

### Minor Changes

- [#235](https://github.com/acronis/uikit/pull/235) [`4fb8b2f`](https://github.com/acronis/uikit/commit/4fb8b2f3c0df84f49def85fa7cba7ee3d062ef66) Thanks [@leonid](https://github.com/leonid)! - Add `Checkbox`: a Base UI checkbox wrapper supporting checked, unchecked, and
  indeterminate states (check / minus glyphs). Colors and geometry are wired to
  the shared `--ui-form-*` token tier from `@constructor-lab/tokens-pd`, with the
  glyph tinted by `--ui-glyph-on-brand-primary` and the focus ring by
  `--ui-focus-primary`; the disabled state always wins over the checked /
  indeterminate fill. Includes tests, Storybook stories, visual-regression
  baselines, and a Figma Code Connect mapping. The `form` token tier is now
  imported in `src/styles/index.css`.

## 0.6.1

### Patch Changes

- [#233](https://github.com/acronis/uikit/pull/233) [`13fb696`](https://github.com/acronis/uikit/commit/13fb6960f699288ccb749d383e342a3dae7b62ab) Thanks [@leonid](https://github.com/leonid)! - Fix unstyled components: `src/styles/index.css` only imported the semantic
  token tier from `@constructor-lab/tokens-pd`, so the per-component token tiers
  (opt-in) were never loaded and every `--ui-button-*` / `--ui-button-icon-*` /
  `--ui-switch-*` / `--ui-breadcrumb-*` reference resolved to nothing. Import the
  `button`, `switch`, and `breadcrumb` component tiers so the shipped library CSS
  (`@constructor-lab/ui-react/styles`) actually carries the component tokens.

## 0.6.0

### Minor Changes

- [#231](https://github.com/acronis/uikit/pull/231) [`f16d691`](https://github.com/acronis/uikit/commit/f16d691de54cec590b095b639da303e5b5cd3d20) Thanks [@leonid](https://github.com/leonid)! - Add `Breadcrumb`: a composable set of breadcrumb primitives (`Breadcrumb`,
  `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`,
  `BreadcrumbSeparator`, `BreadcrumbEllipsis`). Links are polymorphic via the
  Base UI `render` prop (e.g. a router `Link`); the current page is marked with
  `aria-current="page"`. Colors are wired to the `--ui-breadcrumb-*` tokens from
  `@constructor-lab/tokens-pd`, and the separator uses the 16px chevron-right
  icon. Includes tests, Storybook stories, and a Figma Code Connect mapping.

## 0.5.1

### Patch Changes

- Updated dependencies []:
  - @constructor-lab/tokens-pd@0.7.2

## 0.5.0

### Minor Changes

- [#210](https://github.com/acronis/uikit/pull/210) [`6d188d2`](https://github.com/acronis/uikit/commit/6d188d21e719a5af7ad7589f3f5227b32cfb4f53) Thanks [@leonid](https://github.com/leonid)! - Align Button with the Figma design and add a dedicated ButtonIcon component.

  **Button** now wires every style and interaction state directly to the
  dedicated `--ui-button-*` component tokens (from `@constructor-lab/tokens-pd`)
  instead of borrowing shared semantic tokens:
  - Disabled states use the design's explicit per-variant disabled colors instead
    of a blanket `opacity-50`.
  - The focus ring uses the `--ui-focus-*` tokens.
  - Secondary now uses its dedicated border/background/label tokens (previously a
    generic `border-border` + surface-hover), and Ghost is a plain colored-text
    button (the underline-on-hover was removed to match the design).

  **ButtonIcon** is a new icon-only button (32×32, 16px glyph) mirroring the Figma
  `ButtonIcon` component, wired to the `--ui-button-icon-*` tokens.

  **Breaking changes:**
  - Removed the non-design Button variants `outline`, `link`, and `translucent`.
    The supported variants are now `default` (Primary), `secondary`, `ghost`,
    `destructive`, `ai`, and `inverted`.
  - Removed the Button `size="icon"` option — use the new `ButtonIcon` component
    for icon-only buttons.

## 0.4.2

### Patch Changes

- Updated dependencies [[`8a72145`](https://github.com/acronis/uikit/commit/8a721459e35a405bdf9ef11489e86f68b61a821c), [`beae4ff`](https://github.com/acronis/uikit/commit/beae4ffd3dd4cd8742300c8906e7e18cef8693ee)]:
  - @constructor-lab/tokens-pd@0.7.1

## 0.4.1

### Patch Changes

- Updated dependencies [[`bd63c2a`](https://github.com/acronis/uikit/commit/bd63c2ae80bcab09acb1bc558d01951e2c38af83)]:
  - @constructor-lab/tokens-pd@0.7.0

## 0.4.0

### Minor Changes

- [#198](https://github.com/acronis/uikit/pull/198) [`8cbe6cf`](https://github.com/acronis/uikit/commit/8cbe6cfb891cf59a2fe3c006a0ef8a08d06806ee) Thanks [@leonid](https://github.com/leonid)! - Rename `@constructor-lab/design-theme` → `@constructor-lab/tokens-pd` and rebuild it from the Style Dictionary pipeline.

  **`@constructor-lab/tokens-pd` (was `@constructor-lab/design-theme`) — breaking:**
  - **Package renamed.** Update the dependency and all import specifiers from
    `@constructor-lab/design-theme` to `@constructor-lab/tokens-pd`.
  - **Homegrown build retired.** The package no longer runs its own Style
    Dictionary script; it is now the published home for the output of
    `@constructor-lab/style-dictionary`, which is generated and committed.
  - **Exports replaced.** The `./css`, `./scss`, and `./js` exports are removed.
    Output is grouped into `css/`, `tailwind/`, and `dtcg/` dirs.
    - `./css` → `./css/acronis.css` (semantic tier, default brand) and, per
      component, `./css/<component>/acronis.css`.
    - Non-default brands ship as **override-only** files (`./css/brand-b.css`,
      `./css/<component>/brand-b.css`) — import the base then the override (last wins).
    - `./scss` and `./js` (the `tokens`/`groups`/`TokenName` map) are dropped.
    - New: `./tailwind/<brand>.js` (Tailwind presets, baked values, via `@config`)
      and `./dtcg/*.json` (the DTCG intermediate).
  - **Custom-property naming changed.** The `--av-*` prefix is gone. Names now drop
    the `colors` tier segment and use a `--ui-*` prefix:
    `--av-colors-background-surface-primary` → `--ui-background-surface-primary`.
  - **Theming mechanism changed.** Light/dark is driven by `light-dark()` +
    `color-scheme`, toggled with the `[data-theme]` attribute (`<html
data-theme="dark">`) instead of a `.dark` class. Brands are bare `:root`
    overrides (no `.brand-b` class) — one brand per app.
  - **Gradients** are now emitted (`--ui-background-ai-*`), and typography ships as
    `.ui-typography-*` utility classes.

  **`@constructor-lab/ui-react`:**
  - Now themed by `@constructor-lab/tokens-pd` (was `@constructor-lab/design-theme`).
  - The `@theme inline` bridge maps onto the new `--ui-*` names; the `dark:` variant
    now keys off the `[data-theme="dark"]` attribute instead of the `.dark` class.
    Consumers that previously toggled a `.dark` class must switch to `data-theme`.
  - The `ai` button variant's gradient (`--ui-background-ai-*`) is now defined.

### Patch Changes

- Updated dependencies [[`8cbe6cf`](https://github.com/acronis/uikit/commit/8cbe6cfb891cf59a2fe3c006a0ef8a08d06806ee)]:
  - @constructor-lab/tokens-pd@0.6.0

## 0.3.1

### Patch Changes

- Updated dependencies []:
  - @constructor-lab/design-theme@0.5.1

## 0.3.0

### Minor Changes

- [#94](https://github.com/acronis/uikit/pull/94) [`9e418d6`](https://github.com/acronis/uikit/commit/9e418d6fb7e4e52182e96dc26418daf82fde8c25) Thanks [@leonid](https://github.com/leonid)! - Add Figma Code Connect support to `ui-react` and align the Button with the
  Figma "Button" component.
  - **`ui-react`**: new Figma Code Connect setup (`figma.config.json`,
    co-located `*.figma.tsx` files, `figma:connect*` scripts) linking
    components to their Figma counterparts. The `Button` is fully connected and
    its variants now match the Figma `Style` set: added `ai` (gradient) and
    `inverted` variants, and re-pointed `default` / `secondary` / `ghost` /
    `destructive` to the colors used in the mockup via button-local
    `--color-btn-*` token bridges (the shared `--color-*` tokens are unchanged).
    The legacy-only `outline` / `link` / `translucent` variants are retained for
    parity with the shared demos.
  - **`design-tokens`**: added the `colors.background.inverted-surface` semantic
    tokens (idle / hover / active / disabled) that back the inverted button.
  - **`design-theme`**: emits the new
    `--av-colors-background-inverted-surface-*` custom properties.

### Patch Changes

- Updated dependencies [[`9e418d6`](https://github.com/acronis/uikit/commit/9e418d6fb7e4e52182e96dc26418daf82fde8c25)]:
  - @constructor-lab/design-theme@0.5.0

## 0.2.3

### Patch Changes

- Updated dependencies [[`61fe683`](https://github.com/acronis/uikit/commit/61fe68389b42f482fe9f7a07ab0f14ebad6c12d1)]:
  - @constructor-lab/design-theme@0.4.0

## 0.2.2

### Patch Changes

- Updated dependencies [[`61fe683`](https://github.com/acronis/uikit/commit/61fe68389b42f482fe9f7a07ab0f14ebad6c12d1)]:
  - @constructor-lab/design-theme@0.3.0

## 0.2.1

### Patch Changes

- [#84](https://github.com/acronis/uikit/pull/84) [`3b3fe78`](https://github.com/acronis/uikit/commit/3b3fe7852bbff8c50009648fe49fccbda9526bf2) Thanks [@leonid](https://github.com/leonid)! - Add `@constructor-lab/icons-react` — React icon components generated from
  `@constructor-lab/design-assets`. Ships all four packs via subpath exports
  (`./stroke-mono`, `./solid-mono`, `./stroke-multi`, `./solid-multi`) as
  tree-shakeable per-icon named exports plus an `icons` registry + `IconName`
  type per pack.
  - **mono** packs collapse to `currentColor` (inherit text color); **multi**
    packs keep their authored colors (gradient/clip ids are namespaced per icon
    to avoid collisions).
  - The design-assets scale + stroke rules are baked into a `size` prop, so a
    single 24px master renders at any size with the designed stroke weight
    (1.6px @16, 2px @24, 2.5px @32).

  `@constructor-lab/ui-react` now depends on it so components and stories can
  compose icons (e.g. `<Button><PlusIcon /> Add</Button>`).

- Updated dependencies [[`3b3fe78`](https://github.com/acronis/uikit/commit/3b3fe7852bbff8c50009648fe49fccbda9526bf2)]:
  - @constructor-lab/icons-react@0.2.0

## 0.2.0

### Minor Changes

- [#80](https://github.com/acronis/uikit/pull/80) [`1687cc9`](https://github.com/acronis/uikit/commit/1687cc9336de74d53521d8e6ef9097763a0a9bb0) Thanks [@leonid](https://github.com/leonid)! - Introduce two new published packages:
  - `@constructor-lab/design-theme` — generates consumable CSS / SCSS / JS theme
    artifacts from `@constructor-lab/design-tokens` via Style Dictionary, resolving
    the per-scheme (light/dark) and per-brand token matrix into `--av-*` CSS
    custom properties.
  - `@constructor-lab/ui-react` — the next-generation React
    UI Components library built on Base UI (`@base-ui/react`) and themed by
    `@constructor-lab/design-theme`. Ships `Button` and `Switch` with tests and
    Storybook stories as the reference pattern.

### Patch Changes

- Updated dependencies [[`1687cc9`](https://github.com/acronis/uikit/commit/1687cc9336de74d53521d8e6ef9097763a0a9bb0)]:
  - @constructor-lab/design-theme@0.2.0
