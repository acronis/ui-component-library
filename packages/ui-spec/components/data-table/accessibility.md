# DataTable — accessibility

DataTable projects native Table semantics and exposes state-derived accessibility
metadata, stable IDs, focus targets, virtual indices and announcement intents.
It does not render standard buttons, checkboxes, filters, menus, pagination,
retry controls or live regions. DataGrid owns those UIKit-composed controls; a
custom DataTable consumer must render equivalent accessible UI.

## Semantic and metadata contract

- Table projection preserves caption/name plumbing, `scope`, spans, row/cell
  association and visible-leaf `colSpan` metadata.
- Sort render context identifies direction and priority. In multi-sort it marks
  the primary header as the only `aria-sort` owner and supplies matching
  accessible direction/priority text for every sorted header.
- Selection context supplies eligible scope, checked/mixed/disabled state and
  selected-row `aria-selected`; it does not render Checkbox controls.
- Current-row context supplies `aria-current`, logical roving-focus targets and
  Up/Down/Home/End/Enter commands; it does not render or focus product controls.
- Detail and tree contexts are independent. Detail target IDs use
  `${tableId}--detail--${base64url(utf8(rowId))}` and tree targets use
  `${tableId}--tree--${base64url(utf8(rowId))}`. Metadata includes
  `aria-controls` exactly while the target is mounted and omits it otherwise;
  `aria-expanded` always reflects logical state.
- Resize/reorder contexts expose separator value/min/max data, movement commands
  and announcement intents. DataGrid supplies the focusable handles.
- Data-state, lazy-load, selection-count, sort-priority and column-movement
  contexts emit polite announcement intents. DataGrid supplies the live region.
- Plugin factories and lifecycle hooks receive read-only accessibility metadata.
  A descriptor may add only manifest-declared `${id}.metadata.<name>` entries
  from its private plugin registry; it cannot replace identity, focus targets,
  keyboard commands, ARIA ownership, or announcement behavior. Mutation or
  undeclared runtime output rejects before the affected table/header/row/cell
  context is exposed.

## Virtual focus contract

DataTable supplies row index/count metadata and the deterministic focus target:

- Pin the focused DOM row outside normal overscan.
- If pinning cannot retain it during user scroll, target the `tabIndex=-1` table
  scroll container while logical current-row ID and last processed index remain
  unchanged; remount does not steal focus.
- Up/Down from that target scrolls to and targets the adjacent processed row.
- If filtering/replacement removes the row, target the row at the same processed
  index, otherwise the previous last row, otherwise the first enabled fallback
  target registered by the host composer, otherwise the scroll container.
- Update current-row state to the fallback ID or `undefined` and emit exactly one
  `data-reconcile` event.

DataGrid performs the DOM focus movement across its composed UIKit controls. A
custom DataTable composer must implement the supplied target contract.

## Required scenarios

```gherkin
Scenario: [Target P0] Render context separates metadata from controls
  Given selection, pagination, filters, actions, and error metadata are enabled
  Then DataTable exposes their state, commands, ARIA metadata, and announcement intents
  And it renders no standard Checkbox, Pagination, Filter, Button, Alert, or live-region UI
```

```gherkin
Scenario: [Target P1] Virtual target survives recycling
  Given a virtualized view has a focused logical row
  When the DOM row leaves ordinary overscan
  Then DataTable supplies the pinned-row target
  When pinning cannot retain it
  Then it supplies the scroll-container target without changing logical current row
  When data removes it
  Then same-index, previous-last, registered-host-target, scroll-container fallback order applies
  And exactly one data-reconcile event updates current row
```

```gherkin
Scenario: [Target P1] Expansion metadata uses separate mounted targets
  Given one row has detail and tree expansion
  Then each context has its own stable target ID and logical aria-expanded value
  And aria-controls exists only for its mounted target
```

```gherkin
Scenario: [Target P0] Plugin metadata cannot replace accessibility ownership
  Given a validated plugin declares `${id}.metadata.<name>`
  When its registrar factory or lifecycle hook runs
  Then it receives a read-only plugin-registry context and may expose only that declared key
  And focus, identity, keyboard, ARIA, and announcement fields remain library-owned
  When it mutates or emits an undeclared accessibility field
  Then the plugin rejects before that context is observable
```
