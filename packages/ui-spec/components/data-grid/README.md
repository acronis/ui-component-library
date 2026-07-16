# DataGrid

The batteries-included data grid: **`<DataGrid columns={…} rows={…} />`**. A
config-driven composite over TanStack react-table v8 that assembles the whole
approved grid layout in one component — an optional toolbar (search + column
visibility), the table, an optional selection column, loading / empty states, and
optional pagination — so every grid in the app reads the same way.

> **Opinionated composite (design-pending v1).** This is the Phase-1 pilot of
> `context/opinionated-composites-proposal.md`: it trades flexibility for
> consistency. Built from requirements, not a Figma mockup — reconcile with the
> design once one lands.

## When to use

- A records screen where you want a consistent, wired grid without hand-assembling
  the table, toolbar, selection, and pagination each time.
- Any "list of things" whose look and interactions should match every other grid.

## When not to use

- A small, fixed table with no search / selection / pagination — use the `Table`
  primitive directly.
- A grid needing behavior DataGrid does not expose — drop down to `DataTable` +
  the `DataTable*` parts (DataGrid is built on them). This is the escape hatch;
  flexibility lives one layer down, on purpose.
- Card / gallery tiles rather than tabular rows.

## Relationship to `Table` and `DataTable`

| Layer          | What it is                            | API                                                                    |
| -------------- | ------------------------------------- | ---------------------------------------------------------------------- |
| `Table`        | Primitive — native table parts        | Compositional (`TableRow`, `TableCell`, …)                             |
| `DataTable`    | Composite — the grid only             | `columns` + `data`; toolbar / pagination are separate parts you wire   |
| **`DataGrid`** | **Composite — the whole grid layout** | **`columns` + `rows` + `toolbar` / `pagination` / `selectable` flags** |

## Example (React — implemented)

```tsx
import { DataGrid } from '@constructor-lab/ui-react';

// Plain grid
<DataGrid columns={columns} rows={rows} />

// Batteries-included
<DataGrid
  columns={columns}
  rows={rows}
  selectable
  toolbar
  searchKey="email"
  pagination
  onRowClick={(row) => open(row)}
/>
```

`columns` are TanStack `ColumnDef`s — the same defs `DataTable` accepts — so
cell/header rendering (the escape hatch) lives in the column def. Vue and Web
Component implementations are planned and target the same contract — see
`api.yaml` `adapters`.
