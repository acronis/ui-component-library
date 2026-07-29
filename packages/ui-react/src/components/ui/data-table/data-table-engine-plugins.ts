import type {
  Cell,
  Column,
  Header,
  Row,
  Table,
  TableFeature,
} from '@tanstack/react-table';

import {
  normalizeDataTableEngineOptions,
  TANSTACK_TABLE_OPTION_CLASSIFICATION,
  type DataTableEngineOptions,
} from './data-table-engine-options';

const PLUGIN_SURFACES = [
  'options',
  'state',
  'callbacks',
  'rowModels',
  'actions',
  'metadata',
] as const;

type DataTablePluginSurface = (typeof PLUGIN_SURFACES)[number];
type DataTablePluginPhase =
  'createTable' | 'createHeader' | 'createRow' | 'createCell';

// These namespaces are owned by the adapter/controller contract. Kebab-case
// plugin IDs make prefix checks deterministic and prevent lookalike namespaces.
export const DATA_TABLE_RESERVED_PLUGIN_ID_PREFIXES = [
  'data-table',
  'constructor-lab',
  'tanstack',
] as const;

export const DATA_TABLE_LIBRARY_OWNED_EXTENSION_KEYS = [
  'data-table.options.engine',
  'data-table.options.identity',
  'data-table.state.normalized',
  'data-table.state.query',
  'data-table.callbacks.state-change',
  'data-table.callbacks.query-change',
  'data-table.rowModels.core',
  'data-table.rowModels.final',
  'data-table.actions.reset',
  'data-table.actions.toggle',
  'data-table.actions.scroll',
  'data-table.actions.measure-layout',
  'data-table.metadata.query',
  'data-table.metadata.request-key',
  'data-table.metadata.status',
] as const;

type DataTablePluginRegistrySurface = Readonly<Record<string, unknown>>;

export interface DataTablePluginScopedRegistry {
  readonly options: DataTablePluginRegistrySurface;
  readonly state: DataTablePluginRegistrySurface;
  readonly callbacks: DataTablePluginRegistrySurface;
  readonly rowModels: DataTablePluginRegistrySurface;
  readonly actions: DataTablePluginRegistrySurface;
  readonly metadata: DataTablePluginRegistrySurface;
}

export interface DataTablePrivatePluginRegistry {
  readonly byPlugin: Readonly<
    Record<string, DataTablePluginScopedRegistry | undefined>
  >;
}

interface DataTablePluginFactoryContext<TData> {
  readonly pluginId: string;
  readonly registry: DataTablePluginScopedRegistry;
  readonly row?: Readonly<TData>;
}

type DataTablePluginFactory<TData> = (
  context: DataTablePluginFactoryContext<TData>
) => unknown;

interface DataTablePluginHookContext<TData> {
  readonly pluginId: string;
  readonly phase: DataTablePluginPhase;
  readonly registry: DataTablePluginScopedRegistry;
  readonly row?: Readonly<TData>;
}

type DataTablePluginHook<TData> = (
  context: DataTablePluginHookContext<TData>
) => Readonly<Record<string, unknown>> | void;

export interface DataTableEnginePluginManifest<Id extends string> {
  readonly options: readonly `${Id}.options.${string}`[];
  readonly state: readonly `${Id}.state.${string}`[];
  readonly callbacks: readonly `${Id}.callbacks.${string}`[];
  readonly rowModels: readonly `${Id}.rowModels.${string}`[];
  readonly actions: readonly `${Id}.actions.${string}`[];
  readonly metadata: readonly `${Id}.metadata.${string}`[];
}

export interface DataTablePluginRegistrar<TData> {
  option(localName: string, factory: DataTablePluginFactory<TData>): void;
  state(localName: string, factory: DataTablePluginFactory<TData>): void;
  callback(localName: string, factory: DataTablePluginFactory<TData>): void;
  rowModel(localName: string, factory: DataTablePluginFactory<TData>): void;
  action(localName: string, factory: DataTablePluginFactory<TData>): void;
  metadata(localName: string, factory: DataTablePluginFactory<TData>): void;
  hook(phase: DataTablePluginPhase, hook: DataTablePluginHook<TData>): void;
}

/**
 * Plugin setup, registered factories, and lifecycle hooks are synchronous,
 * pure, deterministic, and safe to replay. React StrictMode and controller
 * preparation may invoke them more than once. Effects belong in explicit
 * post-commit actions exposed by the plugin, never in these callbacks.
 */
