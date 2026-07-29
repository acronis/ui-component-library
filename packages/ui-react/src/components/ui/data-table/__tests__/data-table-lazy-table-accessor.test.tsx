import type { ColumnDef } from '@tanstack/react-table';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// `ctx.table` is a thunk over a `const` declared ~50 lines later in the
// controller, so calling it from the body of `engineOptions` is a temporal dead
// zone on **every** render, not just the first. The raw failure is
// `ReferenceError: Cannot access 'table' before initialization`, which names
// neither the rule broken nor the fix.
//
// Two operators hit exactly that in this file on one day: one recognised it only
// because the hazard was documented, the other spent a diagnosis treating it as a
// checkout-wide blocker taking out 48 tests. Documentation shortened one and
// prevented neither — so the mechanism is the error message, and this is its guard.
//
// Exercised through a REAL controller rather than a composer with a fake context.
// The fake context in `data-table-features.test.tsx` throws its own error, so an
// assertion there would test the fixture and not the guard — which is rule 7b:
// exercise the configuration the consumer actually uses.

interface Person {
  id: string;
  name: string;
}

const columns: ColumnDef<Person, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
];

const rows: Person[] = [{ id: 'a', name: 'Ada' }];

vi.mock('../data-table-features', async (importOriginal) => {
  const real = await importOriginal<typeof import('../data-table-features')>();
  const { defineDataTableFeature } =
    await import('../data-table-features/registry');

  return {
    ...real,
    DATA_TABLE_FEATURES: [
      ...real.DATA_TABLE_FEATURES,
      defineDataTableFeature<Person>({
        id: 'virtualization',
        // The mistake in its natural form. `data` is a value rather than a
        // closure, so a feature that wants the row model reaches for the table in
        // the literal's body — which is precisely where it does not exist.
        engineOptions: (ctx) => ({ data: [...ctx.table().options.data] }),
      }),
    ],
  };
});

const { useDataTable } = await import('../data-table-controller');

describe('the lazy table accessor names its own misuse', () => {
  const render = () =>
    renderHook(() =>
      useDataTable({ columns, data: rows, getRowId: (row) => row.id })
    );

  it('throws a named error rather than a bare ReferenceError', () => {
    expect(render).toThrow(
      /called while contribution points were being composed/
    );
    expect(render).not.toThrow(/before initialization/);
  });

  it('says what to do instead, not merely what went wrong', () => {
    // An error naming the rule but not the remedy still costs a diagnosis, which
    // is the whole point of replacing the raw one.
    expect(render).toThrow(/inside a closure the later phase invokes/);
  });
});
