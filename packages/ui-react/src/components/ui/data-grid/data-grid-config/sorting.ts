import type { DataTableSortingConfig } from '../../data-table';
import { defineDataGridConfig } from './registry';

// OWNERSHIP: created by F4 with the shipped wiring; **U9 owns this file** —
// `cycle` and `maxColumns` pass-through lands here.

// The `sorting` behavior group (design §5.2).
//
// U9 landed `cycle` and `maxColumns`. Both are pure pass-through: the sorting
// feature module already derives `enableSortingRemoval` / `sortDescFirst` from the
// cycle and `maxMultiSortColCount` from the cap, so the DataGrid layer only has to
// carry them across without re-deriving anything.

export interface DataGridSortingConfig {
  mode?: 'single' | 'multiple';
  /**
   * Direction cycle on repeated activation of a header. Defaults to
   * `['asc', 'desc', 'none']`; dropping `'none'` makes sorting non-removable, and
   * leading with `'desc'` sorts descending first.
   */
  cycle?: readonly ('asc' | 'desc' | 'none')[];
  /** Maximum number of columns in a multi-sort. Unlimited when absent. */
  maxColumns?: number;
}

export interface ResolvedDataGridSorting {
  /** Present the sortable-header affordance. */
  readonly enabled: boolean;
  /** Allow multi-column sort. */
  readonly multi: boolean;
  readonly cycle?: readonly ('asc' | 'desc' | 'none')[];
  readonly maxColumns?: number;
}

/* eslint-disable unused-imports/no-unused-vars -- declaration merging requires
   every augmentation to repeat the target's type-parameter list verbatim, so
   `TData` must be named even in a group whose shape does not use it. */
declare module './registry' {
  interface DataGridGroupedConfigMap<TData> {
    /** Sorting behavior. `false`/omitted disables it. */
    sorting: false | DataGridSortingConfig;
  }
  interface DataGridDeprecatedAliasMap<TData> {
    /** @deprecated Use `sorting`. Present the sortable-header affordance. */
    sortable: boolean;
    /** @deprecated Use `sorting: { mode: 'multiple' }`. */
    multiSort: boolean;
  }
  interface DataGridResolvedConfigMap<TData> {
    sorting: ResolvedDataGridSorting;
  }
}
/* eslint-enable unused-imports/no-unused-vars */

export const sortingConfig = defineDataGridConfig({
  key: 'sorting',
  kind: 'grouped',
  aliases: ['sortable', 'multiSort'],

  resolve({ props }) {
    const warnings: string[] = [];
    let sortable = props.sortable ?? false;
    let multi = props.multiSort ?? false;
    let cycle: readonly ('asc' | 'desc' | 'none')[] | undefined;
    let maxColumns: number | undefined;

    if (props.sorting !== undefined) {
      if (props.sortable !== undefined || props.multiSort !== undefined) {
        warnings.push(
          'DataGrid: `sorting` cannot be combined with `sortable`/`multiSort`; the grouped `sorting` config wins.'
        );
      }
      sortable = props.sorting !== false;
      multi = props.sorting !== false && props.sorting.mode === 'multiple';
      if (props.sorting !== false) {
        cycle = props.sorting.cycle;
        maxColumns = props.sorting.maxColumns;
      }
    }

    return {
      value: { enabled: sortable || multi, multi, cycle, maxColumns },
      warnings,
    };
  },

  controllerOptions({ resolved }) {
    const { enabled, multi, cycle, maxColumns } = resolved.sorting;
    // The engine always sorts; `enabled` only governs the header affordance, so
    // a grid without the affordance still honors a controlled `sorting` slice.
    // `cycle`/`maxColumns` are meaningful even without the header affordance — a
    // controlled `sorting` slice still cycles — so they are carried whenever they
    // are set, which forces the config form rather than the bare `true`.
    const extras = {
      ...(cycle === undefined ? {} : { cycle }),
      ...(maxColumns === undefined ? {} : { maxColumns }),
    };
    const hasExtras = Object.keys(extras).length > 0;
    const sorting: boolean | DataTableSortingConfig = multi
      ? { mode: 'multiple', ...extras }
      : enabled
        ? { mode: 'single', ...extras }
        : hasExtras
          ? extras
          : true;
    return { sorting };
  },

  viewProps({ resolved }) {
    return { sortable: resolved.sorting.enabled };
  },
});
