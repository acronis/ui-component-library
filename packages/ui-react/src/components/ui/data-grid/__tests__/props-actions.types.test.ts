import { describe, expectTypeOf, it } from 'vitest';

import type { DataGridProps } from '../data-grid';
import type { DataGridActionsConfig } from '../data-grid-actions';

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

describe('DataGrid props — actions', () => {
  it('accepts the group; it has no deprecated alias', () => {
    expectTypeOf<DataGridProps<Person, unknown>['actions']>().toEqualTypeOf<
      false | DataGridActionsConfig<Person> | undefined
    >();
  });
});
