import { describe, expectTypeOf, it } from 'vitest';

import type { DataGridProps } from '../data-grid';
import type { ReactNode } from 'react';

import type { DataGridDataStateConfig, DataGridDataStatus } from '../data-grid';

// Per-group prop-surface assertions. These replace the single exhaustive
// `keyof DataGridProps` assertion that used to live in
// `data-table/__tests__/table-family-public-types.test.ts`, which every
// prop-adding unit would have had to edit on the same line. One file per group,
// owned by the unit that owns the group.
//
// Owner: F4.

interface Person {
  id: string;
  name: string;
}

describe('DataGrid props — dataState', () => {
  it('accepts the group and its deprecated aliases', () => {
    expectTypeOf<DataGridProps<Person, unknown>['dataState']>().toEqualTypeOf<
      DataGridDataStateConfig | undefined
    >();
    // `state` is shared with the top-level controlled-slice input, so its full
    // type is asserted in `props-state.types.test.ts`. What this group owns is
    // that the deprecated data-status string is still assignable.
    expectTypeOf<DataGridDataStatus>().toExtend<
      NonNullable<DataGridProps<Person, unknown>['state']>
    >();
    expectTypeOf<
      DataGridProps<Person, unknown>['error']
    >().toEqualTypeOf<ReactNode>();
    expectTypeOf<DataGridProps<Person, unknown>['onRetry']>().toEqualTypeOf<
      (() => void) | undefined
    >();
    expectTypeOf<
      DataGridProps<Person, unknown>['emptyMessage']
    >().toEqualTypeOf<ReactNode>();
    expectTypeOf<
      DataGridProps<Person, unknown>['skeletonRows']
    >().toEqualTypeOf<number | undefined>();
  });
});
