import {
  assertDataTableStateIntegrity,
  type DataTableQuery,
  type DataTableState,
  type SerializableValue,
} from './data-table-contract';

type QueryIdentity = Omit<DataTableQuery, 'requestKey'>;

function assertQueryIdentity(
  query: QueryIdentity | DataTableQuery
): asserts query is QueryIdentity | DataTableQuery {
  const requiredMembers = [
    'version',
    'sorting',
    'filters',
    'grouping',
    'pagination',
  ] as const;

  for (const member of requiredMembers) {
    if (query[member] === undefined) {
      throw new TypeError(
        `DataTable query member "${member}" cannot be undefined.`
      );
    }
  }

  if (
    query.pagination.pageIndex === undefined ||
    query.pagination.pageSize === undefined
  ) {
    throw new TypeError(
      'DataTable query pagination requires pageIndex and pageSize.'
    );
  }
}

function unsupportedValue(value: unknown): never {
  const description =
    typeof value === 'number'
      ? String(value)
      : Object.prototype.toString.call(value);

  throw new TypeError(
    `DataTable request values must be finite JSON data; received ${description}.`
  );
}

function serializeCanonicalValue(
  value: unknown,
  ancestors: Set<object>,
  inArray: boolean
): string | undefined {
  if (value === undefined) {
    if (inArray) {
      unsupportedValue(value);
    }

    return undefined;
  }

  if (
    value === null ||
    typeof value === 'boolean' ||
    typeof value === 'string'
  ) {
    return JSON.stringify(value);
  }

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      unsupportedValue(value);
    }

    return JSON.stringify(value);
  }

  if (typeof value !== 'object') {
    unsupportedValue(value);
  }

  if (ancestors.has(value)) {
    throw new TypeError('DataTable request values cannot contain cycles.');
  }

  ancestors.add(value);

  try {
    if (Array.isArray(value)) {
      const entries: string[] = [];

      for (let index = 0; index < value.length; index += 1) {
        if (!(index in value)) {
          unsupportedValue(undefined);
        }

        const entry = value[index];
        const serialized = serializeCanonicalValue(entry, ancestors, true);

        if (serialized === undefined) {
          unsupportedValue(entry);
        }

        entries.push(serialized);
      }

      return `[${entries.join(',')}]`;
    }

    const prototype = Object.getPrototypeOf(value);

    if (prototype !== Object.prototype && prototype !== null) {
      return unsupportedValue(value);
    }

    const symbolKeys = Object.getOwnPropertySymbols(value);

    if (symbolKeys.length > 0) {
      return unsupportedValue(symbolKeys[0]);
    }

    const entries: string[] = [];

    for (const key of Object.keys(value).sort()) {
      const serialized = serializeCanonicalValue(
        (value as Record<string, unknown>)[key],
        ancestors,
        false
      );

      if (serialized !== undefined) {
        entries.push(`${JSON.stringify(key)}:${serialized}`);
      }
    }

    return `{${entries.join(',')}}`;
  } finally {
    ancestors.delete(value);
  }
}

function serializeCanonicalRequest(value: unknown): string {
  const serialized = serializeCanonicalValue(value, new Set(), false);

  if (serialized === undefined) {
    return unsupportedValue(value);
  }

  return serialized;
}

export function serializeDataTableRequest(value: SerializableValue): string {
  return serializeCanonicalRequest(value);
}

export function createDataTableRequestKey(
  query: QueryIdentity | DataTableQuery
): string {
  assertQueryIdentity(query);

  return serializeCanonicalRequest({
    version: query.version,
    sorting: query.sorting,
    filters: query.filters,
    ...(query.globalFilter === undefined
      ? {}
      : { globalFilter: query.globalFilter }),
    grouping: query.grouping,
    pagination: query.pagination,
  });
}

export function createDataTableQuery<RowId extends string>(
  state: DataTableState<RowId>
): DataTableQuery {
  assertDataTableStateIntegrity(state);

  const identity: QueryIdentity = {
    version: 1,
    sorting: state.sorting,
    filters: state.columnFilters,
    ...(state.globalFilter === undefined
      ? {}
      : { globalFilter: state.globalFilter }),
    grouping: state.grouping,
    pagination: state.pagination,
  };

  return {
    ...identity,
    requestKey: createDataTableRequestKey(identity),
  };
}
