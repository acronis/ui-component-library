import type { ColumnDef } from '@tanstack/react-table';
import { describe, expectTypeOf, it } from 'vitest';

import type {
  DataTableControllerOptions,
  DeprecatedDataTableControllerOptions,
} from '../data-table-controller';

interface Person {
  id: string;
  name: string;
}

type Base = {
  columns: ColumnDef<Person, unknown>[];
  data: Person[];
};

type WithoutRowId<Extra extends object> = Base & Extra;
type WithRowId<Extra extends object> = Base &
  Extra & {
    getRowId: (row: Person) => string;
  };

describe('DataTable controller identity types', () => {
  it('allows identity-free use without getRowId', () => {
    expectTypeOf<Base>().toMatchTypeOf<DataTableControllerOptions<Person>>();
    expectTypeOf<
      WithoutRowId<{
        selection: false;
        rowInteraction: false;
        actions: false;
        server: false;
      }>
    >().toMatchTypeOf<DataTableControllerOptions<Person>>();
  });

  it('requires getRowId for every identity-bearing feature discriminator', () => {
    expectTypeOf<WithoutRowId<{ selection: {} }>>().not.toMatchTypeOf<
      DataTableControllerOptions<Person>
    >();
    expectTypeOf<WithoutRowId<{ detailExpansion: {} }>>().not.toMatchTypeOf<
      DataTableControllerOptions<Person>
    >();
    expectTypeOf<WithoutRowId<{ detailExpansion: false }>>().not.toMatchTypeOf<
      DataTableControllerOptions<Person>
    >();
    expectTypeOf<WithoutRowId<{ tree: {} }>>().not.toMatchTypeOf<
      DataTableControllerOptions<Person>
    >();
    expectTypeOf<WithoutRowId<{ tree: false }>>().not.toMatchTypeOf<
      DataTableControllerOptions<Person>
    >();
    expectTypeOf<
      WithoutRowId<{ getSubRows: (row: Person) => Person[] }>
    >().not.toMatchTypeOf<DataTableControllerOptions<Person>>();
    expectTypeOf<WithoutRowId<{ rowInteraction: {} }>>().not.toMatchTypeOf<
      DataTableControllerOptions<Person>
    >();
    expectTypeOf<
      WithoutRowId<{ rowInteraction: { current: true } }>
    >().not.toMatchTypeOf<DataTableControllerOptions<Person>>();
    expectTypeOf<WithoutRowId<{ actions: {} }>>().not.toMatchTypeOf<
      DataTableControllerOptions<Person>
    >();
    expectTypeOf<WithoutRowId<{ server: {} }>>().not.toMatchTypeOf<
      DataTableControllerOptions<Person>
    >();
    expectTypeOf<
      WithoutRowId<{ getRowCanExpand: () => true }>
    >().not.toMatchTypeOf<DataTableControllerOptions<Person>>();
    expectTypeOf<
      WithoutRowId<{ renderExpandedRow: () => null }>
    >().not.toMatchTypeOf<DataTableControllerOptions<Person>>();
  });

  it('requires getRowId for identity-bearing controlled and default slices', () => {
    expectTypeOf<
      WithoutRowId<{ state: { selection: Set<string> } }>
    >().not.toMatchTypeOf<DataTableControllerOptions<Person>>();
    expectTypeOf<
      WithoutRowId<{ state: { detailExpanded: Set<string> } }>
    >().not.toMatchTypeOf<DataTableControllerOptions<Person>>();
    expectTypeOf<
      WithoutRowId<{ state: { treeExpanded: Set<string> } }>
    >().not.toMatchTypeOf<DataTableControllerOptions<Person>>();
    expectTypeOf<
      WithoutRowId<{ state: { currentRowId: string } }>
    >().not.toMatchTypeOf<DataTableControllerOptions<Person>>();
    expectTypeOf<
      WithoutRowId<{ defaultState: { selection: Set<string> } }>
    >().not.toMatchTypeOf<DataTableControllerOptions<Person>>();
  });

  it('accepts all identity-bearing shapes when getRowId is present', () => {
    expectTypeOf<
      WithRowId<{
        selection: {};
        detailExpansion: {};
        tree: {};
        rowInteraction: { current: true };
        actions: {};
        server: {};
        getSubRows: (row: Person) => Person[];
        getRowCanExpand: () => true;
        renderExpandedRow: () => null;
        state: {
          selection: Set<string>;
          detailExpanded: Set<string>;
          treeExpanded: Set<string>;
          currentRowId: string;
        };
      }>
    >().toMatchTypeOf<DataTableControllerOptions<Person>>();
    expectTypeOf<
      WithRowId<{
        detailExpansion: {};
        getRowCanExpand: () => true;
      }>
    >().toMatchTypeOf<DataTableControllerOptions<Person>>();
  });

  it('keeps the deprecated expansion overload narrow', () => {
    expectTypeOf<
      Base & {
        getRowCanExpand: () => true;
        renderExpandedRow: () => null;
      }
    >().toMatchTypeOf<DeprecatedDataTableControllerOptions<Person>>();
    expectTypeOf<
      Base & {
        getRowCanExpand: () => true;
        selection: {};
      }
    >().not.toMatchTypeOf<DeprecatedDataTableControllerOptions<Person>>();
    type LegacyBase = Base & { getRowCanExpand: () => true };
    expectTypeOf<LegacyBase & { detailExpansion: {} }>().not.toMatchTypeOf<
      DeprecatedDataTableControllerOptions<Person>
    >();
    expectTypeOf<LegacyBase & { tree: {} }>().not.toMatchTypeOf<
      DeprecatedDataTableControllerOptions<Person>
    >();
    expectTypeOf<LegacyBase & { rowInteraction: {} }>().not.toMatchTypeOf<
      DeprecatedDataTableControllerOptions<Person>
    >();
    expectTypeOf<LegacyBase & { actions: {} }>().not.toMatchTypeOf<
      DeprecatedDataTableControllerOptions<Person>
    >();
    expectTypeOf<LegacyBase & { server: {} }>().not.toMatchTypeOf<
      DeprecatedDataTableControllerOptions<Person>
    >();
    expectTypeOf<
      LegacyBase & { getSubRows: (row: Person) => Person[] }
    >().not.toMatchTypeOf<DeprecatedDataTableControllerOptions<Person>>();
    expectTypeOf<
      LegacyBase & { state: { selection: Set<string> } }
    >().not.toMatchTypeOf<DeprecatedDataTableControllerOptions<Person>>();
    expectTypeOf<
      LegacyBase & { defaultState: { detailExpanded: Set<string> } }
    >().not.toMatchTypeOf<DeprecatedDataTableControllerOptions<Person>>();
  });
});

