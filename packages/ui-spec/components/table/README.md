# Table

The semantic, presentational base of the table family. It composes native table
parts, sortable-header affordances, row visual states, and overflow without
owning data or feature state.

> **Availability.** The native parts, sortable header, selected styling, and
> horizontal overflow are implemented. `current`/programmatic selected state is
> an accepted P0 target; expanded state, grouped-header defaults, and an explicit
> coordinated scroll-container contract are accepted P1 targets. The target
> scenarios do not claim those additions are shipped.

## When to use

- Showing structured, comparable data in rows and columns (lists of workloads,
  invoices, devices, …).
- Fully custom tabular markup where the application owns every behavior.

## When not to use

- For a flexible data engine or shared-state composition — use `DataTable`.
- For a standard records screen with approved chrome and a small grouped config
  API — use `DataGrid`.
- For non-tabular layout — use CSS grid/flex, not a table.

## Parts

| Part           | Element   | Purpose                                                    |
| -------------- | --------- | ---------------------------------------------------------- |
| `Table`        | `table`   | The table, in a horizontally scrollable container.         |
| `TableHeader`  | `thead`   | Column-header section.                                     |
| `TableBody`    | `tbody`   | Data rows section.                                         |
| `TableFooter`  | `tfoot`   | Summary section with a top divider.                        |
| `TableRow`     | `tr`      | A row; selected ships, current/expanded are target states. |
| `TableHead`    | `th`      | Column header; `sortable` + `sortDirection` + `onSort`.    |
| `TableCell`    | `td`      | A data cell.                                               |
| `TableCaption` | `caption` | Optional caption below the table.                          |

## Examples

```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Checkbox,
  Tag,
} from '@constructor-lab/ui-react';

// Sortable header (consumer owns the sort logic)
<TableHead sortable sortDirection={dir} onSort={() => setDir(next(dir))}>
  Name
</TableHead>

// Selectable row
<TableRow selected={checked}>
  <TableCell>
    <Checkbox checked={checked} onCheckedChange={setChecked} aria-label="Select row" />
  </TableCell>
  <TableCell>web-server-01</TableCell>
  <TableCell><Tag>Protected</Tag></TableCell>
</TableRow>;
```

Table must not acquire `rows`, `columns`, filtering, selection logic,
pagination, virtualization, persistence, or fetching props. Those contracts
belong to the layers above it.
