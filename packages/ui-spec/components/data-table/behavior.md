# DataTable — behavior

DataTable is the flexible React/TanStack engine and custom-composition layer. Its
controller owns state, plugins, models, actions, metadata and render contexts;
DataTableView projects those models through Table.

It supplies no standard toolbar, filters, selection controls, bulk actions,
column-settings menus, pagination controls, overlays, data-state components or
live region. Existing public companion exports are migration liabilities that
move behind private DataGrid chrome, not target DataTable APIs.

## Foundation and ownership

```gherkin
Scenario: Current baseline renders rows
  Given current React DataTable columns and data
  Then it renders native headers and a body row per row in its current page model
```

```gherkin
Scenario: [Target P0] Shared instance
  Given header, cell, row, state, detail, tree, group, and footer render contexts under one DataTableRoot
  When a render-context command filters rows or changes column visibility
  Then every context and the rendered Table projection derive from that controller
  And no part creates a second engine instance
  And no context contains a preassembled product control
```

```gherkin
Scenario: [Target P0 — React adapter] Engine options use an exact seven-key allowlist
  Given engineOptions contains any of debugAll, debugCells, debugColumns,
    debugHeaders, debugRows, debugTable, or renderFallbackValue
  When the React adapter creates the controller
  Then each supplied allowlisted option reaches TanStack unchanged
  And every allowlisted option is optional
  When JavaScript, spread, or untyped input supplies any other TanStack TableOptions key
  Then preflight rejects it in every environment before table construction
  And this includes `_features`, mergeOptions, meta, nested plugins, state,
    callbacks, row models, faceting, identity, manual flags, features, and policy
  And no rejected value is applied
```

```gherkin
Scenario: [Target P0 — React adapter] TanStack upgrades cannot widen engineOptions
  Given the committed classification contains every installed keyof TableOptions
  Then its classified-safe set equals exactly the seven-key public allowlist
  When TanStack adds or removes an option key
  Or the classified-safe/public-allowlist equality changes
  Then the exhaustive type guard fails until every change is explicitly classified
  And runtime normalization continues to use the same seven-key allowlist constant
```

```gherkin
Scenario: [Target P0 — React adapter] Plugin identity and manifest are complete
  Given a plugin descriptor
  Then id, actionNamespace, metadataNamespace, manifest, and setup are required
  And the namespaces equal `${id}.actions` and `${id}.metadata`
  And the manifest contains exactly options, state, callbacks, rowModels, actions, and metadata arrays
  And every manifest entry matches `${id}.<surface>.<name>`
  When an ID or namespace is duplicate or reserved
  Or a manifest key is bare, a TanStack TableOptions key, duplicate, owned, reserved, or collides across plugins
  Then preflight rejects every descriptor before any setup runs
```

```gherkin
Scenario: [Target P0 — React adapter] Registrar output equals the manifest
  Given all plugin descriptors pass identity and manifest preflight
  When setup runs against the recording registrar
  Then only option, state, callback, rowModel, action, metadata, and restricted hook registration is available
  And each registrar local name is qualified as `${id}.<surface>.<name>`
  And registered option/state/callback/rowModel/action/metadata key sets equal the six manifest sets exactly
  And actions are exposed only under `${id}.actions`
  And metadata is exposed only under `${id}.metadata`
  When setup registers an undeclared or unnamespaced key
  Or a declared key is missing from registration
  Then the plugin rejects in every environment before an extension is observable
```

```gherkin
Scenario: [Target P0 — React adapter] Plugin options stay outside TanStack options
  Given a plugin declares and registers `${id}.options.<name>`
  When the validated adapter-derived feature runs
  Then the option value lives in a private plugin-scoped adapter registry
  And plugin factories and hooks receive only its read-only registry view
  And the value is never spread or merged into TanStack TableOptions
  And it cannot replace or insert a canonical DataTable pipeline stage
```

