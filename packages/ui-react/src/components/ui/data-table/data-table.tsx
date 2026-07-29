import { useEffect, useRef, type ReactNode } from 'react';
import type { ColumnDef, Row } from '@tanstack/react-table';

import {
  useDataTable,
  type DeprecatedDataTableControllerOptions,
} from './data-table-controller';
import { DataTableRoot } from './data-table-root';
import { DataTableView } from './data-table-view';

// Ported from the legacy shadcn UI kit's `data-table`. The public convenience
// path remains intentionally narrow while its rendering now projects the same
// private controller and TanStack instance used by composed DataTable views.
//
// FROZEN COMPATIBILITY ADAPTER. `striped`, `bordered`, `highlightCurrentRow`,
// `skeleton`, and `skeletonRows` are deprecated inputs preserved for one minor
// line after the controller landed. This adapter translates ONLY those current
// props to DataTableView presentation and preserves their output exactly — it
// adds no new states, variants, or customization. It is the sole temporary
// exception to the rule that standard composed UI belongs to DataGrid; DataGrid
// does not use it, and all five inputs are removed in the next major. Migrate to
// the destinations named in `FROZEN_DATA_TABLE_PROP_DESTINATIONS`.

declare const process: {
  readonly env: { readonly NODE_ENV?: string };
};

/** Frozen deprecated prop -> its supported migration destination. */
const FROZEN_DATA_TABLE_PROP_DESTINATIONS = {
  striped: 'DataGrid appearance.striped (or Table presentation)',
  bordered: 'DataGrid appearance.borders (or Table presentation)',
  highlightCurrentRow:
    'DataGrid rowInteraction.current / current-row presentation',
  skeleton:
    'DataGrid dataState (status: "loading") or a custom state render context',
  skeletonRows: 'DataGrid dataState.skeletonRows',
} as const satisfies Record<string, string>;

type FrozenDataTableProp = keyof typeof FROZEN_DATA_TABLE_PROP_DESTINATIONS;

const FROZEN_DATA_TABLE_PROPS = Object.keys(
  FROZEN_DATA_TABLE_PROP_DESTINATIONS
) as FrozenDataTableProp[];

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  /** Enables row expansion for rows that return true. Pair with `renderExpandedRow`. */
  getRowCanExpand?: (row: Row<TData>) => boolean;
  /**
   * Renders expanded content for an expanded row. Used together with
   * `getRowCanExpand`.
   */
  renderExpandedRow?: (row: Row<TData>) => ReactNode;
  /**
   * Alternating row backgrounds.
   * @deprecated Frozen compatibility prop; removed next major. Migrate to
   * DataGrid `appearance.striped` (or compose Table presentation).
   */
  striped?: boolean;
  /**
   * Vertical borders between columns (rows already have horizontal borders).
   * @deprecated Frozen compatibility prop; removed next major. Migrate to
   * DataGrid `appearance.borders` (or compose Table presentation).
   */
  bordered?: boolean;
  /**
   * Highlight the row the user last clicked (the "current" row).
   * @deprecated Frozen compatibility prop; removed next major. Migrate to
   * DataGrid `rowInteraction.current` / current-row presentation.
   */
  highlightCurrentRow?: boolean;
  /**
   * Render placeholder skeleton rows instead of data (loading state).
   * @deprecated Frozen compatibility prop; removed next major. Migrate to
   * DataGrid `dataState` (status "loading") or a custom state render context.
   */
  skeleton?: boolean;
  /**
   * Number of skeleton rows to render when `skeleton` is set.
   * @deprecated Frozen compatibility prop; removed next major. Migrate to
   * DataGrid `dataState.skeletonRows`.
   */
  skeletonRows?: number;
}

function hasOwn(value: object, key: PropertyKey): boolean {
  return Object.prototype.hasOwnProperty.call(value, key);
}

/**
 * Emits a one-time development deprecation warning for each supplied frozen
 * compatibility prop. Production is silent; the warning fires once per mounted
 * DataTable instance (StrictMode's double invocation is guarded).
 */
function useFrozenDataTablePropWarnings(presentKey: string): void {
  const warnedRef = useRef(false);

  useEffect(() => {
    if (
      process.env.NODE_ENV === 'production' ||
      presentKey === '' ||
      warnedRef.current
    ) {
      return;
    }

    warnedRef.current = true;

    for (const prop of presentKey.split(',') as FrozenDataTableProp[]) {
      console.warn(
        `DataTable prop "${prop}" is a deprecated, frozen compatibility input and will be removed in the next major. Migrate to ${FROZEN_DATA_TABLE_PROP_DESTINATIONS[prop]}.`
      );
    }
  }, [presentKey]);
}

export function DataTable<TData, TValue>(props: DataTableProps<TData, TValue>) {
  const {
    columns,
    data,
    renderExpandedRow,
    striped = false,
    bordered = false,
    highlightCurrentRow = false,
    skeleton = false,
    skeletonRows = 5,
  } = props;

  useFrozenDataTablePropWarnings(
    FROZEN_DATA_TABLE_PROPS.filter((prop) => hasOwn(props, prop)).join(',')
  );

  const controllerOptions: DeprecatedDataTableControllerOptions<TData> = {
    columns: columns as ColumnDef<TData, unknown>[],
    data,
    sorting: true,
    filtering: true,
    ...(hasOwn(props, 'getRowCanExpand')
      ? { getRowCanExpand: props.getRowCanExpand }
      : {}),
    ...(hasOwn(props, 'renderExpandedRow')
      ? { renderExpandedRow: props.renderExpandedRow }
      : {}),
  };
  const controller = useDataTable(controllerOptions);

  return (
    <DataTableRoot table={controller}>
      <DataTableView
        renderExpandedRow={renderExpandedRow}
        striped={striped}
        bordered={bordered}
        highlightCurrentRow={highlightCurrentRow}
        skeleton={skeleton}
        skeletonRows={skeletonRows}
        emptyColSpan={columns.length}
      />
    </DataTableRoot>
  );
}
