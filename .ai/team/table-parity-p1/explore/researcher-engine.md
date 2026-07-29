# Table parity P1 — engine readiness inventory (the seven unshipped groups)

- **Scope:** `detailExpansion`, `tree`, `grouping`, `virtualization`,
  `columnsFeatures`, `persistence`, `footer` — the seven behavior groups from
  design §5.2 that do not exist as `DataGrid`/`DataTable` props at all.
- **As of:** commit `6ad26a7` (branch `feat/table-parity`).
- **Read-only research.** No source/spec/test file was modified.
- **Not in scope** (owned by the other researcher; noted only where it
  surfaced): member-level gaps inside the nine shipped groups, `getRowId`,
  `defaultState`.

## At a glance

| Group | Engine readiness | Files most touched (existing) | New files (likely) | Depends on |
| --- | --- | --- | --- | --- |
| `detailExpansion` | **Wired, legacy-shaped.** State slice + TanStack `expanded`/`getExpandedRowModel` feature already installed and driven by `detailExpanded`, but only through the deprecated `getRowCanExpand`/`renderExpandedRow` path. No grouped config, no `onDetailExpansionChange`, no accordion, no ARIA IDs, no DataGrid chrome. | `data-table-controller.ts`, `data-table-render-context.ts`, `data-table-view.tsx` | `data-grid-detail-expansion.tsx` | None of the other six. **Owns TanStack's only native expand feature — see `tree`.** |
| `tree` | **State declared, row model unwired, structurally conflicts with `detailExpansion`.** `treeExpanded` Set is fully wired at the state layer (reducer, prune-on-replace, toggle action), but TanStack has exactly one built-in expand/collapse row-model feature (`state.expanded`) and it is already claimed by `detailExpanded`. `getSubRows` passthrough exists but nothing gates subrow visibility by `treeExpanded`. | `data-table-controller.ts` (new row-model stage), `data-table-render-context.ts`, `data-table-view.tsx` | `data-table-tree.ts` (lazy request state), DataGrid tree chrome | **Must be sequenced with/against `detailExpansion`** (TanStack feature collision). Feeds `grouping`. |
| `grouping` | **State/query wired, row model 100% missing.** `grouping` slice participates in the reducer, `QUERY_SLICES`, page-reset-on-change, and request-key serialization — but `getGroupedRowModel()` is never installed (it's explicitly `'rejected-library-contract'` in the engine-options allowlist, meaning the controller itself must add it, and doesn't). Setting `grouping` today has zero visible effect. | `data-table-controller.ts`, `data-table-render-context.ts`, `data-table-view.tsx` | DataGrid group chrome | **Depends on `tree`'s row-model decision** (design: group roots, preserve descendant trees — needs tree relationships to exist in the pipeline). |
| `virtualization` | **Not started.** `@tanstack/react-virtual` is a dependency but unused by data-table/data-grid (only by the unrelated `Tree` component and one story). No state slice (correct per design — presentation-only), no config, no scroll-container support on `Table`, no `measureLayout()`, no sticky anything. | `table.tsx` (scroll container/sticky hooks), `data-table-view.tsx` (windowed render), `data-table-controller.ts` (`measureLayout`) | `data-table-virtualization.ts`/`.tsx` | **Needs `appearance.height`/`maxHeight`** (cross-scope — flag to shipped-groups researcher). Full scope also touches `tree`+`detailExpansion` (focus fallback) and `grouping` (sticky group headers), but a minimal flat-row cut is independent. |
| `columnsFeatures` | **Split.** Visibility/order/sizing/pinning state slices all exist and are wired through the generic reducer, but TanStack's `enableColumnPinning`/`enablePinning`/`enableColumnResizing`/`columnResizeMode` are never turned on (all `'rejected-library-contract'`, unset by the controller), and there is zero visual manifestation: no sticky-offset CSS for pinning, no `column.getSize()` width application, no resize handle, no reorder interaction. | `data-table-controller.ts` (turn on TanStack flags, add config, fit logic), `table.tsx` (sticky/pin presentation), `data-table-view.tsx` (apply size/pin), `data-table-render-context.ts` | DataGrid view-options menu, resize/reorder handles | None of the other six structurally. **`persistence` depends on this.** |
| `persistence` | **Not started.** Zero matches for persistence/localStorage anywhere in `data-table`/`data-grid`. The slices it would restore into already exist and are independently controllable, and `'restore'` is already a first-class `DataTableChangeCause` (unused). | — | `data-table-persistence.ts`, `data-grid.tsx` (prop wiring) | **Depends on `columnsFeatures`** (default `include` set is exactly visibility/order/width/pinning). A partial cut restoring only the already-shipped visibility/order could precede full `columnsFeatures`. |
| `footer` | **Not started, but the primitive exists.** `TableFooter` is already implemented/exported by the `Table` primitive — `DataTableView` simply never renders it. No footer state, config, or render context. | `data-table-view.tsx` (render `<TableFooter>`), `data-table-render-context.ts` (new footer context) | DataGrid summary-row renderer | Independent of the other six for whole-table summaries. Group-scoped footers (unstated by the design) would need `grouping`. Shares the "no sticky primitive yet" gap with `virtualization`/`grouping`. |

