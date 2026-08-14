import { type ReactNode, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { TimesIcon } from '@constructor-lab/icons-react/stroke-mono';

import { cn } from '@/lib/utils';

import type { DataTableController } from '../data-table';
import { Button } from '../button';
import { ButtonIconMenu } from '../button-icon-menu';
import { ConfirmDialog } from '../confirm-dialog';
import {
  DATA_GRID_DEFAULT_LABELS,
  type ResolvedDataGridLabels,
} from './data-grid-config/labels';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../dropdown-menu';
import { FittedActions } from '../fitted-actions';
import {
  DATA_GRID_CHROME_CELL_CLASS,
  DATA_GRID_CHROME_COLUMN_SIZING,
} from './data-grid-config/chrome-column';

// Private DataGrid chrome (design §4.3, "Row actions and menus" + "Bulk
// actions"): per-row action menus and a selection bulk-action bar, composed from
// ButtonIconMenu/DropdownMenu, Button, FittedActions, and ConfirmDialog. Action
// controls stop row click/selection propagation; destructive actions route through
// the shared ConfirmDialog.
//
// The bulk bar is **content of the toolbar row**, not a row of its own
// (PLTFRM-93130). It used to mount in the `top` chrome slot above the toolbar, so
// the first selection inserted a whole new row and pushed the table down; it now
// replaces the toolbar row's idle members in place. `DataGridBulkActions` below
// therefore draws no container of its own.

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
  | {
      /** Menu items, in order. Mutually exclusive with `render`. */
      items: readonly DataGridRowAction<TData>[];
      /** Unavailable alongside `items` — the two forms are exclusive. */
      render?: never;
    }
  | {
      /** Unavailable alongside `render` — the two forms are exclusive. */
      items?: never;
      /** Own the whole action cell. Mutually exclusive with `items`. */
      render: (row: TData) => ReactNode;
    }
) & {
  /** Which side the action column sits on. Default `end`. */
  placement?: 'start' | 'end';
  /**
   * Invoked with the item's `id` and its row — **after** any `confirm` dialog was
   * accepted, so a destructive action needs no guard of its own here.
   */
  onAction: (actionId: string, row: TData) => void;
};

