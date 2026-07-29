# DataGrid — accessibility

DataGrid assembles the DataTable accessibility contract through a simpler API.
Native table semantics remain the default.

## Current React baseline

- The current grid renders native table structure, labeled selection controls,
  a keyboard-operable search/view-options toolbar, and labeled pagination.
- Current sortable column definitions use DataTable's button-based sort
  affordance. Current selection and pagination controls retain visible focus.
- Current colors resolve from `--ui-*` tokens for native structure, toolbar,
  pagination, loading, empty, hover, selected, and disabled treatments.

## Accepted target requirements

- **Target P0:** every assembled grid receives an accessible name through a
  caption, `aria-label`, or `aria-labelledby`.
- **Target P0:** filter, visibility, pagination, retry, bulk-action, row-action,
  and current-row controls are keyboard reachable with visible focus. **Target
  P1:** tree/detail expansion controls meet the same requirement.
- **Target P0:** multi-sort shows priority visibly; only the primary header owns
  `aria-sort`, while every sorted header describes direction and priority.
- **Target P0:** selection checkboxes name their page/loaded/all-results scope;
  mixed state excludes disabled rows. Selected rows expose `aria-selected`,
  current row exposes `aria-current`, and pointer activation has
  roving-focus/Enter parity.
- **Target P1:** grouped headers use `scope="colgroup"` and correct span;
  row-group headers use `scope="rowgroup"`.
- **Target P1:** resize handles are keyboard-operable separators with value
  semantics. Reorder has keyboard move commands and polite announcements.
- **Target P0:** query/loading/error/empty and selection-count changes announce
  concise outcomes. **Target P1:** append status, lazy loads, retries, preference
  restore, and column movement are also announced.
- **Target P1:** virtual rows preserve index/count metadata and pin the focused
  DOM row outside overscan. If pinning cannot retain it during scroll, focus
  moves to the `tabIndex=-1` scroll container without changing logical current
  row; Up/Down focuses the adjacent processed row. If data removes the row,
  focus/current state uses same-index, previous-last, first-enabled-toolbar,
  then scroll-container fallback order and emits one `data-reconcile` event.
- **Target P0:** loading/empty/error rows span visible leaf columns without
  breaking header association. **Target P1:** footer/detail rows do the same.
- **Target P0/P1:** token contrast covers every newly introduced current,
  error, append, expansion, grouping, and virtual-focus treatment.

## Assembled interaction scenarios

```gherkin
Scenario: [Target P0] Current row has keyboard parity
  Given onRowActivate and current-row behavior
  When a keyboard user moves to a row and presses Enter
  Then the same logical callback as pointer activation fires
  And a nested action remains an independent focus target
```

```gherkin
Scenario: [Target P1] Resize and reorder are not pointer-only
  Given columnsFeatures enables resize and reorder
  When a keyboard user adjusts or moves a column
  Then constraints and pin-region rules match pointer behavior
  And the new size or position is announced
```

```gherkin
Scenario: [Target P0] Server states announce honest progress
  Given a server query with an unknown total
  When it loads, fails, retries, and succeeds
  Then each state is announced once
  And pagination never announces a fabricated total
```

```gherkin
Scenario: [Target P1] Lazy tree failure remains operable
  Given a tree disclosure starts lazy loading
  When the request fails
  Then the row announces the failure
  And its retry is named, keyboard reachable, and associated with that row
```

## Tree rows — grid plus disclosure button, not `treegrid`

The tree implementation is a **plain grid with an in-cell disclosure button**. The
table keeps its table/grid role; each expandable row's tree column contains a
`<button>` carrying `aria-expanded` (`anatomy.yaml` `tree-expander`).

**No `aria-controls`.** A tree parent discloses a _variable_ set of sibling rows,
and several `<tr>` elements cannot share one id, so there is no single element to
point at. `aria-expanded` carries the disclosure semantics on its own;
`aria-controls` is optional in ARIA, weakly supported, and pointing it at a
transient row would announce a target that then vanishes. Detail expansion
differs — it controls exactly one projected row — which is why only that half
emits it.

`treegrid` is deliberately **not** used. It would move `aria-expanded` onto the
`<tr>`, require full treegrid keyboard semantics (Left/Right to collapse/expand,
row-level focus as the primary navigation for _every_ consumer, not only tree
ones), and make the in-cell button a redundant control. Adopting it is a separate
decision, not a refinement of this one.

**Known limitation — depth is conveyed visually only.** `--table-tree-depth` is
presentational and exposes nothing to assistive technology, and a plain grid has
no standard attribute for nesting depth: `aria-level` is only meaningful for a
`row` inside a `treegrid`. The disclosure's accessible name therefore carries the
level (for example "Expand children, level 2"). If row-level tree navigation is
ever required, that is the `treegrid` decision above.
