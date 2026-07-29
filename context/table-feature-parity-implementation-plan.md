# Table feature parity: implementation plan

- **Status:** Planned
- **Date:** 2026-07-23
- **Design contract:** `context/table-feature-parity-design.md`

## 1. Delivery rules

- One engine only: DataGrid normalizes into DataTable; DataTable renders Table.
- Table owns table-shaped presentation only. DataTable owns TanStack-oriented
  state, plugins, actions, metadata, and render contexts only. DataGrid owns all
  library-supplied product chrome that composes other UIKit primitives.
- Do not create a batteries-included `DataTable*` companion suite. Existing
  toolbar/view-options/pagination exports are migration liabilities: establish
  compatibility adapters in P0.3, move each implementation behind DataGrid only
  in its owning P0.4-P0.6 milestone, and add no new features to those exports.
- DataGrid controls reuse existing UIKit primitives. A PR that needs a missing
  primitive must add or mature that primitive first; it must not hide a bespoke
  substitute inside DataGrid.
- Characterization precedes refactoring, but a PR never lands a knowingly
  failing test.
- Controller/state correctness lands before any pattern or screen migration.
- Every feature PR includes its own neutral spec/scenario changes, adapter
  tests, stories, accessibility coverage, and visual baselines where relevant.
  No parity scenarios are postponed to a final catch-all PR.
- New behavior is labeled shipped parity, proposed-only, or React hardening.
- Public changes receive a changeset in the PR that introduces them.

## 2. P0: foundation and correctness

### P0.1 Passing characterization only

Record current behavior without changing claims or expected outcomes:

- Table native semantics, sort affordance, selected row, and overflow;
- DataTable rows/empty/skeleton/striped/bordered/current-row/expansion behavior
  within the currently rendered page;
- current DataGrid search, visibility, selection, pagination, and data states;
- current companion behavior when given a caller-owned instance;
- public type snapshots and current stories.

Document the two known defects in the PR description and design record. Do not
encode truncation or split-instance behavior as desired assertions, do not add
skipped/failing tests, and do not edit component specs in this PR.

### P0.2 Controller, identity/state events, and correctness fixes

Implement together:

1. neutral state/change/query types and React adapter types;
2. conditional `getRowId` discriminated union plus deprecated compatibility
   overload;
3. controllable state helper;
4. deterministic request-key serialization;
5. `useDataTable`, conditional row models, root/context, and view;
6. removal of unconditional pagination;
7. same-ID data-replacement reconciliation;
8. compatibility normalization of shipped `getRowCanExpand` and
   `renderExpandedRow` into independent detail-expansion state;
9. separate top-level DataTable `engineOptions` and `plugins` inputs for
   non-owned TanStack extensions;
10. the seven-key `DataTableEngineOptions` `Pick` allowlist verified against
    TanStack v8.21.3, its complete `keyof TableOptions` classification guard,
    runtime allowlist, and the namespaced manifest/recording-registrar plugin
    preflight. The adapter derives internal raw TanStack features only after
    validation; public callers never supply a raw `TableFeature`.

Add the previously blocked regression tests in the same PR as the fixes:

- 25 rows with pagination disabled render 25 rows;
- controlled slices request but do not commit without owner update;
- uncontrolled slices commit;
- callbacks contain resolved value/cause/full next state/query/request key;
- same-ID immutable replacement preserves configured identity state;
- identity-free use may omit `getRowId`; selection, either expansion domain,
  `getSubRows`, row interaction/current row, actions, server mode, and
  identity-bearing state require it;
- both legacy expansion props retain their current paired and partial behavior,
  and new `detailExpansion` wins over a duplicate legacy prop with a
  development error;
- all six diagnostic flags and `renderFallbackValue` reach TanStack;
- compile-time tests accept exactly those seven keys, reject every other
  `keyof TableOptions`, and prove the committed classification is exhaustive;
  the guard intentionally fails when a TanStack upgrade adds/removes a key or
  changes the classified-safe/public-allowlist equality;
- runtime tests iterate the committed v8.21.3 option-key classification and
  prove every non-allowlisted key—including `_features`, `mergeOptions`,
  `meta`, state, callbacks, row models, faceting, identity, manual flags, and
  policy—is rejected in development and production before construction;
- raw `TableFeature` input is type/runtime rejected;
- plugin ID and action/metadata namespace duplicates, reserved prefixes,
  owned/cross-plugin manifest collisions, duplicate manifest entries,
  undeclared registrations, missing declared registrations, unnamespaced
  action/metadata, forbidden hook mutation, and undeclared runtime surface all
  reject before becoming observable;
