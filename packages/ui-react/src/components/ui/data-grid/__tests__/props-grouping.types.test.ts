import type { ReactNode } from 'react';
import { describe, expectTypeOf, it } from 'vitest';

import type { DataGridProps } from '../data-grid';
// Internal path on purpose: the group's public type reaches consumers through a
// staged `data-grid/index.ts` line (a manifest file), and `data-grid.tsx`'s
// re-export block is closed to units.
import type {
  DataGridGroupContext,
  DataGridGroupingConfig,
} from '../data-grid-config';

// Per-group prop-surface assertions.
//
// Owner: U4.
//
// **`grouping` is deliberately absent from the identity rule**, unlike `tree` and
// `selection`. Design §3.1's normative list of identity-bearing features does not
// include it, and nothing in the group is keyed by row id: collapse is keyed by the
// synthetic group id (§6.5) and group selection goes through `selection`, which
// carries its own constraint. So the last assertion here is a *negative* one, and
// it is the load-bearing one — declaring the group on `DataGridIdentityFreeMap`
// would silently force `getRowId` on every grid that groups.

interface Person {
  id: string;
  name: string;
  status: string | null;
}

describe('DataGrid props — grouping', () => {
  it('accepts the group; it has no deprecated alias', () => {
    expectTypeOf<DataGridProps<Person, unknown>['grouping']>().toEqualTypeOf<
      false | DataGridGroupingConfig<Person> | undefined
    >();
  });

  it('requires `allowedColumns` and leaves the rest optional', () => {
    // Required at this layer only (design §5.2 is the DataGrid API); the DataTable
    // config keeps every member optional so the controller's options union can
    // reference it, per registry rule 5.
    expectTypeOf<DataGridGroupingConfig<Person>>().toEqualTypeOf<{
      allowedColumns: readonly string[];
      // Per-group paging (PLTFRM-93295). Optional, and `0`/omitted is off, so every
      // existing caller keeps the behaviour they had.
      pageSize?: number;
      renderGroup?: (context: DataGridGroupContext<Person>) => ReactNode;
      collapsible?: boolean;
      sticky?: boolean;
      selectionScope?: 'visible-leaves' | 'all-loaded-leaves';
      ungrouped?: {
        readonly show?: boolean;
        readonly name?: string;
        readonly position?: 'first' | 'last';
      };
    }>();
  });

  it('hands a renderer the group, its commands, and its rows', () => {
    // `value` is `unknown` because a grouping column holds whatever the record
    // does; `name` is resolved (the stringified value, or the ungrouped policy's
    // name) so a renderer cannot disagree with the policy. `rows` is the caller's
    // record type, not TanStack rows — the layer boundary the whole kit keeps.
    expectTypeOf<DataGridGroupContext<Person>>().toEqualTypeOf<{
      readonly groupId: string;
      readonly columnId: string;
      readonly value: unknown;
      readonly name: string;
      readonly isUngrouped: boolean;
      readonly depth: number;
      readonly collapsed: boolean;
      readonly collapsible: boolean;
      readonly toggle: () => void;
      readonly rows: readonly Person[];
      readonly rowCount: number;
      readonly colSpan: number;
      readonly selection: {
        readonly state: 'none' | 'some' | 'all';
        readonly eligibleCount: number;
        readonly toggle: (selected?: boolean) => void;
      };
    }>();
  });

  it('does not require `getRowId`, because nothing in it is keyed by row id', () => {
    // The negative half of the identity rule, asserted rather than assumed. If
    // `grouping` were ever declared on `DataGridIdentityFreeMap`, the
    // identity-free branch would pin it to `false` and this stops compiling — which
    // is the point: the failure would otherwise be a caller discovering that a
    // grid which merely groups now demands identity.
    const identityFree: DataGridProps<Person, unknown> = {
      columns: [],
      rows: [],
      grouping: { allowedColumns: ['status'] },
    };

    expectTypeOf(identityFree.grouping).toEqualTypeOf<
      false | DataGridGroupingConfig<Person> | undefined
    >();
  });
});
