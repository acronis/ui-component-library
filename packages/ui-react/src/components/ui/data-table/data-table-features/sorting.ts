import { getSortedRowModel } from '@tanstack/react-table';

import { defineDataTableFeature } from './registry';
import { resolveUpdater } from './translate';

/**
 * Sorting behavior. `true` enables sorting with the engine defaults; a config
 * selects single vs multi-column sort, the click cycle, and a multi-sort column
 * cap. The DataGrid layer presents the affordance; this only models behavior.
 */
export interface DataTableSortingConfig {
  readonly mode?: 'single' | 'multiple';
  /** Direction cycle on repeated activation. Defaults to `['asc','desc','none']`. */
  readonly cycle?: readonly ('asc' | 'desc' | 'none')[];
  /** Maximum number of columns in a multi-sort. */
  readonly maxColumns?: number;
}

/**
 * The sorting feature.
 *
 * **This option group is order-sensitive and its shape is pinned by
 * `__tests__/data-table-engine-option-groups.test.ts`.** Three characterizations
 * in particular are easy to lose and hard to notice:
 *
 *  - An object config and `sorting: true` are *not* interchangeable.
 *    `enableMultiSort` is contributed whenever the config is an object at all, so
 *    `sorting: {}` pins it to `false` while `sorting: true` leaves it unset.
 *  - An empty `cycle: []` counts as present, because `[]` is truthy. Guarding on
 *    `cycle?.length` would leave both derived options unset, and TanStack's
 *    internal fallback for `enableSortingRemoval` is `true` — so that mistake
 *    *inverts* the behavior rather than merely dropping it.
 *  - `enableSortingRemoval` and `sortDescFirst` are derived together from the
 *    cycle; deriving one without the other leaves the engine on its own default.
 */
export const sortingFeature = defineDataTableFeature({
  id: 'sorting',

  engineOptions(ctx) {
    const config = ctx.config as DataTableSortingConfig | undefined;
    const { sortingEnabled, manualSorting } = ctx.gates;

    return {
      // The handler is unconditional: sort state is tracked and emitted even when
      // no client sort model is installed, which is what makes manual/server
      // sorting work.
      onSortingChange: (updater) =>
        ctx.requestChange('sorting', (previous) =>
          resolveUpdater(updater, [...previous])
        ),
      ...(manualSorting ? { manualSorting: true } : {}),
      ...(sortingEnabled
        ? {
            // Manual sorting tracks state but installs no client sort model.
            ...(manualSorting
              ? {}
              : { getSortedRowModel: getSortedRowModel() }),
            ...(config ? { enableMultiSort: config.mode === 'multiple' } : {}),
            ...(config?.cycle
              ? {
                  enableSortingRemoval: config.cycle.includes('none'),
                  sortDescFirst: config.cycle[0] === 'desc',
                }
              : {}),
            ...(config?.maxColumns !== undefined
              ? { maxMultiSortColCount: config.maxColumns }
              : {}),
          }
        : {}),
    };
  },
});
