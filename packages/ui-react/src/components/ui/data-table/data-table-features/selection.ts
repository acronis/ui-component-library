import type { Row } from '@tanstack/react-table';

import { selectionChangeCause } from '../data-table-selection-cause';
import { defineDataTableFeature } from './registry';
import { recordToSet, resolveUpdater, setToRecord } from './translate';

interface IdentityFeatureConfig {
  readonly reserve?: boolean;
}

/**
 * Selection behavior. `mode` picks single vs multiple; `isRowSelectable` gates
 * per-row eligibility; `reserve` keeps selected IDs that are absent after a data
 * replacement instead of pruning them. The DataGrid layer presents the
 * checkboxes/count; this only models behavior.
 */
export interface DataTableSelectionConfig<TData> extends IdentityFeatureConfig {
  readonly mode?: 'single' | 'multiple';
  readonly isRowSelectable?: (row: TData) => boolean;
}

export const selectionFeature = defineDataTableFeature({
  id: 'selection',

  engineOptions(ctx) {
    const config = ctx.config as DataTableSelectionConfig<unknown> | undefined;

    return {
      // **The one funnel every engine-driven selection change passes through**,
      // which is why the provenance is read here rather than at each control.
      // `selectionChangeCause()` is whatever a control claimed for the synchronous
      // call it is inside; `undefined` leaves the controller's `'api'` default,
      // which is the honest answer for a genuinely programmatic change. See
      // `../data-table-selection-cause.ts` for why the engine still computes
      // *what* changes.
      onRowSelectionChange: (updater) =>
        ctx.requestChange(
          'selection',
          (previous) =>
            recordToSet(resolveUpdater(updater, setToRecord(previous))),
          selectionChangeCause()
        ),
      // Eligibility is a predicate over the record, so it is translated from the
      // neutral `(row: TData) => boolean` to TanStack's row-object form here.
      ...(config?.isRowSelectable
        ? {
            enableRowSelection: (row: Row<unknown>) =>
              config.isRowSelectable!(row.original),
          }
        : {}),
      ...(config?.mode
        ? { enableMultiRowSelection: config.mode === 'multiple' }
        : {}),
    };
  },
});
