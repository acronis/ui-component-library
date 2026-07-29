import type { ReactNode } from 'react';
import { describe, expectTypeOf, it } from 'vitest';

import type { DataGridProps } from '../data-grid';
// Internal path on purpose: the group's public type reaches consumers through a
// staged `data-grid/index.ts` line (a manifest file), and `data-grid.tsx`'s
// re-export block is closed to units — that closure is what F4 bought. Same
// precedent as `table-family-public-types.test.ts`.
import type { DataGridDetailExpansionConfig } from '../data-grid-config';

// Per-group prop-surface assertions. See `props-identity-rule.types.test.tsx` for
// the compile-time identity rule this group participates in — `detailExpansion` is
// identity-bearing, so it requires `getRowId`.
//
// Owner: U1.

interface Person {
  id: string;
  name: string;
}

describe('DataGrid props — detailExpansion', () => {
  it('accepts the group; it has no deprecated alias', () => {
    expectTypeOf<
      DataGridProps<Person, unknown>['detailExpansion']
    >().toEqualTypeOf<
      false | DataGridDetailExpansionConfig<Person> | undefined
    >();
  });

  it('requires `render` and leaves the rest optional', () => {
    // Unlike the DataTable layer, where the deprecated `renderExpandedRow` view
    // prop is still a valid content source, a DataGrid detail group with nothing
    // to render is a configuration mistake (design §5.2).
    expectTypeOf<DataGridDetailExpansionConfig<Person>>().toEqualTypeOf<{
      render: (row: Person) => ReactNode;
      isExpandable?: (row: Person) => boolean;
      mode?: 'multiple' | 'accordion';
      reserve?: boolean;
    }>();
  });
});
