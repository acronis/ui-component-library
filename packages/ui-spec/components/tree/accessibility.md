# Tree — accessibility

Follows the WAI-ARIA **Tree View** pattern.

## Roles & ARIA

- Root: `role="tree"`. Give it an accessible name (`aria-label` /
  `aria-labelledby`).
- Each node: `role="treeitem"` with:
  - `aria-level` — 1-based nesting depth.
  - `aria-selected` — reflects selection.
  - `aria-expanded` — `true` / `false` on nodes that have children; **absent** on
    leaf nodes.
- Children container: `role="group"`, rendered only while the parent is expanded.
- The chevron toggle is decorative (`aria-hidden`, `tabindex="-1"`); expansion is
  driven from the focusable `treeitem` and the row click.

## Keyboard

| Key                 | Action                                                      |
| ------------------- | ----------------------------------------------------------- |
| ArrowDown / ArrowUp | Move focus to the next / previous visible item              |
| ArrowRight          | Expand a collapsed item, else move focus to the first child |
| ArrowLeft           | Collapse an expanded item                                   |
| Home / End          | Move focus to the first / last visible item                 |
| Enter / Space       | Select the focused node                                     |

## Focus

- **Roving tabindex**: only one item is in the tab order at a time; arrow keys
  move focus (and the tab stop) between visible items. Before the tree is first
  focused, Tab lands on the first item.
- The focus ring is drawn on the row via `--ui-focus-primary` when the item is
  focused with the keyboard (`:focus-visible`).

## Screen reader

- Level, selection, and expanded/collapsed are announced from `aria-level`,
  `aria-selected`, and `aria-expanded`.
- Leading icons and the chevron are `aria-hidden` (decorative); the row is
  announced by its label (and its checkbox state when present).

## Contrast

- All colors resolve to `--ui-*` tokens that meet the kit's contrast targets in
  light and dark. Selection/hover use the info surface with the standard
  on-surface text token; do not hand-author colors.

## Design-pending note

Roving-tabindex + the ARIA wiring are implemented; the Figma per-state focus fill
(`#bed7f4`) and a dedicated `--ui-tree-*` tier are deferred to the design
reconciliation pass.
