import { describe, expectTypeOf, it } from 'vitest';

import type { DataGridProps } from '../data-grid';
import type { DataGridToolbarConfig } from '../data-grid';
import type { DataGridBulkAction } from '../data-grid-actions';

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

describe('DataGrid props — toolbar', () => {
  it('accepts the group, its members, and its deprecated alias', () => {
    expectTypeOf<DataGridProps<Person, unknown>['toolbar']>().toEqualTypeOf<
      boolean | DataGridToolbarConfig<Person> | undefined
    >();
    expectTypeOf<DataGridProps<Person, unknown>['bulkActions']>().toEqualTypeOf<
      readonly DataGridBulkAction<Person>[] | undefined
    >();
    // design §5.2 members: `columnFilters` defaults false, `viewOptions` true.
    expectTypeOf<
      DataGridToolbarConfig<Person>['columnFilters']
    >().toEqualTypeOf<boolean | undefined>();
    expectTypeOf<DataGridToolbarConfig<Person>['viewOptions']>().toEqualTypeOf<
      boolean | undefined
    >();
    expectTypeOf<DataGridToolbarConfig<Person>['globalSearch']>().toEqualTypeOf<
      boolean | undefined
    >();
  });
});
