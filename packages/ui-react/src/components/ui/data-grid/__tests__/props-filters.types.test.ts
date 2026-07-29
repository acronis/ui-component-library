import { describe, expectTypeOf, it } from 'vitest';

import type { DataGridProps } from '../data-grid';
import type {
  DataGridColumnFilterDef,
  DataGridFiltersConfig,
} from '../data-grid';
// Internal path: U7's new public type reaches consumers through a staged
// `data-grid/index.ts` line, and `data-grid.tsx`'s re-export block is closed to
// units. Same precedent as `props-detail-expansion.types.test.ts`.
import type { DataGridFacetSource } from '../data-grid-config';

// Per-group prop-surface assertions. These replace the single exhaustive
// `keyof DataGridProps` assertion that used to live in
// `data-table/__tests__/table-family-public-types.test.ts`, which every
// prop-adding unit would have had to edit on the same line. One file per group,
// owned by the unit that owns the group.
//
// Owner: U7 (`facet`, multi-column `global.columnIds`).

interface Person {
  id: string;
  name: string;
}

describe('DataGrid props — filters', () => {
  it('accepts the group, its union forms, and its deprecated aliases', () => {
    expectTypeOf<DataGridProps<Person, unknown>['filters']>().toEqualTypeOf<
      | false
      | readonly DataGridColumnFilterDef[]
      | DataGridFiltersConfig
      | undefined
    >();
    expectTypeOf<DataGridProps<Person, unknown>['searchKey']>().toEqualTypeOf<
      string | undefined
    >();
    expectTypeOf<
      DataGridProps<Person, unknown>['searchPlaceholder']
    >().toEqualTypeOf<string | undefined>();
  });

  it('carries the facet source and the multi-column global form', () => {
    // U7's two additions. `facet` is what a set-membership control reads its
    // options from; `global.columnIds` is the multi-column search, with the
    // singular `columnId` kept for one minor line.
    expectTypeOf<
      NonNullable<DataGridColumnFilterDef['facet']>
    >().toEqualTypeOf<DataGridFacetSource>();
    expectTypeOf<DataGridFacetSource>().toEqualTypeOf<
      'unique' | 'min-max' | readonly (string | number | boolean)[]
    >();
    expectTypeOf<NonNullable<DataGridFiltersConfig['global']>>().toEqualTypeOf<{
      columnIds?: readonly string[];
      columnId?: string;
      placeholder?: string;
    }>();
  });
});
