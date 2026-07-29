import { describe, expectTypeOf, it } from 'vitest';

import type { DataGridProps } from '../data-grid';
import type { DataGridSelectionConfig } from '../data-grid';

// Per-group prop-surface assertions. These replace the single exhaustive
// `keyof DataGridProps` assertion that used to live in
// `data-table/__tests__/table-family-public-types.test.ts`, which every
// prop-adding unit would have had to edit on the same line. One file per group,
// owned by the unit that owns the group.
//
// Owner: U9 (`selection.reserve`, `selectByRow`, `selectAllOnIndeterminate`, …).
// U8 owns `selectAll`, per the ownership table's `all-results` note.

interface Person {
  id: string;
  name: string;
}

/** Is `Key` a flat top-level `DataGrid` prop (i.e. a deprecated alias)? */
type IsFlatProp<Key extends string> = Key extends keyof DataGridProps<
  Person,
  unknown
>
  ? true
  : false;

describe('DataGrid props — selection', () => {
  it('accepts the group and its deprecated aliases', () => {
    expectTypeOf<DataGridProps<Person, unknown>['selection']>().toEqualTypeOf<
      false | DataGridSelectionConfig<Person> | undefined
    >();
    expectTypeOf<DataGridProps<Person, unknown>['selectable']>().toEqualTypeOf<
      boolean | undefined
    >();
    expectTypeOf<
      DataGridProps<Person, unknown>['selectionMode']
    >().toEqualTypeOf<'single' | 'multiple' | undefined>();
    expectTypeOf<
      DataGridProps<Person, unknown>['isRowSelectable']
    >().toEqualTypeOf<((row: Person) => boolean) | undefined>();
  });

  it('carries the parity members on the group, and only on the group', () => {
    expectTypeOf<DataGridSelectionConfig<Person>['reserve']>().toEqualTypeOf<
      boolean | undefined
    >();
    expectTypeOf<
      DataGridSelectionConfig<Person>['selectAllOnIndeterminate']
    >().toEqualTypeOf<boolean | undefined>();

    // Not aliases, and deliberately so: the deprecated flat form has nowhere to
    // carry a policy flag, so a caller reaches these three only by migrating to
    // the grouped config — which is also what makes `getRowId` required for
    // them. Asserted rather than left to the comment in `selection.tsx`,
    // because "there is no alias" is exactly the kind of claim that rots into a
    // half-added one.
    //
    // Written as a `keyof` probe rather than `.not.toHaveProperty(…)`: both
    // detect a flat alias appearing, but the negative control on that form
    // reports `Expected 2 arguments, but got 1`, which names neither the prop
    // nor the claim. This one fails with `false` vs `true`.
    expectTypeOf<IsFlatProp<'reserve'>>().toEqualTypeOf<false>();
    expectTypeOf<
      IsFlatProp<'selectAllOnIndeterminate'>
    >().toEqualTypeOf<false>();
    expectTypeOf<IsFlatProp<'selectByRow'>>().toEqualTypeOf<false>();
    // The control for the probe itself: an alias that DOES exist reads `true`,
    // so a probe that answered `false` for everything would be caught here.
    expectTypeOf<IsFlatProp<'selectable'>>().toEqualTypeOf<true>();
  });

  it('carries the three select-all scopes', () => {
    expectTypeOf<DataGridSelectionConfig<Person>['selectAll']>().toEqualTypeOf<
      'page' | 'loaded' | 'all-results' | undefined
    >();
  });
});
