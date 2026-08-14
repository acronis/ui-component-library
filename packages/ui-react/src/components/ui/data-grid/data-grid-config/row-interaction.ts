import { defineDataGridConfig } from './registry';

// OWNERSHIP: **F4/F5**. No Wave 1 owner.

// The `rowInteraction` behavior group (design §5.2): current-row roving focus
// and the row/cell pointer + activation handlers.
//
// The config-level handler owns the behavior and runs first; the named
// `callbacks.onRow*` / `onCell*` observe the same interaction afterwards with
// the enriched event. Either alone is enough to install the handler.

export interface DataGridRowInteractionConfig<TData> {
  /**
   * Enable the current-row roving focus: arrow keys move it, and the current row
   * is tracked in state. **The only identity-bearing member here** — it keys a row
   * id, so it requires `getRowId`; the three handlers below receive the row object
   * and work without identity.
   */
  current?: boolean;
  /** A body row was clicked. */
  onClick?: (row: TData) => void;
  /** A row was activated — Enter on the current row, or a double click. */
  onActivate?: (row: TData) => void;
  /** The pointer entered a body row. */
  onHover?: (row: TData) => void;
}

export interface ResolvedDataGridRowInteraction<TData> {
  readonly current: boolean;
  readonly onClick?: (row: TData) => void;
  readonly onActivate?: (row: TData) => void;
  readonly onHover?: (row: TData) => void;
  readonly onCellClick?: (columnId: string, row: TData) => void;
  readonly onCellHover?: (columnId: string, row: TData) => void;
}

declare module './registry' {
  interface DataGridGroupedConfigMap<TData> {
    /** Row interaction (current row, click/activate/hover). */
    rowInteraction: DataGridRowInteractionConfig<TData>;
  }
  interface DataGridTopLevelConfigMap<TData> {
    /** Called when a body cell is clicked. */
    onCellClick: (columnId: string, row: TData) => void;
    /** Called when the pointer enters a body cell. */
    onCellHover: (columnId: string, row: TData) => void;
  }
  interface DataGridDeprecatedAliasMap<TData> {
    /** @deprecated Use `rowInteraction.current`. Enable current-row roving focus. */
    currentRow: boolean;
    /** @deprecated Use `rowInteraction.onClick`. */
    onRowClick: (row: TData) => void;
    /** @deprecated Use `rowInteraction.onActivate`. */
    onRowActivate: (row: TData) => void;
    /** @deprecated Use `rowInteraction.onHover`. */
    onRowHover: (row: TData) => void;
  }
  interface DataGridIdentityFreeMap<TData> {
    // Only `current` is identity-bearing: the roving-focus row is tracked by id.
    // The click/hover/activate handlers receive the row *object*, so they work
    // without `getRowId` and stay available on this branch (design §3.1).
    rowInteraction: {
      current?: false;
      onClick?: (row: TData) => void;
      onActivate?: (row: TData) => void;
      onHover?: (row: TData) => void;
    };
  }
  interface DataGridResolvedConfigMap<TData> {
    rowInteraction: ResolvedDataGridRowInteraction<TData>;
  }
}

function rowHandler<
  TData,
  Event extends { readonly row: { readonly data: TData } },
>(
  own: ((row: TData) => void) | undefined,
  named: ((event: Event) => void) | undefined
): ((event: Event) => void) | undefined {
  if (own === undefined && named === undefined) {
    return undefined;
  }
  return (event) => {
    own?.(event.row.data);
    named?.(event);
  };
}

function cellHandler<
  TData,
  Event extends {
    readonly cell: {
      readonly columnId: string;
      readonly row: { readonly data: TData };
    };
  },
>(
  own: ((columnId: string, row: TData) => void) | undefined,
  named: ((event: Event) => void) | undefined
): ((event: Event) => void) | undefined {
  if (own === undefined && named === undefined) {
    return undefined;
  }
  return (event) => {
    own?.(event.cell.columnId, event.cell.row.data);
    named?.(event);
  };
}

export const rowInteractionConfig = defineDataGridConfig({
  key: 'rowInteraction',
  kind: 'grouped',
  aliases: ['currentRow', 'onRowClick', 'onRowActivate', 'onRowHover'],
  reads: ['onCellClick', 'onCellHover'],

  resolve({ props }) {
    const warnings: string[] = [];
    let current = props.currentRow ?? false;
    let onClick = props.onRowClick;
    let onActivate = props.onRowActivate;
    let onHover = props.onRowHover;

    if (props.rowInteraction !== undefined) {
      if (
        props.currentRow !== undefined ||
        props.onRowClick !== undefined ||
        props.onRowActivate !== undefined ||
        props.onRowHover !== undefined
      ) {
        warnings.push(
          'DataGrid: `rowInteraction` cannot be combined with `currentRow`/`onRowClick`/`onRowActivate`/`onRowHover`; the grouped `rowInteraction` config wins.'
        );
      }
      const config = props.rowInteraction;
      current = config.current ?? false;
      onClick = config.onClick;
      onActivate = config.onActivate;
      onHover = config.onHover;
    }

    // As with `selection`: only the deprecated `currentRow` alias can reach this
    // without `getRowId`, and the current row is tracked by row id.
    if (current && props.getRowId === undefined) {
      warnings.push(
        'DataGrid: `currentRow` without `getRowId` identifies the current row by index, so it cannot survive a data change. Pass `getRowId`, or migrate to `rowInteraction.current`, which requires it.'
      );
    }

    return {
      value: {
        current,
        onClick,
        onActivate,
        onHover,
        // Cell events are top-level props today; design §5.2 moves them onto
        // column metadata. They resolve here so the render body stays free of
        // per-group props.
        onCellClick: props.onCellClick,
        onCellHover: props.onCellHover,
      },
      warnings,
    };
  },

  viewProps({ resolved, callbacks }) {
    const interaction = resolved.rowInteraction;
    return {
      currentRow: interaction.current,
      onRowClick: rowHandler(interaction.onClick, callbacks?.onRowClick),
      onRowActivate: rowHandler(
        interaction.onActivate,
        callbacks?.onRowActivate
      ),
      onRowHover: rowHandler(interaction.onHover, callbacks?.onRowHover),
      onCellClick: cellHandler(interaction.onCellClick, callbacks?.onCellClick),
      onCellHover: cellHandler(interaction.onCellHover, callbacks?.onCellHover),
    };
  },
});