/** One action in the bulk bar, offered once rows are selected. */
export interface DataGridBulkAction<TData> {
  /** Stable id, reported to observers. */
  id: string;
  /** Visible label. */
  label: ReactNode;
  /** Optional leading icon. */
  icon?: ReactNode;
  /** Render in the destructive style. Does not by itself add a confirmation. */
  destructive?: boolean;
  /** Confirm before running. `onAction` fires only once accepted. */
  confirm?: DataGridActionConfirm;
  /** Invoked with every selected row. */
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
  labels,
  row,
  config,
}: {
  row: TData;
  config: DataGridActionsConfig<TData>;
  labels: ResolvedDataGridLabels;
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
    //
    // Centred, and the cell padding cancelled, via the shared chrome-cell class.
    // `justify-start`/`justify-end` used to key off `config.placement` — which is
    // where the *column* sits, not where the control sits inside it — and in a 40px
    // cell holding a 32px trigger there is nothing to justify: the 16px-a-side cell
    // padding pushed min-content to 64px, so the button overhung its own cell and
    // widened the table. See `DATA_GRID_CHROME_CELL_CLASS`.
    <div
      className={cn(DATA_GRID_CHROME_CELL_CLASS)}
      onClick={(event) => event.stopPropagation()}
    >
      {config.render !== undefined ? (
        config.render(row)
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<ButtonIconMenu aria-label={labels.rowActions} />}
          />
          <DropdownMenuContent align="end">
            {config.items.map((action) => (
              // LOCAL(ui_tools) PLTFRM-93046: `icon` is a prop, not a child.
              // `MenuItem` renders it into a dedicated `shrink-0` flex span
              // beside the label's `flex-1 truncate` span; passing it as a child
              // put it *inside* the label span, where a block-level icon takes
              // its own line — the reported "icon on top and text on the
              // bottom". The prop also applies the item icon colour token,
              // which a child never received.
              // LOCAL(ui_tools) PLTFRM-93046 follow-up: a `destructive` row action
              // used to render IDENTICALLY to a plain one. Only `icon`, `disabled`
              // and `onClick` were forwarded, so `destructive` reached the confirm
              // dialog and nothing else — `Delete` was the same blue as `View
              // details`, while `DataGridBulkActions` below colours *its* destructive
              // actions red. One flag, two surfaces, two answers.
              //
              // Found by the baseline this ticket added
              // (`Internal/DataGrid/RowActionsMenuOpen`): the defect is inside the
              // popup, so no closed-menu capture could show it either.
              //
              // `MenuItem` takes no `destructive` prop — it is vendored
              // (`src/components/ui/VENDORED.md`), so the token is applied here
              // rather than by editing it. Two rules, not one, and the second is the
              // `[&_svg]:` lesson from `DataGridBulkActions`: `MenuItem` colours the
              // icon on the span *wrapping* it, which the svg inherits, so a plain
              // class on the item cannot reach it. `[&_svg]:` sets the colour on the
              // svg itself and outranks the inherited value. The label needs no such
              // help — tailwind-merge drops `MenuItem`'s own `text-[…]` in favour of
              // this one, both being the same utility group.
              <DropdownMenuItem
                key={action.id}
                icon={action.icon}
                disabled={action.disabled?.(row) ?? false}
                className={cn(
                  action.destructive === true &&
                    'text-[var(--ui-text-on-surface-destructive)] [&_svg]:text-[var(--ui-text-on-surface-destructive)]'
                )}
                onClick={() => run(action)}
              >
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

/**
 * Builds the actions `ColumnDef` appended/prepended to the grid columns.
 *
 * `TValue = unknown` (PLTFRM-93046): this is a public helper for a composer
 * building its own column set, and the natural call is
 * `createActionsColumn<Person>(config)` — one type argument, because the actions
 * column has no cell value of its own for the second one to describe.
 */
export function createActionsColumn<TData, TValue = unknown>(
  config: DataGridActionsConfig<TData>,
  // Defaulted here, unlike the components below, because this helper is exported for
  // direct use and its second argument arriving late would otherwise be a breaking
  // signature change for anyone already calling it (PLTFRM-93117).
  labels: ResolvedDataGridLabels = DATA_GRID_DEFAULT_LABELS
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
    // LOCAL(ui_tools) PLTFRM-93046 follow-up: the column had no `header` at all, so
    // TanStack rendered an empty `<th>` — axe's `empty-table-header`. A screen-reader
    // user navigating columns heard nothing for this one.
    //
    // `sr-only` rather than a visible string: the column deliberately shows no
    // heading above a 32px icon-menu gutter, and that design is unchanged — the label
    // is clipped out of the visual layout, so no baseline moves.
    header: () => <span className="sr-only">{labels.rowActions}</span>,
    cell: ({ row }) => (
      <RowActionsCell row={row.original} config={config} labels={labels} />
    ),
  } as ColumnDef<TData, TValue>;
}

/**
 * The selection strip that replaces the toolbar row's idle members while rows are
 * selected (PLTFRM-93130). It is **row content, not a card**: no border, no
 * rounding, no surface of its own, because it has to be the same height as what it
 * replaces — a card's border alone made the row 2px taller on the first selection,
 * which is a small version of the jump this whole change removes.
 *
 * Still exported, and still mountable on its own by a `chrome: { mode: 'external' }`
 * composer; what changed is that it no longer draws its own container.
 */
export function DataGridBulkActions<TData>({
  controller,
  actions,
  selectedCount,
  labels = DATA_GRID_DEFAULT_LABELS,
}: {
  labels?: ResolvedDataGridLabels;
  controller: DataTableController<TData>;
  actions: readonly DataGridBulkAction<TData>[];
  /**
   * The count to announce, when the engine cannot answer it — a server
   * `all-results` selection leaves the engine's `rowSelection` slice unwritten, so
   * the per-row count is 0 however much is selected. Absent means ask the engine,
   * which is right for every client-side grid. `data-grid-config/selected-count.ts`
   * resolves it for the built-in row; a direct composer supplies its own.
   */
  selectedCount?: number;
}) {
  const [pending, setPending] = useState<DataGridBulkAction<TData> | null>(
    null
  );
  const count = selectedCount ?? controller.getState().selection.size;

  if (count === 0) {
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

  // Destructive actions last, preserving each subset's own order. Two reasons, and
  // the second is not cosmetic: the focus fallback's rung 3
  // (`data-table-body-window.ts`) hands focus to the **first focusable control** of
  // this row after a row loss, and a bulk delete is exactly what causes a row loss
  // — so a caller who lists `Delete` first would have focus land on Delete
  // immediately after using it. Figma orders them the same way.
  const ordered = [
    ...actions.filter((action) => !action.destructive),
    ...actions.filter((action) => action.destructive),
  ];
  const byId = new Map(ordered.map((action) => [action.id, action]));

  return (
    <div
      role="toolbar"
      aria-label={labels.bulkActions}
      className="flex min-w-0 flex-1 items-center gap-2"
    >
      {/* Overflow is collapsed into a "More" menu rather than wrapped: wrapping
          would grow the row and jump the table again, which is the bug. */}
      <FittedActions
        className="min-w-0 flex-1"
        actions={ordered.map((action) => ({
          id: action.id,
          label: action.label,
          ...(action.icon === undefined ? {} : { icon: action.icon }),
          onSelect: () => run(action),
        }))}
        renderAction={(action, api) => (
          <Button
            variant="ghost"
            className={cn(
              'h-8 shrink-0 gap-2',
              // `Button`'s "ghost" variant sets `[&_svg]:text-[...idle]` directly on the
              // icon — a descendant selector, one specificity level above a plain class
              // on the button itself. Without the same `[&_svg]:` prefix here, that idle
              // icon-color rule always wins over this one regardless of source order, so
              // the icon stays idle-colored while the label text (which only inherits
              // color, with nothing more specific overriding it) correctly goes red.
              byId.get(action.id)?.destructive === true &&
                'text-[var(--ui-text-on-surface-destructive)] [&_svg]:text-[var(--ui-text-on-surface-destructive)]'
            )}
            onClick={api.onSelect}
          >
            {action.icon}
            {action.label}
          </Button>
        )}
      />
      {/* Polite, not assertive: the count changes on every checkbox click, and an
          assertive region would interrupt the row announcement that caused it. */}
      <span
        aria-live="polite"
        className="shrink-0 text-sm text-[var(--ui-text-on-surface-secondary)]"
      >
        {count} {count === 1 ? 'item' : 'items'} selected
      </span>
      <Button
        variant="ghost"
        aria-label={labels.clearSelection}
        className="size-8 shrink-0 p-0"
        onClick={() => controller.toggle({ type: 'clear-selection' })}
      >
        <TimesIcon />
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
