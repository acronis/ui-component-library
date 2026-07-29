import { describe, expectTypeOf, it } from 'vitest';

import type { DataGridProps } from '../data-grid';
import type { DataGridAppearanceConfig } from '../data-grid';

// Per-group prop-surface assertions. These replace the single exhaustive
// `keyof DataGridProps` assertion that used to live in
// `data-table/__tests__/table-family-public-types.test.ts`, which every
// prop-adding unit would have had to edit on the same line. One file per group,
// owned by the unit that owns the group.
//
// Owner: U9 (`size`, `background`, `showHeader`, `borders`, `height`, `maxHeight`, `stickyHeader`).

interface Person {
  id: string;
  name: string;
}

describe('DataGrid props — appearance', () => {
  it('accepts the group and its deprecated alias', () => {
    expectTypeOf<DataGridProps<Person, unknown>['appearance']>().toEqualTypeOf<
      DataGridAppearanceConfig<Person> | undefined
    >();
    expectTypeOf<DataGridProps<Person, unknown>['striped']>().toEqualTypeOf<
      boolean | undefined
    >();
  });

  it('carries the whole cluster, not just the shipped `striped`', () => {
    // U9's additions. Each is pass-through to `DataTableView`; the point of the
    // assertion is that the *group* exposes them, since a member absent here is
    // unreachable from DataGrid no matter what the primitive supports.
    expectTypeOf<keyof DataGridAppearanceConfig<Person>>().toEqualTypeOf<
      | 'striped'
      | 'size'
      | 'background'
      | 'showHeader'
      | 'stickyHeader'
      | 'borders'
      | 'width'
      | 'height'
      | 'maxHeight'
      | 'rowClassName'
      | 'rowStyle'
      | 'cellClassName'
      | 'cellStyle'
      | 'headerClassName'
      | 'headerStyle'
    >();
    expectTypeOf<
      NonNullable<DataGridAppearanceConfig<Person>['background']>
    >().toEqualTypeOf<'transparent' | 'accent' | 'subtle' | 'surface'>();
    expectTypeOf<
      keyof NonNullable<DataGridAppearanceConfig<Person>['borders']>
    >().toEqualTypeOf<'top' | 'bottom' | 'horizontal' | 'vertical'>();
  });
});
