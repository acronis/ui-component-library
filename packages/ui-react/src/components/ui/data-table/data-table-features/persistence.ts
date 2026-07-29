import { useDataTablePersistence } from '../data-table-persistence';
import { defineDataTableFeature } from './registry';

// OWNERSHIP: stub created by F2; **U10 owns this file**.
//
// This module is deliberately thin: it is the `effects` seam and nothing else. The
// restore/save mechanism lives in `../data-table-persistence.ts` (plan §4 U10's
// layer split), so a direct `useDataTable` caller gets persistence without going
// through DataGrid, and DataGrid supplies only the config prop and its defaults.
//
// **`effects` is the only contribution point that can host this**, which is why
// that point exists at all (features README, the nine points table).
// `engineOptions` and `renderContext` run during the controller's render, so
// reading storage or dispatching a slice change from either would be a side effect
// in a render path.
//
// `'restore'` is a first-class `DataTableChangeCause` (`data-table-contract.ts:120`)
// that nothing emitted before this unit.

/** A slice `persistence.include` may name. */
export type DataTablePersistableSlice =
  | 'columnVisibility'
  | 'columnOrder'
  | 'columnSizing'
  | 'columnPinning'
  | 'sorting'
  | 'columnFilters'
  | 'globalFilter'
  | 'grouping'
  | 'pagination';

export interface DataTablePersistenceStorage {
  read(key: string): string | null | Promise<string | null>;
  write(key: string, value: string): void | Promise<void>;
  remove?(key: string): void | Promise<void>;
}

/**
 * Persistence behavior: the versioned envelope, its storage adapter and which
 * slices participate.
 *
 * Every member is optional by design — design §8 makes `key`, `version` and
 * `storage` required at the *DataGrid* layer (`DataGridPersistenceConfig` does
 * require them), and leaving them optional here is what let the controller's
 * options unions reference this interface before U10 existed. The engine re-checks
 * all three at runtime, so a partially-configured direct caller gets an inert
 * feature rather than a crash.
 */
export interface DataTablePersistenceConfig {
  readonly key?: string;
  readonly version?: number;
  readonly storage?: DataTablePersistenceStorage;
  /** Defaults to the four column slices only (design §5.2). */
  readonly include?: readonly DataTablePersistableSlice[];
  readonly migrate?: (stored: unknown, fromVersion: number) => unknown;
  readonly onError?: (error: unknown) => void;
}

function configOf(config: unknown): DataTablePersistenceConfig | undefined {
  return typeof config === 'object' && config !== null
    ? (config as DataTablePersistenceConfig)
    : undefined;
}

export const persistenceFeature = defineDataTableFeature({
  id: 'persistence',

  effects(ctx) {
    useDataTablePersistence({
      config: configOf(ctx.config),
      state: ctx.state,
      // A **thunk**, not a value. `ctx.table` is itself a thunk over a `const`
      // declared later in the controller, and calling it in a contribution
      // point's body throws a named error; the engine invokes this inside its
      // mount effect, by which point the engine exists.
      //
      // **`getAllLeafColumns`, never `getVisibleLeafColumns`.** This list is what
      // unknown stored column ids are pruned against, and a hidden column is
      // still a column the table has. Pruning against the *visible* set would
      // discard exactly the ids whose hidden state is being restored — a restore
      // that silently un-hides everything it was asked to hide, and the more
      // plausible of the two calls to reach for.
      columnIds: () =>
        ctx
          .table()
          .getAllLeafColumns()
          .map((column) => column.id),
      // Two controller verdicts, derived from the own-keys of its `state` and
      // `defaultState` props. Neither is derivable here: `ctx.state` is the
      // resolved snapshot, which `createDefaultDataTableState` populates for every
      // slice, so it cannot express "the caller did not ask for this".
      //
      // They are **two** members rather than one union because they narrow
      // different things — `state` suppresses restore *and* write, `defaultState`
      // suppresses restore only (`data-grid/behavior.md:71`). See
      // `restorableSlicesFor`.
      controlledSlices: ctx.gates.controlledSlices,
      defaultedSlices: ctx.gates.defaultedSlices,
      requestChange: ctx.requestChange,
    });
  },
});