- plugin `options` manifests reject bare or arbitrary TanStack option keys and
  accept only `${id}.options.*` adapter keys produced by the registrar;
- a valid descriptor's manifest exactly matches registrar output, its
  fully namespaced options/state/callbacks/row-models/actions/metadata are
  exposed through the private plugin registry, and the adapter-derived internal
  TanStack feature runs without exposing raw registration or merging plugin
  options into `TableOptions`;
- `plugins` nested inside `engineOptions` is a type/runtime error, while the two
  separate top-level DataTable inputs work;
- DataGrid has neither input in its public type and does not forward extension
  values.

Update Table/DataTable specs only for contracts implemented in this PR.

### P0.3 Controller actions, private-chrome infrastructure, and compatibility

- Add typed DataTable selectors/actions and render contexts for header, cell,
  row, detail, tree/group, footer, state, and external DataGrid chrome.
- Add typed reset/toggle/scroll/`measureLayout` controller actions.
- Reject `triggerRerender`; automatic immutable state updates are the tested
  replacement.
- Keep the convenience `<DataTable columns data />` path on the same controller.
- Establish private DataGrid chrome containers, shared controller access, focus/
  announcement plumbing, and primitive adapter boundaries only. Do not
  implement selection/bulk controls or data-state UI in this milestone.
- Freeze existing public toolbar/view-options/pagination companions and wire
  them to the shared controller only as deprecated compatibility adapters when
  removal would be breaking. P0.3 does not migrate or extend their feature UI;
  each private DataGrid implementation lands in P0.4-P0.6 with its feature.
- Add the frozen one-minor DataTable adapter for current
  `skeleton`/`skeletonRows`, `striped`, `bordered`, and `highlightCurrentRow`
  props. Preserve characterization behavior exactly. Document
  DataGrid/Table/render-context destinations and next-major removal.

DataTable tests prove render-context actions update the exact body instance.
Compatibility tests and existing visual stories prove the four current props
remain unchanged through the adapter and produce deprecation diagnostics. Shell
tests prove private chrome receives the same controller, but feature-control
integration assertions land in P0.4-P0.6. Correct the false companion guidance
now. Do not migrate patterns yet.

### P0.4 Sorting, filters, visibility, identity interactions

- Shipped single/custom sorting and proposed multi-sort.
- Exact sort cycle and stable priority ordering.
- Multi-sort visible priority plus accessible direction/priority.
- AND column/global filters and shipped operators plus proposed
  `isEmpty`/`isNotEmpty`.
- Faceted filter metadata (legacy `filterStats`): DataTable exposes distinct
  values/counts and min-max range from the pre-filter row model; DataGrid
  renders the set-membership option list/chips from that metadata.
- Column visibility.
- DataGrid sortable-header, toolbar/search, column-filter, applied-filter, and
  view-options UI using the approved UIKit primitives.
- Pipeline-order tests for filter -> group placeholder -> sort -> paginate.

Spec/scenario changes and stories land here, including controlled/uncontrolled
equivalence, page-index reset, and proof that each DataGrid control updates the
same DataTable controller.

### P0.5 Selection, current row, pointer/cell events, and actions

- DataTable: single/multiple/select-all/disabled/reserved selection model,
  selectors, toggle actions, and render-context metadata.
- DataGrid: standard row/header `Checkbox` controls, selection count, and row
  action UI using `ButtonIconMenu`/`DropdownMenu`.
- DataGrid: bulk-action bar and confirmation UI. **Corrected** — this bullet
  previously credited P0.5 with bulk-action **overflow** "using `Toolbar`,
  `Button`/`ButtonMenu`". Neither is shipped, and neither is required: design §5.2's
  `toolbar` row lists `bulkActions` with no overflow member, neither the design's
  `BulkAction` nor the shipped `DataGridBulkAction` has one, and `api.yaml` says only
  "bulkActions empty". So the plan over-claimed relative to its own contract, and the
  resolution is this correction rather than code — building overflow would implement
  a member no contract asks for. What ships is a `<div role="toolbar">` with a
  `Button` per action and `ConfirmDialog` behind `confirm`. That it hand-rolls the
  bar instead of composing the kit's `Toolbar`/`ButtonMenu` is a **kit-consistency**
  finding for the grammar ledger, not a parity gap.
