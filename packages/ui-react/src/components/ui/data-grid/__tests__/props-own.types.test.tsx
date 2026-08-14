import type { ColumnDef } from '@tanstack/react-table';
import { describe, expectTypeOf, it } from 'vitest';

import { DataGrid } from '../data-grid';
import type { DataGridProps, DataGridTruncateCellContext } from '../data-grid';
import { createActionsColumn } from '../data-grid-actions';

// PLTFRM-93046, "Extra issues" — `DataGridOwnProps`: the two props no config
// module contributes (`columns`, `rows`) and the generic they are written over.
//
// Both defects here are **consumer-only**, and that is the whole reason they
// shipped: every reference inside this package spells `<Person, unknown>` out in
// full and passes mutable arrays it just built, so the workspace typecheck and all
// 20 sibling `props-<group>.types.test.ts` files were green the entire time an
// external consumer could not name the prop type at all. The nearest precedent is
// `src/components/ui/data-grid/index.ts`'s #43/#50 block — a type that exists,
// works, and is unreachable from outside. That is the class of defect this file
// exists to catch, so the assertions below are deliberately written the way a
// consumer writes them, not the way the tree does.
//
// Nothing here renders; the file exists for `tsc`.

interface Person {
  id: string;
  name: string;
}

describe('DataGrid props — columns/rows and the TValue default', () => {
  it('defaults `TValue`, so one type argument is enough', () => {
    // TS2314 "Generic type 'DataGridProps' requires 2 type argument(s)" before
    // the default landed. `toEqualTypeOf` rather than a bare reference: it also
    // pins *what* the default is, so widening it to `any` later fails here.
    expectTypeOf<DataGridProps<Person>>().toEqualTypeOf<
      DataGridProps<Person, unknown>
    >();
    expectTypeOf<DataGridTruncateCellContext<Person>>().toEqualTypeOf<
      DataGridTruncateCellContext<Person, unknown>
    >();
  });

  it('accepts an explicit single type argument on the component', () => {
    // TS2558 "Expected 2 type arguments, but got 1" before the default landed.
    // The empty arrays are the point: this spelling is exactly what a consumer
    // reaches for when there is nothing for inference to read.
    void (<DataGrid<Person> columns={[]} rows={[]} />);
  });

  it('accepts an explicit single type argument on `createActionsColumn`', () => {
    void createActionsColumn<Person>({
      items: [{ id: 'edit', label: 'Edit' }],
      onAction: () => {},
    });
  });

  it('accepts readonly `columns` and `rows`', () => {
    // TS4104 before the props were widened. Asserted through the prop types
    // rather than by rendering, so the failure names the prop rather than
    // arriving as a JSX assignability error several frames away.
    expectTypeOf<readonly ColumnDef<Person>[]>().toExtend<
      DataGridProps<Person>['columns']
    >();
    expectTypeOf<readonly Person[]>().toExtend<DataGridProps<Person>['rows']>();

    const columns: readonly ColumnDef<Person>[] = [{ accessorKey: 'name' }];
    const rows: readonly Person[] = [{ id: '1', name: 'Ada' }];
    void (<DataGrid columns={columns} rows={rows} />);
  });

  it('still accepts mutable `columns` and `rows`', () => {
    // The widening has to be additive: `readonly T[]` is the supertype, so every
    // existing mutable call site stays valid. Cheap, and it is the half of the
    // change that could regress silently.
    expectTypeOf<ColumnDef<Person>[]>().toExtend<
      DataGridProps<Person>['columns']
    >();
    expectTypeOf<Person[]>().toExtend<DataGridProps<Person>['rows']>();
  });
});