export interface DataTableEnginePlugin<TData, Id extends string = string> {
  readonly id: Id;
  readonly actionNamespace: `${Id}.actions`;
  readonly metadataNamespace: `${Id}.metadata`;
  readonly manifest: DataTableEnginePluginManifest<Id>;
  setup(registrar: DataTablePluginRegistrar<TData>): void;
}

export interface DataTablePluginTopology<TData> {
  readonly descriptorIdentities: readonly DataTableEnginePlugin<TData>[];
  readonly setupIdentities: readonly DataTableEnginePlugin<TData>['setup'][];
  readonly fingerprint: string;
  readonly normalizedPlugins: readonly DataTableEnginePlugin<TData>[];
}

export interface DataTableReactExtensions<TData> {
  readonly engineOptions?: DataTableEngineOptions<TData>;
  readonly plugins?: readonly DataTableEnginePlugin<TData>[];
}

interface RecordedPlugin<TData> {
  readonly descriptor: DataTableEnginePlugin<TData>;
  readonly factories: Record<
    DataTablePluginSurface,
    Map<string, DataTablePluginFactory<TData>>
  >;
  readonly hooks: Record<DataTablePluginPhase, DataTablePluginHook<TData>[]>;
}

export interface PreparedDataTableExtensions<TData> {
  readonly engineOptions: DataTableEngineOptions<TData>;
  readonly registry: DataTablePrivatePluginRegistry;
  readonly features: readonly TableFeature<TData>[];
}

const pluginIdPattern = /^[a-z][a-z0-9-]*$/;
const localNamePattern = /^[a-z][a-zA-Z0-9-]*$/;
const libraryOwnedKeys = new Set<string>(
  DATA_TABLE_LIBRARY_OWNED_EXTENSION_KEYS
);
const tanStackOptionKeys = new Set<string>(
  Object.keys(TANSTACK_TABLE_OPTION_CLASSIFICATION)
);

function assertPlainObject(
  value: unknown,
  description: string
): asserts value is Record<string, unknown> {
  if (
    typeof value !== 'object' ||
    value === null ||
    Array.isArray(value) ||
    (Object.getPrototypeOf(value) !== Object.prototype &&
      Object.getPrototypeOf(value) !== null)
  ) {
    throw new TypeError(`${description} must be a plain object.`);
  }
}

function isThenable(value: unknown): value is object {
  return (
    value !== null &&
    (typeof value === 'object' || typeof value === 'function') &&
    'then' in value
  );
}

function snapshotDataProperties(
  value: unknown,
  description: string
): Readonly<Record<string, unknown>> {
  assertPlainObject(value, description);

  const descriptors = Object.getOwnPropertyDescriptors(
    value
  ) as unknown as Record<PropertyKey, PropertyDescriptor>;
  const snapshot = Object.create(null) as Record<string, unknown>;

  for (const key of Reflect.ownKeys(descriptors)) {
    if (typeof key === 'symbol') {
      throw new TypeError(`${description} cannot contain symbol keys.`);
    }

    const descriptor = descriptors[key];

    if (descriptor === undefined) {
      throw new TypeError(`${description} descriptor "${key}" is missing.`);
    }
    if ('get' in descriptor || 'set' in descriptor) {
      throw new TypeError(
        `${description} property "${key}" must be a data property; accessors are not allowed.`
      );
    }

    Object.defineProperty(snapshot, key, {
      configurable: false,
      enumerable: true,
      value: descriptor.value,
      writable: false,
    });
  }

  return Object.freeze(snapshot);
}

function snapshotExactObject(
  value: unknown,
  expected: readonly string[],
  description: string
): Readonly<Record<string, unknown>> {
  const snapshot = snapshotDataProperties(value, description);
  const expectedKeys = new Set(expected);

  for (const key of Object.keys(snapshot)) {
    if (!expectedKeys.has(key)) {
      throw new TypeError(`${description} contains undeclared key "${key}".`);
    }
  }

  for (const key of expected) {
    if (!Object.prototype.hasOwnProperty.call(snapshot, key)) {
      throw new TypeError(`${description} is missing required key "${key}".`);
    }
  }

  return snapshot;
}

function snapshotAllowedObject(
  value: unknown,
  allowed: readonly string[],
  description: string
): Readonly<Record<string, unknown>> {
  const snapshot = snapshotDataProperties(value, description);
  const allowedKeys = new Set(allowed);

  for (const key of Object.keys(snapshot)) {
    if (!allowedKeys.has(key)) {
      throw new TypeError(`${description} contains undeclared key "${key}".`);
    }
  }

  return snapshot;
}