- Concrete row hover/click/activate and cell hover/click events.
- Current-row roving focus and keyboard activation.
- Row-click selection (`selectByRow`), select-all indeterminate policy
  (`selectAllOnIndeterminate`), and optional header select-all (`showSelectAll`),
  with action/activation controls still isolating propagation.
- Row actions and event-propagation isolation.
- Stable-ID data replacement and reserve/prune scenarios.
- Server-ready explicit vs all-results selection state types, without enabling
  server mode until P0.6.

Every callback assertion checks cause, full state/query, and request key.

### P0.6 Manual/server contract and data states

- Independent DataTable manual sorting/filtering/grouping/pagination.
- DataGrid all-manual server query type.
- Known and unknown totals.
- Canonical request keys, stale-result handling, and one atomic query event.
- Application-issued all-results selection tokens scoped to query request key.
- DataTable status metadata and row projection for loading, loaded, empty, and
  initial error; no false-empty transition.
- DataGrid presentation with `Skeleton`/`Spinner`, `Empty`, `Alert`, and
  `Button` retry controls.
- DataGrid pagination controls, page-size choice, known/unknown counts, and
  server navigation using `Pagination` plus `Select`/`Combobox`.

Required deterministic scenarios:

```gherkin
Scenario: Query-changing sort resets pagination atomically
  Given server query pageIndex is 3
  When the primary sort changes
  Then exactly one onQueryChange event is emitted
  And its pagination.pageIndex is 0
  And its requestKey is the canonical key of that post-reset query
```

```gherkin
Scenario: All-results selection cannot cross a changed query
  Given an all-results token scoped to request key A
  When filters produce request key B
  Then the grid reports no all-results selection for B
  Until the owner supplies a token scoped to B
```

### P0.7 Final DataGrid normalization and integration

- Implement all grouped-config normalization and validation.
- Implement canonical `chrome` ownership: built-in by default; external requires
  a renderer, suppresses built-in toolbar/pagination controls, and rejects a
  toolbar config.
- Integrate the private chrome delivered in P0.3-P0.6 around the shared
  controller and render contexts. Do not rebuild those controls here.
- Audit that the already-delivered controls use `Toolbar`, `InputSearch`,
  `Filter`, `Input*`, `Select`/`Combobox`, `Chip`, `Pagination`, `Checkbox`,
  `Button`/`ButtonIcon`, `ButtonMenu`/`DropdownMenu`, `Popover`, `Tooltip`,
  `Skeleton`, `Spinner`, `Empty`, `Alert`, and `ConfirmDialog` as applicable.
- Keep those composed controls private to DataGrid. DataTable receives
  state/plugin hooks and render contexts, not a duplicate standard UI.
- Add named screen callbacks.
- Normalize deprecated aliases; grouped+alias duplicates error in development.
- Validate state/default/server/persistence precedence and invalid combinations.
- Type-test that DataGrid exposes neither `engineOptions` nor `plugins`; advanced
  extension examples use DataTable composition.
- Type-test that every member with a documented default is optional, `{}` uses
  those defaults, unknown-total pagination enforces its server constraints, and
  toolbar `{}` renders view options only.
- Require `getRowId` on the new DataGrid API; preserve the deprecated overload.
- Verify grouped configs enable the standard toolbar/filter/selection/action/
  data-state/pagination chrome already implemented in its owning milestone.

Only after this is green:

- update `table-view` to `PageHeader` + DataGrid;
- update `data-table-bulk-actions` to DataGrid or one explicit DataTable
  controller;
- update the data-table screen to bind named callbacks;
- test duplicate built-in/external chrome rejection.

P0 exit:

- every P0 ledger row is implemented, specified, and tested in its feature PR;
- typecheck, lint, ui-spec validation, unit/interaction/a11y tests pass;
- light/dark Docker baselines for changed stories are reviewed;
- existing calls compile through documented compatibility overloads;
- the dependency audit records which existing UIKit primitive owns each visible
  DataGrid control and any prerequisite primitive work has landed separately.

## 3. P1: advanced shipped parity

### P1.1 Detail expansion

- DataTable owns independent detail-expanded state, callbacks, reset, stable
  IDs, ARIA metadata, and render context.
- DataGrid owns the standard `ButtonIcon`/`Collapsible` expander chrome.
- Public grouped `detailExpansion` API over the P0 detail state; deprecated
  `getRowCanExpand`/`renderExpandedRow` continue to normalize through it.
