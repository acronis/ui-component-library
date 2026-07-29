# DataGrid — behavior

DataGrid is the sole batteries-included, config-driven table composite. Target
behavior is normalized into one DataTable controller; visible controls consume
its contexts and reuse existing UIKit primitives. Consumers configure outcomes;
they do not assemble engine state or standard chrome.

The current React facade ships `columns`, `rows`, `selectable`, `toolbar`,
`searchKey`, `pagination`, `pageSize`, `state`, `striped`, and related simple
props. Scenarios marked **Target P0/P1** are accepted contracts, not current
support. Source labels distinguish confirmed shipped legacy parity from accepted
proposed-only behavior.

## Current baseline and migration

```gherkin
Scenario: Current simple grid
  Given columns, rows, and current boolean props
  Then DataGrid renders its current toolbar, selection, loading/empty, and pagination treatments
```

```gherkin
Scenario: [Target P0] Deprecated aliases normalize once
  Given selectable, toolbar, pagination, searchKey, pageSize, state, and striped
  When DataGrid creates its controller
  Then each alias normalizes to the equivalent grouped config
  And no parallel legacy behavior engine remains
```

```gherkin
Scenario: [Target P0] DataGrid uses DataTable exclusively
  Given any supported grouped config
  When DataGrid renders
  Then one DataTable controller owns every enabled state slice
  And its state, row models, metadata, actions, and render contexts are complete before chrome is assembled
  And every toolbar, body, selection, data-state, action, and pagination part consumes it
  And no feature UI ships before its supporting DataTable model and action contract
```

```gherkin
Scenario: [Target P0] Standard chrome has one owner
  Given DataGrid enables toolbar filters, data states, and pagination
  And chrome is omitted or mode is "built-in"
  Then DataGrid renders configured toolbar and pagination controls
  When chrome.mode is "external"
  Then chrome.render receives the shared controller plus typed DataGrid state/actions/render contexts
  And built-in toolbar/pagination controls are suppressed while their state remains
  And data-state rows and footer content remain rendered inside the table
  And toolbar config with external chrome is invalid
  And direct DataTable composition needs no chrome flag
```

```gherkin
Scenario: [Target P0/P1] Standard controls reuse UIKit primitives
  Given built-in DataGrid chrome is enabled
  Then toolbar/search/actions use Toolbar, InputSearch, Button, and ButtonGroup
  And selection uses Checkbox
  And filters/settings use Filter/Input/Select/Combobox/Chip/Popover/Menu
  And paging uses Pagination with Select/Button controls
  And loading/empty/error use Skeleton/Spinner, Empty, and Alert
  And expansion/group/actions use ButtonIcon, Collapsible, Tooltip, Menu, Popover, or Dialog as configured
  And no bespoke replacement control or public DataTable companion suite is introduced
```

```gherkin
Scenario: [Target P0] Grouped values resolve by fixed precedence
  Given aliases, presets, configs, defaultState, state, server, and persistence
  Then aliases normalize first and configs beat presets
  And defaultState beats config defaults and state beats defaultState
  And server exclusively controls query slices and optional server selection
  And persistence restores only uncontrolled slices absent from defaultState
  And DataGrid exposes no engine-extension merge point
  And the seven-key engine allowlist or descriptor plugins require DataTable custom composition
```

```gherkin
Scenario: [Target P0] Named callbacks observe, they never own
  Given a screen binds callbacks alongside the config handlers for the same interaction
  Then the config handler runs first and owns the behavior
  And the named callback runs afterwards with the enriched event
  And server.onQueryChange refetches while callbacks.onQueryChange only observes it
  And a slice-derived event carries the cause, the complete next state, the query, and its request key
  And the four column slices arrive as one onColumnStateChange discriminated by slice
  And binding no callbacks installs no per-slice handlers
```

```gherkin
Scenario: [Target P0/P1] Invalid combinations fail deterministically
  Given an alias/config duplicate, server/state duplicate, missing all-results token,
    range with single selection, bulk actions without multiple selection,
    identity feature without row-id, unbounded virtualization or fit,
    conflicting footer/actions renderers, external chrome with toolbar, or non-serializable server descriptor
  Then typed adapters reject it and development validation reports it
  And documented production precedence applies only where a winner exists
```

