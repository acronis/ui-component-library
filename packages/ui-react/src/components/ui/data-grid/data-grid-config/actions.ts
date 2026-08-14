import {
  createActionsColumn,
  type DataGridActionsConfig,
} from '../data-grid-actions';
import { defineDataGridConfig } from './registry';

// OWNERSHIP: **F4**. No Wave 1 owner.

// The `actions` behavior group (design §5.2): the per-row actions column.
//
// `DataGridActionsConfig` itself lives in `data-grid-actions.tsx` alongside the
// chrome that renders it; this module only normalizes and injects the column.

/**
 * The actions column's id. A group that classifies system columns (U3's
 * `columnsFeatures.lockSystemColumns`) should import this rather than repeat the
 * literal.
 */
export const DATA_GRID_ACTIONS_COLUMN_ID = '__actions__';

export interface ResolvedDataGridActions<TData> {
  /** The normalized config, or `undefined` when no actions column renders. */
  readonly config?: DataGridActionsConfig<TData>;
}

/* eslint-disable unused-imports/no-unused-vars -- declaration merging requires
   every augmentation to repeat the target's type-parameter list verbatim, so
   `TData` must be named even in a group whose shape does not use it. */
declare module './registry' {
  interface DataGridGroupedConfigMap<TData> {
    /**
     * Per-row actions (an appended/prepended actions column) — the built-in menu
     * (`items`) or a custom cell renderer (`render`), never both. `false`/omitted
     * renders no actions column.
     */
    actions: false | DataGridActionsConfig<TData>;
  }
  interface DataGridIdentityFreeMap<TData> {
    // An action targets a specific record; an index cannot identify one across a
    // data change (design §3.1).
    actions: false;
  }
  interface DataGridResolvedConfigMap<TData> {
    actions: ResolvedDataGridActions<TData>;
  }
}
/* eslint-enable unused-imports/no-unused-vars */

export const actionsConfig = defineDataGridConfig({
  key: 'actions',
  kind: 'grouped',
  aliases: [],

  resolve({ props }) {
    const warnings: string[] = [];
    const config =
      props.actions !== undefined && props.actions !== false
        ? props.actions
        : undefined;

    if (config !== undefined) {
      if (config.items !== undefined && config.render !== undefined) {
        warnings.push(
          'DataGrid: `actions.items` cannot be combined with `actions.render`; supply exactly one.'
        );
      }
      const seen = new Set<string>();
      for (const item of config.items ?? []) {
        if (seen.has(item.id)) {
          warnings.push(
            `DataGrid: duplicate action id "${item.id}" in \`actions.items\`; ids must be unique.`
          );
        }
        seen.add(item.id);
      }
    }

    return { value: { config }, warnings };
  },

  columns(columns, { resolved, callbacks }) {
    const { config } = resolved.actions;
    if (config === undefined) {
      return columns;
    }

    // `actions.onAction` owns the behavior and runs first; `callbacks.onRowAction`
    // observes it as a named event.
    const onRowAction = callbacks?.onRowAction;
    const effective =
      onRowAction === undefined
        ? config
        : ({
            ...config,
            onAction: (actionId: string, row: unknown) => {
              config.onAction(actionId, row);
              onRowAction({ actionId, row });
            },
          } as DataGridActionsConfig<unknown>);

    const column = createActionsColumn<unknown, unknown>(
      effective,
      resolved.labels
    );
    return config.placement === 'start'
      ? [column, ...columns]
      : [...columns, column];
  },
});