- Controlled/uncontrolled and reserved/pruned replacement behavior.
- Proposed accordion mode, explicitly labeled new.
- Detail + selection + pagination scenarios.

### P1.2 Tree and lazy loading

- DataTable owns independent tree-expanded state, callbacks, row models, lazy
  request state, and actions.
- DataGrid owns `ButtonIcon`/`Collapsible`, `Spinner`, `Alert`, retry, and
  selection chrome for tree rows.
- Nested rows, indentation, tree-aware filter/sort rules.
- Lazy request keys, per-row loading/error/retry, stale-result rejection.
- Tree selection cascade on/off and disabled descendants.
- Tree + detail scenario proving neither expander mutates the other.

### P1.3 Grouping, ungrouped rows, and tree combination

- DataTable owns group/collapse/sticky/group-selection models and commands.
- DataGrid owns group expanders, labels, selection controls, and menus using
  UIKit primitives.
- `ungrouped` show/hide, name, and first/last placement.
- Root-only grouping with preserved descendant trees.
- Deterministic group order, sort-within-group, and aggregate-sort scenarios.
- Group + tree + lazy + selection scenarios.

### P1.4 Column system

- Table owns grouped-header scope/span and column visual presentation.
- DataTable owns pin/fixed, resize/min/max, reorder, visibility, fit state and
  commands.
- DataGrid owns view-options menus, resize/reorder handles, reset, and fit UI
  using `DropdownMenu`/`Popover`, `Checkbox`, `Resizable`, `ButtonIcon`, and
  `Tooltip`.
- Keyboard resize/reorder and live announcements.
- Locked system columns.
- Pin + reorder + resize + visibility interaction tests.

### P1.5 Virtualization, scrolling, layout, and append

- Final-row-model virtualization adapter with fixed/measured heights.
- Bounded container, overscan, scroll targeting, sticky header/groups.
- Scroll callback and the exact pinned-row, scroll-container, and removed-row
  focus fallback policy from the design.
- Automatic layout observation plus `measureLayout` escape hatch.
- Shipped append/loading-more.
- Proposed append error/retry labeled new.
- Performance budgets for flat, selected, grouped, tree, and expanded data.
- Lazy per-feature initialization and code-split feature chunks so a minimal
  grid pays no cost for unused features (legacy Phase 2/3 parity); a React
  delivery concern, not a contract feature.

### P1.6 Appearance, tooltips, callbacks, and footer

- DataTable exposes tooltip/overflow metadata and anchor render contexts;
  DataGrid renders standard `Tooltip`/`TruncatedText` UI.
- Granular top/bottom/horizontal/vertical borders.
- Table background surface variants (`appearance.background`) and header
  visibility (`appearance.showHeader`), driven through the Table primitive.
- Row/cell/header class and style callbacks with normalized contexts.
- Custom feature icons/render hooks, including action/settings-column icons.
- Footer summaries/custom footer.
- Pointer and keyboard scenarios plus light/dark visual coverage.

### P1.7 Persistence, presets, and feature detection

- First reproduce shipped hidden-column and width restore.
- Add versioned envelope/storage/migration as React hardening.
- Add order/pinning opt-in, corruption/SSR/error handling, and unknown-column
  pruning.
- Controlled/default slices win over restore.
- Add named presets and one-time feature detection as config normalization.
- Verify later explicit configs win and detection never mutates after mount.

P1 exit:

- every shipped-parity ledger row is implemented and tested in its owning PR;
- accepted proposed-only behavior is visibly labeled as new;
- every interaction rule has pairwise coverage;
- advanced stories use supported public APIs rather than private recipes;
- accessibility, performance, and Docker visual gates pass.

## 4. Explicit post-P1 boundary

Cross-page Shift selection over unloaded server rows remains deferred until an
application supplies an ordered-ID range service. Current range selection stops
at the loaded processed page. It never guesses missing IDs.

Automatic persistence of selection/detail/tree/current state and a force-render
API remain rejected defaults. One-for-one Vue slots remain replaced by typed
render hooks and lower-layer composition.

## 5. Spec and screen work by owning PR

Specs stay in the existing seven-file, framework-neutral format:

- Table: semantic parts, sort/current/selected/expanded presentation, borders,
  overflow, and native accessibility only.
- DataTable: neutral controller/state/query/feature contract, conditional row
  identity, separate expansion domains, pipeline/manual rules, state/plugin
  hooks, actions, metadata, and render contexts. It must not promise standard
  toolbar/filter/pagination/selection/menu/overlay/data-state controls.