## Common records-screen outcomes

```gherkin
Scenario: [Target P0] Non-paginated simple API renders all rows
  Given 25 processed rows and pagination = false
  Then all 25 rows render
  And no pagination footer exists
```

```gherkin
Scenario: [Target P0 — shipped legacy parity] Filter, sort, select, and act
  Given typed filters, sorting, multiple selection, disabled rows, and row actions
  When the user filters, sorts, selects eligible rows, and invokes an action
  Then the visible order and selection count derive from one controller
  And the action does not also activate or select its row
```

```gherkin
Scenario: [Target P0/P1 — shipped legacy parity] Faceted filter options
  Given a column filter defines facet = "unique"
  Then DataGrid renders its set-membership control from the distinct values of
    the pre-filter row model, with counts
  And a facet = "min-max" column exposes its numeric range to the control
  And a fixed facet list supplies its options verbatim
  And the option source derives from the one DataTable faceted metadata model
```

```gherkin
Scenario: [Target P0 — shipped legacy parity] Row-click selection and indeterminate policy
  Given multiple selection with selectByRow enabled and one disabled row
  When the user clicks a body row away from its action controls
  Then that row toggles selection while the checkbox remains its accessible control
  And clicking an action or activation control does not also select the row
  When the header control is indeterminate and selectAllOnIndeterminate is true
  Then activating it selects every eligible row rather than clearing them
```

```gherkin
Scenario: [Target P0] Sorting emits a named change event
  Given sorting is enabled
  When the user changes the ordered sort descriptors
  Then sorting-change and state-change receive the same transition
  And it contains the ordered sort descriptors, cause, complete next state/query, and requestKey
```

```gherkin
Scenario: [Target P0 — shipped legacy parity] Stable ID replacement policy
  Given getRowId and reserved selected/current IDs
  When rows are replaced by new objects with the same IDs
  Then logical state is retained
  And reserve = false prunes IDs absent from the new dataset
```

```gherkin
Scenario: [Target P0] Identity is required exactly when a feature needs it
  Given the grouped DataGrid API
  When any identity-bearing feature is enabled — selection, actions, current row,
    server mode, or a controlled selection/current-row/detail-expanded/tree-expanded slice
  Then row-id is required and omitting it does not compile
  When only identity-free features are enabled — sorting, filters, pagination,
    appearance, toolbar, or row click/hover/activate handlers
  Then row-id stays optional, because none of them identifies a record
  And only the deprecated flat aliases may enable an identity feature without it
  And they warn that identity falls back to the row index and cannot survive a data change
```

```gherkin
Scenario: [Target P0 — proposed-only] Multi-sort and typed empty filters
  Given sorting.mode = "multiple"
  And filters include isEmpty or isNotEmpty
  When those controls change
  Then DataGrid produces the same deterministic processed rows as DataTable
  Without the consumer wiring TanStack state
```

```gherkin
Scenario: [Target P1 — proposed-only] Range selection stays visible
  Given an anchor, disabled rows, and a server page boundary
  When Shift selects a range
  Then the contiguous visible eligible rows are selected
  And selection never implies unloaded rows across the boundary
```

## Server and data states

```gherkin
Scenario: [Target P0 — proposed-only] Server facade is all-manual
  Given server contains query, rowCount, and onQueryChange
  When sorting, filtering, grouping, or pagination changes
  Then DataGrid emits exactly one atomic query with any page reset already applied
  And requestKey is canonical JSON of the post-reset version-1 query
  And no matching client transform is installed
```

```gherkin
Scenario: [Target P0] All-results selection is explicit
  Given server mode and selection.selectAll = "all-results"
  When the loaded-page checkbox is activated
  Then DataGrid requires an application-issued token scoped to queryRequestKey
  And never labels loaded rows as all server results
  When the query requestKey changes
  Then that token is invalid until the owner supplies one for the new key
```

```gherkin
Scenario: [Target P0] Loading, error, retry, and empty are coherent
  Given a request moves through loading, error, retry, and successful zero rows
  Then each treatment and announcement appears in order
  And empty appears only after successful zero-row data
```

```gherkin
Scenario: [Target P1 — shipped legacy parity] Append loading preserves content
  Given loaded rows and append loading
  Then existing rows remain visible with append status
```

