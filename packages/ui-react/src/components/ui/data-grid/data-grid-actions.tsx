import { type ReactNode, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';

import { cn } from '@/lib/utils';

import type { DataTableController } from '../data-table';
import { Button } from '../button';
import { ButtonIconMenu } from '../button-icon-menu';
import { ConfirmDialog } from '../confirm-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../dropdown-menu';
import { DATA_GRID_CHROME_COLUMN_SIZING } from './data-grid-config/chrome-column';

// Private DataGrid chrome (design §4.3, "Row actions and menus" + "Bulk
// actions"): per-row action menus and a selection bulk-action bar, composed from
// ButtonIconMenu/DropdownMenu, Button, and ConfirmDialog. Action controls stop
// row click/selection propagation; destructive actions route through the shared
// ConfirmDialog.

export interface DataGridActionConfirm {
  title: ReactNode;
  description?: ReactNode;
  confirmLabel?: ReactNode;
  cancelLabel?: ReactNode;
}

export interface DataGridRowAction<TData> {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  destructive?: boolean;
  /** Per-row disabled predicate. */
  disabled?: (row: TData) => boolean;
  /** Route through a confirmation dialog before firing `onAction`. */
  confirm?: DataGridActionConfirm;
}

/**
 * Row-actions config (design §5.2). Exactly one of `items` (the built-in menu)
 * or `render` (a typed escape hatch owning the whole cell) — supplying both is
 * invalid. Either way the cell isolates row propagation.
 */
export type DataGridActionsConfig<TData> = (
  | { items: readonly DataGridRowAction<TData>[]; render?: never }
  | { items?: never; render: (row: TData) => ReactNode }
) & {
  /** Which side the action column sits on. Default `end`. */
  placement?: 'start' | 'end';
  onAction: (actionId: string, row: TData) => void;
};

export interface DataGridBulkAction<TData> {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  destructive?: boolean;
  confirm?: DataGridActionConfirm;
  onAction: (rows: TData[]) => void;
}

function ConfirmGate({
  confirm,
  destructive,
  onConfirm,
  onDismiss,
}: {
  confirm: DataGridActionConfirm;
  destructive?: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
}) {
  return (
    <ConfirmDialog
      open
      destructive={destructive}
      title={confirm.title}
      description={confirm.description}
      confirmLabel={confirm.confirmLabel}
      cancelLabel={confirm.cancelLabel}
      onConfirm={onConfirm}
      onOpenChange={(open) => {
        if (!open) onDismiss();
      }}
    />
  );
}

function RowActionsCell<TData>({
  row,
  config,
}: {
  row: TData;
  config: DataGridActionsConfig<TData>;
}) {
  const [pending, setPending] = useState<DataGridRowAction<TData> | null>(null);

  const run = (action: DataGridRowAction<TData>) => {
    if (action.confirm) {
      setPending(action);
    } else {
      config.onAction(action.id, row);
    }
  };

  return (
    // Action controls isolate propagation so a click never toggles row
    // selection or the row click/activate handlers — including the controls a
    // custom `render` returns.
    <div
      className={cn(
        'flex',
        config.placement === 'start' ? 'justify-start' : 'justify-end'
      )}
      onClick={(event) => event.stopPropagation()}
    >
      {config.render !== undefined ? (
        config.render(row)
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<ButtonIconMenu aria-label="Row actions" />}
          />
          <DropdownMenuContent align="end">
            {config.items.map((action) => (
              <DropdownMenuItem
                key={action.id}
                disabled={action.disabled?.(row) ?? false}
                onClick={() => run(action)}
              >
                {action.icon}
                {action.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {pending && (
        <ConfirmGate
          confirm={pending.confirm!}
          destructive={pending.destructive}
          onConfirm={() => config.onAction(pending.id, row)}
          onDismiss={() => setPending(null)}
        />
      )}
    </div>
  );
}

/** Builds the actions `ColumnDef` appended/prepended to the grid columns. */
export function createActionsColumn<TData, TValue>(
  config: DataGridActionsConfig<TData>
): ColumnDef<TData, TValue> {
  return {
    id: '__actions__',
    enableSorting: false,
    enableHiding: false,
    enableColumnFilter: false,
    // #91, and applied here rather than in `actions.ts` so a caller using this
    // helper directly gets the same gutter the config layer does. Measured 209.2px
    // around one 24px menu trigger before this; min-content floor is 32px.
    ...DATA_GRID_CHROME_COLUMN_SIZING,
    cell: ({ row }) => <RowActionsCell row={row.original} config={config} />,
  } as ColumnDef<TData, TValue>;
}

export function DataGridBulkActions<TData>({
  controller,
  actions,
}: {
  controller: DataTableController<TData>;
  actions: readonly DataGridBulkAction<TData>[];
}) {
  const [pending, setPending] = useState<DataGridBulkAction<TData> | null>(
    null
  );
  const selectedCount = controller.getState().selection.size;

  if (selectedCount === 0) {
    return null;
  }

  const selectedRows = () =>
    controller.table.getSelectedRowModel().rows.map((row) => row.original);

  const run = (action: DataGridBulkAction<TData>) => {
    if (action.confirm) {
      setPending(action);
    } else {
      action.onAction(selectedRows());
    }
  };

  return (
    <div
      role="toolbar"
      aria-label="Bulk actions"
      className="flex items-center gap-3 rounded-md border border-border bg-[var(--ui-background-surface-secondary)] px-3 py-2"
    >
      <span className="text-sm font-medium">{selectedCount} selected</span>
      <div className="flex flex-1 items-center gap-2">
        {actions.map((action) => (
          <Button
            key={action.id}
            variant={action.destructive ? 'destructive' : 'secondary'}
            className="h-8 gap-2"
            onClick={() => run(action)}
          >
            {action.icon}
            {action.label}
          </Button>
        ))}
      </div>
      <Button
        variant="ghost"
        className="h-8"
        onClick={() => controller.toggle({ type: 'clear-selection' })}
      >
        Clear
      </Button>
      {pending && (
        <ConfirmGate
          confirm={pending.confirm!}
          destructive={pending.destructive}
          onConfirm={() => pending.onAction(selectedRows())}
          onDismiss={() => setPending(null)}
        />
      )}
    </div>
  );
}