```gherkin
Scenario: [Target P0 — React adapter] Hooks cannot widen or mutate the contract
  Given a validated plugin registers a createTable, createHeader, createRow, or createCell hook
  Then its factories and hooks receive read-only adapter contexts
  When a hook mutates context or produces an undeclared, unnamespaced, owned, reserved, or duplicate runtime property
  Or its runtime surface omits a manifest-declared registered property
  Then the plugin rejects before the table, header, row, or cell is exposed
  And it cannot replace options, state containers, callbacks, controller methods,
    query events, row-model stages, identity, focus/accessibility behavior, or another hook
```

```gherkin
Scenario: [Target P0 — React adapter] Raw features are derived only after preflight
  Given descriptor manifests, recording registrations, and runtime surfaces match exactly
  When the adapter finishes plugin validation
  Then the adapter derives private TanStack TableFeature entries
  And supplies them through its library-owned `_features` option
  And namespaced actions and metadata are visible through read-only render contexts
  But a caller-supplied raw TableFeature is rejected in every environment
```

```gherkin
Scenario: [Target P0] Non-paginated tables do not truncate
  Given 25 processed rows and pagination disabled
  Then all 25 rows render
  And no pagination row model or footer exists
```

```gherkin
Scenario: [Target P0] Stable identity survives immutable data replacement
  Given selected, detail-expanded, tree-expanded, and current state keyed by row-id
  When every row object is replaced by a new object with the same ID
  Then each identity-bearing state still refers to the same logical row
```

```gherkin
Scenario: [Target P0] Identity is conditionally required
  Given every identity-bearing feature is disabled
  Then row-id may be omitted
  When selection, detail/tree expansion, lazy load, current row, row actions,
    row-state persistence, server replacement, or row targeting is enabled
  Then the new adapter shape requires row-id
  And a deprecated identity feature without getRowId warns and is non-reserving
```

```gherkin
Scenario: [Target P0] Current-row interaction selects the identity branch
  Given rowInteraction.current is configured
  Then row-id is required by the new adapter shape
  When only onClick/onHover/onActivate are configured, with current absent
  Then row-id stays optional, because those handlers receive the row object
    and need no identity
  And column-only preference persistence remains identity-free
```

```gherkin
Scenario: [Target P0 — React current compatibility] Legacy detail props normalize without drift
  Given getRowCanExpand and renderExpandedRow are supplied
  Then they normalize to detailExpansion.isExpandable and detailExpansion.render
  When only getRowCanExpand is supplied
  Then expandability/state remains available without projected detail content
  When only renderExpandedRow is supplied
  Then the renderer remains available without making additional rows expandable
```

```gherkin
Scenario: [Target P0] Grouped detail config wins over a legacy alias
  Given detailExpansion and either legacy expansion prop are supplied
  Then development reports an invalid combination
  And detailExpansion wins deterministically in production
```

```gherkin
Scenario: [Target P0 — React first-controller-minor compatibility] Frozen visual aliases preserve output
  Given skeleton with skeletonRows, striped, bordered, or highlightCurrentRow is supplied
  When the deprecated React convenience DataTable renders during the first controller minor
  Then each input preserves its current rendered behavior exactly
  And no new semantics, variants, or customization are added
  And skeletonRows affects only the deprecated skeleton path
  And that skeleton path reuses UIKit Skeleton as DataTable's sole temporary UI exception
  And migration destinations are DataGrid dataState/appearance/rowInteraction,
    Table presentation, or DataTable state/row render contexts as applicable
  And all five deprecated inputs are removed in the next major
```

## Controlled and uncontrolled state

```gherkin
Scenario: [Target P0] Controlled state waits for its owner
  Given sorting is controlled
  When the user requests ascending sort
  Then the sorting callback and onStateChange receive the same event
  And it contains slice, resolved value, cause, complete next state/query, and requestKey
  And the rendered order changes only after the owner supplies that sorting state
```

