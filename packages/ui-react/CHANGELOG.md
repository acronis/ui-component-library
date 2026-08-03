# @constructor-lab/ui-react

## 2.7.0

### Minor Changes

- [#97](https://github.com/constructor-lab/ui-component-library/pull/97) [`203e91b`](https://github.com/constructor-lab/ui-component-library/commit/203e91bf3ecf9a8998cf74530dc227d086824fbd) Thanks [@leonid](https://github.com/leonid)! - Every elevated surface now carries the design's shadow.

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

### Patch Changes

- Updated dependencies [[`203e91b`](https://github.com/constructor-lab/ui-component-library/commit/203e91bf3ecf9a8998cf74530dc227d086824fbd)]:
  - @constructor-lab/tokens@4.0.0

## 2.6.0

### Minor Changes

- [#93](https://github.com/constructor-lab/ui-component-library/pull/93) [`d0397f4`](https://github.com/constructor-lab/ui-component-library/commit/d0397f49f4e8f305d1606c306d0f0690b6fb70ec) Thanks [@leonid](https://github.com/leonid)! - Bind `Toast` to its own `--ui-toast-*` token tier and add the design's `critical`
  status.

  The component themed from the shared semantic status vocabulary, so the generated
  `--ui-toast-*` tier had no consumer and a brand re-pointing any of its values
  changed nothing. Every card metric now comes from the tier (surface, radius,
  border width, min-width, paddings, gaps, status-bar width, icon box, content and
  actions metrics) plus the per-status `border-color` / `left-line` pairs, and the
  dismiss control sits on the ButtonIcon tier.

  Reconciled against Figma node `7421:126262` in the process:

  - **New `toast.critical(...)`** (and `'critical'` on `ToastType`) — the design's
    fifth status, between `warning` and `error`. `error` keeps its name and binds
    the design's `danger` tokens.
  - The status bar now overlays the card's leading edge instead of taking layout
    width, so the text keeps the container's `paddingX` from the card edge.
  - An action button aligns with the text instead of with the icon.
  - The title uses the design's applied `headings/body-heading` style (16/500).
  - The dismiss glyph is `TimesSmall`, the design's mark; plain `Times` filled the
    32px box and read far too heavy.
  - The dismiss control and the action are instances of shipped components in the
    design, so they now render the ghost variants of `ButtonIcon` and `Button`.
    The action had been hand-styled onto ButtonIcon's _icon_ colour as a label
    colour, with no hover/active/disabled state bound at all; it now takes the
    ghost label tokens and the design's 32px height.

## 2.5.1

### Patch Changes

- Updated dependencies [[`01f6031`](https://github.com/constructor-lab/ui-component-library/commit/01f6031cde2d7b92ea3819c4e78354591efbfa2c)]:
  - @constructor-lab/tokens@3.1.2

## 2.5.0

### Minor Changes

- [#86](https://github.com/constructor-lab/ui-component-library/pull/86) [`48e191d`](https://github.com/constructor-lab/ui-component-library/commit/48e191ddf43eab38e6a11263de373104113c52c9) Thanks [@leonid](https://github.com/leonid)! - `Calendar` reconciled with its design, on a real `--ui-calendar-*` tier

  Figma node 8148:10167 defines a `components/Calendar/*` variable tier that
  `@constructor-lab/tokens` had never emitted (`Calendar` was missing from the
  token-emit allowlist), so the v1 port approximated the design with semantic
  tokens. With the tier emitted, the component now binds it — and follows the
  design's anatomy, which changes several defaults:

  - **The caption is two `InputSelect`s** (month + year) and the chevron nav is
    hidden, because that is how the design navigates. `captionLayout="label"`
    restores react-day-picker's caption label plus prev/next buttons.
  - **Weeks start on Monday** (`weekStartsOn` defaults to `1`) with two-letter
    weekday labels. A `locale` still overrides both.
  - **`mode="range"` shows two months** side by side (`numberOfMonths` defaults to
    2 in that mode).
  - **The panel is bordered**: container fill, 1px border and 4px radius, a ruled
    caption band and a padded body band.
  - **Day cells are the tier's 32×32 box** — transparent idle, surface-hover on
    hover, the active fill when selected, with value colors split
    primary / secondary (outside) / active / disabled and tabular numerals.
  - **`footer` is banded with the Footer tier**, for the design's Cancel/Apply row
    on the multiple and range variants. The buttons stay the host's.
  - **Today no longer carries a marker.** The v1 port underlined it; the design's
    item has idle / hover / active / disabled and no today state. The cell is still
    marked `.rdp-today`, so a host that wants a marker can style it.

### Patch Changes

- [#86](https://github.com/constructor-lab/ui-component-library/pull/86) [`1ad4a81`](https://github.com/constructor-lab/ui-component-library/commit/1ad4a8152d91515c14f87a1094c82c7291c43117) Thanks [@leonid](https://github.com/leonid)! - List popups scroll in a `ScrollArea` instead of a native gutter

  `InputSelect` (and its `Select` alias), `Combobox` and `Autocomplete` dropped
  `overflow-y-auto` on the Base UI popup in favour of the kit's `ScrollArea`. Its
  overlay scrollbar reserves **zero** layout space, so the full-bleed item rows keep
  their edge-to-edge background instead of being inset by a native scrollbar gutter
  on platforms that reserve one — the same reason `SidebarPrimary`,
  `SidebarSecondary`, `Table` and `Tree` already use it. It also makes the bar
  consistent with those regions: token-coloured, revealed on hover/scroll.

  The height bound moved with it, onto the scroll **viewport** rather than the
  popup. That placement matters: `ScrollArea`'s root is `height: auto`, so a
  max-height there leaves the viewport's `height: 100%` unresolved, the viewport
  grows to the full content height, and the overflow is clipped away unreachable
  with no scrollbar at all.

  Keyboard behaviour is unchanged — Base UI's scroll-into-view walks the new
  scrollable ancestor. Verified in a browser for all three: driving the highlight to
  the last item scrolls the viewport to exactly its maximum and leaves that item in
  view (`InputSelect` via `End`, `Combobox`/`Autocomplete` via `ArrowUp` wrap-around).

- Updated dependencies [[`0b329d6`](https://github.com/constructor-lab/ui-component-library/commit/0b329d6fb0bed12ce96624b48ec96fd527e12be9)]:
  - @constructor-lab/tokens@3.1.1

## 2.4.0

### Minor Changes

- [#72](https://github.com/constructor-lab/ui-component-library/pull/72) [`cc33034`](https://github.com/constructor-lab/ui-component-library/commit/cc33034391780f1f83823c16e9a6c00aa7f14335) Thanks [@leonid](https://github.com/leonid)! - feat(alert): reconcile against the redesigned Figma (node 6768-67288)

  Restyle `Alert` to the new design language — non-breaking (all 7 variants and all
  exports retained):

  - **White surface** (`bg-background`) with a **strong status border**
    (`--ui-border-on-status-*-strong`) and a **6px left accent bar** in the strong
    status background (`--ui-background-status-strong-*`) — replacing the previous
    pale status fill.
  - **Variant-driven full-color status icon**: an empty `<AlertIcon />` now renders
    the variant's default multicolor glyph (CircleInfoBlue, CircleCheckGreen,
    TriangleWarningYellow, CircleWarningOrange, DiamondWarningRed, CircleMinusGray,
    AcronisAiMulti); pass children to override.
  - **Compact dismiss button**: `AlertClose` is now a 32px `ButtonIcon` (neutral
    glyph, hover surface, focus ring) instead of a full-height edge cell.
  - `ai` keeps its branded treatment (pale border + gradient accent bar) since it
    has no solid `-strong` token pair.

  Code Connect completed against the new node; ui-spec (anatomy/tokens/index)
  updated; visual-regression baselines regenerated.

- [#61](https://github.com/constructor-lab/ui-component-library/pull/61) [`b85e708`](https://github.com/constructor-lab/ui-component-library/commit/b85e708e6fba897b2886b240f40a4d50744aea7e) Thanks [@leonid](https://github.com/leonid)! - feat(app-shell): add `AppShellPanel` right-rail region for the AI/chat panel

  The Figma app-shell layouts (Basic layout node 6226-24149, Inner page node
  6226-24150) model the shell as a three-region row — sidebars, body, and a
  right-hand "Acronis AI" chat rail — but `AppShell` only had the sidebar + body
  columns. `AppShellPanel` is the new `<aside>` for that rail.

  The panel has a built-in three-way state — `docked` (fixed rail), `collapsed`
  (~48px icon rail), and `full` (fills the body, which hides). Because the panel
  and the body coordinate, the state lives on the `AppShell` root
  (`panelState` / `defaultPanelState` / `onPanelStateChange`, controllable) and is
  shared via context. New parts drive it: `AppShellPanelContent` (docked/full),
  `AppShellPanelCollapsed` (the rail), `AppShellPanelTrigger` (`to`-target button),
  and the `useAppShell()` hook. The AppShell stories are rebuilt to cover every
  unique layout state from both mockups (primary expanded/collapsed, one or two
  secondary panels — the tertiary role, chat docked/collapsed/full/absent, and the
  inner-page breadcrumb variants).

- [#78](https://github.com/constructor-lab/ui-component-library/pull/78) [`dffb78e`](https://github.com/constructor-lab/ui-component-library/commit/dffb78e4fd3e711c1fe0181494a69bfe8f85585a) Thanks [@leonid](https://github.com/leonid)! - Add `AreaChart` — a typed area-chart composition over the shared `Chart`
  primitives. Takes `data` + `config` + `dataKeys` + `xKey` and renders a themed
  recharts `AreaChart` with tooltip, legend, axes, and grid. Variants: `layout`
  (single / stacked) and `fill` (solid / gradient). Supports `curve`, `strokeWidth`,
  `fillOpacity`, `showDots`, `connectNulls`, axis titles + a Y unit, chrome toggles,
  and a `tooltipContent` passthrough. Series colors bind to the theme-invariant
  `--ui-chart-*` palette.

- [#79](https://github.com/constructor-lab/ui-component-library/pull/79) [`9bf46c4`](https://github.com/constructor-lab/ui-component-library/commit/9bf46c40d12a9071f2abe7ba4b37efac3676d364) Thanks [@leonid](https://github.com/leonid)! - `Avatar`: expose all eight color schemes the `--ui-avatar-*` tier emits. The
  token tier defines `--ui-avatar-color-*` / `--ui-avatar-label-color-*` for
  `blue`, `gray` and `green` as well, but `avatarVariants` only surfaced five
  (`teal`, `violet`, `red`, `yellow`, `orange`) — so those six tokens were dead:
  emitted by the pipeline and referenced by nothing. Widening the enum is purely
  additive (no existing `color` value changes meaning or rendering) and needs no
  token work.

- [#78](https://github.com/constructor-lab/ui-component-library/pull/78) [`b0ca626`](https://github.com/constructor-lab/ui-component-library/commit/b0ca6261f7d472ac4137b23ab34aedd17ab0c3a8) Thanks [@leonid](https://github.com/leonid)! - Add `BarChart` — a typed bar-chart composition over the shared `Chart`
  primitives. Takes `data` + `config` + `dataKeys` + `xKey` and renders a themed
  recharts `BarChart` with tooltip, legend, axes, and grid. Variants: `orientation`
  (vertical / horizontal) and `layout` (grouped / stacked). Supports dashed
  reference/average lines, axis titles + unit suffixes, chrome toggles
  (`showGrid` / `showTooltip` / `showLegend`), a `barRadius`, and a `tooltipContent`
  passthrough. Series colors bind to the theme-invariant `--ui-chart-*` palette.

- [#82](https://github.com/constructor-lab/ui-component-library/pull/82) [`6fa6462`](https://github.com/constructor-lab/ui-component-library/commit/6fa6462449e01f48a12f0d747b6f045621f0c465) Thanks [@leonid](https://github.com/leonid)! - Add `ButtonIconInput` and `InputPassword`, the two components behind the Track 3
  token tiers.

  `ButtonIconInput` is the 20×20 icon affordance that lives inside an input box (a
  clear ✕, a reveal eye, a search trigger) — a distinct component from
  `ButtonIcon`, not a size of it: a smaller container, 2px padding around a 16px
  glyph, and a `normal` / `error` variant so the affordance follows its field into
  the error treatment (including the focus ring, which switches to
  `--ui-focus-error`).

  `InputPassword` is the password field: label, required marker, masked box, the
  reveal toggle, and a description or error message. It consumes its own
  `--ui-input-password-*` tier rather than the `Input` primitive's
  `--ui-input-text-*` one, and its box reserves inline-end room for the toggle
  computed from tokens. The reveal state is uncontrolled by default and can be
  driven via `revealed` / `onRevealedChange`.

- [#78](https://github.com/constructor-lab/ui-component-library/pull/78) [`b0c8132`](https://github.com/constructor-lab/ui-component-library/commit/b0c8132510ed1d5e05e1d7f47ba0ddc33f355bfd) Thanks [@leonid](https://github.com/leonid)! - Add `ChartState` — a shared loading / empty / error placeholder for the chart
  types, rendered in place of a chart inside the same sized slot. A compact status
  block (spinner / inbox / warning glyph over a centered label) with an optional
  retry action for the error state. Themes from the status/text semantic tokens;
  the `--ui-chart-*` data-viz palette is deliberately reserved for series identity.

- [#80](https://github.com/constructor-lab/ui-component-library/pull/80) [`b328219`](https://github.com/constructor-lab/ui-component-library/commit/b3282192a3e504fb7ecd0f61aad843cc52aa7f71) Thanks [@leonid](https://github.com/leonid)! - Add `ComposedChart` — a typed composed (mixed) chart over the shared `Chart`
  primitives. Plots a `series` list over one shared category axis where each entry
  picks its own render `type` (bar / line / area), with tooltip, legend, axes, and
  grid. Series render in array order (later entries paint on top). Supports `curve`,
  `barRadius`, `fillOpacity`, axis titles + a Y unit, chrome toggles, and a
  `tooltipContent` passthrough. No CVA variants (the mix is data-driven). Series
  colors bind to the theme-invariant `--ui-chart-*` palette.

- [#80](https://github.com/constructor-lab/ui-component-library/pull/80) [`8ecbd99`](https://github.com/constructor-lab/ui-component-library/commit/8ecbd9904170ad84bb8750c1961d1b521e62409a) Thanks [@leonid](https://github.com/leonid)! - Add `ConfidenceCone` — a typed forecast/uncertainty chart over the shared
  `Chart` primitives. Plots a central estimate (`valueKey`) as a line inside a
  shaded band between `lowerKey` and `upperKey` (a range `Area` fed a
  `[lower, upper]` tuple) — the widening cone of a projection — with an optional
  dashed `forecastStart` divider, tooltip, and legend. No variant axis — its
  expressiveness is the data mapping plus `bandOpacity` / `curve` / chrome toggles
  and a `tooltipContent` passthrough. The line + band bind to the theme-invariant
  `--ui-chart-*` palette; the divider/axes/chrome resolve to semantic tokens.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - feat(data-grid): actions grouped form and preset normalization (P0.7)

  Completes the grouped-config normalization with the last delivered group and the
  preset layer above it.

  `actions` now matches the design's union: `false | DataGridActionsConfig`, where
  the config carries **exactly one** of `items` (the built-in menu) or `render`
  (a typed escape hatch owning the whole cell), plus `placement` and `onAction`.
  The custom renderer gets the same propagation isolation as the menu — its
  controls never toggle row selection or fire the row click/activate handlers — and
  the cell now justifies to the side `placement` puts the column on. Development
  validation reports action items combined with a renderer, and duplicate item ids.

  `presets` adds named grouped-config bundles:

  ```tsx
  presets={{
    definitions: [{ id: 'reviewable', config: { selection: { mode: 'multiple' }, … } }],
    apply: ['reviewable'],
    detect: ({ columns, rows }) => (rows.length > 20 ? ['paged'] : []),
  }}
  ```

  Precedence rises with explicitness: detected presets apply first, then `apply`
  left-to-right (later writes win), then any group the caller supplied — by grouped
  prop **or** deprecated alias — which a preset never overrides. That last rule
  also means a preset can't manufacture a spurious grouped-vs-alias duplicate
  warning. `detect` runs exactly once against the initial columns/rows, so it can
  never observe mutable state. Development validation reports an applied preset
  that is not defined and a preset carrying anything but a grouped config
  (`state`, `defaultState`, `server`, `columns`, `rows`, `callbacks`).

  `DataGridProps` now extends the new exported `DataGridGroupedConfig`, so the prop
  surface and what a preset may set cannot drift. `DataGridGroupedConfig`,
  `DataGridPreset`, `DataGridPresetsInput`, `DataGridFiltersConfig`,
  `DataGridPaginationConfig`, and `DataGridToolbarConfig` are exported.

  Remaining P0.7 (follow-up): the P1 feature groups (`detailExpansion`, `tree`,
  `grouping`, `virtualization`, `columnsFeatures`, `persistence`, `footer`), the
  required-`getRowId` API change, and the `table-view`/`data-table` screen
  migrations.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - feat(data-grid): chrome ownership + config validation (P0.7, partial)

  - New `chrome` prop implements canonical chrome ownership (design §5.1). It
    defaults to built-in (DataGrid renders its toolbar, filters, bulk bar, and
    pagination). `chrome.mode="external"` keeps the engine state but suppresses
    every built-in control and calls `render(context)` with the shared controller
    plus the current selection, query, and state — so a screen composes its own
    toolbar/pagination without a second engine. The empty/error rows and footer
    stay inside the table. `DataGridChrome` and `DataGridChromeContext` are
    exported.
  - Development-time validation of invalid combinations: `chrome.mode="external"`
    with `toolbar`/`searchKey`, and bulk actions without multiple selection, each
    emit a descriptive `console.error`.
  - The DataGrid public type continues to expose neither `engineOptions` nor
    `plugins` (advanced engine extension stays on custom DataTable composition),
    now covered by the table-family public-type characterization test.

  Story added: `ExternalChrome`.

  Remaining P0.7 (its own pass): the full 16-group grouped-config normalization
  with precedence/presets, deprecated-alias→grouped duplicate errors, and the
  `table-view` / `data-table` screen migrations.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - DataGrid: `columnsFeatures` gains its header chrome — a resize handle, a reorder
  grip, keyboard operation, and one live region per grid.

  With `columnsFeatures: { resizing: true }` every unlocked column's header carries
  a focusable resize handle: pointer drag (TanStack's own maths, committing per
  `resizeMode`) plus Left/Right arrows for a 16px step. With
  `columnsFeatures: { reordering: true }` it carries a grip; activate it and the
  arrow keys move the column one **visible** position inside its own pin region,
  with Enter or Escape ending the interaction. Pointer drag-and-drop reorder is not
  part of this release.

  - **The controls are siblings of the sort affordance, not children of it.** They
    mount through the header-cell adornment seam with `placement: 'edge'`, which is
    `TableHead`'s `trailing` slot — so on a sortable column a pointer release does
    not sort, Enter/Space acts instead of sorting, and the header's accessible name
    stays the column label rather than absorbing the control's.
  - **Announcements go to one live region per grid**, mounted by the group itself,
    and shared with the column-settings menu. Widths, moves, pin changes and
    visibility changes are announced in the logical vocabulary (`pinned to start`,
    never `left`).
  - **`aria-valuemax` is emitted only for a column the caller capped.** The
    engine's resolved maximum is `Number.MAX_SAFE_INTEGER`, which is a safe clamp
    and a nonsense thing to publish.
  - **Locked columns offer no controls at all**, resizing included, so the default
    `lockSystemColumns` leaves the selection and actions columns untouched.

  For a hand-composed `DataTable`, the same commands are on the header render
  context as `columns` (`resizeTo`, `moveTo`, `moveBy`, `pin`, plus `size`,
  `minSize`, `maxSize`, `position`, `total`). Each returns a structured
  announcement intent, or `undefined` when nothing changed — the engine renders no
  handle and no live region, so a custom composer owns the wording exactly as
  DataGrid does.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - DataTable/DataGrid: add the `columnsFeatures` behavior group — engine wiring and
  config resolution.

  `DataGrid` gains a `columnsFeatures` prop (`visibility`, `pinning`, `resizing`,
  `reordering`, `resizeMode`, `fit`, `overflowTooltip`, `lockSystemColumns`), and
  the DataTable feature module turns on TanStack's column pinning and resizing and
  exposes pin/size/order commands on the header render context.

  Three behavioral notes:

  - `resizeMode` defaults to `'onEnd'`, not TanStack's `'onChange'`. The library
    default commits sizing state on every pointer move, which re-renders every row
    per frame; pass `resizeMode: 'onChange'` to opt back in.
  - Only `enableColumnPinning` is set. TanStack's `enablePinning` is deprecated in
    favour of the per-axis flags, and row pinning is not in scope.
  - `lockSystemColumns` defaults to on, so the selection and actions columns cannot
    be moved, pinned or resized, and offer no header controls, unless it is
    explicitly `false`.

  The presentation half — pinned columns and their offsets, resolved widths, and
  the header resize handle and reorder grip — is in this release too; see the
  `columnsFeatures` header-chrome entry.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - feat(data-grid): config registry + `toolbar.columnFilters`/`viewOptions` members

  **New: the toolbar's own members are now configurable (design §5.2).**

  `DataGridToolbarConfig` gains `columnFilters` and `viewOptions`:

  ```tsx
  <DataGrid
    columns={columns}
    rows={rows}
    filters={{ columns: filterDefinitions }}
    toolbar={{ columnFilters: true, viewOptions: false }}
  />
  ```

  **Migration — `toolbar.columnFilters` defaults to `false`.** Defining column
  filters and _surfacing_ their controls are now separate decisions, as the design
  specifies. Previously the controls rendered whenever `filters` carried column
  definitions, with no way to turn them off; now `toolbar.columnFilters` governs it
  and defaults to off.

  If you pass `filters` with `columns` (or the deprecated bare
  `DataGridColumnFilterDef[]` form) and want the controls, add
  `toolbar={{ columnFilters: true }}`. In development DataGrid logs an error when
  filter definitions would render nowhere, so an un-migrated grid reports itself
  rather than silently dropping its filter row. `filters.global` (the toolbar
  search box) is unaffected.

  `toolbar.viewOptions` defaults to `true` — the previous, unconditional behavior —
  and set to `false` hides the column-visibility menu. DataGrid now renders its own
  toolbar row rather than the frozen `DataTableToolbar` adapter, which is unchanged;
  direct DataTable composition is unaffected.

  **Internal: DataGrid's behavior groups are now a config registry.**

  No public API change. `data-grid.tsx` hand-listed every behavior group in eight
  places — the `DataGridGroupedConfig` interface, a total-record `satisfies` over
  its keys, the resolved shape, the resolver, the resolved-field destructure, the
  `useDataTable({…})` assembly, the column assembly, and the render body. All eight
  are now derived from one module per group under `data-grid-config/`, each
  declaring its own prop surface, resolution, controller options, column
  injection, view props, and chrome. Adding a behavior group is a new file plus one
  line in the module list.

  Two behavior-adjacent consequences worth knowing:

  - Config resolution is memoized on the props the registry actually reads instead
    of on the props object, and the named callbacks are read through a stable
    accessor. Both make the assembled column set referentially stable in cases
    where it previously churned — notably when `callbacks` is passed as an object
    literal, which used to reset TanStack row selection on re-render.
  - A module may not overwrite another module's controller option or view prop; a
    collision throws in development rather than letting one silently win.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - feat(data-grid): `detailExpansion` — caller-rendered detail panels (U1)

  ```tsx
  <DataGrid
    columns={columns}
    rows={rows}
    getRowId={(row) => row.id}
    detailExpansion={{
      render: (row) => <InvoiceSummary invoice={row} />,
      isExpandable: (row) => row.hasDetail,
      mode: 'multiple',
    }}
    callbacks={{ onDetailExpansionChange: (event) => persist(event.value) }}
  />
  ```

  A disclosure control appears in a `__detail__` system column behind the selection
  checkbox, and opening it reveals `render(row)` in a full-width row beneath the
  record.

  **`render` is required** at the DataGrid layer — a detail group with nothing to
  render is a configuration mistake. `isExpandable` decides which records get a
  control at all; `reserve` retains expanded ids across a data replacement.
  `mode: 'accordion'` keeps at most one panel open and is **proposed-only** in the
  design, with `multiple` the shipped default.

  `detailExpansion` is identity-bearing, so it requires `getRowId` — expanded ids
  have to survive a data change, and an index cannot do that.

  Three properties worth knowing because they are easy to assume wrong:

  - **A detail row consumes no pagination slot.** It is a presentation of a record
    already on the page, not a record entering the row model, so `pageSize: 25`
    still means 25 records. This is deliberately the opposite of the answer for tree
    descendants, which are real records.
  - **Detail and tree expansion are fully independent** — separate state slice,
    separate callback, separate display-row kind. Toggling a panel leaves
    `treeExpanded` untouched, and accordion mode can never collapse a tree node.
  - **`aria-controls` is emitted exactly while the panel is mounted**, never
    pointing at an element that does not exist, while `aria-expanded` always
    reflects logical state. The control and the panel derive the id from one shared
    function, so they cannot disagree.

  `onDetailExpansionChange` joins the named callbacks, carrying the same enriched
  event shape as the rest of the family.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - feat(data-grid): faceted filter options and multi-column global search (U7)

  **Faceted option sources.** A column filter can now say where its options come
  from, which is what turns a free-text control into a set-membership one:

  ```tsx
  <DataGrid
    columns={columns}
    rows={rows}
    getRowId={(row) => row.id}
    filters={{
      columns: [
        { columnId: 'category', label: 'Category', facet: 'unique' },
        {
          columnId: 'status',
          label: 'Status',
          facet: ['active', 'paused', 'archived'],
        },
      ],
    }}
    toolbar={{ columnFilters: true }}
  />
  ```

  `'unique'` offers the column's distinct values **with their counts**, `'min-max'`
  its numeric range, and an explicit list supplies fixed options verbatim —
  including ones that occur in no row. This is shipped legacy parity with
  `filterStats`.

  The values come from the **pre-filter** row model, so the option list keeps
  showing every choice, with accurate counts, while a filter is applied. Facets need
  client-side filtering and are inactive in server mode, where the client holds only
  one page and any facet computed from it would be wrong.

  **Multi-column global search.** `filters.global.columnIds` matches one query,
  case-insensitively, across every listed column:

  ```tsx
  filters={{ global: { columnIds: ['name', 'category', 'status'] } }}
  toolbar={{ globalSearch: true }}
  ```

  A term matching any one of those columns matches the row, so a screen no longer
  needs to hand-roll an OR inside a single column's `filterFn`. Per-column
  customization is a `globalFilterFn` on that column's metadata, which keeps the
  query descriptor `{ q, columnIds }` serializable — server mode round-trips it
  unchanged.

  The deprecated singular `filters.global.columnId` still works. Supplying both
  warns and `columnIds` wins.

  **Behaviour change: the toolbar search box now drives the engine's global filter**
  rather than one column's filter. For a single-column configuration this is
  equivalent, and it is what makes the multi-column form work at all — previously the
  box could only ever have matched one column. The reset control now clears the
  global query as well as the column filters; before, a global query could be left
  active with no way to clear it from the toolbar.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - feat(data-grid): grouped-config union forms for filters/pagination/toolbar (P0.7)

  The three prototype props whose names clash by type now accept both their
  deprecated legacy shape and the design's grouped config, normalized together:

  - `filters`: `false | DataGridColumnFilterDef[] | DataGridFiltersConfig`. The
    config adds `{ columns, global: { columnId, placeholder } }`; the bare array is
    the deprecated alias for `{ columns }`.
  - `pagination`: `boolean | DataGridPaginationConfig` (`{ pageSize, pageSizeOptions }`).
    The boolean plus the separate `pageSize`/`pageSizeOptions` props are deprecated.
  - `toolbar`: `boolean | DataGridToolbarConfig` (`{ globalSearch, bulkActions }`).
    `globalSearch` shows the search box (its column comes from `filters.global` or
    the deprecated `searchKey`); `toolbar.bulkActions` supersedes the deprecated
    top-level `bulkActions`. `toolbar: {}` renders view options only.

  Precedence follows the design: a grouped config wins over its deprecated alias
  and supplying both emits a development warning (`filters.global` vs
  `searchKey`/`searchPlaceholder`, `toolbar.bulkActions` vs `bulkActions`, the
  `pagination` config vs `pageSize`/`pageSizeOptions`). `DataGridFiltersConfig`,
  `DataGridPaginationConfig`, and `DataGridToolbarConfig` are exported. An unfiltered
  grid now keeps a stable `columnFilters` reference so the memoized column set
  (and TanStack row selection) survives re-renders.

  Remaining P0.7 (follow-up): `actions` grouped form, `presets`, the P1 feature
  groups, and the `table-view`/`data-table` screen migrations.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - feat(data-grid): grouped-config API for delivered features (P0.7)

  DataGrid now accepts the design's grouped, object-form configs for the delivered
  features, and the flat prototype props become deprecated aliases that normalize
  into them:

  - `selection` (`false | { mode, showSelectAll, isRowSelectable }`) ← `selectable`
    / `selectionMode` / `isRowSelectable`
  - `sorting` (`false | { mode }`) ← `sortable` / `multiSort`
  - `appearance` (`{ striped }`) ← `striped`
  - `dataState` (`{ status, skeletonRows, empty, error, onRetry }`) ← `state` /
    `error` / `onRetry` / `skeletonRows` / `emptyMessage`
  - `rowInteraction` (`{ current, onClick, onActivate, onHover }`) ← `currentRow` /
    `onRowClick` / `onRowActivate` / `onRowHover`

  Precedence follows the design: a grouped config wins over its deprecated alias,
  and supplying both emits a development warning. The grouped config types are
  exported (`DataGridSelectionConfig`, `DataGridSortingConfig`,
  `DataGridAppearanceConfig`, `DataGridDataStateConfig`,
  `DataGridRowInteractionConfig`). `selection.showSelectAll` can now hide the header
  select-all in multiple mode.

  Story added: `GroupedConfig`.

  Not yet migrated to grouped form (follow-up, some pending P1 engine features):
  `filters`/`pagination`/`toolbar` (need `legacy | config` union props), `actions`,
  `presets`, and the P1 groups (tree/grouping/virtualization/columns/persistence/
  detailExpansion). The `table-view` / `data-table` screen migrations also remain.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - DataTable/DataGrid: add the `grouping` behavior group — row grouping with
  collapsible, sticky group headers, a group-scoped select-all, and the ungrouped
  bucket policy.

  `DataGrid` gains a `grouping` prop (`allowedColumns` required; `renderGroup`,
  `collapsible`, `sticky`, `selectionScope`, `ungrouped` optional). `DataTable`
  gains the matching `grouping` config, a `groupCollapsed` state slice, and a
  working `toggle-group` imperative action. Root records group while each root's
  descendant tree stays attached; a group's members render underneath its header
  and collapse into it.

  `grouping` does **not** require `getRowId`: collapse is keyed by the synthetic
  group id, not by row identity. A grid that groups _and_ selects needs `getRowId`
  because of `selection`.

  Five notes worth reading before you use it:

  - **Grouping is switched on through the `grouping` state slice, not the config.**
    `allowedColumns` says which columns _may_ group; pass
    `defaultState={{ grouping: ['status'] }}` (or a controlled `state.grouping`) to
    group by one. This mirrors `sorting`, where the config carries behavior and the
    slice carries the current value. There is no built-in group-by control in this
    release.
  - **`getGroupedRowModel()` alone shows group headers with no members.** The
    grouped row model nests each group's members in `subRows`, and TanStack's stock
    expand stage returns early while nothing is expanded, so this release installs
    its own expand stage — owned by the `grouping` feature module and shared with
    `tree`, which no longer installs one. Tree expansion is unchanged.
  - **`groupedColumnMode` is set to `false`.** TanStack's default (`'reorder'`)
    hoists every grouped column to the front of the column order the moment
    grouping activates, silently overriding `columnsFeatures.columnOrder`. The
    group header shows the value already, so the caller's order is kept.
  - **`selectionScope` defaults to `'all-loaded-leaves'`**, so a collapsed group is
    still selectable. `'visible-leaves'` restricts the group select-all to rows
    currently on screen, which means a collapsed group's control is empty and
    disabled.
  - **A sticky group header needs `appearance.height` or `appearance.maxHeight`**,
    and with `appearance.stickyHeader` it slides under the table header rather than
    stacking below it (the fixed z-ladder puts the header above group rows). There
    is no offset member for clearing the header.

  Two inherited limitations, recorded rather than left to be discovered: a real
  `null` and the string `"null"` land in the **same** group, because the row model
  keys groups by the stringified value above this layer; and `allowedColumns` is
  enforced when the grouping slice is written through the engine, so a value pushed
  directly into a controlled `state.grouping` is honoured as the caller's own
  assertion.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - feat(data-grid): `state`/`defaultState` exposure + the `getRowId` identity rule

  **New: `state` and `defaultState` on DataGrid.**

  ```tsx
  <DataGrid
    columns={columns}
    rows={rows}
    getRowId={(row) => row.id}
    selection={{ mode: 'multiple' }}
    state={{ selection }} // controlled: requests, never commits
    defaultState={{ pagination: { pageIndex: 0, pageSize: 25 } }}
    callbacks={{ onSelectionChange: (event) => setSelection(event.value) }}
  />
  ```

  A slice in `state` is controlled: DataGrid emits the change event so the screen can
  apply it, but commits nothing internally. A slice absent from `state` is
  uncontrolled and initializes once from `defaultState`. The same slice in both is a
  development error and the controlled value wins. The controller already implemented
  all three rules — this exposes them at the DataGrid layer.

  Two precedence rules resolve the overlaps DataGrid adds on top. Server mode
  controls the query slices exclusively, so a caller controlling one of those is
  reported rather than silently overridden. And a caller `defaultState` slice beats a
  group's own initial value — `defaultState.pagination` wins over
  `pagination.pageSize`.

  **`state` keeps its deprecated string form.** `state="loading"` is still the
  data-status alias for `dataState.status` and still warns when combined with
  `dataState`. The prop is now a structural union of the status string and the
  controlled-slice object, discriminated by `typeof state === 'string'`; the two are
  disjoint, so no caller needs to change.

  **Migration: `getRowId` is now required by the grouped API when a feature needs row
  identity.** `DataGridProps` is a discriminated union implementing design §3.1:
  `getRowId` is optional only while every identity-bearing feature is disabled, and
  required as soon as one is enabled — `selection`, `actions`, `rowInteraction.current`,
  `server`, or a controlled `selection`/`currentRowId`/`detailExpanded`/`treeExpanded`
  slice. Omitting it is a compile error naming the missing prop.

  Nothing needs to change today: **every existing call site already complies.** The
  deprecated flat aliases (`selectable`, `currentRow`, `onRowClick`, …) stay
  source-compatible for one minor line, as the design requires. They now log a
  development warning explaining that identity falls back to the row index and cannot
  survive a data change, and the fix is either `getRowId` or the grouped config.

  The rule is deliberately finer than the design sketch in one place:
  `rowInteraction`'s `onClick`/`onActivate`/`onHover` receive the row _object_, not an
  id, so they remain available without `getRowId`. Only `current` requires it.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - feat(data-grid): named screen callbacks (P0.7)

  Adds the `callbacks` prop — the surface a screen binds to (design §5.3). Each
  callback carries the enriched event (`cause`, the complete next `state`, the
  `query`, and its `requestKey`) instead of a bare value:

  ```tsx
  callbacks={{
    onSelectionChange: (event) => setSelected(event.value),
    onQueryChange: (event) => syncUrl(event.query),
    onColumnStateChange: (event) => persist(event.slice, event.value),
    onRowAction: ({ actionId, row }) => run(actionId, row),
  }}
  ```

  Implemented: `onStateChange`, `onQueryChange`, `onSelectionChange`,
  `onCurrentRowChange`, `onPaginationChange`, `onColumnStateChange`, `onRowHover`,
  `onRowClick`, `onRowActivate`, `onCellHover`, `onCellClick`, `onRowAction`,
  `onDataStateAction`.

  **One ordering rule throughout: a config-level handler owns the behavior and runs
  first; the named callback observes afterwards.** So `server.onQueryChange`
  refetches and `callbacks.onQueryChange` only observes the same event (it must not
  start a second request), `rowInteraction.on*` runs before `onRow*`,
  `actions.onAction` before `onRowAction`, and `dataState.onRetry` before
  `onDataStateAction`. Binding both is supported and expected — the config handler
  gets the row, the callback gets the full event.

  Every slice-derived event reuses the controller's own `DataTableChangeEvent`
  narrowed to its slice, so the family has one event shape rather than a parallel
  vocabulary. The four column slices fan into a single `onColumnStateChange`
  discriminated by `event.slice`, so persisting column preferences is one handler.
  Binding no callbacks installs no per-slice handlers on the controller.

  The design's `onDetailExpansionChange`, `onTreeExpansionChange`, `onTreeLoad`,
  `onGroupingChange`, and `onScroll` are deliberately **not** included: their
  features are P1, and they will land with the behavior that emits them rather than
  as callbacks that can never fire. `onDataStateAction`'s `append-retry` action
  likewise arrives with the P1 append state.

  Exports `DataGridCallbacks` plus the event types
  (`DataGridSelectionChangeEvent`, `DataGridCurrentRowChangeEvent`,
  `DataGridPaginationChangeEvent`, `DataGridColumnStateChangeEvent`,
  `DataGridColumnSlice`, `DataGridRowActionEvent`,
  `DataGridDataStateActionEvent`).

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - DataGrid: add the `persistence` behavior group (U10, DataGrid half).

  `<DataGrid persistence={{ key, version, storage }} />` restores stored column
  preferences on mount and saves them as they change. `key`, `version` and `storage`
  are required (design §8); `include`, `migrate` and `onError` are optional.

  ```tsx
  <DataGrid
    columns={columns}
    rows={rows}
    persistence={{
      key: 'servers-grid',
      version: 2,
      storage: {
        read: (key) => localStorage.getItem(key),
        write: (key, value) => localStorage.setItem(key, value),
      },
    }}
  />
  ```

  - **Defaults to the four column slices** — visibility, order, sizing and pinning.
    Sorting, filters, grouping and the page index are opt-in through `include`;
    selection, detail/tree expansion and the current row cannot be named at all
    (design §5.2).
  - **No `getRowId` required.** Every persistable slice is keyed by column id, so
    the group is deliberately absent from the identity rule — a caller may persist
    column preferences without supplying row identity.
  - **The group renders no chrome.** A restore is visible only as the ordinary
    chrome of whatever slice it restored into, so it contributes a config prop and
    nothing else; all mechanics are the DataTable engine's.
  - **It warns rather than half-configuring.** A JS caller missing `key`, `version`
    or `storage` disables the group with a message naming the missing members, and
    an `include` entry the library does not recognise is reported — the engine drops
    an unknown slice name silently, so the warning is the only signal a caller gets.
  - **Precedence is `state` > `defaultState` > stored payload > config defaults.** A
    slice the caller controls is neither restored into nor saved; a slice the caller
    gave a `defaultState` is not restored into but _is_ still saved once the user
    changes it.

  New public type: `DataGridPersistenceConfig`. Its barrel re-export is batched with
  the other public-type lines at branch close, so reach it from
  `@constructor-lab/ui-react` only after that lands.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - feat(data-grid): reorder columns by dragging the header grip

  `columnsFeatures.reordering` now offers a pointer gesture as well as the keyboard
  one. Drag a column's reorder grip onto another column: that column's header is
  outlined as the drop target, release moves the dragged column into its place, and
  Escape (or a cancelled pointer) abandons the drag with nothing moved.

  - **A gesture layer over the existing commands, not new reorder logic.** Release
    calls the engine's own `moveTo`, which stays the authority on legality — a move
    is still clamped to the column's pin region and still refuses a locked target
    (design §6.9). Both paths announce through the same intent, so a pointer user and
    a keyboard user hear the same sentence.
  - **The keyboard path is unchanged.** A press below a 4px threshold is still a
    click, and a click still engages arrow-key reordering. A keyboard activation is
    never consumed by the pointer path.
  - **New, and useful to a composer**: every header cell now publishes
    `data-column-id`, and — with `reordering` on — carries the drop-target paint rule
    keyed on `data-reorder-target`. A composer that maps its own gesture onto
    `moveTo`/`moveBy` can identify the column under a pointer and mark it without
    authoring colour of its own.

  Nothing is added at rest beyond the grip's grab cursor: the drop outline exists
  only while a pointer is down.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - feat(data-grid): build DataGrid on the shared DataTable controller

  DataGrid no longer creates its own separate TanStack instance. It now composes
  the one canonical `useDataTable` controller plus `DataTableRoot`/`DataTableView`,
  so its toolbar, grid body, and pagination all read and mutate a single engine
  that owns the normalized state, query, and controlled/uncontrolled semantics —
  the "one engine only" rule from the table-feature-parity design. Its public prop
  surface (`columns`, `rows`, `state`, `selectable`, `toolbar`, `searchKey`,
  `pagination`, `onRowClick`, `striped`, …) is unchanged, and every existing
  behavior is preserved. Because the shared controller installs no pagination model
  unless requested, DataGrid renders every row when `pagination` is not set rather
  than silently truncating to a default page.

  `DataTableView` gains an `onRowClick(context)` prop that fires with the clicked
  row's typed context and composes with `highlightCurrentRow`; DataGrid maps it to
  its `onRowClick(row)` callback.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - Add the `tree` behavior group to `DataGrid`, and complete the eager half of the
  `tree` feature in the `DataTable` engine.

  ```tsx
  <DataGrid
    columns={columns}
    rows={regions}
    getRowId={(row) => row.id}
    tree={{ getChildren: (row) => row.reports, indent: 24 }}
    callbacks={{ onTreeExpansionChange: (event) => save(event.value) }}
  />
  ```

  - `tree.getChildren` supplies descendant relationships (the DataTable-level
    `getSubRows` prop still works and is now the fallback, not the only route).
  - `tree.indent` sets the per-level step, default 20px. It reaches the row as the
    `--table-tree-indent` custom property alongside `--table-tree-depth`, so a
    direct `DataTable` composition can indent from a column class with
    `calc(var(--table-tree-depth) * var(--table-tree-indent))`.
  - `tree.column` names which column carries the disclosure and the indentation,
    defaulting to the first **declared** data column. Note this is not necessarily
    the leftmost _rendered_ one once `columnsFeatures` reorders or hides columns —
    and **hiding the tree column removes the disclosure entirely**, so the tree
    becomes unexpandable rather than merely un-indented.
  - `tree.reserve` keeps expanded ids that are absent after a data replacement.
  - `callbacks.onTreeExpansionChange` reports `treeExpanded` transitions. Tree and
    detail expansion share no slice, callback, or id namespace, so subscribing to
    one never delivers the other's events, and both may be enabled at once.

  The disclosure is an **in-cell** control on the tree column rather than a leading
  system column, because indentation and disclosure have to move together and a
  fixed leading column cannot indent. It wraps the column's own cell renderer, so a
  custom `cell` is preserved.

  Accessibility: a plain grid with an in-cell disclosure button carrying
  `aria-expanded`. `role="treegrid"` is deliberately not adopted, and the disclosure
  emits no `aria-controls` — a tree parent reveals a variable set of sibling rows,
  and several `<tr>` elements cannot share one id. Because `aria-level` is
  meaningful only inside a `treegrid`, the nesting level is carried in the
  disclosure's accessible name instead.

  Tree descendants **consume pagination slots**: a page size of 4 over an expanded
  parent with two children renders the parent, both children, and one more root.
  This is the opposite of detail rows, which are a presentation of a record already
  on the page.

  ### Lazy children

  `tree.loadChildren` fetches children for a record that has none yet. Expanding a
  childless row triggers it; each request is keyed, and a superseded result is
  dropped, so a slow first response cannot overwrite a newer one.

  ```tsx
  <DataGrid
    columns={columns}
    rows={regions}
    getRowId={(row) => row.id}
    tree={{
      getChildren: (row) => row.reports,
      loadChildren: (row) =>
        fetch(`/api/regions/${row.id}/children`).then(toJson),
    }}
    callbacks={{ onTreeLoad: (event) => track(event.status, event.requestKey) }}
  />
  ```

  - While a request is in flight the branch shows a spinner row; on failure it shows
    an Alert with a Retry control. `tree.renderLoadError` replaces the failure
    content only — the spinner is not overridable, and retry cannot be suppressed.
  - `callbacks.onTreeLoad` reports each transition (`loading`, then `loaded` or
    `error`) with the request key that identifies the attempt. A superseded result
    emits nothing, so the event stream is a faithful trace of what actually landed.
  - **With a loader configured, every not-yet-resolved row gets a disclosure**, since
    the library cannot know whether a childless record has children until it asks. A
    row whose load completed with no children becomes a leaf and loses the control.
  - Request status is deliberately **not** part of `treeExpanded` or any other state
    slice, so persisting or restoring table state never restores a stale load state.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - feat(data-grid): pagination `showPageSize`/`showFirstLast`/`unknownTotal` and server directional capabilities (U8)

  **`pagination.showPageSize`** and **`pagination.showFirstLast`** drop the
  rows-per-page select and the first/last page buttons. Both default to `true`, so
  nothing changes for an existing caller:

  ```tsx
  pagination={{ pageSize: 25, showPageSize: false, showFirstLast: false }}
  ```

  **`pagination.unknownTotal`** is for a cursor-style backend that can answer "is
  there another page" but never "how many". It announces no page count and hides
  first/last, and it is valid **only** in server mode with both new capabilities
  supplied:

  ```tsx
  pagination={{ unknownTotal: true }}
  server={{
    query,
    hasNextPage: cursor.next !== null,
    hasPreviousPage: cursor.previous !== null,
    onQueryChange,
  }}
  ```

  **`server.hasNextPage`** and **`server.hasPreviousPage`** are the owner's
  directional capabilities. They are authoritative when supplied and they have to
  be, because the engine's answer in this configuration is not missing — it is
  wrong. With manual pagination and neither `rowCount` nor `pageCount`, TanStack's
  `getRowCount()` falls back to the length of the row model it was handed, so
  `getPageCount()` becomes `ceil(loadedWindow / pageSize)`. A 500-result query
  served 10 rows at a time reports a page count of **1**: the footer announces
  "Page 1 of 1" and `getCanNextPage()` is `false`, so Next is dead on every page.
  Supplying the two capabilities is what fixes both, and `unknownTotal` is what
  stops the fabricated count being announced.

  `unknownTotal` also passes `pageCount: -1` to the engine, so `getPageCount()`
  reports genuinely-unknown rather than a count derived from the current window,
  and page navigation is not clamped to it.

  **New: `DataGrid` renders its own pagination row.** The frozen
  `DataTablePagination` companion adapter takes exactly `{ table, pageSizeOptions }`
  and is marked "do not add new features here", so the three members needed
  DataGrid-owned chrome — the same move `toolbar.viewOptions` made for the toolbar
  row. **At the defaults the two render identical markup**, and a test asserts that
  byte-for-byte through one shared controller, so no existing DataGrid rendering
  changes and no visual baseline moves. `DataTablePagination` stays exported for
  external callers; DataGrid no longer consumes it.

  **Deviation from the design contract, recorded deliberately.** Design §5.2 lists
  `unknownTotal` outside server mode as an invalid combination, which implies only
  that it is reported. It is reported — and it is also **not honored**: outside
  server mode the member resolves to `false`. The client row model knows the real
  total, so suppressing the count there would replace a correct answer with no
  answer, which is strictly worse than the warning. Resolving it away also keeps the
  invalid state out of everything downstream, so neither the chrome nor the
  controller ever sees an unknown total it cannot support.

  Four development warnings cover §5.2's invalid combinations for `unknownTotal`:
  outside server mode, without both directional capabilities, alongside
  `server.rowCount`/`server.pageCount`, and with an explicit `showFirstLast: true`.
  The last keys off the caller having _set_ the member rather than off its resolved
  value — `showFirstLast` defaults to `true`, so a resolved-value check would warn
  on every correctly configured unknown-total grid. A fifth reports a `server`
  config that supplies neither totals nor capabilities, which is the configuration
  that silently produces the fabricated count above.

  **None of the three members has a deprecated flat alias.** `pagination`'s flat
  form is a boolean plus `pageSize`/`pageSizeOptions`, and it carries nowhere to put
  a presentation flag, so the grouped config is the only route to all three — a
  limit of the alias form rather than an omission here.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - feat(data-grid): `selection.selectAll` — page, loaded, and all-results scopes (U8)

  **`selection.selectAll`** says what the header select-all covers:

  ```tsx
  selection={{ mode: 'multiple', selectAll: 'loaded' }}
  ```

  - **`page`** — the current page's eligible rows. What already shipped.
  - **`loaded`** — every eligible loaded row, across pages.
  - **`all-results`** — everything the query matches.

  Unset means **page when paginated, loaded otherwise** (design §6.1), so nothing
  changes for an existing caller.

  **`all-results` is the one that needed new machinery**, because its member set is
  exactly what DataGrid has never seen. It requires an application-issued
  `server.selection` token scoped to the current `query.requestKey`; DataGrid never
  invents one and never labels the loaded window as all server results. With a valid
  token:

  - each row checkbox is derived from `!excludedIds.has(row.id)` rather than from any
    engine slice — the token can describe rows that were never loaded;
  - toggling a row emits an **exclusion delta** through `server.onSelectionChange`
    and commits nothing to the engine, so the controlled token stays authoritative;
  - the header control is fully checked only when there are no exclusions, clears
    the exclusions when activated from its mixed state, and requests
    `selection: undefined` — the absence of a selection — when deselecting
    everything. That last encoding is deliberate: an all-results token excluding
    every _loaded_ id would claim exclusions for rows the application may never have
    sent.

  This completes `ui-spec/…/data-table/behavior.md`'s "All-results token cannot cross
  a query", whose last clause — "toggled exclusions emit against the authoritative
  token without mutating it internally" — was the part deferred when `server.selection`
  shipped.

  **Without a usable token, `all-results` degrades to the default scope and reports
  the combination** (design §5.2). It does not disable the control and it does not
  fake the claim.

  **One asymmetry worth knowing.** The all-results toggle reports
  `cause: 'pointer'`, because it emits from the click handler. Every other selection
  change reports `'api'`, because it goes through `row.toggleSelected()` and the
  controller cannot see what drove it. Both values are honest; the difference is that
  the engine round-trip loses the provenance the call site had.

  **Also recorded rather than relied on:** the `loaded` half of the default has no
  observable consequence today. Without a pagination row model, TanStack's
  page-scoped predicates and toggles already cover the whole row model, so `page` and
  `loaded` coincide exactly when the grid does not paginate. The distinction is
  reachable only through an explicit `selectAll: 'loaded'` on a paginated grid. The
  code follows §6.1 anyway, because agreeing with the spec costs nothing.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - feat(data-grid): controlled server selection and `server.onSelectionChange` (U8)

  **`server.selection`** hands selection ownership to the application, in the two
  shapes design §3.6 specifies:

  ```tsx
  server={{
    query,
    rowCount,
    selection: { mode: 'explicit', ids: new Set(['d-2']) },
    onSelectionChange: (event) => {
      // event.previous is the authoritative selection; event.selection is the request
      if (event.selection?.mode === 'explicit') setIds(event.selection.ids);
    },
    onQueryChange,
  }}
  ```

  An **`explicit`** selection is enumerable, so it becomes a controlled `selection`
  slice: the boxes it names are ticked, and a click **requests** a change without
  committing one. Nothing moves until the owner supplies a new `server.selection` —
  so an owner that ignores the event gets a grid whose selection never changes,
  which is the point rather than a bug.

  An **`all-results`** selection means "everything the query matches, except these".
  DataGrid cannot make that claim on its own — it has only ever seen the loaded
  window — so the `token` is application-issued and scoped to the exact
  `queryRequestKey` it was issued for. **A token whose key does not match the current
  `query.requestKey` is stale and reports nothing**, until the owner supplies one for
  the new key. DataGrid never invents a token and never labels loaded rows as all
  server results.

  **`server.onSelectionChange`** reports requested changes, carrying the
  authoritative `previous`, the requested `selection`, and the `cause`/`query`/
  `requestKey` of the transition. It runs **before** `callbacks.onSelectionChange`,
  which only observes — the same authoritative-then-observe ordering
  `server.onQueryChange` already has (design §5.3). Supplying it without
  `server.selection` logs a development error: with no controlled selection the
  engine owns selection outright and `callbacks.onSelectionChange` already reports
  it, so firing here too would be a second event for one transition.

  Controlling the same slice from both sides — `server.selection` and
  `state.selection` — is design §5.2's invalid combination and is reported, which
  falls out of the existing server/state overlap rule now that `selection` joins the
  controlled slices.

  **Not shipped, and named rather than left to be discovered: the `all-results`
  toggle path.** Adjusting `excludedIds` when a row is toggled needs the loaded row
  ids, and the one place a row id is in hand at that moment is the selection column's
  cell renderer. So exclusion toggling lands with `selection.selectAll:
'all-results'`, and until it does an `all-results` token is reported and
  staleness-checked but drives no checkbox. If that work ships without consuming
  `ResolvedDataGridServer.selection`, the member and the `all-results` shape should
  be deleted rather than left declared.

  **Known limitation, pre-existing and now pinned by a test:** the `cause` on a
  selection change driven by the row checkbox is `api`, not `pointer`, because the
  checkbox calls `row.toggleSelected()` and the controller cannot see what drove it.
  A screen therefore cannot currently distinguish a user click from a programmatic
  selection.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - feat(data-grid): sorting cycle/maxColumns and the appearance cluster (U9)

  **`sorting`** gains `cycle` and `maxColumns`:

  ```tsx
  sorting={{ mode: 'multiple', cycle: ['asc', 'desc'], maxColumns: 2 }}
  ```

  `cycle` sets the direction sequence on repeated header activation — dropping
  `'none'` makes sorting non-removable, and leading with `'desc'` sorts descending
  first. `maxColumns` caps a multi-sort. Both are carried even when the sortable
  header affordance is off, because a controlled `sorting` slice still cycles.

  **`appearance`** gains the rest of the cluster beyond `striped`: `size`,
  `background` (transparent / accent / subtle / surface), `showHeader`,
  `stickyHeader`, independent `borders` strengths for the top, bottom, horizontal
  and vertical edges, `width` / `height` / `maxHeight`, and the six
  `rowClassName` / `rowStyle` / `cellClassName` / `cellStyle` / `headerClassName` /
  `headerStyle` callbacks — each taking the same typed render context the rest of
  the family uses.

  An unset member is passed as absent rather than as an explicit `undefined`, so the
  `Table` primitive's own defaults still apply and today's markup is unchanged.

  `appearance.stickyHeader` without `height` or `maxHeight` now logs a development
  error: with no bounded height the table never scrolls, so a sticky header has
  nothing to stick to and the member would appear to do nothing.

  **Fix:** the `detailExpansion` expander column's header cell had no accessible
  name, failing axe's `empty-table-header` rule and leaving the column unnamed to a
  screen reader. It now carries a visually-hidden label, so the header row still
  reads as a bare expander gutter.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - feat(data-grid): selection `selectByRow`, `reserve`, and the indeterminate policy (U9)

  **`selection.selectByRow`** toggles a row's selection when its body row is
  clicked:

  ```tsx
  selection={{ mode: 'multiple', selectByRow: true }}
  ```

  The checkbox column stays the accessible primary control — the row gets a pointer
  cursor and a click handler, and deliberately **no tab stop and no keyboard
  binding**, so it does not become an unlabelled focus target. Action controls, the
  detail expander and the row checkbox all isolate propagation, so none of them
  selects on the way through. Eligibility comes from `isRowSelectable` and
  single-selection mode replaces rather than accumulates, both straight from the
  engine.

  Composes with a row-click handler rather than replacing it: with both
  `selection.selectByRow` and `rowInteraction.onClick`, the toggle runs first and the
  handler observes the post-toggle state. On a double-click activation the row is
  toggled twice and therefore ends where it started, so double-clicking to open does
  not disturb selection.

  **`selection.reserve`** keeps selected ids whose records are absent after a data
  replacement, instead of pruning them:

  ```tsx
  selection={{ mode: 'multiple', reserve: true }}
  ```

  The pruning behavior itself is the controller's and unchanged — this is the config
  surface that reaches it from `DataGrid`. Default stays `false`, so a selected id
  whose record disappears is still dropped with cause `data-reconcile`.

  **`selection.selectAllOnIndeterminate`** picks what the header select-all does
  when it is in the mixed state: select every eligible row (`true`, the default), or
  clear the selection (`false`).

  ```tsx
  // the new opt-in: a mixed header control clears instead of selecting
  selection={{ mode: 'multiple', selectAllOnIndeterminate: false }}
  ```

  **No behavior change.** The default matches what already ships, so existing callers
  see nothing new. Only the mixed state is governed at all: an unchecked header
  control still selects the page and a fully checked one still clears it, under either
  policy, and select-all skips rows excluded by `isRowSelectable` either way.

  _Deviation from the design contract, recorded deliberately._ Design §5.2 defaults
  this member to `false`. Shipping that default would have changed behavior for every
  existing caller with no code change on their part — the most invisible kind of
  breaking change — and both behaviors are defensible UX with no correctness argument
  for either, so the shipped one wins and the member exists for callers who want the
  other. (Today's behavior is `true` by accident rather than by decision: an
  indeterminate checkbox reports `checked: true` and that value was passed straight
  through. Consumers depend on observed behavior regardless of whether it was
  intended.)

  Setting `selectAllOnIndeterminate` where the header control does not render — in
  single mode, or with `showSelectAll: false` — logs a development error, since the
  policy governs exactly that one control. The check keys off the caller having _set_
  the member rather than off its resolved value, because with a `true` default a
  resolved-value check would fire for every single-mode grid.

  **Fix, and a second behavior change: the row checkbox now isolates event
  propagation.** `DataTableViewProps.onRowClick` has always documented that
  "interactive descendants that stop propagation (checkboxes, action buttons) do not
  trigger it". That was true of the actions cell and the detail expander but not of
  the selection checkbox, so ticking a row's box also ran the row-click handler and,
  with roving focus on, moved the current row. It no longer does. If you were relying
  on a checkbox click to reach `rowInteraction.onClick` (or the deprecated
  `onRowClick`), read the selection change from `callbacks.onSelectionChange`
  instead — it reports the transition the checkbox actually caused.

  The selection cell now wraps its checkbox in a `<span class="contents">` to carry
  that isolation. It has `display: contents`, so it generates no box and the cell's
  layout is unchanged — but it is a new node, so a DOM query for the cell's first
  element child now finds the span rather than the checkbox. The handler cannot go on
  the checkbox itself: Base UI renders the visible `<span role="checkbox">` and a
  hidden native `<input>` as siblings, and activating the box dispatches a click from
  the input, which does not pass through the box.

  **None of the three members has a deprecated flat alias**, and that is a limit of
  the alias form rather than an omission: `selectable` / `selectionMode` /
  `isRowSelectable` are flat and carry no place for a policy flag. A caller on the
  aliases migrates to the grouped `selection` config to reach any of them, which also
  brings `getRowId` with it under the identity rule.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - DataGrid: add the public `virtualization` prop — row windowing over the engine's
  existing seam.

  `DataGrid` gains `virtualization` (`estimateRowHeight`, `measure`, `overscan`,
  `scrollToIndex`; every member optional). The windowing mechanism already shipped in
  `DataTable`; this is the config route to it, so a grid virtualizes with
  `virtualization={{}}` plus a bounded height.

  - **A bounded height is required** — either `appearance.height` or
    `appearance.maxHeight`. Without a bound there is no viewport to window against and
    every row renders. The value must be an **absolute length**: a percentage resolves
    against an indefinite containing block, so the scroll viewport grows to its content,
    reports itself bounded, and never scrolls. The engine reports both failures against
    the DOM rather than guessing from the config.
  - **`virtualization={{}}` is a complete configuration.** Design §5.2's defaults (40px
    row estimate, `fixed` measurement, overscan 8) live in the engine, and this layer
    passes through only what the caller set rather than restating them — so one default
    has one home, and "the caller chose 40" stays distinguishable from "nobody chose".
  - **No `getRowId` required.** Windowing is presentation keyed by row index, not by row
    identity.
  - Windowing applies to the **display-row** list rather than to the records, so row
    index and count metadata survive (design §7), and pagination plus virtualization
    windows the current page.

  `measure: 'dynamic'` measures each rendered row instead of trusting the estimate; use
  it for variable-height content. `scrollToIndex` scrolls a row into view and again
  whenever the value changes, so it reads as state rather than as a one-shot command.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - feat(data-table): publish the flexible DataTable composition API

  The table-feature-parity foundation (one controller owning the normalized state
  and single TanStack instance, framework-neutral state/change/query contract,
  seven-key engine-option allowlist, and analyzable custom-feature plugin surface)
  was implemented and tested but never exported. It is now public from
  `@constructor-lab/ui-react`:

  - `useDataTable` controller hook (`DataTableController`, its options unions, the
    `IdentityFreeDataTableState` helper, and the `DataTableToggleAction` imperative
    actions), plus the deprecated compatibility overload.
  - `DataTableRoot` / `useDataTableRoot` / `DataTableView` composition primitives.
  - Typed render contexts (`createHeaderContext`, `createRowContext`,
    `createCellContext`, `createStateContext`) that expose values/metadata/commands
    only — never preassembled product chrome.
  - The framework-neutral contract (`DataTableState`, `DataTableSlice`,
    `DataTableQuery`, `DataTableChangeEvent`, descriptors, serializable types),
    query helpers (`createDataTableQuery`, `createDataTableRequestKey`,
    `serializeDataTableRequest`), and state helpers
    (`createDefaultDataTableState`, `useControllableDataTableSlice`).
  - The React-only engine escape hatches: `DataTableEngineOptions` allowlist
    (`DATA_TABLE_SAFE_ENGINE_OPTION_KEYS`, `normalizeDataTableEngineOptions`,
    `TANSTACK_TABLE_OPTION_CLASSIFICATION`) and the custom-feature plugin surface
    (`DataTableEnginePlugin`, its manifest/registrar types,
    `inspectDataTablePluginTopology`, `prepareDataTableExtensions`).

  The existing `DataTable`, `DataTableToolbar`, `DataTablePagination`,
  `DataTableViewOptions`, and `DataTableColumnHeader` exports are unchanged; the
  standard product-chrome companions remain frozen one-minor compatibility
  adapters that move behind DataGrid and are removed next major.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - DataTable: split the expansion domains so `detailExpansion` and `tree` are
  independent (ADR-0001).

  TanStack Table ships one expand/collapse feature and its row model walks
  `row.subRows` only, so it is an identity transform for detail expansion and
  exactly what a tree needs. The controller now binds `state.expanded`,
  `getExpandedRowModel()` and `onExpandedChange` to the **`treeExpanded`** slice,
  and detail expansion became a library-owned render-layer projection over
  **`detailExpanded`** — a detail row never enters `getRowModel().rows`,
  `flatRows` or `rowsById`, and it consumes no pagination slot.

  `DataTableRowContext` gains two namespaces:

  - `row.detail` — `{ isExpanded, canExpand, toggle }`
  - `row.tree` — `{ isExpanded, canExpand, toggle, depth, hasChildren, loadState }`

  `row.isExpanded`, `row.canExpand` and `row.toggleExpanded` are kept as
  **deprecated aliases of the `detail` domain** for this compatibility line and
  are removed in the same major as the other table compatibility adapters. Because
  those values were already driven by `detailExpanded`, aliasing them to detail is
  a zero-behavior-change migration.

  `DataTableController` gains `getExpansion()`, reporting `treeEnabled`,
  `detailEnabled` and the detail-domain `canExpandDetail` predicate.

  Migration notes:

  - The deprecated `getRowCanExpand` / `renderExpandedRow` props are unchanged:
    while no tree is configured they keep TanStack's `expanded` on the detail
    slice, so column cells that call `row.getIsExpanded()` /
    `row.toggleExpanded()` behave exactly as before.
  - Supplying **both** `getSubRows` and `renderExpandedRow` previously produced a
    single conflated expand state. It now produces two independent ones: the tree
    disclosure drives `treeExpanded` and the detail panel drives `detailExpanded`.
    No known call site combines them.
  - **`getSubRows` on its own now counts as a tree**, with or without a `tree`
    config — subrows are what the expand row model walks, so supplying them is
    what declares a tree. Two consequences for a `getSubRows`-only caller:
    `getExpandedRowModel()` is now installed where it previously was not, and
    `state.expanded` is sourced from `treeExpanded`. **Nothing renders
    differently** while `treeExpanded` is empty, which it is until something
    writes to it: the stage short-circuits on an empty expanded state and returns
    its input row model, so only root rows are visible exactly as before. What
    changes is that expanding a row through `treeExpanded` now actually reveals
    its descendants, which is the wire this split existed to connect.
  - `getExpandedRowModel()` is no longer installed for detail-only expansion. It
    was an identity transform there — no dataset without `getSubRows` has subrows
    for it to walk — so rendered output is unchanged.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - DataTable: an internal feature-module registry, a display-row list, two named
  seams, and the `appearance` pass-through (ADR-0002, DataTable half).

  This is a characterization-preserving refactor with one additive public surface.
  It exists so the remaining behavior groups can be built in parallel: adding a
  feature is now one new module file plus one manifest line, instead of edits to
  `data-table-controller.ts`, `data-table-view.tsx` and
  `data-table-render-context.ts` all at once.

  **Internal, no behavior change.** The conditional `useReactTable` option spreads
  and every `on*Change` handler moved into per-feature modules under
  `data-table/data-table-features/`, composed in design §3.5's committed pipeline
  order. Contributions are additive and collision-checked across modules — two
  features setting the same option throws, naming both, rather than letting the
  later one silently win. `data-table-view.tsx` now renders a **display-row list**
  derived over the engine's record rows, so `detail`, `group`, `tree-status` and
  `footer` rows are explicit kinds instead of one hard-coded special case.
  Pagination still counts records, and keyboard roving focus and striping still
  index records, not display rows.

  **New public API, all additive:**

  - `DataTableController.tableId` — a stable DOM id root, so the design §7 ARIA id
    schemes (`${tableId}--detail--${base64url(rowId)}`) have something to root at.
    The detail panel now carries that id, which is what lets an expander button
    point `aria-controls` at an element that exists exactly when the panel is
    mounted.
  - `DataTableController.getFeatures()` — the library-internal registry runtime.
    Not an extension point; the public one is still `plugins` (design §4.1).
  - `DataTableController.getViewBridge()` — the channel the view publishes its
    imperative window operations through. The controller owns the toggle-action
    union but cannot reach the view's scroll container, so `measure-layout` and
    `scroll-to-row` dispatch here. Library-internal.
  - `DataTableView` gains **`stickyFooter`**, the only route by which a footer
    feature's `sticky` option reaches `TableFooter`: a feature renders the
    `<TableRow>` _inside_ `<TableFooter>` and cannot reach the section element.
  - `DataTableView` **appearance pass-through**: `size`, `background`, `borders`,
    `width`, `height`, `maxHeight`, `stickyHeader` and `showHeader` now reach the
    `Table` primitive, plus the `rowClassName` / `rowStyle` / `cellClassName` /
    `cellStyle` / `headerClassName` / `headerStyle` resolvers. Previously the view
    rendered `<Table>` bare inside a hardcoded wrapper, so the primitive's
    presentation and scroll-container props were reachable from a hand-written
    composition and unreachable from DataGrid. Setting `height` or `maxHeight` is
    also what bounds the scroll container, which is the precondition for sticky
    sections and windowed rendering.
  - **Behavior-group keys pre-declared** on the controller options:
    `columnsFeatures`, `grouping`, `footer`, `virtualization` and `persistence`,
    each typed against a config interface owned by its own feature module; and
    `filtering` / `pagination` widened from `boolean` to `boolean | Config`. All
    five new groups are keyed by column ID or index rather than row ID, so they sit
    on the base options and do **not** require `getRowId`. Every member of every
    config is optional at this layer.
  - **`DataTableToggleAction` pre-declared members**: `measure-layout`,
    `scroll-to-row` and `toggle-group`. The two windowing actions dispatch through
    `getViewBridge()`, so implementing them needs no controller change;
    `toggle-group` needs a state slice that does not exist yet. All three throw a
    "not implemented yet" `TypeError` until their owner lands, rather than silently
    doing nothing.
  - `createHeaderContext` takes an optional second `controller` argument. Omitting
    it keeps the previous behavior.

  Migration notes:

  - Nothing is required. Default rendered output is unchanged, and every existing
    suite passes unmodified.
  - If you supplied `filtering` or `pagination` as a boolean, that still works —
    the config object form is new, not a replacement.
  - `DataTableController` gained members, so a hand-written object literal typed as
    `DataTableController` (rather than one returned by `useDataTable`) needs
    `tableId`, `getFeatures` and `getViewBridge`. Test doubles are the realistic
    case.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - DataTable: whole-table footer summaries (U5).

  `TableFooter` already existed and was exported; `DataTableView` simply never
  rendered it. The footer is now a `kind: 'footer'` display row emitted from the
  registry's `tableDisplayRows` point, and the view routes that kind into
  `<TableFooter>` rather than `<TableBody>` — so a footer is never counted as a
  record row by anything walking the body.

  **New controller config, `footer`:**

  - `summaries` — one entry per column, each naming a `columnId` and an
    `aggregate`: `sum`, `avg`, `min`, `max`, `count`, `countDistinct`, or a reducer
    `(rows) => SerializableValue` for anything the named set cannot express. The
    named forms are serializable so a server can compute them instead.
  - `scope` per summary — `'filtered'` (the default) totals every row after
    filtering, sorting and tree expansion but **before** the page slice, so a
    paginated grid shows the grand total; `'page'` totals the visible page only.
  - `render` — owns the footer's cells, receiving the typed footer context.
  - `sticky` — pins the section, mapped onto the view's `stickyFooter` prop.

  **The footer render context** (`DataTableFooterContext`) exposes `summaries`,
  `summaryFor(columnId)`, `rows`, `pageRows`, `visibleColumnIds` and
  `visibleColumnCount`. Each computed `DataTableSummaryValue` carries its `value`,
  its `aggregate` (`'custom'` for a reducer), its `scope` and the `rowCount` it saw,
  so a formatter can branch without re-deriving anything.

  Two behaviors worth knowing:

  - **An empty table has no total, and says so.** Every numeric aggregation returns
    `undefined` rather than `0` for an empty input, because a footer showing `0` for
    an empty table states something false. A column that genuinely sums to zero
    still shows `0`.
  - **Cells follow column _visibility_, not the column definitions.** The footer
    emits one cell per visible column so it lines up with the body; an unsummarized
    column contributes an empty cell rather than being omitted.

  Not included, deliberately: **group-scoped footers.** The design does not address
  them. The display-row kind carries `scope: 'table' | 'group'` so the shape need
  not change later, but only the table scope is emitted.

  One deviation from design §5.2, recorded rather than silent: §5.2 makes
  `summaries` and `render` mutually exclusive, and that rule is enforced at the
  **DataGrid** layer where the caller sits. At the DataTable layer they compose —
  `summaries` is the model and `render` is the presentation — because DataGrid
  itself relies on that composition to format a caller's summaries, and enforcing
  the exclusion here would leave `DataTableFooterContext.summaries` permanently
  empty for every renderer.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - feat(data-table): manual/server query contract + DataGrid data states (P0.6)

  **DataTable (model):**

  - `useDataTable` gains independent manual modes — `manualSorting`,
    `manualFiltering`, `manualPagination`, `manualGrouping` — plus `rowCount` /
    `pageCount` for manual pagination. A manual stage tracks its slice/state and
    emits changes but leaves the client rows untouched (the caller processes them
    server-side); no client row model is installed for that stage.
  - New `onQueryChange` callback fires once per atomic query transition (a change
    to sorting, filters, global filter, grouping, or pagination), carrying the
    previous and next `DataTableQuery` and the canonical request key of the next
    query. A query-changing sort/filter/group resets `pageIndex` in the same
    transition, so only the post-reset key is emitted. The caller owns
    fetch/cancellation and stale-result handling (compare against the latest
    `requestKey`).

  **DataGrid (composed chrome):**

  - New `state="error"` renders an `Alert` (with optional `error` content and an
    `onRetry` button). Loading never infers empty and an error is never treated as
    empty — the engine is fed no rows in the empty/error states so counts and
    pagination stay consistent.
  - New `server` config (`DataGridServerConfig`: `query`, `rowCount?`, `pageCount?`,
    `onQueryChange`) puts the grid in all-manual mode — the query slices are
    controlled from `server.query`, pagination controls drive server navigation,
    and every atomic query transition calls `server.onQueryChange`. DataGrid never
    sorts, filters, or slices client rows in server mode.

  Stories added: `ErrorState`, `Server`. The all-results server-selection token
  (design §3.6) remains a follow-up.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - DataTable: add the `persistence` restore/save engine (U10, DataTable half).

  Persisted table preferences behind a versioned storage envelope (design §8). The
  mechanism lives in DataTable so a direct `useDataTable` caller gets it without
  DataGrid; the `persistence` config prop on DataGrid follows separately.

  - **New `data-table-persistence.ts`** — the engine. `planDataTableRestore` turns a
    stored payload into a list of slice writes (validate → migrate → prune), and
    `useDataTablePersistence` runs it from the `persistence` feature module's
    `effects` hook, then saves whenever a managed slice changes.
  - **Restore lands after the column model normalizes and before interaction**
    (§6.13) by virtue of being a mount effect, and emits `requestChange(…,
'restore')` — the first emitter of a `DataTableChangeCause` that has existed
    since F1 with nothing producing it.
  - **Validation and pruning are distinct.** An unknown column id is schema
    evolution: the entry is pruned and the rest of the slice restores. A wrong type
    is corruption: the whole slice is discarded. Pruning is against
    `getAllLeafColumns`, so a hidden column's stored width still restores.
  - **No live row state by default, enforced at compile time.** Selection,
    detail/tree expansion and the current row are not merely absent from the default
    `include` set — they cannot be named in it, and adding one fails to compile
    (`_AssertNoRowStatePersisted`). `pagination` is nameable but not default.
  - **Two new `DataTableFeatureGates` members**, `controlledSlices` and
    `defaultedSlices`, derived from the own-keys of the controller's `state` and
    `defaultState` props. A resolved state snapshot cannot express "the caller did
    not ask for this", so neither exclusion is derivable from it.
    - A **controlled** slice is excluded from restore **and** save: the controller
      declines to commit one but still emits its change event, and a controlled
      caller applying that event is the overwrite `behavior.md:462-468` forbids.
    - A **`defaultState`** slice is excluded from **restore only**. It is just the
      caller's initial value, so later user changes to it are still saved —
      collapsing the two sets would silently disable persistence for any slice the
      caller gave a default.
  - **Write discipline:** nothing is written before the restore attempt settles (a
    mount write would delete the payload before reading it), and a restore itself
    writes nothing. Storage is touched only inside effects, so server rendering
    never reaches an adapter.

  No public API change in this changeset — `DataTablePersistenceConfig` is reachable
  through `DataTableControllerOptions` and the DataGrid prop lands with the config
  group.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - feat(data-table): show a column's prospective width while a resize handle is dragged

  A thin vertical line, spanning the whole table, marks where the dragged column's
  edge will land. **Not decoration:** `columnsFeatures` defaults
  `columnResizeMode` to `'onEnd'`, so the column does not move until release — until
  now, grabbing a handle produced no response at all and the new width appeared with
  the pointer already up. In that mode the line is the interaction's only visible
  half.

  - It tracks the **prospective** width, `clamp(startSize + delta, minSize,
maxSize)`, mirroring `table-core`'s own arithmetic (the `-0.999999` floor and the
    two-decimal rounding included). The clamp is load-bearing: TanStack writes the
    dragged width unclamped and clamps on _read_, so an unclamped line keeps
    travelling after the column has stopped at its minimum — asserting a width the
    release cannot produce.
  - It is painted on the **container box** (`[data-slot="table-container"]`) as an
    `::after`, at the z ladder's new `55` rung — above every sticky rule, below the
    scrollbar. Hosting it inside a header cell would have grown the viewport's
    scrollable overflow and resized the scrollbar mid-drag.
  - Available to any composer, not just `DataGrid`: it keys off the engine's own
    drag state, so wiring a handle to `resizeHandleProps` is enough.
  - Styled from the `Resizable` token tier (`--ui-resizable-border-width` /
    `-color-active`), which is the kit's existing vocabulary for a resize divider
    being dragged.

  **New:** `Table.containerStyle` — the counterpart to `containerClassName`, for
  giving the scroll container's box a value a class cannot express (a computed
  length, or a custom property driving a rule `containerClassName` declares).
  `containerProps` remains the escape hatch for the _scrolling element_, which is a
  different node. `width` still wins over `containerStyle` on conflict.

  Not covered by visual regression: a screenshot cannot capture a drag, so those
  baselines are unchanged and say nothing about this feature.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - feat(data-table): selection model + DataGrid selection/actions/bulk chrome (P0.5)

  **DataTable (model):**

  - `useDataTable`'s `selection` option now accepts a config —
    `{ mode?: 'single' | 'multiple'; isRowSelectable?; reserve? }` — mapping to the
    engine's single/multi row selection and per-row eligibility. `reserve` keeps
    selected IDs absent after a data replacement instead of pruning them.
    `DataTableSelectionConfig` is exported.

  **DataGrid (composed chrome):**

  - Now runs on the identity controller branch (a `getRowId`, defaulting to the row
    index) so selection, actions, and bulk operations have stable row identity.
  - New `selectionMode` (`single` hides the header select-all and keeps one row
    selected) and `isRowSelectable` (ineligible rows get a disabled checkbox and
    are skipped by select-all).
  - New `actions` prop renders a per-row action menu (`ButtonIconMenu` +
    `DropdownMenu`) with per-row disabled predicates; destructive items route
    through `ConfirmDialog`. Action controls stop row click/selection propagation.
  - New `bulkActions` prop renders a selection bulk-action bar (`Button`s + a
    selected-count + clear) shown while rows are selected, with destructive actions
    confirmed via `ConfirmDialog`. Each action receives the selected rows.
  - Exports: `DataGridActionsConfig`, `DataGridRowAction`, `DataGridBulkAction`,
    `DataGridActionConfirm`, `createActionsColumn`, `DataGridBulkActions`.

  **Row/cell interaction (DataTableView + DataGrid):**

  - `DataTableView` gains typed pointer/activation events — `onRowHover`,
    `onRowActivate` (Enter while the row is focused, or double-click), `onCellClick`,
    and `onCellHover` — and `onRowClick` now receives a `DataTableRowPointerEvent`
    carrying the row context and native event. New event types
    `DataTableRowPointerEvent`, `DataTableRowActivationEvent`, and
    `DataTableCellPointerEvent` are exported.
  - New `currentRow` prop enables current-row **roving focus**: body rows share one
    tab stop, Up/Down move the current row one visible record, Home/End jump to the
    first/last, Enter activates, and the current row carries `aria-current`.
    Interactive descendants stay tabbable and do not activate the row.
  - DataGrid exposes `currentRow`, `onRowActivate`, `onRowHover`, `onCellClick`,
    and `onCellHover` (called with the row data / column id) over the shared
    controller.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - feat(data-table): sorting model + DataGrid sortable-header and column-filter controls (P0.4)

  **DataTable / Table (model + presentation):**

  - `useDataTable`'s `sorting` option now accepts a config —
    `{ mode?: 'single' | 'multiple'; cycle?; maxColumns? }` — in addition to
    `boolean`. It maps to the engine's multi-sort, sort-removal, desc-first, and
    multi-sort column cap. `DataTableSortingConfig` is exported.
  - The header render context gains `sortCount` and a `sortDescription`
    (`"sorted descending, priority 2"`) for accessible multi-sort priority.
  - `DataTableView` gains a `sortable` prop that presents the standard
    sortable-header affordance for every sortable column (driving the Table
    primitive's sort button/icon/`aria-sort`), with Shift-activation adding to a
    multi-sort. `renderHeader` now also receives the column's default rendered
    content so a projection can wrap rather than replace the label.
  - The `Table` primitive's `TableHead` presents multi-sort priority via a new
    `sortPriority` prop, and its `onSort` now receives the originating mouse event
    (so callers can detect Shift for multi-sort). Backward compatible.

  **DataGrid (composed chrome):**

  - New `sortable` and `multiSort` props present sortable headers on the shared
    controller, with visible 1-based priority for multi-column sorts.
  - New `filters` prop renders per-column filter controls (a `Filter` +
    `Popover` with an operator `Select` and value `Input`), applied-filter
    `Chip`s, and a reset control — all driving the one DataTable engine with AND
    logic. Supported operators: `equals`, `notEquals`, `contains`, `startsWith`,
    `greaterThan(OrEqual)`, `lessThan(OrEqual)`, `in`, plus `isEmpty`/`isNotEmpty`.
    `DataGridColumnFilterDef`, `DataGridFilterOperator`, `DataGridFilterValue`,
    `operatorFilterFn`, `evaluateFilterOperator`, and `FILTER_OPERATOR_LABELS` are
    exported.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - feat(data-table): window the body over `@tanstack/react-virtual` (U6a)

  `DataTable`'s body-window seam is now a real windowing implementation. Reachable
  today through the controller — `useDataTable({ virtualization: { … } })`; the public
  `DataGrid` `virtualization` prop is deliberately **not** declared yet (U6b), so that
  it never ships with a known gap in the focus rules the kit enforces on itself.

  ```tsx
  const controller = useDataTable({
    columns,
    data: rows, // 10,000 of them
    virtualization: { estimateRowHeight: 40, measure: 'fixed', overscan: 8 },
  });
  // height, NOT maxHeight — see the precondition below.
  <DataTableView height={400} />;
  ```

  Defaults are `api.yaml`'s: **40px / `fixed` / overscan 8**. `measure: 'dynamic'`
  re-measures each rendered row and corrects the reserved scroll height; `scrollToIndex`
  scrolls when it changes. Windowing applies to the **display-row** list, so record
  counts, selection, filtering, expansion and page counts continue to use the full row
  model — verified with a 500-row table selecting a row far outside the window.

  The pre-declared **`measure-layout`** and **`scroll-to-row`** toggle actions now reach
  the seam through the view bridge instead of throwing. They still throw with the
  feature off, and again after the view unmounts, rather than quietly no-opping.

  **The bounded-container precondition is `height`, not `maxHeight` — and this is a
  correction to `api.yaml`, which says either will do.** A `maxHeight` on its own clamps
  the scroll container but leaves its `height` at `auto`, so the viewport's `height: 100%`
  has no definite parent to resolve against and grows to its content instead. Measured in
  a browser at `maxHeight={400}` over 10,000 rows: container 400px, **viewport 400040px**,
  no spacers, all 10,000 rows in the DOM — and the table could not be scrolled at all.
  Virtualization is completely inert in that configuration.

  Two development errors therefore guard it, because one of them can pass while the
  feature is dead:

  - no `height`/`maxHeight` at all — the container never asked to be bounded;
  - **the viewport is taller than the container that bounds it** — it asked, but the
    geometry did not follow. This is the one that catches the `maxHeight` case, and it
    names both measured heights, because the failure is otherwise silent.

  The underlying container behaviour belongs to `Table`/`ScrollArea` rather than to the
  seam, and is filed separately; the second error makes it loud in the meantime.

  **Design §7 focus clauses 1 and 2**, which are one mechanism rather than two — "pinning
  cannot retain the focused row" is the same condition as "the pin budget is exhausted":

  - A focused row is **pinned outside the overscan** by _extending the contiguous range_
    through the virtualizer's own `rangeExtractor`, never by appending out of order.
    `bodyWindow.rows` stays one flat index space, and the spacers stay exact by
    construction rather than by care. Verified in a browser with `overscan: 2` over 10,000
    rows: the window extended to keep the focused row mounted and `document.activeElement`
    unchanged.
  - Past a bounded pin budget the row is released and **focus moves to the scroll
    container**, without touching the logical current row — the seam cannot reach that
    state at all. The guard is "focus was ours and has since been lost to `<body>`", not
    "focus is still inside the container": by the time any effect runs the row is gone and
    the browser has already moved focus to `<body>`, so the latter is false exactly when
    the hand-off is needed.

  Focus is tracked from a `focusin` listener on the scroll container. Recording it while
  attaching row refs cannot work — that happens during commit, but the range is decided
  during render, and focusing a row causes no render, so the value would always be one
  render stale and in practice never set at all.

  `@tanstack/react-virtual` moves from `devDependencies` to **`dependencies`**, matching
  `@tanstack/react-table`. It was already imported by shipped source (`tree.tsx`) and
  resolved only because the bundler inlines it; this seam adds a second import. It is
  deliberately still not externalised — that is a separate question about consumer
  bundles.

  Clauses 3 and 4 of §7 (the same-index → previous-last → toolbar → scroll-container
  fallback after data removes the focused row, and the single `data-reconcile` event) are
  **not** in this change.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - feat(data-table): fall back to a neighbouring row when data removes the current one (§7 clauses 3–4)

  When a data change removes the row that holds roving focus, `DataTable` no longer just
  **clears** the current row — which stranded the keyboard user, because the next arrow
  key had nowhere to resume from. It now falls back, per design §7 clause 3
  (`data-grid/behavior.md:275-276`):

  - **rung 1, same index** — the row that shifted into the vacated position becomes
    current;
  - **rung 2, previous last** — when the vacated index no longer exists (the removed row
    was at or past the new end), the last surviving row becomes current;
  - **rung 3, the toolbar** — with no row surviving, DOM focus moves to the first
    focusable control of the `DataGrid` toolbar, found by query
    (`[data-slot="data-grid-toolbar"]`) rather than by any new prop or ref;
  - **rung 4, the scroll container** — when there is no toolbar, or its controls are all
    inert, or it holds none at all, focus moves to the table's scroll container instead.

  The current row is still **cleared** when no row survives: rungs 3 and 4 move DOM focus
  and touch no state, which is design §7's "without changing logical current row".

  **Position is measured over the visible list — `getRowModel().rows`, with group headers
  excluded — not over `data`.** Roving focus is a visual affordance, so the index a user
  perceives is the one in the post-filter/sort/pagination list they can see. Group rows
  are in that list and cannot hold roving focus, so counting them would land rung 1 on a
  group header. Tree descendants **are** records and **do** occupy positions, so they are
  counted.

  **§7 clause 4 — "exactly one `data-reconcile` event updates the current row"** — holds
  structurally rather than by care: the whole chain resolves to a single value before one
  request is issued, so there is no branch that can emit a clear followed by a set. A
  controlled caller applying both would otherwise see the current row blink out and back.

  **Behaviour change for controlled callers.** A caller that mirrors `currentRowId` will
  now receive a row id where it previously received `undefined` after a removal. The
  `cause` is still `data-reconcile`, and `rowInteraction: { reserve: true }` still opts out
  of reconciliation entirely.

  **A rung-3 miss falls THROUGH to rung 4; it is never a landing.** That path is the
  ordinary one, not an edge case, and in two different ways: `DataGrid` renders no toolbar
  row at all unless `toolbar` is passed or a search column exists, and a toolbar that does
  render can still hold no focusable control (`toolbar={{ viewOptions: false }}` with no
  search column and no active filter). Focusing the toolbar row itself was considered and
  rejected — an empty layout div announces nothing to a screen reader, so it would turn a
  miss into a silent dead end. Controls that are `disabled` or `aria-disabled` are skipped
  for the same reason: `.focus()` on an inert control leaves focus where it was.

  **Focus is only taken when it was lost from this table.** Two conditions, and they reject
  different mistakes: focus must have been inside the table and not deliberately moved out
  of it since, and the removed current row must have been one the person could actually see
  (a current row that was filtered out or on another page never held DOM focus, so moving
  focus would take it from wherever they are). Without the first, a background refresh that
  empties an untouched table would pull focus into it out of nowhere.

  `DataGridToolbar` now carries `data-slot="data-grid-toolbar"`. It is the only markup
  difference between it and the frozen `DataTableToolbar` adapter, which is asserted in
  both directions.

  **Not verified in a browser.** happy-dom has no layout engine, so the tests assert which
  element receives focus and in what order — not that the scroll container can then be
  scrolled, which is part of why rung 4 is useful to a person. See the CI gap in the
  project's issue [#78](https://github.com/constructor-lab/ui-component-library/issues/78).

- [#61](https://github.com/constructor-lab/ui-component-library/pull/61) [`b85e708`](https://github.com/constructor-lab/ui-component-library/commit/b85e708e6fba897b2886b240f40a4d50744aea7e) Thanks [@leonid](https://github.com/leonid)! - feat(search-global): deprecate `SearchGlobal`

  `SearchGlobal` is retired — it is gone from the app-shell layouts (Figma nodes
  6226-24149 / 6226-24150), where search now lives in the sidebar rather than the
  top bar. The component and its `SearchGlobalProps` are marked `@deprecated` (IDE
  strikethrough + a deprecation note); it still renders for now but should not be
  used in new work, and existing usages should move to their surface's own search
  affordance. Slated for removal in a future major.

- [#62](https://github.com/constructor-lab/ui-component-library/pull/62) [`bb636fb`](https://github.com/constructor-lab/ui-component-library/commit/bb636fb58da6bdf85e59ae2d28836497b5ab1594) Thanks [@leonid](https://github.com/leonid)! - feat(fitted-actions): add `FittedActions`

  A responsive action row that collapses overflowing actions into a "More" dropdown
  menu, recomputing on resize (ResizeObserver + off-screen measurement). Config-driven
  via an `actions` array (`{ id, label, icon?, isDisplayed?, divided?, disabled?,
onSelect? }`), with `renderAction` / `renderTrigger` overrides and a `showDropdown`
  toggle; the pure fit math is exported as `computeFittedVisibleCount`. A React
  reimplementation of the ui-kit Vue `AvFittedActions`; it also backs the Toolbar's
  `ToolbarActions` responsive overflow. Initial version; design reconciliation pending.

- [#80](https://github.com/constructor-lab/ui-component-library/pull/80) [`054ed24`](https://github.com/constructor-lab/ui-component-library/commit/054ed24bbd26044d6718a251e74225aa491df83f) Thanks [@leonid](https://github.com/leonid)! - Add `FunnelChart` — a typed funnel-chart composition over the shared `Chart`
  primitives. Plots a `data` list of stages (sized by `dataKey`, named by
  `nameKey`) as a narrowing funnel with tooltip and on-chart labels. Variant:
  `lastShape` (triangle point / flat rectangle); `reversed` flips the taper;
  `showLabels` / `showTooltip` toggle chrome; `tooltipContent` passthrough. Stage
  colors bind to the theme-invariant `--ui-chart-*` palette.

- [#80](https://github.com/constructor-lab/ui-component-library/pull/80) [`b0de040`](https://github.com/constructor-lab/ui-component-library/commit/b0de0402077f5cb26a8d5667fe64cb4df9897135) Thanks [@leonid](https://github.com/leonid)! - Add `Histogram` — a typed histogram over the shared `Chart` primitives. Buckets
  a flat numeric `data` distribution into `bins` equal-width buckets and plots the
  count per bucket as touching bars, with axes and a tooltip. No variant axis — its
  expressiveness is the binning (`bins`) plus `showGrid` / `showTooltip` toggles
  and a `tooltipContent` passthrough; the binning is a pure exported
  `computeHistogramBins` helper. The count series binds to the theme-invariant
  `--ui-chart-*` palette; axes/grid/chrome resolve to semantic tokens.

- [#78](https://github.com/constructor-lab/ui-component-library/pull/78) [`c6fedc2`](https://github.com/constructor-lab/ui-component-library/commit/c6fedc272e03e2c9b7ded46df75544f96bff1c5b) Thanks [@leonid](https://github.com/leonid)! - Add `LineChart` — a typed line-chart composition over the shared `Chart`
  primitives. Takes `data` + `config` + `dataKeys` + `xKey` and renders a themed
  recharts `LineChart` with tooltip, legend, axes, and grid. Variants: `curve`
  (linear / monotone / step) and `lineStyle` (solid / dashed). Supports
  previous-period comparison overlays (`comparisonKeys`, dashed + dimmed), shaded
  delta bands (`deltaBands`), axis titles + a Y unit, `strokeWidth` / `showDots` /
  `connectNulls`, chrome toggles, and a `tooltipContent` passthrough. Series colors
  bind to the theme-invariant `--ui-chart-*` palette.

- [#79](https://github.com/constructor-lab/ui-component-library/pull/79) [`fd5fe77`](https://github.com/constructor-lab/ui-component-library/commit/fd5fe7765424b958ebcd7b6d741b7288d1868294) Thanks [@leonid](https://github.com/leonid)! - Add `Metric` — a presentational metric card built on `Card`: a label (+ optional
  info tooltip and top-right caption) over a primary value with an optional
  status-tinted icon badge, unit, metadata badge and a composed `TrendIndicator`,
  plus optional supporting text and a composable `children` body (a chart, a
  `Meter` breakdown, a `Separator`, an insight line). `size` scales the typography;
  `loading` swaps the value for a skeleton.

  `status` (neutral / info / success / warning / danger / critical) tints **only**
  the icon badge — the `--ui-background-status-<s>-pressed` fill with the
  `--ui-text-on-status-<s>` icon color — never a full fill, so many metrics read
  calmly on one dashboard. `Timeline`'s status marker uses the same pairing.

  Design-pending v1: no Figma node exists for a metric card, so there is no
  `--ui-metric-*` tier — the composed `Card` supplies the surface and the shared
  semantic tokens supply the rest.

- [#78](https://github.com/constructor-lab/ui-component-library/pull/78) [`f91c4c4`](https://github.com/constructor-lab/ui-component-library/commit/f91c4c4f148a4a3da1263c3cd7c7d45705fff9cc) Thanks [@leonid](https://github.com/leonid)! - Add `PieChart` — a typed pie/donut-chart composition over the shared `Chart`
  primitives. Takes `data` + `config` + `dataKey` (slice value) + `nameKey` (slice
  label) and renders a themed recharts `PieChart` with tooltip and legend. One
  variant: `shape` (pie / donut). Supports a donut `centerLabel` (headline value +
  caption, legend-aware centering), `innerRadius` / `outerRadius` / `paddingAngle`,
  chrome toggles, and a `tooltipContent` passthrough. Slice colors bind to the
  theme-invariant `--ui-chart-*` palette.

- [#80](https://github.com/constructor-lab/ui-component-library/pull/80) [`c9fd237`](https://github.com/constructor-lab/ui-component-library/commit/c9fd2372815dd89d8be29bb419ebda2fbc9a7f6e) Thanks [@leonid](https://github.com/leonid)! - Add `RadarChart` — a typed radar (spider) chart over the shared `Chart`
  primitives (the kit's first polar type). Plots one radar area per `dataKeys`
  entry around a categorical `angleKey` web, with tooltip and legend. Variant:
  `gridType` (polygon / circle web); `fillOpacity` / `strokeWidth` / `showDots` and
  chrome toggles; `tooltipContent` passthrough. Series colors bind to the
  theme-invariant `--ui-chart-*` palette. Polar spoke labels are themed via a local
  workaround for a shared-primitives gap (the container themes cartesian ticks, not
  polar ones) — the shared `chart.tsx` is left untouched.

- [#80](https://github.com/constructor-lab/ui-component-library/pull/80) [`e32e2e3`](https://github.com/constructor-lab/ui-component-library/commit/e32e2e3266777baa76853665996b38573bdf2d07) Thanks [@leonid](https://github.com/leonid)! - Add `RadialBarChart` — a typed radial-bar chart over the shared `Chart`
  primitives (a polar type). Plots one concentric arc per `data` row, sized by
  `dataKey` and named by `nameKey`, with a background track, tooltip, and legend.
  No variant axis — its expressiveness is geometry (`startAngle` / `endAngle` +
  `innerRadius` / `outerRadius`, so a caller can build a full ring or a half-circle
  gauge) plus `showBackground` / chrome toggles and a `tooltipContent` passthrough.
  Arc colors bind to the theme-invariant `--ui-chart-*` palette.

- [#80](https://github.com/constructor-lab/ui-component-library/pull/80) [`b99a594`](https://github.com/constructor-lab/ui-component-library/commit/b99a5944ca23044a705c76e9fbc4eeed0fa96ea1) Thanks [@leonid](https://github.com/leonid)! - Add `ScatterChart` — a typed scatter/bubble-chart composition over the shared
  `Chart` primitives. Takes a `series` list (each `{ key, data }`) + `config` +
  numeric `xKey` / `yKey` and renders a themed recharts `ScatterChart` with
  tooltip, legend, axes, and grid. Optional `zKey` (+ `zRange`) maps a third field
  to point size (a bubble chart); `shape` sets the marker; axis titles + unit
  suffixes and chrome toggles are supported. No CVA variants (expressiveness is in
  the data mapping). Series colors bind to the theme-invariant `--ui-chart-*`
  palette.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - ScrollArea: expose the viewport, and stop scrolled content painting over the
  scrollbar.

  **`viewportRef` and `viewportProps`.** `ref` reaches the root, which is
  `overflow: hidden` and never scrolls — it reports `scrollTop: 0` and
  `scrollHeight === clientHeight` forever. Anything that measures, observes or
  programmatically scrolls the region needs the viewport: a virtualizer's scroll
  element, an infinite-scroll observer, a scroll-to-item call. `viewportProps`
  carries a scroll handler, a tab index, or `data-*` attributes that have to sit on
  the element that actually scrolls.

  **Fix: the scrollbar is no longer painted over by scrolled content.** `ScrollBar`
  was `z-index: auto` and the root was `position: relative` with no z-index —
  therefore not a stacking context — so any z-index used by content _inside_ the
  scroll area outranked the scrollbar, and outranked everything outside the scroll
  area too. A sticky table header is the case that surfaced it: the header stacked
  above the bar and hid its top edge exactly where a long table is most likely to be
  scrolled.

  Two changes together: the root now sets `isolation: isolate`, and `ScrollBar`
  takes a z-index above content. Isolating is what keeps the second change local —
  the scrollbar only outranks content in its own scroll area, and content inside can
  no longer outrank overlays outside.

  `isolation` is used deliberately rather than `contain` or a `transform`: those
  create a containing block and would break `position: sticky` inside the viewport.
  Verified in a browser that sticky positioning and both horizontal pin directions
  are unaffected.

  **Possible behavior change for consumers:** if you relied on a z-index inside a
  `ScrollArea` to paint above something outside it, it no longer will. In practice
  the root has always been `overflow: hidden`, so non-portalled content could never
  escape the box anyway; Base UI overlays portal out and are unaffected.

  **Measured, not assumed: nothing in this kit changes appearance.** Isolating can
  only alter painting where a descendant inside the scroll area carries a `z-index`.
  Every current consumer was checked in a browser — `SidebarSecondary`,
  `SidebarPrimary`, `AppShell` and `Tree` — and **none has a single z-indexed
  descendant inside a scroll area**, so for all of them the change is provably inert.
  Screenshots with and without `isolation` are byte-identical for `SidebarSecondary`
  and `AppShell`. `Table` is the only consumer that stacks inside its scroll area,
  which is the case this exists for.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - Table: add `TableHead`'s `trailing` slot, for controls that must sit outside the
  sort button.

  `children` is the column label, and a `sortable` header wraps its label in a
  `<button>`. A control passed as `children` therefore became a descendant of that
  button, where a pointer release fires `onSort`, Enter/Space sorts instead of
  acting, and the button's accessible name absorbs the control's label. Since a
  records grid is normally sortable _and_ resizable, that was the common case
  rather than an edge case.

  `trailing` renders as a sibling of the sort button, so its content keeps its own
  events, focus and accessible name. Non-interactive decoration of the label (a
  unit hint, an info icon) can stay in `children`; only controls must not nest.

  Additive and layout-neutral — the slot adds no wrapper element, so a header cell
  without `trailing` renders exactly as before.

  This is the primitive half of the column-resize seam: `DataTableView` routes
  `ColumnPresentation`'s `placement: 'edge'` header adornments into it, so a
  column resize handle or reorder grip mounts there.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - Table: add the presentation cluster and the scroll/sticky container.

  `Table`, `TableRow` and `TableHead` had fixed classes against `--ui-table-*` and
  no variants at all. This adds the box/surface cluster the table-parity design
  calls `appearance`, plus the sticky and pin surfaces that virtualization,
  footers and grouping all need. Everything is additive and every default
  preserves today's rendered output.

  `Table`:

  - `size` — `'small' | 'medium' | 'large'` cell density. `medium` is the shipped
    metric set.
  - `background` — `'transparent' | 'accent' | 'subtle' | 'surface'`. Legacy
    `backgroundColor` (transparent / solid-brand-accent / solid-brand-lightest /
    fixed-white) normalizes onto these. The variant also publishes the surface a
    sticky or pinned cell paints over scrolling content.
  - `borders` — independent `top` / `bottom` / `horizontal` / `vertical`, each
    `false | true | 'subtle' | 'default' | 'strong'`. Each dimension resolves on
    its own; only `horizontal` is on by default (the shipped row divider).
  - `width` / `height` / `maxHeight` on the scroll container (a bare number is
    px), plus `containerRef`, `containerClassName` and `containerProps`. The
    container reports `data-bounded` once a height is set — the precondition for
    sticky sections and for windowed rendering.

  `TableHeader` / `TableFooter`: `sticky` pins the section to the top / bottom of
  a bounded container.

  `TableRow`: `current` (`aria-current` + `data-current` and a layout-neutral
  leading marker; never `aria-selected`, so current and selected stay
  independent), `expanded` (`aria-expanded` + `data-expanded`; Table never renders
  or toggles the child content), and `sticky` + `stickyOffset` for group headers.

  `TableHead` / `TableCell`: `pinned` (`'start' | 'end'`) + `pinOffset`. Table
  presents the pin and marks the cell `data-pinned`; the owner decides which
  columns are pinned and supplies the accumulated offset.

  Notes:

  - `border-collapse: collapse` paints row borders on the table's border grid, so
    a sticky header's divider would scroll away with the content. Sticky sections
    draw it as an inset hairline in the same row-divider token instead, and
    `borders.horizontal: false` removes that hairline too.
  - The stacking order is fixed so the three sticky mechanisms compose: pinned
    body cell < sticky group row (pinned within) < sticky header/footer (pinned
    within).
  - `Table` now exports `tableVariants` and the `TableProps`,
    `TableHeaderProps`, `TableFooterProps`, `TableCellProps`, `TableBorders`,
    `TableBorderValue`, `TableBorderStrength` and `TableColumnPin` types.
  - No `showHeader` property: a header Table is not given is a header it does not
    render, so hiding it stays the owner's composition.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - Table: the scroll container is now `ScrollArea`, so table scrollbars match the
  rest of the kit.

  Previously the container was a plain `div` with `overflow: auto`, which meant
  every table showed whatever scrollbar the platform draws. It is now the kit's own
  `ScrollArea`, with overlay scrollbars that reserve no layout space.

  **`containerRef` and `containerProps` now reach the element that actually
  scrolls.** `ScrollArea`'s outer box is `overflow: hidden`; the viewport inside it
  is the scroller. Both are wired to the viewport, so a ref you hold reports real
  `scrollTop`/`scrollHeight` and an `onScroll` you pass fires for the scroll you can
  observe. `data-bounded` moved to the viewport for the same reason — it marks the
  element an owner is given, not the wrapper around it.

  **`containerClassName`, `width`, `height` and `maxHeight` still apply to the outer
  box**, which is what sizes the region.

  **Why the container is two elements.** The box that sizes the region and the
  element that scrolls cannot be the same node: an element carries exactly one
  `data-slot`, the viewport already carries `data-slot="scroll-area-viewport"`, and
  overriding that would break `ScrollArea`'s own contract. So
  `data-slot="table-container"` names the outer box and the viewport does the
  scrolling. This is not a side effect of where the box styles went — putting
  `height`/`maxHeight` on the viewport measures identically and would still leave
  the slot on the box.

  **Breaking for anyone attached to the container element.** `Table` is published,
  and the element that scrolls has moved _inside_ the chain: it is now
  `ScrollArea`'s viewport rather than the outer box. A scroll listener, an
  `IntersectionObserver`, a `scrollTo` call, or CSS written against the container
  now targets a node that no longer scrolls, and will silently do nothing rather
  than error. Use `containerRef` — it points at the scrolling element — or query
  `[data-slot="scroll-area-viewport"]`.

  Migration, for anyone reaching into the DOM:

  - `table.parentElement` is **no longer** the scroll container — the table's parent
    is `ScrollArea`'s content wrapper. Use `[data-slot="table-container"]` for the
    box, or `[data-slot="scroll-area-viewport"]` for the scroller.
  - The box no longer has `overflow-auto`; it is `overflow-hidden`, and the viewport
    scrolls.
  - The box always carries an inline `style` now (`ScrollArea` sets its position and
    corner-size custom properties), so asserting the style attribute is absent no
    longer works — assert on the specific properties you care about.

  Sticky headers, sticky footers, sticky group rows and both column pin directions
  are unaffected: verified in a browser under simultaneous vertical and horizontal
  scroll, positioned identically to the previous container. `ScrollArea` isolates
  its stacking context rather than using `contain` or a `transform`, which would
  create a containing block and break sticky.

- [#79](https://github.com/constructor-lab/ui-component-library/pull/79) [`fd5fe77`](https://github.com/constructor-lab/ui-component-library/commit/fd5fe7765424b958ebcd7b6d741b7288d1868294) Thanks [@leonid](https://github.com/leonid)! - Add `Timeline` — a chronological event list for activity feeds, audit logs and
  status history. `Timeline` is a semantic `<ol>`; each `TimelineItem` is an `<li>`
  laying out a 32px marker, a 1px connector rail (hidden on the last item, and
  positioned with a logical inset so it follows the marker under RTL), and a
  bordered content card holding a header (title + optional inline `tag` ·
  right-aligned `timestamp`) over a free-form body, with an optional `actions` row.
  Purely presentational — it never sorts, groups, paginates, fetches, or formats a
  date. `TimelineMarker` is exported for standalone use.

  Derived from the Figma `TimelineItem` component (page `6025:24403`, node
  `7615:7791`) with a real Code Connect mapping. Because the marker there is an
  `Avatar` **instance**, `marker` is a slot; omitting it renders the built-in
  status-tinted mark, whose `--ui-background-status-<s>-pressed` +
  `--ui-text-on-status-<s>` pairing matches `Metric`'s icon badge. No
  `--ui-timeline-*` tier — every colour in the design resolves to an existing shared
  semantic token.

  v1 ships **no `size` / `density` / `current` axes**: the Figma component is a
  single symbol with no variant set, so nothing in the design backs them.

- [#73](https://github.com/constructor-lab/ui-component-library/pull/73) [`21f2b1c`](https://github.com/constructor-lab/ui-component-library/commit/21f2b1cd297a24a3eb220677a2e845fcd0d3f737) Thanks [@leonid](https://github.com/leonid)! - feat(toast): reconcile against the redesigned Figma "Notification" (node 6946-25164) + add `Notification` alias

  - **Restyle** toasts to the new design language (shared with the redesigned
    Alert): white surface (`bg-background`) + **strong status border**
    (`--ui-border-on-status-*-strong`) + a **6px left accent bar**
    (`--ui-background-status-strong-*`) + a **full-color status icon**
    (CircleInfoBlue / CircleCheckGreen / TriangleWarningYellow / DiamondWarningRed)
    - a **compact 32px ButtonIcon** close + a floating shadow. Status maps:
      `success`/`info`/`warning` as-is; `error` → the danger tokens; `loading` and
      untyped toasts stay neutral (plain `border-border`, no accent).
  - **Add `Notification` / `notification` aliases** (the Figma component is named
    "Notification", and toasts are this kit's notification pattern):
    `Notification` = `Toaster` (the region), `notification` = `toast` (the trigger
    API, with `.success`/`.error`/… helpers), `NotificationProps` = `ToasterProps`.

  Code Connect completed (node 6946-25164); ui-spec index/tokens/anatomy updated;
  VR baselines regenerated.

- [#62](https://github.com/constructor-lab/ui-component-library/pull/62) [`bb636fb`](https://github.com/constructor-lab/ui-component-library/commit/bb636fb58da6bdf85e59ae2d28836497b5ab1594) Thanks [@leonid](https://github.com/leonid)! - feat(toolbar): add `Toolbar`

  A horizontal action bar for selection / list contexts (Figma node 3897-7199),
  built on the Base UI Toolbar primitive — `role="toolbar"` with roving-tabindex
  arrow-key navigation. Composable parts: `Toolbar`, `ToolbarGroup`,
  `ToolbarButton`, `ToolbarLink`, `ToolbarSeparator`, and a non-interactive
  `ToolbarStatus` label. Actions reuse the Button `ghost` tokens (no Toolbar token
  tier); the `disabled` prop maps to the Figma `state` (active | disabled) and greys
  every action while keeping it focusable (`aria-disabled`).

  Also adds `ToolbarActions` — a config-driven, width-aware action list with a
  "priority+" overflow menu (the Figma breakpoints behavior, node 6262-28276). It
  is backed by the new `FittedActions` component: overflowing actions collapse into
  a "More actions" menu, recomputing on resize.

- [#76](https://github.com/constructor-lab/ui-component-library/pull/76) [`5f1f208`](https://github.com/constructor-lab/ui-component-library/commit/5f1f2084d824c27dec22c4764da1a2d24508a3db) Thanks [@leonid](https://github.com/leonid)! - feat(ui-react): cross-cutting CSS base reset, breakpoint scale, portal provider, RTL sweep

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

- [#80](https://github.com/constructor-lab/ui-component-library/pull/80) [`672683a`](https://github.com/constructor-lab/ui-component-library/commit/672683af355e227e9c8a36d50c2471948cbd0dcf) Thanks [@leonid](https://github.com/leonid)! - Add `Treemap` — a typed treemap over the shared `Chart` primitives. Packs a
  hierarchical `data` array into nested rectangles sized by `dataKey`, named by
  `nameKey`, with on-tile labels and a tooltip. Each top-level category owns a
  color and its leaves inherit it, separated by a surface-colored gutter. No
  variant axis — its expressiveness is the hierarchy plus the tile `aspectRatio`
  and `showLabels` / `showTooltip` toggles and a `tooltipContent` passthrough.
  Category colors bind to the theme-invariant `--ui-chart-*` palette; the gutter,
  on-tile labels (on-color text token), and chrome resolve to semantic tokens.

- [#79](https://github.com/constructor-lab/ui-component-library/pull/79) [`fd5fe77`](https://github.com/constructor-lab/ui-component-library/commit/fd5fe7765424b958ebcd7b6d741b7288d1868294) Thanks [@leonid](https://github.com/leonid)! - Add `TrendIndicator` — a small presentational trend/delta indicator: a direction
  glyph, an already-formatted change value, and an optional comparison label. It
  separates **`direction`** (up / down / flat — the arithmetic) from
  **`sentiment`** (positive / negative / neutral — good or bad), because the kit
  cannot assume up = good: revenue ↑ is positive, threats ↑ is negative, MTTR ↓ is
  positive. Two sizes, an `inline` or tinted `badge` variant, an optional tooltip
  (which makes the root keyboard-reachable), and an `ariaLabel` for a full
  accessible sentence.

  Design-pending v1: no Figma node exists for a trend indicator, so there is no
  `--ui-trend-indicator-*` tier — sentiment resolves the semantic
  `--ui-text-on-status-*` colors and the badge their matching
  `--ui-background-status-*`. The `--ui-chart-*` palette is deliberately unused; it
  is reserved for data-series marks.

### Patch Changes

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - fix(data-grid): `columnsFeatures.fit` and `overflowTooltip` now work on their own

  Both are documented props that did nothing unless an unrelated column feature
  happened to be switched on. `columnsFeatures={{ fit: 'content' }}` and
  `{{ overflowTooltip: true }}` reached the engine only alongside `visibility`,
  `pinning`, `resizing` or `reordering`.

  The config layer resolved both members and carried them in the resolved value, but
  the guard in `controllerOptions` discarded the entire config unless one of the four
  _affordances_ was on — so the two members were computed, stored, and thrown away.

  Fixed at that guard, whose question is "does the engine need this config?" — not by
  adding the members to the shared `enabled` flag. `enabled` has three readers and they
  do not ask the same thing: `toolbar` uses it to decide whether a grid opted in at all,
  and widening it would have flipped that ternary and **silently removed the column
  list from the settings menu** of any `{ fit: ... }` caller. That is measured, and a
  test pins it so the predicate cannot be collapsed back into `enabled`.

  `enabled`'s docstring said "any sub-feature enabled", which was false; it is the four
  affordances, and reading it as true is what made the discard guard look correct.

  No behaviour change for a grid that sets neither member, including
  `columnsFeatures={{}}`.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - docs(data-grid): `columnsFeatures.fit` and `.overflowTooltip` document what they actually do

  Both prop docstrings ship in the `.d.ts`, so this is what an editor shows a consumer —
  and both were making a promise the props do not keep.

  **`overflowTooltip`** said "Show a tooltip when a cell's content is truncated", which
  reads as "this flag produces truncation". It does not. It adds `truncate`
  (`white-space: nowrap` + `text-overflow: ellipsis`), and `nowrap` makes the column's
  min-content width the entire string — so under `w-full` + `table-layout: auto` the
  browser widens the column to fit it and nothing ever reaches an overflow edge.
  Measured on deliberately long values with no `maxSize`: the table grew past its
  container and **0 of 16 body cells clipped**. `appearance.width` is not a way round it
  either — that width lands on the bordered box and the table scrolls inside it,
  unclipped. **Declare `maxSize` on the columns that should truncate**; with every column
  capped, 12 of those same 16 cells clip.

  **`fit`** did not say that `'content'` and `'container'` render identically today.
  They produce byte-identical captures (0 of 1,024,000 pixels) with column widths
  agreeing to the decimal: `'content'` emits `min-width: fit-content` and `'container'`
  emits nothing, and a `min-width` floor below the width auto-layout already distributes
  is inert. What both arms _do_ change is dropping the default `min-width: 150px` floor,
  which visibly redistributes unsized columns from even to content-driven — so `fit` is
  worth setting, just not for a difference between its two string values.

  No behaviour change. The two `columnsFeatures` stories added alongside this exercise
  both props standalone, which no story did before.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - fix(data-grid): the pager counts a server-owned selection instead of reporting 0

  User-reported: the pagination row read **"0 of 4 row(s) selected."** over a grid with
  everything selected.

  `server.selection` in `all-results` mode means "everything the query matches except
  `excludedIds`", and the engine's `rowSelection` slice is **deliberately never
  written** in that mode — the controlled token stays authoritative and nothing is
  committed internally. The pager asked `getFilteredSelectedRowModel()`, which counts
  per-row selection, so the numerator was 0 however much was selected. Nothing was
  broken; the pager was asking a question the mode cannot answer.

  `DataGridPagination` takes a new optional `selectedCount` prop, resolved by the config
  layer from the **effective** `resolved.server.selection` — `all-results` counts as
  total minus exclusions, `explicit` counts the owner's enumerated ids, and an
  `all-results` token scoped to a stale `queryRequestKey` resolves away rather than
  being attributed to the current query. A resolved number rather than the
  `DataGridServerSelection` union, so the pager learns no server-selection semantics.

  Absent the prop, the engine's own count stands, so every client-side grid is
  unchanged.

  Known limitation, logged rather than fixed: a caller composing `DataGridPagination`
  directly without supplying `selectedCount` still gets the engine's count, which sees
  only ids inside the loaded window.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - fix(data-grid): the pager's "of N" reports the result total, not the loaded window

  Second, independent half of the pager-label defect. `getFilteredRowModel().rows.length`
  is the **loaded** row set, so under server pagination the label announced one window as
  the whole result set.

  It is self-proving: a grid with `server.rowCount: 4821` and a 4-row window rendered
  "0 of 4 row(s) selected." while its own page counter rendered "Page 1 of 483" — two
  numbers in one component describing the same total, and the component already held the
  right one.

  Now `table.getRowCount()`, which is `options.rowCount ?? prePaginationRowModel.rows.length`
  — the filtered count client-side and the owner's total in server mode. Correct in both
  without a branch and without new plumbing, since `server.ts` already forwards
  `rowCount`. Client-side grids are unchanged.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - fix(data-grid): anchor the column-resize indicator to the column's rendered edge

  User-reported, after the resize fix: "for others its shown at place of previous column
  but resizing properly". The drag indicator was drawn one column to the left for every
  column except the first.

  The line's position was `anchor + prospective width`, where the width came from
  `columnSizingInfo.startSize` — TanStack's **notional** `column.getSize()`. For a
  column with no declared `size` that is the 150px default, while the cell renders at
  whatever `table-layout: auto` distributes to it. The two are unrelated, so the line
  landed short of the column's true trailing edge by `rendered − 150`: measured
  **-198.7px at a 1280px viewport and -412px at 1920px**, which puts it nearer the
  column's leading edge — the previous column's boundary — than its own. The first
  column looked correct because it declares `size: 200` and renders at exactly 200, so
  notional and rendered agree there and nowhere else.

  The anchor was never wrong: measured per column, it equals each column's true left
  edge. The fix separates the two coordinate systems the calculation had been mixing —
  the notional side now contributes only the _displacement_ the commit is allowed to
  make (bounded by `minSize`/`maxSize`, as before), and the measured client rect
  contributes the _origin_. For a column whose declared size the browser honours the two
  are equal and the result is unchanged.

  Measured after the fix, +60 drag: the line sits exactly on the column's trailing edge
  plus the pointer travel for every column, at both 1280px and 1920px.

  **Known residual, for unsized columns only.** The commit is still a notional width, and
  because the unsized presentation arm publishes only `min-width`, `table-layout: auto`
  redistributes the surplus — so after release the edge lands 6–72px from where the line
  was (measured). That is a much smaller and differently-caused error than the -412px it
  replaces, and closing it means giving unsized columns a real `width`, which would change
  at-rest rendering across the kit.

  At-rest rendering is untouched: the indicator only exists during a drag.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - fix(data-grid): a column with an explicit `size` can now actually be resized

  User-reported: dragging the resize handle on a column whose def declares a `size`
  moved the drag indicator but never changed the column's width — "indicator appears
  at a new spot each time but table column width visually not changing".

  `columnPresentation` built the explicitly-sized `<th>` style from the column
  definition's own `size` instead of from `column.getSize()`, which is the only value
  a committed resize updates. The definition's number is a constant, so the emitted
  `width` never moved — and because `minWidth` was pinned to the same constant, the
  column could not be narrowed either. Inert in both directions, while every other
  half of the feature (handle, drag, `columnSizing`, indicator) worked.

  `width`/`minWidth` now read the live `column.getSize()`, so a resize is reflected in
  both the header and the body cells, and the committed width honours the caller's
  `minSize`/`maxSize` via TanStack's own clamp. `maxWidth` deliberately keeps reading
  the caller's `maxSize`, because the resolved column def defaults `maxSize` to
  `Number.MAX_SAFE_INTEGER` and a value with a default cannot express "unset".

  Also: **the drag indicator is no longer drawn for the column at the table's trailing
  edge.** The table is `w-full`, so that column's right edge is fixed by the container
  and a line claiming it is about to move cannot be honoured. The column is identified
  by measuring its trailing edge against the table's, not by index — reordering,
  pinning and horizontal scroll all move the trailing column without moving any index.

  At-rest rendering is unchanged: with nothing recorded in `columnSizing`,
  `getSize()` returns the declared `size`. Verified against the committed visual
  baselines, which are byte-identical.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - fix(data-table): a chosen column width is honoured as a width, not as a floor

  "Restore column preferences" did not restore the width. Storage returned
  `columnSizing: { name: 320 }` and the column rendered at **643.1px**, because a column
  that declares no `size` took the presentation arm that publishes `min-width` only —
  and under `w-full` + `table-layout: auto` a floor below the width the browser already
  distributes does nothing at all.

  The same mismatch made pointer resizing unreliable on any column without a declared
  size, because TanStack computes a drag as `startSize + delta` where `startSize` is
  `columnSizing[id] ?? columnDef.size` — a notional number, its own 150px default for an
  unsized column, while that column renders at something else entirely. Measured at a
  1280px viewport:

  |                                      | before             | after              |
  | ------------------------------------ | ------------------ | ------------------ |
  | restored width of 320 renders at     | 643.1px            | 320.0px            |
  | 60px drag moves the edge             | 82.0px             | 60.3px             |
  | two consecutive 40px drags move it   | 56.9px then 48.3px | 40.3px then 40.0px |
  | 40px drag under `fit: 'container'`   | 0.0px — a no-op    | 40.4px             |
  | drag-indicator residual, 1280 / 1920 | 22.0px / 72.2px    | 0.0px / 0.0px      |

  Two coupled changes, and neither is correct without the other:

  - `columnSizing` holds a width somebody chose — restored from storage, committed by a
    drag, or set through `resizeTo` — so it is now published as a real `width` (with the
    matching `minWidth` floor, so §6.10's "a minimum causes horizontal scroll rather
    than compression" still holds).
  - The resize handle's new `onPointerDown` writes the column's rendered width into
    `columnSizing` as the gesture begins, so the engine's notional size and the edge on
    screen are the same number before the engine reads either. `pointerdown` precedes
    `mousedown`, which is what makes it visible to the engine's own read.

  A column that declares a `size` is unaffected: it already published a real width and
  already resized exactly. A column with no sizing entry is unaffected at rest, so `fit`
  and the default floor behave as before.

  Composers spreading `resizeHandleProps` onto their handle get this automatically. One
  that hand-picks `onMouseDown` will not — `DataTableColumnResizeHandleProps` now
  documents that.

  **One behaviour change worth knowing about, because it can surprise you.** Pressing a
  resize handle and releasing it **without moving** now commits a binding width, which
  takes that column out of `fit` redistribution from then on. The state write itself is
  not new — the engine has always committed a `columnSizing` entry on release, with a
  zero delta, writing its own notional size. What is new is that the value now _binds_.
  So a column that stops participating in `fit` after an accidental click on its handle
  is doing that for this reason. Reset it with `resetColumnSizing`, or by clearing the
  column's entry in the `columnSizing` slice.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - fix(data-table): a record row with an open detail panel is now painted as expanded

  A table could hold two disclosure mechanisms and paint only one of them open: a
  grouping header already looked expanded, and a record row whose detail panel was open
  did not. Both now carry `data-expanded`, so a row that is disclosing looks like it.

  - Only when a panel is actually **rendered**. `detailExpansion: {}` with no `render`
    and no `renderExpandedRow` is a supported configuration — the caller wants expansion
    state and no panel row — and such a row discloses nothing, so it is not painted.
  - **Styling only.** `data-expanded` is not `aria-expanded`, which is invalid on a row
    inside `role="table"`; disclosure semantics stay on the expander button.
  - Selection still wins over expansion.

  ⚠ **Known and accepted**: the expanded tint is `--ui-table-data-row-color-hover`, the
  hover token, so an open row reads as hover-tinted while the pointer is elsewhere. That
  trade-off was chosen deliberately in favour of matching group headers rather than
  introducing a new token.

  Visual-regression baselines for one story change with this.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - fix(data-table): `DataTablePagination`'s "of N" reports the result total, not the loaded window

  The DataTable half of the pager-label defect fixed on `DataGridPagination`. The two
  components carried the identical expression, and the denominator half is reachable in
  DataTable today: `manualPagination` and `rowCount` are supported controller options and
  `DataTablePagination` is a public export, so a table paginating server-side announced
  one loaded window as the whole result set — "of 4" beside its own "Page 1 of 483".

  Now `table.getRowCount()`, which is `options.rowCount ?? prePaginationRowModel.rows.length`
  — the owner's total when supplied and the client total when not, so client tables are
  unchanged.

  The numerator is deliberately left on the engine here. The grid's new `selectedCount`
  prop exists because a _server selection token_ leaves the engine's `rowSelection` slice
  unwritten, and DataTable has no server-selection path — the engine-options contract
  rejects the options that would create one, so the prop would have no producer.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - fix(data-table): give the keyboard-focusable row the kit focus ring

  Current-row navigation puts a roving `tabIndex` on the `<tr>`, making the row
  itself focusable — but the row carried no focus style, so browsers painted their
  own default outline (a solid black box in Chromium light mode) instead of the
  kit's focus treatment.

  The row now takes `--ui-focus-primary` on `focus-visible`, matching the sortable
  column header and every other focusable control. It uses `outline` rather than
  `ring` because box-shadow on a `<tr>` is unreliable across engines, and the
  outline is inset so a focused first/last row is not clipped by the table border.
  Rows are left untouched when row navigation is off.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - fix(data-table): a column-resize drag no longer runs backwards in a right-to-left document

  Dragging a resize handle in a right-to-left locale moved the column's edge the wrong
  way: pulling the handle in the direction that should widen the column narrowed it by
  exactly the same amount. The keyboard path (Tab to a handle, Left/Right) was always
  correct, so the two disagreed.

  Measured in Chromium on a 348.7px column, dragging 60px in the widening direction:

  |               | before              | after               |
  | ------------- | ------------------- | ------------------- |
  | left-to-right | 408.7px (+60.0)     | 408.7px (+60.0)     |
  | right-to-left | **288.7px (−60.0)** | **408.7px (+60.0)** |

  **The cause was two sources of truth, not a missing sign.** The keyboard path read the
  rendered direction live; the drag inherited `@tanstack/react-table`'s
  `columnResizeDirection` option, which this library never set — so it kept the
  library's `'ltr'` default and multiplied every delta by `+1` even where the handle
  had moved to the opposite physical edge. Both paths now resolve direction from one
  element-level read, so they cannot disagree.

  No API change, and nothing to configure: direction is observed from the rendered
  document, exactly as the keyboard path already did. A caller still cannot pass
  `columnResizeDirection` through `controllerOptions` — keeping it in sync with the
  document by hand is the defect this replaces.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - DataTable: `toggle({ type: 'select-row' })` and `toggle({ type: 'select-all' })` now
  go through the engine, so they agree with the selection checkbox.

  Both actions wrote the selection slice by hand, which re-implemented TanStack's own
  selection mutation while omitting everything it does. A caller driving selection
  through these public actions got a selection model that **disagreed with the
  checkbox** in three configurations:

  - **single-select mode now replaces rather than accumulates.** Selecting a second row
    used to leave both selected.
  - **a row your `isRowSelectable` rejects is now refused.** It used to be selected
    anyway — while its checkbox stayed disabled, so the two paths disagreed about a row
    the user cannot click.
  - **selection now cascades to sub-rows** where the engine allows it. A parent selected
    through the action used to leave its descendants behind, while the same parent
    selected through its checkbox took them.

  `select-all` additionally resolves its toggle direction from the engine, so a page
  whose only unselected rows are ineligible now counts as fully selected and toggling it
  clears the page instead of doing nothing visible.

  Both actions also stop hardcoding the change cause, so a caller that claims a
  provenance for a wrapped call now has it reported instead of overwritten. A bare
  action still reports `api`, which is the honest answer for a programmatic change.

  One deliberate difference from the engine: `select-row` with an id no row has is a
  no-op rather than an exception. The engine's own lookup throws; the previous behaviour
  added the phantom id, which the data-reconcile pass pruned on the next data change
  anyway, so raising inside a caller's event handler would be a new failure mode rather
  than a fix.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - fix(selection): a pointer-driven selection change now reports `cause: 'pointer'`
  instead of `'api'`.

  Every selection control goes through the engine — `row.toggleSelected()`,
  `table.toggleAll*RowsSelected()` — so by the time the controller saw the change it
  knew only _that_ the engine asked, not _what_ asked it. Each one reported
  `cause: 'api'`, which is the single thing `cause` exists to distinguish from: a
  consumer could not tell a user's click from a programmatic selection. In one click
  handler the same pointer event produced `'pointer'` for the current row and
  `'api'` for the selection two lines apart.

  Three call sites are fixed together — the row checkbox, the header select-all, and
  `selection.selectByRow` — because a partial fix is worse than uniform dishonesty:
  it reads as a deliberate distinction.

  **The engine still decides _which_ rows change.** The provenance is carried across
  the round-trip rather than replacing it, so single-selection replacement,
  `isRowSelectable` eligibility and the sub-row cascade all keep living in TanStack's
  own `mutateRowIsSelected`. Writing the slice directly from the control — the
  obvious fix — would have traded a wrong string for those three behaviours.

  A change nothing drove still reports `'api'`, which is the honest answer for a
  genuinely programmatic selection.

  For a hand-composed `DataTable`, the same treatment is available: wrap an engine
  call in `withSelectionCause(cause, act)`. It is scoped to selection deliberately —
  a general "cause of the next change" would be an untyped side channel every feature
  could reach into.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - fix(data-table): a virtualized table now reports its true row positions to assistive technology

  A windowed table renders a slice of real rows between two `aria-hidden` spacers, so
  assistive technology counted only what was in the accessibility tree — announcing
  "row 3 of 20" where the truth was row 1,847 of 4,821. That is not an imprecise
  number; it is a different quantity.

  With `virtualization` on, the table now publishes `aria-rowcount` and every rendered
  row publishes `aria-rowindex` — the mechanism ARIA provides for a table whose rows
  are not all in the DOM. Header rows are numbered too, and group-header, detail and
  footer rows get indices alongside records, so the sequence has no holes.

  **Nothing changes when virtualization is off**, and that is deliberate rather than an
  oversight: when every row is in the DOM the browser's own count is already correct, so
  publishing an explicit one could only replace a right implicit number with a chance to
  be wrong. Per MDN, the attribute is not needed in that case.

  No visual change and no API change.

  **Verified as emitted, not as announced.** The attributes and their values are
  asserted in a rendered DOM, including the off-by-one that a variable header-row count
  introduces. Whether a given screen reader honours them over its own count of the
  accessibility tree is not covered by any automated check in this repository.

- [#76](https://github.com/constructor-lab/ui-component-library/pull/76) [`5f1f208`](https://github.com/constructor-lab/ui-component-library/commit/5f1f2084d824c27dec22c4764da1a2d24508a3db) Thanks [@leonid](https://github.com/leonid)! - fix(ui-react): six confirmed Figma design-parity divergences (non-breaking)

  - **Avatar sizing.** The 2px separator was a border-box CSS border, so with
    `box-sizing: border-box` it ate 2px off each edge and the painted fill rendered
    at 28px inside the (already 32px) box, against a designed 32px fill (Figma
    stroke is `strokeAlign: OUTSIDE`). It is now a spread-only outset ring via a
    raw `box-shadow` arbitrary property (not `shadow-[…]`, which routes through
    `--tw-shadow-color` and resolves inconsistently for spread-only rings across
    engine versions), so the fill fills the full 32px and the ring sits outside —
    matching upstream [#543](https://github.com/constructor-lab/ui-component-library/issues/543). This changes only the painted stroke; it does **not**
    change `AvatarGroup` spacing, which is driven by the separate
    `--ui-avatar-global-avatar-group-gap` token (−6px, a 26px step) and is left
    untouched. (Measured in a browser: element box 32×32 before and after; fill
    28→32; group step 26px unchanged.)
  - **`Button` / `ButtonMenu` cursor.** Added `cursor-pointer` to each component's
    shared base class so every variant shows the pointer cursor.
  - **Ghost button underline.** The ghost variant now wires all four
    `--ui-button-ghost-label-text-decoration-*` states (hover underlines; idle /
    active / disabled are `none`). All four are referenced — even the `none` ones —
    because a brand override is only honored if the matching state token is
    referenced.
  - **Checkbox focus ring.** `focus-visible:ring-2` → `ring-[3px]` per Figma.
  - **Breadcrumb link.** Underline is now hover-only (removed the focus-visible
    underline); the focus ring is a 3px flush ring on `--ui-focus-primary` (was
    `ring-2` + `ring-offset-2` on `--ui-focus-brand`).

- [#69](https://github.com/constructor-lab/ui-component-library/pull/69) [`f89c216`](https://github.com/constructor-lab/ui-component-library/commit/f89c216cf8ba43a88fcfb17949bbcdf7a97a0305) Thanks [@leonid](https://github.com/leonid)! - fix(dialog): reconcile against Figma — rewire to the `--ui-dialog-*` token tier

  Reconciled `Dialog` against the Figma design (node 6343:58898) and completed its
  Code Connect. The component previously themed from semantic tokens with a "no
  `--ui-dialog-*` tier exists yet" note; that tier now ships in
  `@constructor-lab/tokens`, so the container, header, title, and body are wired to
  it — which also corrects real geometry drift:

  - **container** → `--ui-dialog-container-{color,border-radius,width-min}`; the
    `sm`/`md` sizes → `--ui-dialog-container-size-{sm,md}` (`md` 672 → **632px**).
  - **header** → `--ui-dialog-header-{color,border-color,border-width,gap,height,
padding-x}` (padding **20 → 16px**); title → `--ui-dialog-header-title-color`.
  - **body** → `--ui-dialog-body-{gap,padding-y,height-min}` (padding **24 → 16px**,
    **72px** min-height, content vertically centered).

  The footer keeps the shared semantic vocabulary (Figma's Footer tier has no
  `--ui-footer-*` counterpart yet), with its horizontal padding corrected to 16px.
  Code Connect completed (`status: COMPLETE`, real node URL); the ui-spec
  index/tokens/anatomy were updated to match. Visual-regression baselines
  regenerated (light + dark). The close glyph still uses the muted treatment rather
  than Figma's plain-blue `ButtonIcon` idle — a separate button-icon token
  discrepancy, tracked out of this change.

- [#65](https://github.com/constructor-lab/ui-component-library/pull/65) [`8bf0312`](https://github.com/constructor-lab/ui-component-library/commit/8bf03129edb0d5d862ca16fadcf2bb8c8b532953) Thanks [@leonid](https://github.com/leonid)! - fix(calendar, widget-table-data, chip): rewire dangling `--ui-*` token references

  The `/component-readiness` audit flagged two components referencing tokens that no
  longer resolve (silent fallbacks):

  - **widget-table-data** — `--ui-table-global-cell-border-color` →
    `--ui-table-global-row-border-color` (thead / row divider / footer borders) and
    `--ui-table-global-row-color-hover` → `--ui-table-data-row-color-hover` (row
    hover). These were live refs, so the borders/hover now render their intended
    colors instead of falling back.
  - **calendar** — a comment referenced the retired `--ui-text-on-surface-link`;
    updated to the current `--ui-text-on-surface-link-idle` (comment only, no render
    change).
  - **chip** — the latest token update renamed `--ui-chip-global-box-icon-size` →
    `--ui-chip-global-icon-size`; the component (and its spec `tokens.yaml`) still
    referenced the old name, so the leading/remove-glyph icon size had no longer
    resolved. Rewired to the current name (same `var(--ui-units-size-16)` value —
    restores the intended 16px icon sizing).

- [#78](https://github.com/constructor-lab/ui-component-library/pull/78) [`82fd4f5`](https://github.com/constructor-lab/ui-component-library/commit/82fd4f534a82b51bc6257947013b763b6d0284b8) Thanks [@leonid](https://github.com/leonid)! - fix(ui-react): declare cursor-pointer on the base class of every interactive component

  `cursor-pointer` was missing from the base class of several always-interactive
  surfaces — a native `<button>`'s UA cursor reset hides the gap in code review
  while it renders wrong in the browser. Moved/added it to the **base** (not a
  subset of variants) for `ButtonIcon`, `Chip` (base + remove button),
  `DialogCloseButton`, `InputText`'s clear button, `SidebarSecondary` rows +
  section-label trigger, `Filter`, `Link`, and the `NavigationMenu` trigger.
  (`Button`/`ButtonMenu` were fixed in the prior parity batch.) Cursor is not
  captured by visual regression, so no baselines move.

  Guarded against regression by a new `@constructor-lab/ui-spec` grammar rule
  (`interaction/interactive-cursor`, checklist I7) with a static `kit-lint`
  detector that flags a `cva()` base carrying a `hover:` state but no `cursor-*`.

- [#56](https://github.com/constructor-lab/ui-component-library/pull/56) [`21f088b`](https://github.com/constructor-lab/ui-component-library/commit/21f088b283334526bf5db359bc3eda34e44ea6eb) Thanks [@leonid](https://github.com/leonid)! - fix(page-header): PageHeader is no longer a `banner` landmark

  `PageHeader` rendered `role="banner"`, which added a second `banner` landmark
  alongside the app header on every screen — an ARIA landmark-uniqueness violation
  (and it made the screen-audit conflate the two headers). It is now a
  non-landmark `<div>`; the page's sole `banner` is the app header, and the `<h1>`
  in `PageHeaderTitle` remains the page heading. Enforced by the new
  `accessibility/landmark-uniqueness` grammar rule (I6, `must`).

- [#78](https://github.com/constructor-lab/ui-component-library/pull/78) [`8ca474c`](https://github.com/constructor-lab/ui-component-library/commit/8ca474cbf0610d7069abd51748f924b312fdeaab) Thanks [@leonid](https://github.com/leonid)! - fix(ui-react): Figma parity batch 2 — card-filter ARIA + selected, clear buttons, link, chip

  - **CardFilter**: `type="button"` is now gated on `!render`, so
    `render={<a href/>}` no longer stamps an invalid `type` onto the anchor. Added
    a controlled `selected` prop (sets `aria-pressed` + a `data-selected`
    attribute that drives the active border/background) for a clickable card used
    as a toggle. Additive, non-breaking.
  - **InputText / Search** clear buttons: a proper 20px hit target (`size-5 p-0.5`)
    with a hover/active background from `--ui-button-icon-global-container-color-*`,
    and the icon now references the component-tier
    `--ui-button-icon-global-icon-color-idle` instead of the generic
    `--ui-glyph-on-surface-primary`.
  - **Chip**: `[&_svg]:pointer-events-none` so a click on the icon falls through to
    the chip.
  - **Link**: removed the stray `[text-underline-position:from-font]` — redundant
    against the global `text-underline-offset` and divergent from ButtonGhost.

- [#78](https://github.com/constructor-lab/ui-component-library/pull/78) [`624b5f8`](https://github.com/constructor-lab/ui-component-library/commit/624b5f8b3903bddaa459faec9176c9d3bb9ea5d2) Thanks [@leonid](https://github.com/leonid)! - fix(ui-react): parity batch 3 — chart tooltip tokens, menu focus ring, view options

  - Chart tooltip: radius and padding now come from the Tooltip tier tokens
    (`--ui-tooltip-container-border-radius` / `-padding-x` / `-padding-y`),
    `shadow-xl` → `shadow-md`, and the value span drops `font-mono`. Added a
    `TooltipOpen` story (the tooltip is hover-only, so `defaultIndex` forces it
    open for the visual-regression snapshot).
  - Menu items: a 3px inset keyboard-only focus ring
    (`focus-visible:not(:hover)`), which they lacked.
  - DataTableViewOptions: removed the "Toggle columns" heading (and its orphaned
    separator) that the current Figma does not have. Kept
    `DropdownMenuCheckboxItem` — it already renders a checkmark, stays open across
    toggles, and carries `aria-checked`, so it _is_ the design's "item with a
    checkmark"; a plain item would lose all three. Exports unchanged.

- [#78](https://github.com/constructor-lab/ui-component-library/pull/78) [`582e06f`](https://github.com/constructor-lab/ui-component-library/commit/582e06f1f26c594ce77aa55a6f6be2e361d5a7f8) Thanks [@leonid](https://github.com/leonid)! - fix(ui-react): pixel-snap the resizable divider with a logical border

  The `ResizableHandle` divider line was a 1px-wide background box centred with a
  `-translate-x-1/2` transform, so at fractional handle positions the line
  straddled two device pixels and rendered blurry. It is now a zero-width box
  painted by its logical `border-inline-start` (block-start for the stacked
  orientation), which the browser snaps to the pixel grid. Keyboard focus paints a
  3px `--ui-focus-primary` ring as a `box-shadow` on the line itself (auto-centred),
  removed while dragging (`active:after:shadow-none`). Same tokens, same geometry —
  crisper line. No API change.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - fix(search-global): re-theme off the removed `--ui-search-global-*` tier

  `SearchGlobal` is retired (deprecated, slated for removal) and its dedicated
  component token tier was removed from `@constructor-lab/tokens` — but the
  component still referenced 15 of those tokens plus two generated
  `.ui-search-global-*-text-style` classes that went with them. Every one of those
  `var()` lookups resolved to nothing, so the field rendered with no fill, size,
  radius, gradient border, or text colors.

  Each reference now points at the shared token that tier used to alias — the AI
  gradients, the `--ui-units-*` sizes, and the AI-purple glyph/text semantics — so
  the field resolves through generated tokens again and renders as designed. The
  two text-style classes become their equivalent utilities. No component tier is
  reintroduced, and its `ui-spec` `tokens.yaml`/anatomy/accessibility/README are
  updated to name the tokens that actually exist.

- [`b8fde72`](https://github.com/constructor-lab/ui-component-library/commit/b8fde722858687e1b03f811fd29adb1d6bcadb5b) Thanks [@m231-a](https://github.com/m231-a)! - `SidebarPrimaryCollapseTrigger` accepts a `shortcut` hint

  The design's footer row is `Collapse menu ⌘H` (Figma node 2092:5372), but the
  primary rail's collapse trigger had no way to render the trailing shortcut —
  only its `SidebarSecondaryCollapseTrigger` counterpart did. It now takes the
  same optional `shortcut` node, right-aligned via the existing
  `--ui-sidebar-primary-menu-item-extras-global-shortcut-*` tokens and hidden
  with the label (`sr-only`) in collapsed mode.

- [`ccbfe9d`](https://github.com/constructor-lab/ui-component-library/commit/ccbfe9d52ab392eed7e01a3d420e2c3d356a45e1) Thanks [@m231-a](https://github.com/m231-a)! - `SidebarSecondary` header metrics now come from the design's tokens

  Two silent geometry drifts against Figma node 2468:59502, both invisible to
  visual regression (each delta sits under the 0.5%-of-canvas threshold):

  - **Panel header was 16px short.** It applied the per-variant
    `--ui-sidebar-secondary-expanded-container-header-padding-y` (8px), but the
    design binds one pair for both variants —
    `--ui-sidebar-secondary-global-container-header-padding-{x,y}` (16/16) — which
    is what makes the header 64px tall around its 32px title. (The per-variant
    tokens belong to `SidebarPrimary`, whose design does reference them.)
  - **Section headers were 36px instead of 40px, with no vertical padding.** The
    floor was a hardcoded `min-h-9` under a comment claiming no header-height token
    existed; `--ui-sidebar-secondary-section-container-header-min-width` (40px) had
    been generated all along — Figma names the variable `minWidth` although it
    drives the row's min _height_. `…-header-padding-y` (2px) was likewise defined
    but unused.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - Fix a render loop that froze the browser when a group row was collapsed.

  Toggling a group in a grouped `DataGrid` locked the page: 11,293 controller state
  writes in 8 seconds, with a stable DOM and a flat heap — a render loop, not a leak.
  TanStack auto-resets its `expanded` state whenever the row model is invalidated, that
  reset reached `onExpandedChange`, and `requestChange` allocated a fresh state object
  even when the value had not changed, so React never bailed out and the re-render
  invalidated the row model again.

  Two independent fixes, each verified to break the loop on its own:

  - `autoResetExpanded: false` — the controller _derives_ `expanded` from
    `treeExpanded`/`detailExpanded`, so a slice the engine does not own must not be
    auto-reset by it. Correct regardless of the loop.
  - `requestChange` now skips the write, and the change callbacks, when a slice's value
    is unchanged. It bails only where equality can be positively established; slices
    carrying arbitrary values (`columnFilters`, `globalFilter`) always write, because a
    wrong "equal" would silently drop a caller's update.

  A no-op request no longer emits `onStateChange`, `onSliceChange` or `onQueryChange`.
  Nothing else about the public surface changes, and at-rest rendering is unaffected
  (measured: zero guard bails at mount across all 111 table-family stories).

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - Table: `TableHead`'s accessible name no longer absorbs `trailing` content.

  A header cell's accessible name is computed from its contents, so a control in the
  `trailing` slot with an `aria-label` — a resize handle, say — was folded into it:
  the column header announced as "Name Resize name column". That is worse than it
  sounds, because a screen reader repeats the column header for **every cell** in
  the column, so the handle's label was announced on every row.

  When `trailing` content is present, `TableHead` now names the header from its label
  region explicitly, which structurally excludes the slot. The control keeps its own
  accessible name.

  A header with no `trailing` content is unchanged — no `aria-labelledby`, no
  wrapper element, name still computed from content — so nothing about the common
  case moves.

  This is deliberately automatic rather than a prop. Anything mounted in `trailing`
  gets the correct naming without the caller knowing the hazard exists; an opt-in
  would have meant every future consumer rediscovering it.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - fix(Table): `maxHeight` now bounds the element that scrolls, so a bounded table
  can actually scroll.

  `maxHeight` alone produced a table that **clipped instead of scrolling**. The
  constraint was applied to the scroll container's outer box, leaving that box
  `max-height: 320px` with `height: auto` — and the inner viewport's `height: 100%`
  needs a _definite_ parent height, so it resolved to auto and grew to its content.
  Measured in a browser with 60 rows in a 320px box: box 320px against a **2440px**
  viewport whose `scrollHeight === clientHeight`, so `scrollTop` never left 0 and
  the box's `overflow: hidden` clipped the remaining rows.

  `height` was unaffected, because a definite length is inheritable — which is why
  the two placements looked interchangeable when only `height` was measured.

  Three consequences of the fix:

  - **Any `maxHeight` table whose content exceeds the bound now scrolls.** This was
    never virtualization-specific, though it did make windowed rendering inert:
    `data-bounded` read `true` throughout, so every precondition guard keyed on it
    passed while the feature was dead.
  - **`height`/`maxHeight` now land on the viewport; `width` stays on the outer
    box.** `data-slot="table-container"` stays on the box (an element carries one
    slot and the viewport already has ScrollArea's), and `data-bounded` plus
    `containerRef` stay on the viewport. If you assert on inline styles, a height
    constraint you used to read off `[data-slot="table-container"]` is now on
    `[data-slot="scroll-area-viewport"]`.
  - **`containerProps.style` moves with them**, onto the scrolling element that prop
    is documented to reach — it previously landed on the outer box.

  Sticky headers, sticky footers and pinned columns were re-verified in a browser
  under simultaneous vertical and horizontal scroll: the sticky header holds at the
  top of the scrollport and the start/end-pinned columns hold at its edges while the
  unpinned columns scroll under them.

  Three stories were added whose content actually overflows
  (`BoundedByHeightOverflowing`, `BoundedByMaxHeightOverflowing`,
  `BoundedByMaxHeightBothAxes`). Their absence is why this shipped: every existing
  bounded story holds eight rows in a 200–240px box, and a story that cannot exhibit
  a failure certifies its absence.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - `Table`: `height` and `maxHeight` require a **definite** length, and a percentage
  now says so in development.

  A percentage never bounded the scroll container, and after the constraint moved to
  the element that scrolls it stopped even _looking_ bounded. Measured for both
  members — 60 rows, `50%`, a 400px parent — the scrolling element comes out 2440px
  with `scrollHeight === clientHeight` and `scrollTop` stuck at 0. Percentages
  resolve against that element's containing block, whose height is `auto`, so they
  compute as no constraint at all.

  **A percentage previously appeared to work, and that is the part worth stating.**
  When the constraint sat on the outer box it resolved against the app's own
  definite-height parent, so the box came out the right size and **clipped** its
  overflow. It was never scrolling; it only looked bounded. A layout that has just
  started overflowing was showing you clipped content before.

  Use a length (`320`, `'20rem'`) or a viewport unit (`'50vh'`). A percentage logs a
  development-only error naming the prop and the value.

  No behaviour change for any definite value, and nothing in this repo passed a
  percentage.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - Table: `TableRow`'s `expanded` no longer emits `aria-expanded`.

  `aria-expanded` is only valid on a `treegrid` row. On a row inside a
  `role="table"` it is invalid, and axe reports it as `aria-conditional-attr` at
  **serious** impact. `expanded` now sets `data-expanded` only, which is what the
  styling hooks use.

  The attribute belongs on the **disclosure control**, alongside `aria-controls`
  pointing at the revealed row — which is what the component spec's anatomy already
  specifies for the expander parts, and what DataGrid's expander implements. So this
  aligns the primitive with a contract it was contradicting rather than changing the
  family's accessible behaviour.

  If the table family later adopts `role="treegrid"`, the attribute returns to the
  row gated on that role, which needs a `Table`-level prop: a row cannot know the
  role of the table containing it.

  No consumer migration — `expanded` shipped on this release line only, and nothing
  reads `aria-expanded` from a row.

- [#74](https://github.com/constructor-lab/ui-component-library/pull/74) [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086) Thanks [@leonid](https://github.com/leonid)! - **DataGrid/DataTable: `appearance.width` now bounds the bordered box, and the
  generated chrome columns are 40px instead of ~100–210px.**

  Two instances of one defect — a sizing constraint landing on a different element
  than the one that presents the region.

  `appearance.width` reached the scroll container while the border was drawn by a
  wrapper `<div>` that took no width, so a narrow grid rendered as a full-width
  bordered box containing a narrow scroll region, with the horizontal scrollbar
  ending short of the border it appeared to belong to. The wrapper is gone: the
  scroll container carries the border, the radius and the width. Two consequences
  worth knowing — the width now _includes_ the 2px border (`box-sizing:
border-box`), and `ScrollArea`'s viewport `rounded-[inherit]` finally resolves to
  the container's radius instead of `0`.

  The generated selection, detail-expander and row-actions columns declared no
  width, so they inherited TanStack's 150px default and rendered 92.6–209.2px
  around 16–24px controls. They are now pinned to 40px — square to the table's
  row-height floor (`h-10`) at the default `medium` density.

  Also fixes a second case of the same root cause: **a caller's `size` on a column
  now reaches the DOM in a plain `<DataGrid>`.** Column widths were published only
  when `columnsFeatures` enabled one of `visibility`/`pinning`/`resizing`/
  `reordering`, so `size: 200` on an otherwise plain grid silently did nothing. An
  _unsized_ column is unchanged and still publishes no width.

  **Behaviour change, stated because it is not a side effect:** the detail-expander
  column (`__detail__`) is now **locked by default** alongside the selection and
  actions columns — it can no longer be moved, pinned or resized unless the caller
  sets `columnsFeatures.lockSystemColumns: false`. Its absence from that set was an
  oversight rather than a decision: the expander was the only generated chrome
  column a user could drag out of place. The invariant is now that the locked set
  matches the generated set. This reaches the column-settings menu and the column
  announcer; the menu's visual baseline captures it closed, so no pixel change is
  expected there.

- Updated dependencies [[`ba53236`](https://github.com/constructor-lab/ui-component-library/commit/ba5323610064ea0aab88a1671135be7bb083e894), [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086), [`e7caa81`](https://github.com/constructor-lab/ui-component-library/commit/e7caa813840069a33bb409cbd7aee93c3aee6086), [`d7e04a2`](https://github.com/constructor-lab/ui-component-library/commit/d7e04a298b47b9bba952b0dba4cc255d2941f277), [`7416b3a`](https://github.com/constructor-lab/ui-component-library/commit/7416b3addb3e68d89facbdd8f6b982dddab8beb7), [`b8071ac`](https://github.com/constructor-lab/ui-component-library/commit/b8071acfac66cd794a4a102ef308a570c74dfdb8)]:
  - @constructor-lab/tokens@3.1.0
  - @constructor-lab/icons-react@1.0.1

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
