import { useState } from 'react';
import {
  ButtonIcon,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@constructor-lab/ui-react';
import { EllipsisIcon } from '@constructor-lab/icons-react/stroke-mono';

// "Toolbar + Table with Checkbox" from the Figma "Basic table behavior" section,
// the fullest frame. Composed from the Table primitive + Checkbox + Link:
//   • a leading selection column; the header checkbox drives select-all and
//     shows the indeterminate (partial) state,
//   • a bulk-actions toolbar that is hidden until at least one row is checked,
//     then reveals the batch actions plus an "N selected · Deselect all" summary,
//   • per-row "more actions" that are available at idle but disappear once a
//     selection is active (the toolbar owns the actions during selection).

interface Device {
  id: number;
  name: string;
  type: string;
  status: string;
}

const devices: Device[] = [
  { id: 1, name: 'web-server-01', type: 'Server', status: 'Protected' },
  { id: 2, name: 'db-primary', type: 'Server', status: 'Protected' },
  { id: 3, name: 'laptop-anna', type: 'Workstation', status: 'At risk' },
  { id: 4, name: 'kiosk-lobby', type: 'Workstation', status: 'Protected' },
  { id: 5, name: 'mail-relay', type: 'Server', status: 'Protected' },
];

const BULK_ACTIONS = ['Back up now', 'Assign plan', 'Move', 'Delete'];

export function TableBulkActions() {
  const [selected, setSelected] = useState<number[]>([]);

  const allSelected = selected.length === devices.length;
  const someSelected = selected.length > 0 && !allSelected;
  const hasSelection = selected.length > 0;

  const toggleAll = () =>
    setSelected(allSelected ? [] : devices.map((device) => device.id));

  const toggleRow = (id: number) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );

  return (
    <div className="rounded-md border">
      {/* Bulk-actions toolbar — only present once something is selected. */}
      {hasSelection && (
        <div
          role="toolbar"
          aria-label="Bulk actions"
          className="flex items-center justify-between gap-4 border-b border-[color:var(--ui-table-global-row-border-color)] bg-[var(--ui-background-surface-secondary)] px-3 py-2"
        >
          <div className="flex flex-wrap items-center gap-4">
            {BULK_ACTIONS.map((action) => (
              <Link key={action} href="#" className="text-sm">
                {action}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap text-sm text-muted-foreground">
            <span>{selected.length} selected</span>
            <span aria-hidden>·</span>
            <Link
              href="#"
              className="text-sm"
              onClick={(event) => {
                event.preventDefault();
                setSelected([]);
              }}
            >
              Deselect all
            </Link>
          </div>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[48px]">
              <Checkbox
                aria-label="Select all rows"
                checked={allSelected}
                indeterminate={someSelected}
                onCheckedChange={toggleAll}
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[48px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {devices.map((device) => {
            const isSelected = selected.includes(device.id);
            return (
              <TableRow key={device.id} selected={isSelected}>
                <TableCell>
                  <Checkbox
                    aria-label={`Select ${device.name}`}
                    checked={isSelected}
                    onCheckedChange={() => toggleRow(device.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{device.name}</TableCell>
                <TableCell>{device.type}</TableCell>
                <TableCell>{device.status}</TableCell>
                <TableCell className="text-right">
                  {/* Single-row actions step aside while a selection is active. */}
                  {!hasSelection && (
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <ButtonIcon
                            variant="ghost"
                            aria-label={`Actions for ${device.name}`}
                          />
                        }
                      >
                        <EllipsisIcon />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem>Back up now</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