```gherkin
Scenario: [Target P0] Uncontrolled state initializes once
  Given defaultState contains column visibility
  When the owner later renders a different defaultState
  Then the live visibility is unchanged
  And explicit controller reset is required to restore defaults
```

```gherkin
Scenario: [Target P0] Controlled and default values cannot duplicate a slice
  Given sorting is supplied in both state and defaultState
  Then development reports an invalid combination
  And controlled state wins deterministically in production
```

```gherkin
Scenario: [Target P0] Mixed state slices stay independent
  Given sorting is controlled and selection is uncontrolled
  When the user sorts and selects a row
  Then sorting waits for its owner
  And selection commits internally
```

```gherkin
Scenario: [Target P0] Feature disablement is not an implicit reset
  Given a controlled selection slice contains row IDs
  When selection behavior is disabled
  Then its row model, commands and render-context metadata are removed
  And the controlled slice is not erased
```

## Row-model pipeline

The client pipeline is fixed: `core/tree relationships → filter → group roots →
sort → tree expand → detail-row projection → paginate → virtual presentation`.
A disabled stage is an identity transform; a manual stage consumes
caller-processed rows.

```gherkin
Scenario: [Target P0] Manual stages do not double-process
  Given filtering and pagination are manual
  When caller-supplied rows render
  Then DataTable installs neither the client filter nor pagination row model
  And enabled client sorting still runs in its documented pipeline position
```

```gherkin
Scenario: [Target P1] Virtualization is presentation only
  Given the final row model contains 10,000 processed rows
  When virtualization renders a moving DOM window
  Then filter, group, selection, detail/tree expansion, and page counts still use the final row model
  And recycling rows does not change logical identity
```

## Sorting and filtering

```gherkin
Scenario: [Target P0 — shipped legacy parity] Sort with a custom comparator
  Given a sortable column with a custom comparator and configured sort cycle
  When its button is activated
  Then the controller applies the next direction using that comparator
  And only the active sorted header reports its direction
```

```gherkin
Scenario: [Target P1 — shipped legacy parity] Nested rows sort within their tree level
  Given tree rows and a tree-aware comparator
  When sorting changes
  Then sibling rows sort within each parent
  And parent/child hierarchy and expansion state are preserved
  And children are not flattened into the root sort order
```

```gherkin
Scenario: [Target P0 — proposed-only] Multi-column sort
  Given sorting mode is multiple
  When a second column is added to sorting
  Then both sort descriptors are retained in deterministic priority order
  And only the primary header owns aria-sort
  And every sorted header exposes matching visible and accessible direction/priority
```

```gherkin
Scenario: [Target P0 — shipped and proposed parity] Typed AND filters
  Given status is in-set "active" and name contains "web"
  And the proposed-only isNotEmpty operator is applied to owner
  Then a row renders only when every active filter matches
  And reset clears the configured filter slices atomically
```

```gherkin
Scenario: [Target P0/P1 — shipped legacy parity] Faceted filter metadata is model-only
  Given a set-membership filter requests distinct-value facets
  Then the filter render context exposes the distinct values and their counts
    computed from the pre-filter row model
  And a min-max facet exposes the numeric range instead
  And DataTable renders no option list, chips, or counts control itself
  And the metadata updates when the underlying data changes
```

## Selection, current row, and actions

```gherkin
Scenario: [Target P0 — shipped legacy parity] Select eligible rows
  Given multiple selection with one disabled row
  When the page select-all controller action is invoked
  Then every eligible processed row on the current page is selected
  And the disabled row is excluded from checked and indeterminate calculations
```

```gherkin
Scenario: [Target P0 — shipped legacy parity] Reserve or prune selection
  Given selected IDs are absent from replacement data
  When reserve is true
  Then the IDs remain selected
  When reserve is false
  Then the absent IDs are pruned
```

