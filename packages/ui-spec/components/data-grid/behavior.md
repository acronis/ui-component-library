# DataGrid — Behavior

## Rendering

### Renders a row per datum from the column defs

**Given** `columns` and `rows`
**When** DataGrid renders
**Then** it renders a header from the column defs and one body row per datum,
with each cell produced by that column's `cell` renderer (or the accessor value).

### Empty state

**Given** `rows` is empty (or `state="empty"`)
**When** it renders
**Then** it shows a single `emptyMessage` row instead of body rows.

### Loading state

**Given** `state="loading"`
**When** it renders
**Then** it renders `skeletonRows` placeholder rows instead of data.

## Selection

### Selection column

**Given** `selectable`
**When** it renders
**Then** it prepends a checkbox column; the header checkbox selects or clears the
whole page (indeterminate when only some rows are selected)
**And** each row checkbox toggles that row, which tints the row as selected.

## Toolbar

### Client-side search

**Given** `searchKey` (or `toolbar`)
**When** the user types in the toolbar search box
**Then** the grid filters client-side on that column
**And** a Reset control clears the active filter.

### Column visibility

**Given** the toolbar is shown
**When** the user toggles a column in the view-options menu
**Then** that column is hidden or shown.

## Pagination

**Given** `pagination`
**When** it renders
**Then** it renders a footer with the selection count, a rows-per-page select
(seeded by `pageSize` / `pageSizeOptions`), a page indicator, and first / prev /
next / last controls; without `pagination` all rows render and no footer shows.

## Row click

**Given** `onRowClick`
**When** the user clicks a body row
**Then** `onRowClick` is called with that row's original data
**And** the rows present as clickable (pointer cursor).

## Composition / escape hatch

**Given** a need DataGrid's props cannot express
**When** the author reaches for more control
**Then** they drop down to the `Table` primitive and the `DataTable*` parts
DataGrid is built on — flexibility lives one layer down, not in more DataGrid props.
