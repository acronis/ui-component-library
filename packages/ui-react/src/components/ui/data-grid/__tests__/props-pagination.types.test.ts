import { describe, expectTypeOf, it } from 'vitest';

import type { DataGridProps } from '../data-grid';
import type { DataGridPaginationConfig } from '../data-grid';

// Per-group prop-surface assertions. These replace the single exhaustive
// `keyof DataGridProps` assertion that used to live in
// `data-table/__tests__/table-family-public-types.test.ts`, which every
// prop-adding unit would have had to edit on the same line. One file per group,
// owned by the unit that owns the group.
//
// Owner: U8 (`unknownTotal`, `showPageSize`, `showFirstLast`).

interface Person {
  id: string;
  name: string;
}

describe('DataGrid props — pagination', () => {
  it('accepts the group, its boolean form, and its deprecated aliases', () => {
    expectTypeOf<DataGridProps<Person, unknown>['pagination']>().toEqualTypeOf<
      boolean | DataGridPaginationConfig | undefined
    >();
    expectTypeOf<DataGridProps<Person, unknown>['pageSize']>().toEqualTypeOf<
      number | undefined
    >();
    expectTypeOf<
      DataGridProps<Person, unknown>['pageSizeOptions']
    >().toEqualTypeOf<number[] | undefined>();
  });

  it('carries the three presentation members on the grouped config', () => {
    expectTypeOf<DataGridPaginationConfig['showPageSize']>().toEqualTypeOf<
      boolean | undefined
    >();
    expectTypeOf<DataGridPaginationConfig['showFirstLast']>().toEqualTypeOf<
      boolean | undefined
    >();
    expectTypeOf<DataGridPaginationConfig['unknownTotal']>().toEqualTypeOf<
      boolean | undefined
    >();
  });

  it('gives the three no deprecated flat alias', () => {
    // `pageSize`/`pageSizeOptions` are this group's only flat aliases, so the
    // boolean `pagination` form cannot reach the three members above — the
    // grouped config is the only route, which is why the ✓ for `unknownTotal` is
    // scoped to a server-mode grouped config. Asserted rather than assumed: a
    // flat alias added later would silently widen the deprecated surface that
    // design §3.1 keeps source-compatible for exactly one minor line.
    expectTypeOf<DataGridProps<Person, unknown>>().not.toHaveProperty(
      'showPageSize'
    );
    expectTypeOf<DataGridProps<Person, unknown>>().not.toHaveProperty(
      'showFirstLast'
    );
    expectTypeOf<DataGridProps<Person, unknown>>().not.toHaveProperty(
      'unknownTotal'
    );
  });
});
