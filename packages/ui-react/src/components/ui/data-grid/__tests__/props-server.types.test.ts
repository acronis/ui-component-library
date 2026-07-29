import { describe, expectTypeOf, it } from 'vitest';

import type { DataGridProps } from '../data-grid';
import type { DataGridServerConfig } from '../data-grid';
import type {
  DataGridServerSelection,
  DataGridServerSelectionChangeEvent,
} from '../data-grid-config';

// Per-group prop-surface assertions. These replace the single exhaustive
// `keyof DataGridProps` assertion that used to live in
// `data-table/__tests__/table-family-public-types.test.ts`, which every
// prop-adding unit would have had to edit on the same line. One file per group,
// owned by the unit that owns the group.
//
// Owner: U8 (`hasNextPage`, `hasPreviousPage`, `selection`, `onSelectionChange`).

interface Person {
  id: string;
  name: string;
}

describe('DataGrid props — server', () => {
  it('accepts the top-level input; it is never preset-addressable', () => {
    expectTypeOf<DataGridProps<Person, unknown>['server']>().toEqualTypeOf<
      DataGridServerConfig | undefined
    >();
  });

  it('carries the two directional capabilities', () => {
    expectTypeOf<DataGridServerConfig['hasNextPage']>().toEqualTypeOf<
      boolean | undefined
    >();
    expectTypeOf<DataGridServerConfig['hasPreviousPage']>().toEqualTypeOf<
      boolean | undefined
    >();
  });

  it('carries the controlled selection and its paired handler', () => {
    expectTypeOf<DataGridServerConfig['selection']>().toEqualTypeOf<
      DataGridServerSelection | undefined
    >();
    expectTypeOf<DataGridServerConfig['onSelectionChange']>().toEqualTypeOf<
      ((event: DataGridServerSelectionChangeEvent) => void) | undefined
    >();
  });

  it('requires an all-results token to be complete', () => {
    // The discriminating half. A partial all-results value must not be
    // assignable: an application-issued token is only meaningful with the request
    // key it was issued for and the exclusions it carries, so making any of the
    // three optional would let a caller supply a token DataGrid cannot check for
    // staleness — and staleness rejection is the entire contract.
    expectTypeOf<{
      mode: 'all-results';
      queryRequestKey: string;
      excludedIds: ReadonlySet<string>;
      token: string;
    }>().toMatchTypeOf<DataGridServerSelection>();
    expectTypeOf<{
      mode: 'all-results';
      token: string;
    }>().not.toMatchTypeOf<DataGridServerSelection>();

    // Not asserted, and worth saying why rather than leaving the gap to be read as
    // an oversight: "an `explicit` value may not carry a `token`" is **not
    // expressible here**. Excess-property checking applies to fresh object
    // literals, not to type-level assignability, so `{ mode: 'explicit'; ids;
    // token }` is structurally assignable to the `explicit` branch. A caller
    // writing that inline still gets an error from the compiler; a test cannot
    // claim credit for it.
  });
});