```gherkin
Scenario: [Target P1 — proposed-only] Append failure offers retry
  Given loaded rows remain visible
  When append fails
  Then a retry action appears without replacing the loaded rows
```

## Advanced parity

```gherkin
Scenario: [Target P1 — shipped legacy parity] Expansion and lazy tree are independent
  Given detail expansion and lazy tree children are configured
  When a detail row opens and a child load fails
  Then detailExpanded and treeExpanded remain separate
  And lazy idle/loading(requestKey)/loaded/error metadata is separate from both
  And detail state remains open
  And the tree row exposes its own error and retry
```

```gherkin
Scenario: [Target P1 — proposed-only] Accordion detail expansion
  Given detailExpansion.mode = "accordion"
  When a second detail row opens
  Then the prior detail row closes
  And tree branches at other depths are unchanged
```

```gherkin
Scenario: [Target P1 — shipped legacy parity] Groups sort and select leaves
  Given grouping, aggregates, sorting, and group selection
  When a group is sorted, collapsed, made sticky, and selected
  Then leaves sort within grouping-key order
  And only eligible leaf records are selected
```

```gherkin
Scenario: [Target P1 — shipped legacy parity] Group roots preserve trees and ungrouped policy
  Given root records include descendant trees and ungrouped records
  When grouping is enabled
  Then roots group and each descendant tree remains attached
  And ungrouped records follow show, name, and first/last placement
  And independently grouping descendants is invalid
```

```gherkin
Scenario: [Target P1 — shipped legacy parity plus React hardening] Column features restore together
  Given pinning, reorder, resize, visibility, and versioned persistence
  When preferences restore against changed column definitions
  Then legacy hidden-column and width preferences restore
  And new hardening prunes unknown IDs and preserves controlled slices
  And pin regions, order, constraints, and locked system columns follow the interaction rules
```

```gherkin
Scenario: [Target P1 — shipped legacy parity] Virtual expanded rows retain focus
  Given measured-height virtualization and an expanded row
  When the user scrolls and DOM rows recycle
  Then expansion and counts remain based on logical rows
  And the focused DOM row is pinned outside overscan
  When pinning cannot retain it during user scroll
  Then focus moves to the scroll container without changing logical current row
  When data removes it
  Then same-index, previous-last, toolbar, scroll-container fallback order applies
  And exactly one data-reconcile event updates current row
```

```gherkin
Scenario: [Target P1 — shipped legacy parity] Presentation config is not a data engine
  Given appearance, overflow, custom feature icons, and footer summaries
  Then those options alter approved rendering only
  And typed columns and render hooks remain the content escape hatch
```

```gherkin
Scenario: [Target P1 — shipped legacy parity] Background and header visibility are presentation only
  Given appearance.background = "accent" and appearance.showHeader = false
  Then the grid renders the accent surface and hides the header row
  And the column model, selection, and data-state behavior are unchanged
  And legacy transparent/solid-brand-accent/solid-brand-lightest/fixed-white map
    onto the neutral background variants through the Table primitive
```

```gherkin
Scenario: [Target P1 — shipped legacy parity] Tooltips, borders, events, styles, and layout are deterministic
  Given row/cell tooltips, cell metadata events/icons, granular borders, style hooks, and onScroll
  When rows render and the container changes or scrolls
  Then normalized contexts drive tooltip/class/style/event results
  And border edges resolve independently
  And automatic measurement runs, with measureLayout only as an external-change escape hatch
```

```gherkin
Scenario: [Target P1 — shipped legacy parity] Presets and detection normalize once
  Given presets apply left-to-right and detection returns IDs from initial columns/rows
  Then explicit grouped configs win
  And detection never observes mutable state
  And preset state, server, rows, and callbacks are invalid
```

```gherkin
Scenario: [Target P0] Force-render is rejected
  Given legacy triggerRerender existed
  Then DataGrid exposes no equivalent
  And immutable controller/state updates are the replacement
```

## Escape hatch

```gherkin
Scenario: Configuration cannot express an uncommon composition
  Given a layout or selective manual mode outside the grouped facade
  Then the author drops to DataTable
  And fully custom native markup drops to Table
  And DataGrid does not grow a runtime layout schema
```
