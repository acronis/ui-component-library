import { describe, expectTypeOf, it } from 'vitest';

import type {
  DataGridPersistenceConfig,
  DataGridProps,
} from '../data-grid-config';
import type { DataTablePersistenceStorage } from '../../data-table/data-table-features/persistence';

// The `persistence` group's prop surface (U10). Imported through the internal
// `'../data-grid-config'` path, not the package barrel: the barrel lines are
// batched at branch close (#43) and staged in
// `.ai/team/table-parity-p1/integration/U10.md`.

interface Person {
  id: string;
  name: string;
}

const storage: DataTablePersistenceStorage = {
  read: () => null,
  write: () => undefined,
};

/**
 * Is `Key` a flat top-level `DataGrid` prop (i.e. a deprecated alias)?
 *
 * A `keyof` probe rather than `.not.toHaveProperty(…)`, following the note U9 left
 * in `props-selection.types.test.ts`: both detect a flat alias appearing, but the
 * negative control on `toHaveProperty` reports `Expected 2 arguments, but got 1`,
 * which names neither the prop nor the claim. Confirmed here — that is the exact
 * error the first draft of this file produced.
 */
type IsFlatProp<Key extends string> = Key extends keyof DataGridProps<
  Person,
  unknown
>
  ? true
  : false;

describe('DataGrid props — persistence', () => {
  it('accepts the group, and `false` to disable it', () => {
    expectTypeOf<DataGridProps<Person, unknown>['persistence']>().toEqualTypeOf<
      false | DataGridPersistenceConfig | undefined
    >();
  });

  it('has no deprecated flat aliases', () => {
    // New surface: legacy had no boolean prop for persisted preferences, so there
    // is nothing for the group to normalize from. Asserted rather than assumed,
    // because the alias record in `data-grid-config.test.tsx` and this file are the
    // only two places that record it.
    expectTypeOf<IsFlatProp<'persistPreferences'>>().toEqualTypeOf<false>();
    expectTypeOf<IsFlatProp<'preferencesKey'>>().toEqualTypeOf<false>();
    expectTypeOf<IsFlatProp<'persistColumns'>>().toEqualTypeOf<false>();
    // The control on the probe itself: the grouped prop DOES exist, so a probe
    // that answered `false` for everything would be caught here.
    expectTypeOf<IsFlatProp<'persistence'>>().toEqualTypeOf<true>();
  });

  it('requires key, version and storage — design §8', () => {
    // The whole point of the DataGrid-layer config existing separately from
    // `DataTablePersistenceConfig`, whose members are all optional so the
    // controller's options unions could name it before this unit shipped.
    expectTypeOf<DataGridPersistenceConfig>().toHaveProperty('key');
    expectTypeOf<DataGridPersistenceConfig['key']>().toEqualTypeOf<string>();
    expectTypeOf<
      DataGridPersistenceConfig['version']
    >().toEqualTypeOf<number>();
    expectTypeOf<
      DataGridPersistenceConfig['storage']
    >().toEqualTypeOf<DataTablePersistenceStorage>();

    // …and an object missing one of the three is not assignable. This is the
    // assertion that would fail if a later edit made them optional to "be
    // convenient" — the positive assertions above would all still pass.
    expectTypeOf<{
      key: string;
      version: number;
    }>().not.toMatchTypeOf<DataGridPersistenceConfig>();
  });

  it('leaves the optional members optional', () => {
    expectTypeOf<{
      key: string;
      version: number;
      storage: DataTablePersistenceStorage;
    }>().toMatchTypeOf<DataGridPersistenceConfig>();
    expectTypeOf<DataGridPersistenceConfig['include']>().toEqualTypeOf<
      | readonly (
          | 'columnVisibility'
          | 'columnOrder'
          | 'columnSizing'
          | 'columnPinning'
          | 'sorting'
          | 'columnFilters'
          | 'globalFilter'
          | 'grouping'
          | 'pagination'
        )[]
      | undefined
    >();
  });

  it('does not require getRowId — no persistable slice is row-keyed', () => {
    // The identity rule (design §3.1). `persistence` is deliberately absent from
    // `DataGridIdentityFreeMap`, because every slice `include` admits is keyed by
    // column id and the four row-keyed slices cannot be named at all (the engine's
    // `_AssertNoRowStatePersisted`). So a caller may persist column preferences
    // without supplying identity — asserted here, because the map omission is
    // invisible otherwise and re-adding it later would be a breaking change.
    // The assertion IS the declaration: annotating it `DataGridProps` without a
    // `getRowId` means the identity-free branch admits the group. If `persistence`
    // were ever declared on `DataGridIdentityFreeMap`, this stops compiling.
    const identityFree: DataGridProps<Person, unknown> = {
      columns: [],
      rows: [],
      persistence: { key: 'k', version: 1, storage },
    };

    expectTypeOf(identityFree.persistence).toEqualTypeOf<
      false | DataGridPersistenceConfig | undefined
    >();
  });
});