function snapshotArray(
  value: unknown,
  description: string
): readonly unknown[] {
  if (!Array.isArray(value)) {
    throw new TypeError(`${description} must be an array.`);
  }

  const descriptors = Object.getOwnPropertyDescriptors(
    value
  ) as unknown as Record<PropertyKey, PropertyDescriptor>;
  const lengthDescriptor = descriptors.length;

  if (
    lengthDescriptor === undefined ||
    'get' in lengthDescriptor ||
    'set' in lengthDescriptor
  ) {
    throw new TypeError(`${description} has an invalid length descriptor.`);
  }

  const length = lengthDescriptor.value;

  if (!Number.isSafeInteger(length) || length < 0) {
    throw new TypeError(`${description} has an invalid length.`);
  }

  const snapshot: unknown[] = [];

  for (const key of Reflect.ownKeys(descriptors)) {
    if (key === 'length') {
      continue;
    }
    if (typeof key === 'symbol') {
      throw new TypeError(`${description} cannot contain symbol keys.`);
    }
    if (!/^(0|[1-9]\d*)$/.test(key) || Number(key) >= length) {
      throw new TypeError(
        `${description} contains undeclared property "${key}".`
      );
    }

    const descriptor = descriptors[key];

    if (
      descriptor === undefined ||
      'get' in descriptor ||
      'set' in descriptor
    ) {
      throw new TypeError(
        `${description} entry "${key}" must be a data property; accessors are not allowed.`
      );
    }

    snapshot[Number(key)] = descriptor.value;
  }

  if (snapshot.length !== length) {
    throw new TypeError(`${description} cannot contain sparse entries.`);
  }
  for (let index = 0; index < length; index += 1) {
    if (!(index in snapshot)) {
      throw new TypeError(`${description} cannot contain sparse entries.`);
    }
  }

  return Object.freeze(snapshot);
}

function isReservedPluginId(id: string): boolean {
  return DATA_TABLE_RESERVED_PLUGIN_ID_PREFIXES.some(
    (prefix) => id === prefix || id.startsWith(`${prefix}-`)
  );
}

function qualifyPluginKey(
  id: string,
  surface: DataTablePluginSurface,
  localName: string
): string {
  if (!localNamePattern.test(localName)) {
    throw new TypeError(
      `DataTable plugin "${id}" ${surface} local name "${localName}" is invalid.`
    );
  }

  if (surface === 'options' && tanStackOptionKeys.has(localName)) {
    throw new TypeError(
      `DataTable plugin "${id}" cannot register TanStack option "${localName}".`
    );
  }

  return `${id}.${surface}.${localName}`;
}

