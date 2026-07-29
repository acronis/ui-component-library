# Table — accessibility

Table renders native table semantics (`<table>`/`<thead>`/`<tbody>`/`<tr>`/
`<th>`/`<td>`/`<caption>`), so assistive tech announces rows, columns, and
headers natively. Use the parts as their elements intend.

## Roles & semantics

- The root is a native `<table>` (role `table`); `<th>` are column headers
  (role `columnheader`), `<td>` are cells (role `cell`).
- Provide a `TableCaption` (or an `aria-label`/`aria-labelledby` on the table)
  so the table has an accessible name.
- Simple column headers use `scope="col"`. **Target P1:** grouped column headers
  combine the correct `colSpan` with `scope="colgroup"`; row-group headers use
  `scope="rowgroup"`. Native attributes already pass through.

## Sorting

- A `sortable` `TableHead` sets **`aria-sort`** on the `<th>`: `none` when
  unsorted, `ascending` / `descending` when sorted — so screen readers announce
  the current sort.
- The sort affordance is a real **`<button>`**, so it is reachable by Tab and
  activates with **Enter / Space**; it shows a `--ui-focus-primary` focus ring.
- Only the actively sorted header exposes `ascending` or `descending`. The
  unsorted action name communicates the next available sort without relying on
  the icon.
- **Target P0:** for multi-sort, only the primary header owns `aria-sort`; every
  sorted header has matching visible and accessible direction/priority text.

## Header tooltips

- A header may include a `Tooltip` trigger (consumer composition) to explain a
  column or reveal a label truncated to fit. The trigger must be a real focusable
  control with an accessible name (`aria-label`) so the tooltip is reachable by
  keyboard — not a hover-only affordance. Table owns no tooltip state.

## Selection

- Selection is expressed by rendering a `Checkbox` in a leading cell; label it
  (`aria-label`) and use an `aria-label="Select all"` checkbox in the header.
- A selected `TableRow` currently sets `data-state="selected"` for styling; its
  DataTable owner must pair that with the checkbox state.
- **Target P0:** selected data rows expose `aria-selected`; current rows use
  `aria-current` and remain distinct from selection.
- **Target P1:** the owner supplies stable addressable IDs. A detail target is
  `${tableId}--detail--${base64url(utf8(rowId))}` and a tree target is
  `${tableId}--tree--${base64url(utf8(rowId))}`. An expander includes
  `aria-controls` exactly while its target is mounted; otherwise it omits the
  attribute. `aria-expanded` always reflects logical state, and lives on the
  **expander control** rather than the row — it is only valid on a treegrid row,
  so a row in a `role="table"` never carries it.

## Contrast

- Cell text uses `--ui-table-data-value-color-idle`, headers
  `--ui-table-header-label-color`, dividers `--ui-table-global-row-border-color`;
  row hover/active use `--ui-table-data-row-color-{hover,active}`. These meet
  WCAG AA against the page surface in light and dark themes. Re-verify against
  the final palette once the design is confirmed ready for dev.
