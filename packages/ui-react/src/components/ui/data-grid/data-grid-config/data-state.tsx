import type { ReactNode } from 'react';

import {
  Alert,
  AlertActions,
  AlertContent,
  AlertDescription,
  AlertTitle,
} from '../../alert';
import { Button } from '../../button';
import { defineDataGridConfig } from './registry';

// OWNERSHIP: **F4**. No Wave 1 owner. It reads the string half of the
// shared `state` prop, which `state.ts` declares.

// The `dataState` behavior group (design §5.2): status, skeleton rows, the empty
// message, and the error alert with its retry control.
//
// It owns the controller's `data` option, because a forced empty/error state
// feeds the engine no rows — the whole projection (counts, pagination, state
// region) then stays consistent with the presentation.

export type DataGridDataStatus = 'loading' | 'empty' | 'loaded' | 'error';

export type DataGridDataStateConfig =
  | { status?: 'loaded'; empty?: ReactNode; skeletonRows?: number }
  | { status: 'loading'; skeletonRows?: number }
  | { status: 'empty'; empty?: ReactNode }
  | { status: 'error'; error?: ReactNode; onRetry?: () => void };

export interface ResolvedDataGridDataState {
  readonly status: DataGridDataStatus;
  readonly skeletonRows: number;
  readonly empty: ReactNode;
  readonly error?: ReactNode;
  readonly onRetry?: () => void;
}

/* eslint-disable unused-imports/no-unused-vars -- declaration merging requires
   every augmentation to repeat the target's type-parameter list verbatim, so
   `TData` must be named even in a group whose shape does not use it. */
declare module './registry' {
  interface DataGridGroupedConfigMap<TData> {
    /** Data state (status, skeleton rows, empty/error content, retry). */
    dataState: DataGridDataStateConfig;
  }
  interface DataGridDeprecatedAliasMap<TData> {
    /** @deprecated Use `dataState.error`. */
    error: ReactNode;
    /** @deprecated Use `dataState.onRetry`. */
    onRetry: () => void;
    /** @deprecated Use `dataState.empty`. Message shown in the empty state. */
    emptyMessage: ReactNode;
    /** @deprecated Use `dataState.skeletonRows`. */
    skeletonRows: number;
  }
  interface DataGridResolvedConfigMap<TData> {
    dataState: ResolvedDataGridDataState;
  }
}
/* eslint-enable unused-imports/no-unused-vars */

/** Stable identity for the forced-empty row set, so TanStack does not re-derive. */
const NO_ROWS: readonly never[] = [];

export const dataStateConfig = defineDataGridConfig({
  key: 'dataState',
  kind: 'grouped',
  aliases: ['state', 'error', 'onRetry', 'emptyMessage', 'skeletonRows'],

  resolve({ props }) {
    const warnings: string[] = [];
    // `state` is shared: the deprecated data-status string belongs to this group,
    // the controlled-slice object to `state.ts`. They are structurally disjoint.
    // The prop is declared once, by `state.ts`, or the intersection that builds
    // `DataGridProps` would collapse it to `never`.
    const deprecatedStatus =
      typeof props.state === 'string' ? props.state : undefined;
    let status: DataGridDataStatus = deprecatedStatus ?? 'loaded';
    let skeletonRows = props.skeletonRows ?? 5;
    let empty: ReactNode = props.emptyMessage ?? 'No results.';
    let error = props.error;
    let onRetry = props.onRetry;

    if (props.dataState !== undefined) {
      if (
        deprecatedStatus !== undefined ||
        props.error !== undefined ||
        props.onRetry !== undefined ||
        props.skeletonRows !== undefined ||
        props.emptyMessage !== undefined
      ) {
        warnings.push(
          'DataGrid: `dataState` cannot be combined with `state`/`error`/`onRetry`/`skeletonRows`/`emptyMessage`; the grouped `dataState` config wins.'
        );
      }
      const config = props.dataState;
      status = config.status ?? 'loaded';
      skeletonRows =
        ('skeletonRows' in config ? config.skeletonRows : undefined) ?? 5;
      empty = ('empty' in config ? config.empty : undefined) ?? 'No results.';
      error = 'error' in config ? config.error : undefined;
      onRetry = 'onRetry' in config ? config.onRetry : undefined;
    }

    return { value: { status, skeletonRows, empty, error, onRetry }, warnings };
  },

  controllerOptions({ resolved, rows }) {
    const { status } = resolved.dataState;
    const data = status === 'empty' || status === 'error' ? NO_ROWS : rows;
    // The controller's `data` is mutable by contract; the grid never writes it.
    return { data: data as unknown[] };
  },

  viewProps({ resolved, callbacks, columnCount }) {
    const { status, skeletonRows, empty, error, onRetry } = resolved.dataState;
    const isLoading = status === 'loading';

    return {
      skeleton: isLoading,
      skeletonRows,
      emptyColSpan: columnCount,
      renderState: isLoading
        ? undefined
        : status === 'error'
          ? () => (
              <Alert variant="critical" className="text-start">
                <AlertContent>
                  <AlertTitle>Something went wrong</AlertTitle>
                  {error !== undefined && (
                    <AlertDescription>{error}</AlertDescription>
                  )}
                </AlertContent>
                {onRetry && (
                  <AlertActions>
                    <Button
                      variant="secondary"
                      className="h-8"
                      onClick={() => {
                        // `dataState.onRetry` owns the recovery; the named
                        // callback observes it.
                        onRetry();
                        callbacks?.onDataStateAction?.({ action: 'retry' });
                      }}
                    >
                      Retry
                    </Button>
                  </AlertActions>
                )}
              </Alert>
            )
          : (context) =>
              context.status === 'empty' ? (
                <span className="text-[var(--ui-table-data-value-color-disabled)]">
                  {empty}
                </span>
              ) : null,
    };
  },
});