```gherkin
Scenario: [Target P1 — proposed-only] Visible range and additive selection
  Given a selection anchor and a visible processed range containing a disabled row
  When Shift activates another row
  Then eligible rows in the contiguous visible range are selected
  And the range stops at an unloaded server page
  When Ctrl or Cmd toggles a row
  Then other selected rows remain selected
```

```gherkin
Scenario: [Target P0 — shipped legacy parity] Current row is not selection
  Given current-row interaction and multiple selection are enabled
  When a row receives keyboard activation
  Then currentRowId changes and the activation callback fires
  And selection changes only when the configured selection action is used
```

```gherkin
Scenario: [Target P0 — shipped legacy parity] Row action isolates propagation
  Given a custom row renderer invokes an action command inside a selectable activatable row
  When its render-context isolation handler runs
  Then its action callback fires
  And row activation and selection do not fire
```

```gherkin
Scenario: [Target P0/P1 — shipped legacy parity] Row, cell, tooltip, and scroll callbacks are concrete
  Given rowInteraction callbacks and column cell metadata are configured
  When a row or cell is hovered/clicked, a row activates, or the container scrolls
  Then the corresponding enriched row, cell, activation, or scroll event fires once
  And row/cell tooltip content receives its normalized context
  And cell actions still isolate row propagation
```

## Manual/server queries and data states

```gherkin
Scenario: [Target P0 — proposed-only] Query-changing sort resets pagination atomically
  Given server query pageIndex is 3
  When the primary sort changes
  Then exactly one query-change event is emitted
  And its query pagination.pageIndex is 0
  And requestKey is the canonical JSON serialization of that post-reset version-1 query
  And object keys are lexicographically sorted while descriptor priority order is preserved
```

```gherkin
Scenario: [Target P0] Unknown totals are honest
  Given manual pagination has no rowCount or pageCount
  And the owner supplies hasNextPage and hasPreviousPage
  Then navigation follows those capabilities
  And no fabricated page count is announced
```

```gherkin
Scenario: [Target P0] All-results token cannot cross a query
  Given an application-issued all-results token is scoped to request key A
  When filters produce request key B
  Then no all-results selection is reported for B
  Until the controlled owner supplies a token scoped to B
  And toggled exclusions emit against the authoritative token without mutating it internally
```

```gherkin
Scenario: [Target P0] Loading does not flash empty
  Given a server query is loading and the current row window is empty
  Then the state context reports loading and a loading announcement intent
  And it does not report empty
  When the successful response contains zero rows
  Then the context reports empty and an empty announcement intent
  And the controller/view contract renders no standard Skeleton, Empty, Alert, retry, or live-region control
  And only the frozen deprecated React convenience skeleton path may temporarily reuse Skeleton
```

```gherkin
Scenario: [Target P1 — proposed-only] Append failure retains rows
  Given loaded rows are visible and incremental loading fails
  Then existing rows remain visible
  And state context exposes append-error metadata plus a retry command
  And DataTable renders no retry control
```

## Expansion, tree, and grouping

```gherkin
Scenario: [Target P1 — shipped legacy parity] Detail and tree expansion are separate
  Given a tree row can also reveal a detail row
  When detail expansion toggles
  Then only detailExpanded and onDetailExpansionChange change
  And treeExpanded and onTreeExpansionChange are unchanged
  And accordion mode, when enabled, applies only to the configured detail scope
```

```gherkin
Scenario: [Target P1 — shipped legacy parity] Lazy child load handles stale work
  Given a collapsed tree row starts loading children
  When a newer request replaces it or the row disappears
  Then loading(requestKey), loaded, or error(error,requestKey) metadata remains keyed by row ID
  And it is stored outside both expansion slices
  And stale results do not mutate the current tree
  And loading failure exposes row-scoped error metadata and a retry command
  And standard Spinner/Alert/retry UI belongs to DataGrid
```

```gherkin
Scenario: [Target P1 — shipped legacy parity] Group selection targets leaves
  Given a collapsible group contains eligible and disabled leaves
  When the group-selection command is invoked
  Then eligible leaf records are selected according to group policy
  And the synthetic group row and disabled leaves are not selected
```

