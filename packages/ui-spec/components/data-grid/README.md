# DataGrid

The opinionated, config-driven table composite. It gives standard record screens
one small grouped API, normalizes every behavior into DataTable, and exclusively
composes the visible product UI from existing UIKit primitives.

> **Availability.** The current React adapter ships a smaller boolean-prop
> facade and its own internal TanStack setup. The grouped config API and the
> rebuild exclusively on `useDataTable` are accepted P0/P1 target work. Examples
> are labelled so planned behavior is not mistaken for shipped support.

## Choose the layer

| Layer       | Use it for                                                    |
| ----------- | ------------------------------------------------------------- |
| `Table`     | Native custom markup; the application owns all behavior.      |
| `DataTable` | Flexible engine, controlled/manual state, custom composition. |
| `DataGrid`  | Standard records screen with approved feature configs.        |

## Current React API

```tsx
<DataGrid
  columns={columns}
  rows={rows}
  selectable
  toolbar
  searchKey="email"
  pagination
  pageSize={25}
  striped
/>
```

## Accepted grouped API (planned)

```tsx
<DataGrid
  columns={columns}
  rows={rows}
  getRowId={(row) => row.id}
  dataState={{ status: 'loaded' }}
  selection={{
    reserve: true,
    isRowSelectable: (row) => !row.locked,
  }}
  sorting={{ mode: 'multiple' }}
  filters={{
    global: { placeholder: 'Search devices' },
    columns: filterDefs,
  }}
  defaultState={{ pagination: { pageIndex: 0, pageSize: 25 } }}
  pagination={{ pageSizeOptions: [25, 50, 100] }}
  columnsFeatures={{
    reordering: true,
    resizing: true,
    pinning: true,
    overflowTooltip: true,
  }}
  toolbar={{
    globalSearch: true,
    columnFilters: true,
    bulkActions,
  }}
  appearance={{
    striped: true,
    stickyHeader: true,
    height: 480,
    borders: { horizontal: true, vertical: true },
  }}
  persistence={{ key: 'devices-grid', version: 2, storage }}
/>
```

Accepted groups are `selection`, `sorting`, `filters`, `pagination`,
`detailExpansion`, `tree`, `grouping`, `virtualization`, `columnsFeatures`,
`persistence`, `toolbar`, `actions`, `appearance`, `dataState`, `footer`, and
`rowInteraction`. `chrome`, `state`, `defaultState`, `server`, `presets`, and
`callbacks` are top-level ownership/normalization inputs rather than behavior
groups.

## UIKit composition ownership

DataGrid is the only batteries-included layer:

- `Toolbar`, `InputSearch`, `Button`, and `ButtonGroup` for standard chrome.
- `Checkbox` for selection.
- `Filter`, `Input*`, `Select`/`Combobox`, `Chip`, `Popover`, and `Menu` for
  filtering and column settings.
- `Pagination` plus `Select`/`ButtonIcon` for paging.
- `Skeleton`/`Spinner`, `Empty`, and `Alert` for data states.
- `ButtonIcon`, `Collapsible`, `Tooltip`, `Menu`, `Popover`, and `Dialog` for
  expansion, grouping, actions, help and overlays.
- `Table` and `ScrollArea` for semantic table and bounded scrolling surfaces.

These are DataGrid-owned private chrome implementations, not public
`DataTable*` companions. DataTable supplies only engine contexts and commands.

Every config member with a default is optional. Required members are limited to
content/identity the component cannot infer: detail `render`, tree
`getChildren`, grouping `allowedColumns`, persistence `key`/`version`/`storage`,
and the selected actions/footer union branch.

`chrome` defaults to built-in. Use
`chrome={{ mode: 'external', render: (context) => <CustomChrome {...context} /> }}`
to retain toolbar/pagination state while suppressing their built-in controls.
External chrome rejects `toolbar`; loading/empty/error rows and footer summaries
remain table content. Direct DataTable composition needs no chrome flag.

## Server records screen (planned P0)

```tsx
<DataGrid
  columns={columns}
  rows={rows}
  getRowId={(row) => row.id}
  server={{ query, rowCount, onQueryChange }}
  dataState={dataState}
/>
```

The server facade makes sorting, filtering, grouping, and pagination manual
together. Use DataTable when only selected stages are manual.

## Migration

For one minor line after the rebuild, current aliases normalize immediately:

- `selectable` → `selection`
- `searchKey`/`searchPlaceholder` → `filters`/`toolbar`
- `pagination`/`pageSize`/`pageSizeOptions` → `pagination` config
- `state`/`emptyMessage`/`skeletonRows` → `dataState`
- `striped` → `appearance.striped`

DataGrid keeps typed cell/header renderers in column definitions and offers
approved typed render escape hatches for toolbar, state, footer, actions,
groups, and expanded content. These remain DataGrid configuration surfaces,
not public DataTable companion components. For arbitrary composition or
selective manual processing, drop to DataTable; for fully custom markup, drop
to Table.