export function inspectDataTablePluginTopology<TData>(
  input: unknown
): DataTablePluginTopology<TData> {
  const candidates = snapshotArray(input, 'DataTable plugins');
  const plugins = candidates.map((candidate, index) => {
    const descriptor = snapshotExactObject(
      candidate,
      ['id', 'actionNamespace', 'metadataNamespace', 'manifest', 'setup'],
      `DataTable plugin descriptor at index ${index}`
    );
    const manifest = snapshotExactObject(
      descriptor.manifest,
      PLUGIN_SURFACES,
      `DataTable plugin manifest at index ${index}`
    );
    const manifestSnapshot = Object.fromEntries(
      PLUGIN_SURFACES.map((surface) => [
        surface,
        snapshotArray(
          manifest[surface],
          `DataTable plugin manifest.${surface} at index ${index}`
        ),
      ])
    );

    return Object.freeze({
      id: descriptor.id,
      actionNamespace: descriptor.actionNamespace,
      metadataNamespace: descriptor.metadataNamespace,
      manifest: Object.freeze(manifestSnapshot),
      setup: descriptor.setup,
    }) as unknown as DataTableEnginePlugin<TData>;
  });

  const pluginIds = new Set<string>();
  const namespaces = new Set<string>();
  const manifestKeys = new Set<string>();

  for (const plugin of plugins) {
    const { id, actionNamespace, metadataNamespace, manifest, setup } = plugin;

    if (typeof id !== 'string' || !pluginIdPattern.test(id)) {
      throw new TypeError(
        'DataTable plugin id must be lowercase kebab-case and begin with a letter.'
      );
    }

    if (isReservedPluginId(id)) {
      throw new TypeError(
        `DataTable plugin id "${id}" uses a reserved prefix.`
      );
    }

    if (pluginIds.has(id)) {
      throw new TypeError(`Duplicate DataTable plugin id "${id}".`);
    }
    pluginIds.add(id);

    for (const namespace of [actionNamespace, metadataNamespace]) {
      if (typeof namespace === 'string' && namespaces.has(namespace)) {
        throw new TypeError(
          `Duplicate DataTable plugin namespace "${namespace}".`
        );
      }
    }

    if (actionNamespace !== `${id}.actions`) {
      throw new TypeError(
        `DataTable plugin "${id}" actionNamespace must equal "${id}.actions".`
      );
    }
    if (metadataNamespace !== `${id}.metadata`) {
      throw new TypeError(
        `DataTable plugin "${id}" metadataNamespace must equal "${id}.metadata".`
      );
    }

    for (const namespace of [actionNamespace, metadataNamespace]) {
      namespaces.add(namespace);
    }

    if (typeof setup !== 'function') {
      throw new TypeError(`DataTable plugin "${id}" setup must be a function.`);
    }

    const pluginManifestKeys = new Set<string>();

    for (const surface of PLUGIN_SURFACES) {
      const entries = manifest[surface];

      for (const entry of entries) {
        if (typeof entry !== 'string') {
          throw new TypeError(
            `DataTable plugin "${id}" manifest.${surface} entries must be strings.`
          );
        }

        if (pluginManifestKeys.has(entry)) {
          throw new TypeError(
            `DataTable plugin "${id}" has duplicate manifest key "${entry}".`
          );
        }
        pluginManifestKeys.add(entry);

        if (libraryOwnedKeys.has(entry)) {
          throw new TypeError(
            `DataTable plugin "${id}" manifest key "${entry}" is library-owned.`
          );
        }

        if (manifestKeys.has(entry)) {
          throw new TypeError(
            `DataTable plugin manifest key "${entry}" collides across plugins.`
          );
        }

        const prefix = `${id}.${surface}.`;

        if (!entry.startsWith(prefix)) {
          throw new TypeError(
            `DataTable plugin "${id}" manifest key "${entry}" must be namespaced under "${prefix}".`
          );
        }

        const localName = entry.slice(prefix.length);
        const qualified = qualifyPluginKey(id, surface, localName);

        if (qualified !== entry) {
          throw new TypeError(
            `DataTable plugin "${id}" manifest key "${entry}" is invalid.`
          );
        }

        manifestKeys.add(entry);
      }
    }
  }

  const normalizedPlugins = Object.freeze(plugins);
  const descriptorIdentities = Object.freeze([
    ...candidates,
  ] as DataTableEnginePlugin<TData>[]);
  const setupIdentities = Object.freeze(
    normalizedPlugins.map((plugin) => plugin.setup)
  );
  const fingerprint = JSON.stringify(
    normalizedPlugins.map(
      ({ id, actionNamespace, metadataNamespace, manifest }) => ({
        id,
        actionNamespace,
        metadataNamespace,
        manifest,
      })
    )
  );

  return Object.freeze({
    descriptorIdentities,
    setupIdentities,
    fingerprint,
    normalizedPlugins,
  });
}