**Cannot be built fully independently:**
- `tree` and `detailExpansion` share TanStack's single native expand/collapse
  feature today — whoever picks up `tree` must either coordinate with
  `detailExpansion`'s owner or resolve the collision themselves (see below).
  This is the one true blocking pair in the set of seven.
- `grouping`'s "group roots, preserve descendant trees" requirement (design
  §3.5, §6.6) presumes tree relationships exist in the row-model pipeline, so
  it should land after (or in lockstep with) whatever `tree` decides.
- `persistence`'s default restorable set is the `columnsFeatures` slices, so
  its full scope trails `columnsFeatures`.

Everything else — `virtualization`'s *minimal* flat-row cut, `columnsFeatures`,
and `footer` (whole-table summaries) — can start in parallel with no code
collision, provided the shared `Table`-primitive sticky-positioning gap (below)
is assigned to one owner rather than three.

## Cross-cutting infrastructure gaps (affect 3+ groups)

1. **TanStack's single native "expanded" feature is a scarce resource.**
   `data-table-controller.ts` currently derives TanStack's `state.expanded` /
   `getExpandedRowModel()` / `onExpandedChange` *exclusively* from
   `detailExpanded` (lines ~574, 625, 679–685). TanStack ships no second
   built-in expand/collapse row model. `tree` needs one too. This is not a
   simple "wire up the other slice" job — it needs either a custom row-model
   stage for tree (independent of TanStack's `expanded`) or some other
   resolution, and it is squarely an engineering decision, not a mechanical
   gap.
2. **No sticky-positioning support anywhere in the `Table` primitive.**
   `grep` for `sticky`/`pin` in `packages/ui-react/src/components/ui/table/table.tsx`
   returns nothing. `virtualization` (sticky header), `footer` (sticky
   footer), and `grouping` (sticky group headers) each need this. Landing one
   shared sticky mechanism in `Table` (design §4.2 anticipates this: "Table
   may add… scroll-container ref/class/size props used by sticky/virtual
   rendering") avoids three groups inventing their own.
3. **Row-model pipeline order is currently flat.** `data-table-view.tsx`
   renders `table.getRowModel().rows` as one undifferentiated list — no
   concept of a "group row" vs. a "data row" vs. a "detail row" beyond the
   single `renderExpandedRow`/`row.getIsExpanded()` special case. `grouping`,
   `tree`, and `footer` (and the render layer generally) will all need the
   view to distinguish row *kinds*, so whoever lands the first of
   `tree`/`grouping` is effectively choosing that render-layer shape for the
   others.
4. **The plugin system (`data-table-engine-plugins.ts`) is not the vehicle
   for any of these seven.** Its registrar can only add a plugin's own
   namespaced `rowModels.*` surface; the design explicitly forbids a plugin
   from "replac[ing] or insert[ing] a stage into the canonical DataTable
   pipeline." Grouping/tree/virtualization row-model work must land as core
   changes to `data-table-controller.ts`/`data-table-view.tsx`, not as an
   opt-in plugin. (The two library-owned extension keys
   `data-table.rowModels.core`/`.final` in that file are read-only anchors
   for plugins, not an insertion point.)
5. **One-line note for the shipped-groups researcher:** I could not confirm
   from this pass whether `appearance.height`/`maxHeight`/`stickyHeader`
   (listed as P0/shipped in the design's disposition table) actually has a
   bounded-container implementation today; `virtualization`'s "requires
   bounded height/maxHeight" invalid-combination rule depends on it existing.
   Flagging, not investigating further (out of this inventory's scope).

## Per-group detail

### `detailExpansion`

**Engine readiness.** The state slice (`detailExpanded: ReadonlySet<RowId>`)
is complete end-to-end: declared in `data-table-contract.ts:40`, defaulted in
`data-table-state.ts:69`, reconciled on data replacement respecting `reserve`
(`data-table-controller.ts:711–742`), toggleable via
`toggle({ type: 'expand-row', domain: 'detail' })`
(`data-table-controller.ts:852–871`), and exposed in row render context
(`isExpanded`/`canExpand`/`toggleExpanded` in `data-table-render-context.ts:43–49,129–137`).
TanStack wiring is real, not stubbed: `detailEnabled` gates
`getExpandedRowModel()` installation (`data-table-controller.ts:556–560,625`),
`expanded` state is sourced from `detailExpanded`
(`data-table-controller.ts:574`), and `onExpandedChange` writes back to it
(`data-table-controller.ts:679–685`). But all of this is reached only through
the **deprecated** `getRowCanExpand`/`renderExpandedRow` props
(`usesLegacyExpansion`) or the bare `detailExpansion?: false | { reserve? }`
identity-gating shape (`data-table-controller.ts:185`) — the *behavioral*
config (`render`, `isExpandable`, `mode: 'multiple' | 'accordion'`) from
design §5.2 does not exist as a type anywhere in `ui-react` source (it does
exist in the neutral spec — see Acceptance material below).

**Missing:** the full `DetailExpansionConfig` shape; a distinct
`onDetailExpansionChange` callback (today: generic `onSliceChange.detailExpanded`
/ `onStateChange` only); accordion mode (close-previous-on-open); the ARIA
addressable-ID scheme from design §7
(`${tableId}--detail--${base64url(rowId)}`, `aria-controls` exactly when
mounted); `detailExpansion.render`/`isExpandable` wiring in the render layer
(today only `renderExpandedRow` renders a flat appended row —
`data-table-view.tsx:367–376`); DataGrid exposure — `DataGridGroupedConfig`
has no `detailExpansion` key, so there is no `ButtonIcon`/`Collapsible`
expander chrome at all.

**Files:** `data-table-controller.ts` (new config shape,
`isExpandable`→`getRowCanExpand` wiring, accordion collapse-previous logic),
`data-table-render-context.ts` (typed `onDetailExpansionChange` event, ARIA
metadata), `data-table-view.tsx` (render via `detailExpansion.render`, not
just the legacy prop). New: `data-grid-detail-expansion.tsx` + a
`DataGridGroupedConfig.detailExpansion` entry and its
`resolveGroupedConfig`/`GROUPED_CONFIG_ALIASES` normalization in
`data-grid.tsx`.

**Depends on:** none of the other six. Most engine-ready of the seven, but
see cross-cutting gap #1 — it currently occupies the one native TanStack
expand feature.

**Acceptance material:**
`packages/ui-spec/components/data-table/behavior.md:387-404` ("Detail and
tree expansion are separate", "Lazy child load handles stale work");
`data-table/behavior.md:218-233` ("Expansion and lazy tree are independent",
"Accordion detail expansion"); `data-table/behavior.md:142-159` (legacy-prop
normalization, grouped-config-wins-over-alias); neutral contract already
declared in `packages/ui-spec/components/data-table/api.yaml:76-83,224-225`
and `data-grid/api.yaml:76-83,224-225`.

### `tree`

**Engine readiness.** `tree?: false | { reserve? }` exists only as an
identity-gating option (`data-table-controller.ts:186`); the reconcile effect
prunes/reserves `treeExpanded` on data replacement
(`data-table-controller.ts:743–749`); the `toggle` action can flip
`treeExpanded` membership (`domain: 'tree'`,
`data-table-controller.ts:852–871`) — confirmed independent of
`detailExpanded` at the **state** level by
`data-table-controller.test.tsx:742-762`. `getSubRows` passes through to
TanStack when supplied (`data-table-controller.ts:584–588`), which builds
parent/child nesting in the *core* row model — but nothing today reads
`treeExpanded` to decide which children are visible in
`table.getRowModel().rows`, because that decision in TanStack is made by the
single `expanded`/`getExpandedRowModel` feature, which is already bound to
`detailExpanded` (see cross-cutting gap #1). No lazy-load state machine
(`idle|loading(requestKey)|loaded|error(error,requestKey)`, keyed by row ID,
outside both expansion slices) exists; no `onTreeLoad`/`onTreeLoadState`;
no `renderLoadError`/retry; no indentation metadata; no tree-aware
sort/filter behavior.

**Files:** `data-table-controller.ts` (the core change — a tree-visibility
row-model stage independent of TanStack's `expanded`), a new
`data-table-tree.ts` for lazy request-state (idle/loading/loaded/error keyed
by row ID, with stale-request rejection), `data-table-render-context.ts`
(tree row context — indent depth, `hasChildren`, lazy status), `data-table-view.tsx`
(indentation rendering, tree expander slot distinct from the detail expander
slot). New DataGrid files for `ButtonIcon`/`Collapsible`/`Spinner`/`Alert`
tree chrome.

**Depends on:** **must be resolved against `detailExpansion`** (cross-cutting
gap #1) before or as part of this work — not independently buildable without
that decision. Its output (tree relationships + row model) is a prerequisite
for `grouping`'s "root rows are grouped; each root retains its descendant
tree" rule.

**Acceptance material:**
`data-table/behavior.md:387-404`; `data-table/behavior.md:396-404` (lazy
stale-work handling — very concrete, names the exact metadata shape);
`data-grid/behavior.md:218-225` (grid-level expansion/lazy-tree independence).

### `grouping`

**Engine readiness.** The `grouping: readonly string[]` slice is a complete
citizen of the generic state machinery: declared/defaulted
(`data-table-contract.ts:42`, `data-table-state.ts:71`), written back via
`onGroupingChange` → `requestChange('grouping', ...)`
(`data-table-controller.ts:686–689`), included in `QUERY_RESET_SLICES`/
`QUERY_SLICES`/`PAGE_RESET_SLICES` so a grouping change atomically resets
`pageIndex` and emits `onQueryChange` exactly like sort/filter changes do
(design §3.4's page-reset rule already generalized correctly), and
serialized into the canonical request key
(`data-table-query.ts:169,186`). **But `getGroupedRowModel()` is never
installed.** It is explicitly classified `'rejected-library-contract'` in
`data-table-engine-options.ts:75`, meaning it is deliberately excluded from
the public `engineOptions` escape hatch on the theory that the controller
itself installs it — except the controller never does. The only place
`getGroupedRowModel` is imported/used in the whole `data-table` directory is
inside `data-table-recipes.stories.tsx:10,173`, as a hand-rolled bypass
example that talks to TanStack directly, not through `useDataTable`. Net
effect: today, setting `grouping: ['status']` on the shared controller
changes state and fires callbacks/query events but produces **no visible
grouping** — rows render exactly as if ungrouped.

**Missing:** `groupingEnabled` gate + `getGroupedRowModel()` installation
(mirroring how `sortingEnabled`/`filteringEnabled` gate their row models);
the full `GroupingConfig` (`allowedColumns`, `renderGroup`, `collapsible`,
`sticky`, `selectionScope`, `ungrouped`) — `grouping` isn't even present as a
controller-option key today (unlike `tree`/`detailExpansion`, which at least
have the bare identity shape); group-row collapse state (a new concern —
group rows need expand/collapse too, and it's an open question whether that
reuses/extends the tree mechanism or is its own thing); root-only grouping +
preserved-descendant-tree semantics; `ungrouped` bucket; group-scoped
selection; sort-within-group / aggregate-sort; DataGrid group chrome
(expanders, labels, selection controls, menus) — zero exposure in
`DataGridGroupedConfig`.

**Files:** `data-table-controller.ts` (install `getGroupedRowModel`, add
`GroupingConfig` option, group-collapse state — likely a new slice or an
extension of the tree mechanism), `data-table-render-context.ts` (group row
context type), `data-table-view.tsx` (render group-header rows — the view
currently has no notion of a row that isn't a data row, other than the
special-cased detail-expansion append row). New DataGrid group chrome files.

**Depends on:** the `tree` row-model decision (cross-cutting gap #1/#3) —
design §3.5/§6.6 requires grouping to classify only root rows while each
root's descendant tree stays attached, which presumes tree relationships
already exist in the pipeline. Does not depend on `detailExpansion`,
`virtualization`, `columnsFeatures`, `persistence`, or `footer` for its core
row-model mechanics.

**Acceptance material:**
`data-table/behavior.md:407-430` ("Group selection targets leaves", "Sorting
within groups", "Grouping classifies roots and handles ungrouped rows");
`data-grid/behavior.md:236-249` (grid-level group+sort+collapse+sticky+select,
and root/descendant/ungrouped policy) — these scenarios are specific enough
to double as acceptance tests once the row model exists.

### `virtualization`

**Engine readiness.** Not started. `@tanstack/react-virtual` is already a
declared dependency (`packages/ui-react/package.json:94`) but the only
consumers in the whole package are the unrelated `Tree` **component**
(`components/ui/tree/tree.tsx`) and one reference in
`data-table-recipes.stories.tsx` — nothing in `data-table`/`data-grid` uses
it. No `VirtualizationConfig`, no state slice (correctly — design §3.5 says
virtualization is a presentation-only renderer that never changes counts or
state, matching `data-table/behavior.md:229`, "[Target P1] Virtualization is
presentation only"), no bounded-height enforcement, no `measureLayout()`
action (the controller's `DataTableToggleAction` union
(`data-table-controller.ts:265–279`) has `select-row`/`select-all`/
`clear-selection`/`expand-row`/`set-current-row` only — no layout/scroll
action exists at all), no `onScroll`, no scroll-container ref/class on
`Table` (confirmed by an empty grep for "sticky"/"pin" in `table.tsx`), and
none of the design §7 focus-fallback policy (pinned DOM row outside
overscan, scroll-container fallback, same-index/previous-last/toolbar
fallback chain, exactly-one `data-reconcile` event).

**Files:** `table.tsx` (scroll-container ref/class/size props — design §4.2
anticipates this addition), `data-table-view.tsx` (replace the flat
`rows.map(...)` with a windowed render over `@tanstack/react-virtual`),
`data-table-controller.ts` (`measureLayout()` action, automatic layout
observation on data/column/container change). New:
`data-table-virtualization.ts`/`.tsx` for the adapter itself.

**Depends on:** `appearance.height`/`maxHeight` (design §5.2: "Requires
bounded height/maxHeight") — **cross-scope**, flagged to the shipped-groups
researcher rather than investigated here. Full spec compliance also touches
`tree`+`detailExpansion` (the focus-fallback policy explicitly spans both
expansion domains) and `grouping` (sticky group headers), but a minimal
fixed-height/flat-row virtualizer has no hard code dependency on any of the
other six and could be scoped as a first cut.

**Acceptance material:**
`data-table/behavior.md:229-238` ("Virtualization is presentation only");
`data-grid/behavior.md:262-272` ("Virtual expanded rows retain focus" — this
one scenario alone encodes the entire design §7 focus-fallback chain and is
the best single acceptance target for the feature).

### `columnsFeatures`

**Engine readiness (split by sub-feature):**
- *Visibility* — already P0/shipped (`columnVisibility` state +
  `onColumnVisibilityChange`); out of this inventory's scope except as the
  "already works" baseline the other four sub-features get compared against.
- *Pinning* — state slice complete
  (`columnPinning: { left, right }`, `data-table-contract.ts:26–29,38`;
  wired through `onColumnPinningChange` →
  `requestChange('columnPinning', ...)`, `data-table-controller.ts:663–674`),
  but `enableColumnPinning`/`enablePinning` are never set `true` by the
  controller (both `'rejected-library-contract'` in
  `data-table-engine-options.ts:50,60`, i.e. deliberately excluded from the
  public escape hatch on the assumption the controller opts in directly — it
  doesn't), and there is **no visual pinning**: no sticky-left/right offset
  CSS anywhere (confirmed empty grep for "sticky"/"pin" in `table.tsx`).
- *Resizing* — `columnSizing` state slice wired identically to pinning
  (`data-table-controller.ts:662`), but `enableColumnResizing`/
  `columnResizeMode`/`columnResizeDirection` are never set
  (`'rejected-library-contract'`, unset), and no header/cell reads
  `column.getSize()` to apply a width (confirmed empty grep for `getSize()`
  and `width:` across `data-table`/`table`). No resize-handle UI.
- *Reordering* — `columnOrder` slice wired the same way
  (`data-table-controller.ts:658–661`); TanStack's column order is pure
  state (no `enable*` flag gate), so mechanically this is the closest of the
  four to usable, but there is zero drag/keyboard reorder interaction and no
  pin-vs-order interaction logic (design §6.9: "Pin regions win over order").
- *Fit* (`content`/`container`/`false`), *overflowTooltip*,
  *lockSystemColumns* — none exist in any form.

**Files:** `data-table-controller.ts` (turn on the TanStack `enable*` flags,
add the full `ColumnsFeaturesConfig` option, `fit` width-distribution logic,
locked-system-column enforcement for DataGrid's `__select__`/actions
columns), `table.tsx` (sticky/pin presentation on `TableHead`/`TableCell` —
design §4.2 only currently lists "sort direction/priority and native scope"
for `TableHead`, pin support is a genuinely new addition), `data-table-view.tsx`
(apply `column.getSize()` widths and pin offsets, resize-handle slot, reorder
drag/keyboard), `data-table-render-context.ts` (header context needs
pin/size/order commands, currently only has sort commands). New DataGrid
files: view-options `DropdownMenu`/`Popover` + `Checkbox`, resize handles via
`Resizable`, reorder via keyboard-move commands + live announcements.

**Depends on:** none of the other six structurally — it's independently
buildable. **`persistence` depends on it** (see next section).

**Acceptance material:**
`data-table/behavior.md:435-449` ("Pin, order, size, visibility, and restore
interact", "Keyboard column manipulation"); `data-grid/behavior.md:253-259`
("Column features restore together" — explicitly bundles this with
persistence, confirming the dependency called out above).

### `persistence`

**Engine readiness.** Not started — zero matches for "localStorage",
"persist", or "Persistence" anywhere under `data-table`/`data-grid` source.
Favorable groundwork: the slices persistence would restore into
(`columnVisibility`, `columnOrder`, `columnSizing`, `columnPinning`) are
already independently controllable/uncontrollable through the generic
`useControllableDataTableSlice`/`requestChange` machinery, so a restore step
is mechanically "one more `requestChange(slice, value, 'restore')` call per
included slice" rather than a new state-management pattern — and
`'restore'` is already a first-class member of `DataTableChangeCause`
(`data-table-contract.ts:98`) that nothing currently emits. `DataGrid`'s
existing `presets`/`applyPresets`/`resolveGroupedConfig` normalization
pattern (`data-grid.tsx:412-474`) is a reusable template for
restored-vs-explicit-config precedence (design §5.2 rule 8: "Persistence
restores only uncontrolled slices absent from `defaultState`"), even though
presets and persistence are officially separate top-level inputs.

**Missing:** everything else — the `key`/`version`/`storage`/`include`/
`migrate`/`onError` config surface (design §8); the restore-before-interaction
lifecycle hook (must run once, after columns normalize, before interaction —
design §6.13); controlled-slice exclusion; unknown-column-ID pruning;
corruption/SSR error handling via `onError`; versioned migration.

**Files:** new `data-table-persistence.ts` (envelope/version/migrate/storage
adapter — could plausibly live at either the DataTable or DataGrid layer,
see layer-split note below); `data-grid.tsx` for the public `persistence`
prop plumbing and `onError`.

**Layer-split note:** the design doesn't fully settle whether restore
mechanics belong in DataTable (as a controller option, generalizable to
direct DataTable composition) or are DataGrid-only (since DataGrid is the
only layer with a `key`/named-config surface today). The existing pattern —
DataTable owns state/mechanics, DataGrid owns config/UI — suggests the
restore *engine* (read storage, validate/migrate, call `requestChange` per
included slice) belongs in DataTable, with DataGrid supplying the
`PersistenceConfig` prop and defaults. This is a decision for whoever scopes
the PR, not a settled fact from the design doc.

**Depends on:** `columnsFeatures` — the default `include` set is exactly the
four column slices, so full-scope persistence trails full-scope
`columnsFeatures` (specifically pinning/resizing, which don't visually exist
yet). A partial cut restoring only visibility+order (already P0-shipped)
could precede/parallelize with the rest of `columnsFeatures`. Does not
depend on `detailExpansion`, `tree`, `grouping`, `virtualization`, or
`footer` — the design explicitly rejects persisting live-row-state
(selection/detail/tree/current row) by default (§8: "Selection, detail/tree
expansion, current row, request status, and page index are not persisted by
default").

**Acceptance material:**
`data-table/behavior.md:452-473` ("Legacy preferences restore hidden columns
and widths", "Versioned preferences restore safely" — names the exact test
shape: old version + unknown column ID + controlled sorting slice, all in one
scenario, "Live row state is not automatically persisted");
`data-grid/behavior.md:253-259,300-305` ("Column features restore together",
"Presets and detection normalize once").

### `footer`

**Engine readiness.** Not started at the feature level, but the
presentational primitive is already done: `TableFooter` is implemented and
exported by the `Table` primitive
(`packages/ui-react/src/components/ui/table/index.ts`) — `DataTableView`
simply never renders one (confirmed: no `TableFooter`/footer usage anywhere
in `data-table-view.tsx`). No `FooterConfig`, no summary state, no footer
render context (`data-table-render-context.ts` has header/row/cell/state
contexts only), no `footer.render`/`summaries`/`sticky`, no DataGrid
exposure. (One grep hit for "footer" in `data-grid.test.tsx` — "paginates its
rows from the built-in footer" — is describing the pagination bar
colloquially, not an actual summary-row feature; confirms zero real
implementation.)

**Files:** `data-table-view.tsx` (render `<TableFooter>` when a footer config
is present), `data-table-render-context.ts` (new footer context —
`createFooterContext` alongside the existing `createHeaderContext`/
`createRowContext`/`createCellContext`/`createStateContext`),
`data-table-controller.ts` (footer likely needs no new *state* slice at all
— summaries can probably be derived from `table.getFilteredRowModel()`/
current rows as a pure render-prop, unlike the other six, which all need a
state slice). New DataGrid file for the built-in formatted-summary renderer.

**Depends on:** independent of `tree`, `persistence`, `columnsFeatures` for
whole-table summaries. Shares the "no sticky primitive yet" gap
(cross-cutting #2) with `virtualization`/`grouping` for `footer.sticky`.
Group-scoped summaries (a footer row per group) are not addressed by the
design at all — an unstated combination worth flagging if `grouping` lands
first — but basic whole-table summaries need nothing from `grouping`.

**Acceptance material:**
`data-table/behavior.md:476-490` ("Footer and tooltip models expose render
context", bundled with tooltip/borders/style-callback/scroll scenarios in
the same P1.6 milestone); `data-grid/behavior.md:274-297` ("Presentation
config is not a data engine", "Background and header visibility are
presentation only", "Tooltips, borders, events, styles, and layout are
deterministic").

## Where the neutral spec already gets ahead of the code

Both `packages/ui-spec/components/data-table/api.yaml` and
`.../data-grid/api.yaml` already declare all seven groups as target
(framework-neutral) contract entries — `detailExpansion`, `tree`, `grouping`,
`virtualization`, `columnsFeatures`, `persistence`, `footer` all appear as
named config members with descriptions (e.g. `data-grid/api.yaml:76-158`,
`data-table/api.yaml:101-175`), and `behavior.md` in both packages carries the
Gherkin scenarios cited per group above, each tagged `[Target P1 …]` and
often `— shipped legacy parity` (meaning: confirmed shipped in the legacy Vue
`AvTable`, so the scenario is not speculative — it's a known-good behavior
being ported). This means the acceptance criteria and the neutral type shapes
are already written and reviewed; what's missing in every one of the seven
cases is the React/TanStack implementation and, for `detailExpansion`/`tree`/
`grouping`, a resolution to the TanStack-feature-collision and row-model gaps
documented above.
