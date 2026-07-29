import { describe, expectTypeOf, it } from 'vitest';

import type { DataTableStateInput } from '../../data-table';
import type {
  DataGridDataStatus,
  DataGridProps,
  IdentityFreeDataGridState,
} from '../data-grid';

// Per-group prop-surface assertions for the top-level `state`/`defaultState`
// inputs. See `props-identity-rule.types.test.tsx` for the compile-time identity
// rule these participate in.
//
// Owner: F5.

interface Person {
  id: string;
  name: string;
}

describe('DataGrid props — state', () => {
  it('accepts a controlled slice object and the deprecated status string', () => {
    // One prop, two structurally disjoint forms, discriminated by
    // `typeof state === 'string'`. Declared once — a prop declared in two of the
    // registry maps would intersect to `never` rather than union.
    expectTypeOf<DataGridProps<Person, unknown>['state']>().toEqualTypeOf<
      | DataGridDataStatus
      | DataTableStateInput
      | IdentityFreeDataGridState
      | undefined
    >();
    expectTypeOf<
      DataGridProps<Person, unknown>['defaultState']
    >().toEqualTypeOf<
      DataTableStateInput | IdentityFreeDataGridState | undefined
    >();
  });

  it('strips the identity slices from the identity-free state shape', () => {
    // What makes `state={{ selection }}` without `getRowId` a compile error.
    expectTypeOf<
      IdentityFreeDataGridState['selection']
    >().toEqualTypeOf<undefined>();
    expectTypeOf<
      IdentityFreeDataGridState['currentRowId']
    >().toEqualTypeOf<undefined>();
    expectTypeOf<
      IdentityFreeDataGridState['detailExpanded']
    >().toEqualTypeOf<undefined>();
    expectTypeOf<
      IdentityFreeDataGridState['treeExpanded']
    >().toEqualTypeOf<undefined>();
    // Non-identity slices survive.
    expectTypeOf<IdentityFreeDataGridState['pagination']>().toEqualTypeOf<
      DataTableStateInput['pagination']
    >();
  });
});