function createRecordedPlugin<TData>(
  descriptor: DataTableEnginePlugin<TData>
): RecordedPlugin<TData> {
  const factories = Object.fromEntries(
    PLUGIN_SURFACES.map((surface) => [surface, new Map()])
  ) as RecordedPlugin<TData>['factories'];
  const hooks: RecordedPlugin<TData>['hooks'] = {
    createTable: [],
    createHeader: [],
    createRow: [],
    createCell: [],
  };
  let recording = true;

  const register = (
    surface: DataTablePluginSurface,
    localName: string,
    factory: DataTablePluginFactory<TData>
  ): void => {
    if (!recording) {
      throw new TypeError(
        `DataTable plugin "${descriptor.id}" registrar is closed.`
      );
    }
    if (typeof factory !== 'function') {
      throw new TypeError(
        `DataTable plugin "${descriptor.id}" ${surface} factory must be a function.`
      );
    }

    const key = qualifyPluginKey(descriptor.id, surface, localName);
    const declared = new Set<string>(descriptor.manifest[surface]);

    if (!declared.has(key)) {
      throw new TypeError(
        `DataTable plugin "${descriptor.id}" registered undeclared key "${key}".`
      );
    }
    if (factories[surface].has(key)) {
      throw new TypeError(
        `DataTable plugin "${descriptor.id}" registered duplicate key "${key}".`
      );
    }

    factories[surface].set(key, factory);
  };

  const registrar: DataTablePluginRegistrar<TData> = {
    option: (name: string, factory: DataTablePluginFactory<TData>): void =>
      register('options', name, factory),
    state: (name: string, factory: DataTablePluginFactory<TData>): void =>
      register('state', name, factory),
    callback: (name: string, factory: DataTablePluginFactory<TData>): void =>
      register('callbacks', name, factory),
    rowModel: (name: string, factory: DataTablePluginFactory<TData>): void =>
      register('rowModels', name, factory),
    action: (name: string, factory: DataTablePluginFactory<TData>): void =>
      register('actions', name, factory),
    metadata: (name: string, factory: DataTablePluginFactory<TData>): void =>
      register('metadata', name, factory),
    hook: (
      phase: DataTablePluginPhase,
      hook: DataTablePluginHook<TData>
    ): void => {
      if (!recording) {
        throw new TypeError(
          `DataTable plugin "${descriptor.id}" registrar is closed.`
        );
      }
      if (!Object.prototype.hasOwnProperty.call(hooks, phase)) {
        throw new TypeError(
          `DataTable plugin "${descriptor.id}" hook phase "${phase}" is invalid.`
        );
      }
      if (typeof hook !== 'function') {
        throw new TypeError(
          `DataTable plugin "${descriptor.id}" hook must be a function.`
        );
      }
      hooks[phase].push(hook);
    },
  };
  Object.freeze(registrar);

  let setupResult: unknown;

  try {
    setupResult = (
      descriptor.setup as (value: DataTablePluginRegistrar<TData>) => unknown
    )(registrar);
  } finally {
    recording = false;
  }

  if (isThenable(setupResult)) {
    throw new TypeError(
      `DataTable plugin "${descriptor.id}" setup must be synchronous.`
    );
  }

  for (const surface of PLUGIN_SURFACES) {
    const registeredKeys = new Set(factories[surface].keys());

    for (const declaredKey of descriptor.manifest[surface]) {
      if (!registeredKeys.has(declaredKey)) {
        throw new TypeError(
          `DataTable plugin "${descriptor.id}" did not register declared key "${declaredKey}".`
        );
      }
    }
  }

  return { descriptor, factories, hooks };
}

interface MutationTracker {
  attempted: boolean;
}

function createReadonlyView(
  value: unknown,
  tracker: MutationTracker,
  cache = new WeakMap<object, unknown>()
): unknown {
  if (
    (typeof value !== 'object' || value === null) &&
    typeof value !== 'function'
  ) {
    return value;
  }

  if (cache.has(value)) {
    return cache.get(value);
  }

  const rejectMutation = (): false => {
    tracker.attempted = true;
    return false;
  };
  const proxy = new Proxy(value, {
    defineProperty: rejectMutation,
    deleteProperty: rejectMutation,
    get(target, property, receiver) {
      return createReadonlyView(
        Reflect.get(target, property, receiver),
        tracker,
        cache
      );
    },
    preventExtensions: rejectMutation,
    set: rejectMutation,
    setPrototypeOf: rejectMutation,
  });
  cache.set(value, proxy);

  return proxy;
}

function invokeWithReadonlyContext<Result>(
  callback: (context: never) => Result,
  context: object,
  pluginId: string
): Result {
  const tracker: MutationTracker = { attempted: false };
  const result = callback(createReadonlyView(context, tracker) as never);

  if (tracker.attempted) {
    throw new TypeError(
      `DataTable plugin "${pluginId}" attempted to mutate a read-only context.`
    );
  }

  return result;
}

function buildPluginRegistry<TData>(
  plugins: readonly RecordedPlugin<TData>[]
): DataTablePrivatePluginRegistry {
  const byPlugin: Record<string, DataTablePluginScopedRegistry> = {};

  for (const plugin of plugins) {
    const mutableRegistry = Object.fromEntries(
      PLUGIN_SURFACES.map((surface) => [surface, {}])
    ) as Record<DataTablePluginSurface, Record<string, unknown>>;

    for (const surface of PLUGIN_SURFACES) {
      for (const [key, factory] of plugin.factories[surface]) {
        const context: DataTablePluginFactoryContext<TData> = {
          pluginId: plugin.descriptor.id,
          registry: mutableRegistry,
        };
        const value = invokeWithReadonlyContext(
          factory,
          context,
          plugin.descriptor.id
        );

        if (isThenable(value)) {
          throw new TypeError(
            `DataTable plugin "${plugin.descriptor.id}" ${surface} factory must be synchronous.`
          );
        }

        mutableRegistry[surface][key] = value;
      }
    }

    for (const surface of PLUGIN_SURFACES) {
      Object.freeze(mutableRegistry[surface]);
    }
    byPlugin[plugin.descriptor.id] = Object.freeze(mutableRegistry);
  }

  return Object.freeze({ byPlugin: Object.freeze(byPlugin) });
}

