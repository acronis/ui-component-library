import { describe, expectTypeOf, it } from 'vitest';

import type { DataGridProps } from '../data-grid';
import type { DataGridSortingConfig } from '../data-grid';

// Per-group prop-surface assertions. These replace the single exhaustive
// `keyof DataGridProps` assertion that used to live in
// `data-table/__tests__/table-family-public-types.test.ts`, which every
// prop-adding unit would have had to edit on the same line. One file per group,
// owned by the unit that owns the group.
//
// Owner: U9 (`sorting.cycle`, `sorting.maxColumns`).

interface Person {
  id: string;
  name: string;
}

describe('DataGrid props — sorting', () => {
  it('accepts the group and its deprecated aliases', () => {
    expectTypeOf<DataGridProps<Person, unknown>['sorting']>().toEqualTypeOf<
      false | DataGridSortingConfig | undefined
    >();
    expectTypeOf<DataGridProps<Person, unknown>['sortable']>().toEqualTypeOf<
      boolean | undefined
    >();
    expectTypeOf<DataGridProps<Person, unknown>['multiSort']>().toEqualTypeOf<
      boolean | undefined
    >();
  });
});
