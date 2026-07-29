import { describe, expectTypeOf, it } from 'vitest';

import type { DataGridProps } from '../data-grid';
import type { DataGridRowInteractionConfig } from '../data-grid';

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

describe('DataGrid props — rowInteraction', () => {
  it('accepts the group, its deprecated aliases, and the cell events', () => {
    // Two shapes, because the identity rule (design §3.1) narrows this group on
    // the identity-free branch: `current` is tracked by row id, while the
    // click/hover/activate handlers receive the row object and need no identity.
    expectTypeOf<
      DataGridProps<Person, unknown>['rowInteraction']
    >().toEqualTypeOf<
      | DataGridRowInteractionConfig<Person>
      | {
          current?: false;
          onClick?: (row: Person) => void;
          onActivate?: (row: Person) => void;
          onHover?: (row: Person) => void;
        }
      | undefined
    >();
    expectTypeOf<DataGridProps<Person, unknown>['currentRow']>().toEqualTypeOf<
      boolean | undefined
    >();
    expectTypeOf<DataGridProps<Person, unknown>['onRowClick']>().toEqualTypeOf<
      ((row: Person) => void) | undefined
    >();
    expectTypeOf<
      DataGridProps<Person, unknown>['onRowActivate']
    >().toEqualTypeOf<((row: Person) => void) | undefined>();
    expectTypeOf<DataGridProps<Person, unknown>['onRowHover']>().toEqualTypeOf<
      ((row: Person) => void) | undefined
    >();
    expectTypeOf<DataGridProps<Person, unknown>['onCellClick']>().toEqualTypeOf<
      ((columnId: string, row: Person) => void) | undefined
    >();
    expectTypeOf<DataGridProps<Person, unknown>['onCellHover']>().toEqualTypeOf<
      ((columnId: string, row: Person) => void) | undefined
    >();
  });
});
