# Tree — behavior

Given/When/Then scenarios for the tree menu. State (expand/select/check) is
owned by the `Tree` root and is uncontrolled via the `default*` props.

## Expand / collapse

- **Given** a node with children that is collapsed, **when** the user clicks its
  row or its chevron, **then** the node expands, its `group` of children renders,
  and `aria-expanded` becomes `true` (fires `nodeToggle` with `expanded: true`).
- **Given** an expanded node, **when** the user clicks its row or chevron again,
  **then** it collapses and its children unmount (`nodeToggle` `expanded: false`).
- **Given** a node with no children, **when** the user clicks its row, **then**
  nothing expands (no chevron is shown — a spacer keeps label alignment).

## Selection

- **Given** the tree, **when** the user clicks a row (or presses Enter / Space on
  a focused item), **then** that node becomes the single selected node
  (`aria-selected="true"`), any previously selected node is deselected, and
  `nodeSelect` fires with the node id.
- Selection and expansion are independent: clicking an expandable row both
  selects it and toggles its expansion.

## Checkboxes

- **Given** `showCheckbox` (TreeView) or a `TreeItemCheckbox` in a row, **when**
  the user clicks the checkbox, **then** the node's checked state toggles and
  `nodeCheck` fires with `{ id, checked }`.
- **Given** a row with a checkbox, **when** the user clicks the checkbox, **then**
  the row is **not** selected and does **not** expand (the checkbox stops the
  click from reaching the row).

## Keyboard

- **Given** a focused item, **when** the user presses **ArrowDown / ArrowUp**,
  **then** focus moves to the next / previous visible item (roving tabindex).
- **When** the user presses **ArrowRight** on a collapsed expandable item,
  **then** it expands; on an already-expanded item, focus moves to the first
  child.
- **When** the user presses **ArrowLeft** on an expanded item, **then** it
  collapses.
- **When** the user presses **Home / End**, **then** focus moves to the first /
  last visible item.
- **When** the user presses **Enter / Space**, **then** the focused node is
  selected.
