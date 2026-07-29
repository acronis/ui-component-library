import type { TableFeature, TableOptions } from '@tanstack/react-table';
import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest';

import {
  DATA_TABLE_SAFE_ENGINE_OPTION_KEYS,
  normalizeDataTableEngineOptions,
  TANSTACK_TABLE_OPTION_CLASSIFICATION,
  type DataTableEngineOptions,
  type DataTableSafeEngineOptionKey,
} from '../data-table-engine-options';
import type { DataTableReactExtensions } from '../data-table-engine-plugins';

interface Person {
  id: string;
}

type RejectedTableOptionKey = Exclude<
  keyof TableOptions<Person>,
  DataTableSafeEngineOptionKey
>;

describe('DataTable engine option boundary', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('exposes exactly the seven reviewed option keys at compile time', () => {
    expectTypeOf<keyof DataTableEngineOptions<Person>>().toEqualTypeOf<
      | 'debugAll'
      | 'debugCells'
      | 'debugColumns'
      | 'debugHeaders'
      | 'debugRows'
      | 'debugTable'
      | 'renderFallbackValue'
    >();
    expectTypeOf<
      keyof typeof TANSTACK_TABLE_OPTION_CLASSIFICATION
    >().toEqualTypeOf<keyof TableOptions<Person>>();
    expectTypeOf<RejectedTableOptionKey>().not.toEqualTypeOf<
      keyof DataTableEngineOptions<Person>
    >();
    expectTypeOf<DataTableEngineOptions<Person>>().not.toHaveProperty(
      'plugins'
    );
    expectTypeOf<
      DataTableReactExtensions<Person>['plugins']
    >().not.toEqualTypeOf<readonly TableFeature<Person>[]>();
  });

  it('accepts and preserves all seven reviewed keys', () => {
    const options: DataTableEngineOptions<Person> = {
      debugAll: true,
      debugCells: true,
      debugColumns: true,
      debugHeaders: true,
      debugRows: true,
      debugTable: true,
      renderFallbackValue: '—',
    };

    expect(normalizeDataTableEngineOptions(options)).toEqual(options);
    expect(Object.keys(options).sort()).toEqual(
      [...DATA_TABLE_SAFE_ENGINE_OPTION_KEYS].sort()
    );
  });

  it('classifies every installed TanStack key and rejects every non-allowlisted key', () => {
    expect(Object.keys(TANSTACK_TABLE_OPTION_CLASSIFICATION)).toHaveLength(84);

    for (const environment of ['development', 'production']) {
      vi.stubEnv('NODE_ENV', environment);

      for (const [key, classification] of Object.entries(
        TANSTACK_TABLE_OPTION_CLASSIFICATION
      )) {
        if (classification.startsWith('safe-')) {
          expect(() =>
            normalizeDataTableEngineOptions({ [key]: undefined })
          ).not.toThrow();
        } else {
          expect(() =>
            normalizeDataTableEngineOptions({ [key]: undefined })
          ).toThrow(new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
        }
      }
    }
  });

  it.each([
    ['nested plugins', { plugins: [] }],
    ['unknown keys', { arbitrary: true }],
    ['raw features', { createTable: () => undefined }],
    ['symbol keys', { [Symbol('engine')]: true }],
  ])('rejects %s before engine construction', (_, input) => {
    expect(() =>
      normalizeDataTableEngineOptions(input as DataTableEngineOptions<Person>)
    ).toThrow(TypeError);
  });

  it('inspects non-enumerable keys and rejects accessors without invoking them', () => {
    const nonEnumerable = {};
    Object.defineProperty(nonEnumerable, 'state', {
      enumerable: false,
      value: {},
    });
    const getter = vi.fn(() => true);
    const accessor = {};
    Object.defineProperty(accessor, 'debugTable', {
      enumerable: false,
      get: getter,
    });

    expect(() =>
      normalizeDataTableEngineOptions(
        nonEnumerable as DataTableEngineOptions<Person>
      )
    ).toThrow(/state/);
    expect(() =>
      normalizeDataTableEngineOptions(
        accessor as DataTableEngineOptions<Person>
      )
    ).toThrow(/accessors/);
    expect(getter).not.toHaveBeenCalled();
  });

  it('preserves an own __proto__ key long enough to reject it', () => {
    const input = {};
    Object.defineProperty(input, '__proto__', {
      enumerable: false,
      value: { debugTable: true },
    });

    expect(() =>
      normalizeDataTableEngineOptions(input as DataTableEngineOptions<Person>)
    ).toThrow(/__proto__/);
  });

  it('snapshots proxy descriptors without invoking property get traps', () => {
    const get = vi.fn();
    const input = new Proxy(
      { debugTable: true },
      {
        get,
      }
    );

    expect(normalizeDataTableEngineOptions(input)).toEqual({
      debugTable: true,
    });
    expect(get).not.toHaveBeenCalled();
  });

  it.each([
    ['raw feature', { createTable: () => undefined }],
    ['unknown option', { arbitrary: true }],
    ['nested plugins', { plugins: [] }],
  ])('rejects %s input in production', (_, input) => {
    vi.stubEnv('NODE_ENV', 'production');

    expect(() =>
      normalizeDataTableEngineOptions(
        input as unknown as DataTableEngineOptions<Person>
      )
    ).toThrow(TypeError);
  });
});