// ADDITIVE (F2). The assertions above are unchanged; these cover the behavior
// groups F2 pre-declared so a Wave 1/2 unit fills in its own
// `data-table-features/<feature>.ts` and never reopens the options unions
// (ADR-0002, BL-1). This file is deliberately not in F2's read-only guard set:
// pre-declaring union keys is precisely what it guards, so it has to grow.
describe('DataTable controller pre-declared behavior groups', () => {
  // The load-bearing assertion of the set. Every one of these groups is keyed by
  // column ID or by index, never by row ID, so they belong on the base options
  // rather than in the identity split — requiring `getRowId` from a caller who
  // only wants a footer would be a bug, not a safety rail.
  it('accepts every identity-free group without getRowId', () => {
    expectTypeOf<
      WithoutRowId<{ columnsFeatures: { pinning: true } }>
    >().toMatchTypeOf<DataTableControllerOptions<Person>>();
    expectTypeOf<
      WithoutRowId<{ grouping: { allowedColumns: ['name'] } }>
    >().toMatchTypeOf<DataTableControllerOptions<Person>>();
    expectTypeOf<WithoutRowId<{ footer: { sticky: true } }>>().toMatchTypeOf<
      DataTableControllerOptions<Person>
    >();
    expectTypeOf<
      WithoutRowId<{ virtualization: { overscan: 8 } }>
    >().toMatchTypeOf<DataTableControllerOptions<Person>>();
    expectTypeOf<
      WithoutRowId<{ persistence: { key: 'grid'; version: 1 } }>
    >().toMatchTypeOf<DataTableControllerOptions<Person>>();
  });

  it('accepts the disabled form and the empty config for each group', () => {
    expectTypeOf<
      WithoutRowId<{
        columnsFeatures: false;
        grouping: false;
        footer: false;
        virtualization: false;
        persistence: false;
      }>
    >().toMatchTypeOf<DataTableControllerOptions<Person>>();
    // Every member of every stub is optional, which is what lets the union
    // reference the interface before its owning unit exists. The owning unit
    // tightens optionality inside its own file.
    expectTypeOf<
      WithoutRowId<{
        columnsFeatures: {};
        grouping: {};
        footer: {};
        virtualization: {};
        persistence: {};
      }>
    >().toMatchTypeOf<DataTableControllerOptions<Person>>();
  });

  it('accepts every group alongside the identity-bearing branch', () => {
    expectTypeOf<
      WithRowId<{
        selection: {};
        tree: {};
        columnsFeatures: { resizing: true };
        grouping: { collapsible: true };
        footer: {};
        virtualization: { measure: 'dynamic' };
        persistence: { key: 'grid'; version: 2 };
      }>
    >().toMatchTypeOf<DataTableControllerOptions<Person>>();
  });

  it('rejects a member no stub declares', () => {
    expectTypeOf<
      WithoutRowId<{ virtualization: { overscan: 'eight' } }>
    >().not.toMatchTypeOf<DataTableControllerOptions<Person>>();
    expectTypeOf<
      WithoutRowId<{ footer: { sticky: 'yes' } }>
    >().not.toMatchTypeOf<DataTableControllerOptions<Person>>();
  });

  // U7 and U8 need `filtering`/`pagination` to carry a config, not just a
  // boolean. Pre-declared for the same reason as the five above.
  it('widens filtering and pagination to a config without breaking the boolean', () => {
    expectTypeOf<WithoutRowId<{ filtering: true }>>().toMatchTypeOf<
      DataTableControllerOptions<Person>
    >();
    expectTypeOf<
      WithoutRowId<{ filtering: { globalColumnIds: ['name'] } }>
    >().toMatchTypeOf<DataTableControllerOptions<Person>>();
    expectTypeOf<WithoutRowId<{ pagination: true }>>().toMatchTypeOf<
      DataTableControllerOptions<Person>
    >();
    expectTypeOf<
      WithoutRowId<{ pagination: { unknownTotal: true } }>
    >().toMatchTypeOf<DataTableControllerOptions<Person>>();
  });

  it('keeps the deprecated overload closed to every pre-declared group', () => {
    type LegacyBase = Base & { getRowCanExpand: () => true };

    expectTypeOf<LegacyBase & { columnsFeatures: {} }>().not.toMatchTypeOf<
      DeprecatedDataTableControllerOptions<Person>
    >();
    expectTypeOf<LegacyBase & { grouping: {} }>().not.toMatchTypeOf<
      DeprecatedDataTableControllerOptions<Person>
    >();
    expectTypeOf<LegacyBase & { footer: {} }>().not.toMatchTypeOf<
      DeprecatedDataTableControllerOptions<Person>
    >();
    expectTypeOf<LegacyBase & { virtualization: {} }>().not.toMatchTypeOf<
      DeprecatedDataTableControllerOptions<Person>
    >();
    expectTypeOf<LegacyBase & { persistence: {} }>().not.toMatchTypeOf<
      DeprecatedDataTableControllerOptions<Person>
    >();
  });
});
