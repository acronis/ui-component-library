import type { ReactNode } from 'react';
import { describe, expectTypeOf, it } from 'vitest';

// BOTH types come from the PACKAGE ROOT BARREL (`src/index.ts`), never from
// `../data-grid` or a module file, so this import traverses all three re-export hops
// in source and fails if any of them stops carrying either name. `DataGridFooterConfig`
// was missing at all three until the lines landed with this change — see the fuller
// note in `props-columns-features.types.test.ts`, including why #43's literal
// "import from the package specifier" is not runnable inside the package.
import type { DataGridFooterConfig, DataGridProps } from '../../../../index';

// Per-group prop-surface assertions; one file per group, owned by the unit that
// owns the group.
//
// Owner: U5 (`footer`). Filled by the #50 audit unit — the group shipped (#25/#32)
// while this file still said "NOT YET IMPLEMENTED" and still held an `it.todo`, so
// the type surface of a shipped group was unasserted, and **`it.todo` never fails**.
//
// The XOR is the part worth asserting rather than the presence of the prop.
// `summaries` and `render` are mutually exclusive via `?: never` on each branch
// (§5.2: DataGrid owns formatting, so a caller either hands over the model or takes
// the whole row). A test that only checked `footer` accepted an object would pass
// with the XOR collapsed to a plain optional pair, which is the same
// nesting-blind shape rule 7b warns about — so both branches are asserted
// positively AND the union of the two is asserted to fail.

interface Person {
  id: string;
  name: string;
}

describe('DataGrid props — footer', () => {
  it('accepts the group', () => {
    expectTypeOf<DataGridProps<Person, unknown>['footer']>().toEqualTypeOf<
      false | DataGridFooterConfig<Person> | undefined
    >();
  });

  it('accepts either branch of the summaries/render XOR', () => {
    expectTypeOf<{
      readonly summaries: readonly { columnId: string; aggregate: 'sum' }[];
    }>().toMatchTypeOf<DataGridFooterConfig<Person>>();
    expectTypeOf<{
      readonly render: (rows: readonly Person[]) => ReactNode;
    }>().toMatchTypeOf<DataGridFooterConfig<Person>>();
  });

  // The negative half, and the reason this file is not just a presence check: with
  // the `?: never` guards removed both members would coexist and this assertion is
  // the only thing that notices.
  it('rejects summaries and render together', () => {
    expectTypeOf<{
      readonly summaries: readonly { columnId: string; aggregate: 'sum' }[];
      readonly render: (rows: readonly Person[]) => ReactNode;
    }>().not.toMatchTypeOf<DataGridFooterConfig<Person>>();
  });

  // `sticky` sits on both branches — it is the config's only route to the view's
  // `stickyFooter`, because a footer feature's `renderDisplayRow` returns the row
  // *inside* `<TableFooter>` and cannot reach the section element.
  it('carries sticky on both branches', () => {
    expectTypeOf<{
      readonly summaries: readonly { columnId: string; aggregate: 'sum' }[];
      readonly sticky: boolean;
    }>().toMatchTypeOf<DataGridFooterConfig<Person>>();
    expectTypeOf<{
      readonly render: (rows: readonly Person[]) => ReactNode;
      readonly sticky: boolean;
    }>().toMatchTypeOf<DataGridFooterConfig<Person>>();
  });

  // The group declares `aliases: []` — nothing to assert for deprecated flat props
  // here. The guard that polices the alias surface is
  // `data-table/__tests__/table-family-public-types.test.ts`, which freezes the
  // whole key set and does fire on an addition (measured during the #50 sweep). See
  // the longer note in `props-columns-features.types.test.ts` for why the invented-
  // name `not.toHaveProperty` assertion that was here first got removed instead.
});
