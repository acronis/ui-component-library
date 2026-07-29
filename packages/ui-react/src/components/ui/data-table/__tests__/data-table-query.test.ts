import { describe, expect, it } from 'vitest';

import type { DataTableQuery, SerializableValue } from '../data-table-contract';
import {
  createDataTableQuery,
  createDataTableRequestKey,
  serializeDataTableRequest,
} from '../data-table-query';
import { createDefaultDataTableState } from '../data-table-state';

function queryIdentity(
  overrides: Partial<Omit<DataTableQuery, 'requestKey'>> = {}
): Omit<DataTableQuery, 'requestKey'> {
  return {
    version: 1,
    sorting: [],
    filters: [],
    grouping: [],
    pagination: { pageIndex: 0, pageSize: 10 },
    ...overrides,
  };
}

describe('DataTable canonical request serialization', () => {
  it('sorts object keys lexicographically at every depth', () => {
    expect(
      serializeDataTableRequest({
        zebra: 1,
        alpha: {
          delta: true,
          beta: 'value',
        },
      })
    ).toBe('{"alpha":{"beta":"value","delta":true},"zebra":1}');
  });

  it('preserves array and descriptor priority order', () => {
    const primaryName = createDataTableRequestKey(
      queryIdentity({
        sorting: [
          { id: 'name', desc: false },
          { id: 'createdAt', desc: true },
        ],
      })
    );
    const primaryCreatedAt = createDataTableRequestKey(
      queryIdentity({
        sorting: [
          { id: 'createdAt', desc: true },
          { id: 'name', desc: false },
        ],
      })
    );

    expect(primaryName).not.toBe(primaryCreatedAt);
    expect(JSON.parse(primaryName).sorting).toEqual([
      { desc: false, id: 'name' },
      { desc: true, id: 'createdAt' },
    ]);
  });

  it('omits undefined object members', () => {
    expect(serializeDataTableRequest({ beta: undefined, alpha: 1 })).toBe(
      '{"alpha":1}'
    );
  });

  it.each([
    ['non-finite numbers', { value: Number.POSITIVE_INFINITY }],
    ['dates', { value: new Date('2026-07-23') }],
    ['functions', { value: () => undefined }],
    ['bigints', { value: BigInt(1) }],
    ['symbols', { value: Symbol('unsupported') }],
    ['undefined array entries', { value: [undefined] }],
    ['sparse arrays', { value: Array(1) }],
  ])('rejects unsupported %s', (_, value) => {
    expect(() =>
      serializeDataTableRequest(value as unknown as SerializableValue)
    ).toThrow(TypeError);
  });

  it('rejects cyclic values while allowing repeated non-cyclic references', () => {
    const cyclic: Record<string, unknown> = {};
    cyclic.self = cyclic;
    const shared = { id: 'shared' };

    expect(() =>
      serializeDataTableRequest(cyclic as SerializableValue)
    ).toThrow(/cycles/);
    expect(serializeDataTableRequest({ first: shared, second: shared })).toBe(
      '{"first":{"id":"shared"},"second":{"id":"shared"}}'
    );
  });

  it('derives a query key from query members without serializing requestKey', () => {
    const state = createDefaultDataTableState({
      globalFilter: { term: 'backup', ignored: undefined },
      grouping: ['tenant'],
      pagination: { pageIndex: 2, pageSize: 25 },
    });
    const query = createDataTableQuery(state);

    expect(query.requestKey).toBe(
      createDataTableRequestKey({
        version: query.version,
        sorting: query.sorting,
        filters: query.filters,
        globalFilter: query.globalFilter,
        grouping: query.grouping,
        pagination: query.pagination,
      })
    );
    expect(query.requestKey).not.toContain('requestKey');
  });

  it('excludes requestKey when a complete query is passed at runtime', () => {
    const identity = queryIdentity({
      sorting: [{ id: 'name', desc: false }],
    });
    const expected = createDataTableRequestKey(identity);

    expect(
      createDataTableRequestKey({
        ...identity,
        requestKey: 'must-not-be-part-of-the-next-key',
      })
    ).toBe(expected);
  });

  it('rejects explicitly undefined required query members', () => {
    expect(() =>
      createDataTableRequestKey(
        queryIdentity({
          sorting: undefined as never,
        })
      )
    ).toThrow(/sorting/);
    expect(() =>
      createDataTableRequestKey(
        queryIdentity({
          pagination: {
            pageIndex: undefined as never,
            pageSize: 10,
          },
        })
      )
    ).toThrow(/pagination/);
  });
});