function createDerivedFeature<TData>(
  plugins: readonly RecordedPlugin<TData>[],
  registry: DataTablePrivatePluginRegistry
): TableFeature<TData> {
  const runHooks = (phase: DataTablePluginPhase, target: object): void => {
    const additions = new Map<string, unknown>();

    for (const plugin of plugins) {
      const scopedRegistry = registry.byPlugin[plugin.descriptor.id];

      if (scopedRegistry === undefined) {
        throw new TypeError(
          `DataTable plugin "${plugin.descriptor.id}" registry is missing.`
        );
      }

      const declaredKeys = new Set<string>(
        PLUGIN_SURFACES.flatMap(
          (surface) => plugin.descriptor.manifest[surface]
        )
      );

      for (const hook of plugin.hooks[phase]) {
        const output = invokeWithReadonlyContext(
          hook,
          {
            pluginId: plugin.descriptor.id,
            phase,
            registry: scopedRegistry,
          },
          plugin.descriptor.id
        );

        if (output === undefined) {
          continue;
        }
        if (isThenable(output)) {
          throw new TypeError(
            `DataTable plugin "${plugin.descriptor.id}" ${phase} hook must be synchronous.`
          );
        }

        const outputSnapshot = snapshotDataProperties(
          output,
          `DataTable plugin "${plugin.descriptor.id}" ${phase} hook output`
        );

        for (const [key, value] of Object.entries(outputSnapshot)) {
          if (!declaredKeys.has(key)) {
            throw new TypeError(
              `DataTable plugin "${plugin.descriptor.id}" produced undeclared runtime key "${key}".`
            );
          }
          if (
            libraryOwnedKeys.has(key) ||
            additions.has(key) ||
            key in target
          ) {
            throw new TypeError(
              `DataTable plugin runtime key "${key}" collides with an existing surface.`
            );
          }
          additions.set(key, value);
        }
      }
    }

    for (const [key, value] of additions) {
      Object.defineProperty(target, key, {
        configurable: false,
        enumerable: false,
        value,
        writable: false,
      });
    }
  };

  return {
    createTable: (table: Table<TData>) => runHooks('createTable', table),
    createHeader: (header: Header<TData, unknown>) =>
      runHooks('createHeader', header),
    createRow: (row: Row<TData>) => runHooks('createRow', row),
    createCell: (
      cell: Cell<TData, unknown>,
      _column: Column<TData>,
      _row: Row<TData>,
      _table: Table<TData>
    ) => runHooks('createCell', cell),
  };
}

export function prepareDataTableExtensions<TData>(
  extensions: DataTableReactExtensions<TData>,
  inspectedTopology?: DataTablePluginTopology<TData>
): PreparedDataTableExtensions<TData> {
  const extensionSnapshot = snapshotAllowedObject(
    extensions,
    ['engineOptions', 'plugins'],
    'DataTable React extensions'
  );
  const engineOptions = extensionSnapshot.engineOptions as
    DataTableEngineOptions<TData> | undefined;
  const pluginInput = extensionSnapshot.plugins ?? [];
  const normalizedEngineOptions =
    normalizeDataTableEngineOptions(engineOptions);
  const plugins =
    inspectedTopology?.normalizedPlugins ??
    inspectDataTablePluginTopology<TData>(pluginInput).normalizedPlugins;
  const recordedPlugins = plugins.map((plugin) =>
    createRecordedPlugin<TData>(plugin)
  );
  const registry = buildPluginRegistry(recordedPlugins);
  const features: TableFeature<TData>[] =
    recordedPlugins.length === 0
      ? []
      : [createDerivedFeature(recordedPlugins, registry)];

  return Object.freeze({
    engineOptions: normalizedEngineOptions,
    registry,
    features: Object.freeze(features),
  });
}
