import type { ReactNode } from 'react';
import { describe, expectTypeOf, it } from 'vitest';

import type { DataGridProps } from '../data-grid';
import type { DataGridLabels } from '../data-grid-config';

// Per-group prop-surface assertions for the `labels` group (PLTFRM-93117).
//
// Owner: F4. Every string DataGrid renders that the caller did not supply.

interface Person {
  id: string;
  name: string;
}

describe('DataGrid props — labels', () => {
  it('accepts the group config', () => {
    expectTypeOf<DataGridProps<Person, unknown>['labels']>().toEqualTypeOf<
      DataGridLabels | undefined
    >();
  });

  it('makes every member optional', () => {
    // An omitted member keeps its English default, so adopting this group is
    // never all-or-nothing.
    expectTypeOf<DataGridLabels['rowsPerPage']>().toEqualTypeOf<
      string | undefined
    >();
    expectTypeOf<DataGridLabels['clearSelection']>().toEqualTypeOf<
      string | undefined
    >();
  });

  it('types interpolated members as functions', () => {
    // Members with runtime values are functions so plural classes beyond
    // English's two are expressible.
    expectTypeOf<DataGridLabels['selectedCount']>().toEqualTypeOf<
      ((selected: number, total: number) => ReactNode) | undefined
    >();
  });
});
