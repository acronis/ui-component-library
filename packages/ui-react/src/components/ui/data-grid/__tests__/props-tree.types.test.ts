import type { ReactNode } from 'react';
import { describe, expectTypeOf, it } from 'vitest';

import type { DataGridProps } from '../data-grid';
// Internal path on purpose: the group's public type reaches consumers through a
// staged `data-grid/index.ts` line (a manifest file), and `data-grid.tsx`'s
// re-export block is closed to units.
import type {
  DataGridTreeConfig,
  DataGridTreeLoadErrorContext,
} from '../data-grid-config';

// Per-group prop-surface assertions. See `props-identity-rule.types.test.tsx` for
// the compile-time identity rule this group participates in — `tree` keys expanded
// ids by row id, so it requires `getRowId`.
//
// Owner: U2.

interface Person {
  id: string;
  name: string;
  reports?: Person[];
}

describe('DataGrid props — tree', () => {
  it('accepts the group; it has no deprecated alias', () => {
    expectTypeOf<DataGridProps<Person, unknown>['tree']>().toEqualTypeOf<
      false | DataGridTreeConfig<Person> | undefined
    >();
  });

  it('requires `getChildren` and leaves the rest optional', () => {
    // Required here but optional at the DataTable layer, where the shipped
    // `getSubRows` route already supplies relationships (design §5.2 is the
    // DataGrid API). `loadChildren` is optional because an eager tree is a
    // complete configuration, not a degraded one.
    expectTypeOf<DataGridTreeConfig<Person>>().toEqualTypeOf<{
      getChildren: (row: Person) => readonly Person[] | undefined;
      loadChildren?: (
        row: Person,
        requestKey: string
      ) => Promise<readonly Person[]>;
      renderLoadError?: (
        context: DataGridTreeLoadErrorContext<Person>
      ) => ReactNode;
      indent?: number;
      column?: string;
      reserve?: boolean;
    }>();
  });

  it('gives the load-error renderer a retry it cannot decline', () => {
    // A failed branch with no way back is not a supported shape, so `retry` is
    // required on the context rather than optional. `error` is `unknown` because
    // a rejected promise carries whatever the caller's loader threw.
    expectTypeOf<DataGridTreeLoadErrorContext<Person>>().toEqualTypeOf<{
      readonly row: Person;
      readonly error: unknown;
      readonly retry: () => void;
    }>();
  });
});