- DataGrid: concrete grouped configs, precedence, server contract, named
  callbacks, UIKit-primitive dependency/reuse, standard chrome ownership, and
  compatibility aliases in the React adapter section.
- `table-view`: PageHeader plus DataGrid-owned toolbar/filter/data states/page.
- `data-table-bulk-actions`: DataGrid by default; one shared DataTable
  controller only for explicit custom composition.
- data-table screen: named callback bindings and reachable server, selection,
  retry, action, column preference, detail, and tree states actually used by the
  screen.

Each PR changes only the spec/scenarios for behavior it implements. Generated
stories and conformance tests must remain synchronized.

## 6. Verification matrix

| Layer         | Verification                                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------------ |
| Neutral spec  | Conditional identity; distinct expansions; config/state/query events; shipped/proposed labels          |
| React types   | Seven-key allowlist + exhaustive upgrade guard; plugin manifests; no DataGrid engine escape hatch      |
| Unit          | State slices, canonical request key, pipeline, reconciliation, persistence, presets, lazy races        |
| Component     | Table presentation; DataTable models/render contexts; DataGrid UIKit-composed controls and data states |
| Interaction   | Pointer/cell events, keyboard current row/sort/resize/reorder, retry, bulk actions                     |
| Accessibility | axe plus names, scopes, sort priority, ARIA state, focus, live regions, virtual row metadata           |
| Stories       | Canonical feature and high-risk pair stories; client/server; shipped/proposed labels                   |
| Visual        | Light/dark Docker baselines for density, border variants, pin/sticky, grouping/tree, data states       |
| Performance   | Large flat/grouped/tree/selected data; virtual DOM count; update/scroll budgets                        |
| Compatibility | Calls compile; aliases/frozen DataTable props preserve behavior; no second engine or new chrome suite  |

Test ownership follows the public boundary:

- Table tests assert markup, layout/presentation variants, refs, native
  semantics, scopes, and passive ARIA/data attributes. They do not initialize a
  TanStack instance.
- DataTable tests assert row-model pipelines, controlled/uncontrolled state,
  selectors/actions, plugin/manual modes, query events, render-context values,
  reconciliation, virtualization, and accessibility metadata. They do not
  assert UIKit toolbar, checkbox, menu, pagination, dialog, popover, tooltip,
  empty, alert, or spinner rendering, except frozen characterization of the
  deprecated current skeleton compatibility prop.
- DataGrid tests assert config normalization and integration between its one
  DataTable controller and the reused UIKit controls. Each control test proves
  both the primitive contract and the resulting controller/query change.
- DataGrid stories and visual baselines own complete toolbar, filter, selection,
  bulk-action, menu, data-state, tree/group chrome, column-settings, overlay,
  pagination, and live-region combinations. DataTable stories demonstrate
  flexible render composition without resembling a second standard records
  screen.

High-risk combinations:

- filter + reserved selection + immutable data replacement;
- multi-sort + grouping + detail expansion;
- tree lazy load + cascade selection + error/retry;
- grouping roots + descendant tree + ungrouped placement;
- pin + reorder + resize + visibility + persistence;
- server query + unknown total + stale result + all-results token;
- virtualization + measured height + both expansion domains + focus;
- bulk actions + pagination + disabled rows;
- loading + append + error/retry + live announcements.

## 7. Pull-request sequence

1. **Passing characterization only** — no spec claims or expected defects.
2. **Controller/state/events/identity plus pagination and reconciliation fixes.**
3. **Controller/render contexts, private-chrome shell, and compatibility
   adapters.**
4. **Sorting/filtering/visibility plus their DataGrid controls and scenarios.**
5. **Selection/current-row/actions plus DataGrid selection/bulk/action UI.**
6. **Manual/server/query/data-state plus DataGrid state/pagination UI.**
7. **Final DataGrid config normalization/integration, then screen migration.**
8. **Independent detail expansion, tree/lazy, and their scenarios.**
9. **Grouping/ungrouped/tree combination and its scenarios.**
10. **Column system and keyboard accessibility with its scenarios.**
11. **Virtualization/layout/scroll/append plus appearance/tooltips/footer with
    their scenarios.**
12. **Persistence/presets/detection with their scenarios and release integration
    audit.**

PR 12 does not receive postponed parity tests. Its audit only runs the already
landed full suite, checks the ledger has no unowned accepted row, reviews
performance/visual results, and confirms migration documentation.
