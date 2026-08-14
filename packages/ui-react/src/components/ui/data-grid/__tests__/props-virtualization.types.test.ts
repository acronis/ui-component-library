import { describe, expectTypeOf, it } from 'vitest';

import type { DataGridProps } from '../data-grid';
// Internal path on purpose: the group's public type reaches consumers through a
// staged `data-grid/index.ts` line (a manifest file), and `data-grid.tsx`'s
// re-export block is closed to units.
import type { DataGridVirtualizationConfig } from '../data-grid-config';
import type { DataTableRowRange } from '../../data-table/data-table-features/virtualization';

// Per-group prop-surface assertions.
//
// Owner: U6.
//
// **`virtualization` is deliberately absent from the identity rule.** Windowing is
// presentation over the rendered list and is keyed by INDEX — `scrollToIndex` says so
// in its name — so design §3.1's list of identity-bearing features does not include
// it. The last assertion here is therefore a *negative* one, and it is the
// load-bearing one: declaring the group on `DataGridIdentityFreeMap` would pin it to
// `false` on the identity-free branch and silently force `getRowId` on every grid that
// merely windows its rows.
//
// The config is **not generic**, unlike `tree` and `grouping`. Nothing in it takes or
// returns a row: `estimateRowHeight` is a function of the row *index*. A phantom
// `TData` would be noise in the public type and in every hover.

interface Person {
  id: string;
  name: string;
}

describe('DataGrid props — virtualization', () => {
  it('accepts the group; it has no deprecated alias', () => {
    expectTypeOf<
      DataGridProps<Person, unknown>['virtualization']
    >().toEqualTypeOf<false | DataGridVirtualizationConfig | undefined>();
  });

  it('leaves every member optional, because the engine seam owns the defaults', () => {
    // Design §5.2's 40px / `fixed` / overscan 8 live in `data-table-body-window.ts`,
    // so this layer requires nothing and defaults nothing — `virtualization: {}` is a
    // complete configuration.
    expectTypeOf<DataGridVirtualizationConfig>().toEqualTypeOf<{
      estimateRowHeight?: number | ((rowIndex: number) => number);
      measure?: 'fixed' | 'dynamic';
      overscan?: number;
      scrollToIndex?: number;
      onRangeChange?: (range: DataTableRowRange) => void;
    }>();
  });

  it('takes a row-height estimate as a number or a function of the index', () => {
    // A function of the INDEX, not of the row: the estimate is needed before the row
    // is rendered, and in a windowed list before its record is even reached.
    expectTypeOf<
      DataGridVirtualizationConfig['estimateRowHeight']
    >().toEqualTypeOf<number | ((rowIndex: number) => number) | undefined>();
  });

  it('does not require `getRowId`, because windowing is keyed by index', () => {
    // The negative half of the identity rule, asserted rather than assumed. If
    // `virtualization` were ever declared on `DataGridIdentityFreeMap`, the
    // identity-free branch would pin it to `false` and this stops compiling.
    const identityFree: DataGridProps<Person, unknown> = {
      columns: [],
      rows: [],
      virtualization: { estimateRowHeight: 40 },
      appearance: { height: 400 },
    };

    expectTypeOf(identityFree.virtualization).toEqualTypeOf<
      false | DataGridVirtualizationConfig | undefined
    >();
  });
});