```gherkin
Scenario: [Target P1 — shipped legacy parity] Sorting within groups
  Given grouping and leaf sorting are enabled
  When sorting changes
  Then group order follows grouping keys
  And leaves sort within each group
  And aggregate sorting occurs only when explicitly configured
```

```gherkin
Scenario: [Target P1 — shipped legacy parity] Grouping classifies roots and handles ungrouped rows
  Given grouped roots include descendant trees and an ungrouped policy
  When grouping runs
  Then only root rows are classified and every descendant tree remains attached
  And ungrouped rows follow configured show/hide, name, and first/last placement
  And regrouping descendants independently is rejected as invalid
```

## Columns, layout, persistence, and footer

```gherkin
Scenario: [Target P1 — shipped legacy parity] Pin, order, size, visibility, and restore interact
  Given pinned system columns and persisted user column preferences
  When preferences restore, a column is reordered, resized, hidden, and shown again
  Then pin regions win over order
  And explicit min/max sizes win over fit distribution
  And system selection/action columns stay locked unless explicitly unlocked
```

```gherkin
Scenario: [Target P1 — proposed-only accessibility counterpart] Keyboard column manipulation
  Given resize and reorder are enabled
  Then render context exposes constrained resize/reorder commands and announcement intents
  And DataTable renders no handle or live region
  And DataGrid or a custom composer maps keyboard controls to those commands
```

```gherkin
Scenario: [Target P1 — shipped legacy parity] Legacy preferences restore hidden columns and widths
  Given stored hidden-column and width preferences
  When columns normalize
  Then valid hidden columns and widths restore before interaction
```

```gherkin
Scenario: [Target P1 — new React hardening] Versioned preferences restore safely
  Given storage contains an old version, an unknown column ID, and a controlled sorting slice
  When persistence restores
  Then migration and validation run
  And the unknown column is discarded
  And controlled sorting is not overwritten
  And selection, detail/tree expansion, current row, request status, and page index are not restored by default
```

```gherkin
Scenario: [Target P1] Live row state is not automatically persisted
  Given persistence is enabled without explicit live-row-state inclusion
  Then selection, detail/tree expansion, and current row are excluded
  And an adapter may persist one only through an explicit safe opt-in contract
```

```gherkin
Scenario: [Target P1 — shipped legacy parity] Footer and tooltip models expose render context
  Given footer summaries and row/cell tooltip metadata
  Then footer context exposes summary values and commands
  And cell context exposes overflow/tooltip metadata and anchor data
  And DataTable renders no formatted summary or Tooltip control
```

```gherkin
Scenario: [Target P1 — shipped legacy parity] Automatic layout and scroll replace doLayout
  Given data, columns, sizes, or the container change
  Then layout measurement is scheduled automatically
  When an external font/container change is not observable
  Then measureLayout performs the explicit measurement
  And onScroll receives the normalized scroll event
```

## Rejected legacy mutation surface

```gherkin
Scenario: [Target P0/P1] Controller actions replace Vue imperative mutation methods
  Given legacy Vue exposed one-for-one imperative methods that directly mutated table state
  Then DataTable does not reproduce that mutation surface
  And controlled state plus state-change callbacks remain the primary API
  And approved reset, toggle, and scrollToRow controller actions provide equivalent supported operations
```

```gherkin
Scenario: [Target P0] No force-render replacement is exposed
  Given legacy triggerRerender forced Vue to repaint mutable data
  Then DataTable exposes no force-render API
  And immutable data/state updates drive rendering deterministically
```

```gherkin
Scenario: [Target P0/P1] Named slots map to typed hooks
  Given legacy Vue provided arbitrary named slots
  Then columns and typed header/cell/row/state/footer/action/group/detail contexts replace supported customization
  And uncommon layout uses DataTable composition or the Table primitive
```
