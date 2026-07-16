# DataGrid — Accessibility

- **Structure:** renders a native `<table>` (via the `Table` primitive), so rows
  and cells carry native table semantics. Column headers are `<th>`.
- **Selection column:** each checkbox is a real `Checkbox` (Base UI) with an
  accessible name — `Select all rows` on the header, `Select row` per row. The
  header checkbox exposes an indeterminate state when only some rows are selected.
- **Toolbar:** the search box is a labeled `InputText`; the column-visibility menu
  and Reset are keyboard-operable (Base UI menu / Button).
- **Pagination:** the rows-per-page control is a labeled `Select`
  (`Rows per page`); the page controls are `ButtonIcon`s with explicit
  `aria-label`s (`Go to first/previous/next/last page`) and are disabled at the
  ends of the range.
- **Row click:** `onRowClick` is a convenience affordance, not a substitute for a
  focusable control — when a row navigates, put a real link/button in a cell so
  keyboard users have a target; the row click augments it for pointer users.
- **Contrast:** all colors resolve from `--ui-*` tokens (the `--ui-table-*` tier
  and the composed components' tiers), authored to meet WCAG contrast.
- **WCAG:** 1.3.1 (info & relationships — native table), 2.1.1 (keyboard —
  toolbar / selection / pagination controls), 4.1.2 (name/role/value — labeled
  checkboxes, select, and icon buttons).
