import type { Table, TableFeature } from '@tanstack/react-table';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  DATA_TABLE_LIBRARY_OWNED_EXTENSION_KEYS,
  DATA_TABLE_RESERVED_PLUGIN_ID_PREFIXES,
  prepareDataTableExtensions,
  type DataTableEnginePlugin,
  type DataTablePluginRegistrar,
  type DataTableReactExtensions,
} from '../data-table-engine-plugins';

interface Person {
  id: string;
}

const emptyManifest = {
  options: [],
  state: [],
  callbacks: [],
  rowModels: [],
  actions: [],
  metadata: [],
} as const;

function createPlugin(
  overrides: Record<string, unknown> = {}
): DataTableEnginePlugin<Person> {
  return {
    id: 'audit',
    actionNamespace: 'audit.actions',
    metadataNamespace: 'audit.metadata',
    manifest: emptyManifest,
    setup: () => undefined,
    ...overrides,
  } as unknown as DataTableEnginePlugin<Person>;
}

function prepare(plugin: DataTableEnginePlugin<Person>) {
  return prepareDataTableExtensions<Person>({ plugins: [plugin] });
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('DataTable plugin descriptor preflight', () => {
  it.each([
    ['invalid id grammar', { id: '_audit' }],
    ['reserved data-table id', { id: 'data-table-audit' }],
    ['reserved constructor-lab id', { id: 'constructor-lab-audit' }],
    ['reserved tanstack id', { id: 'tanstack-audit' }],
    ['wrong action namespace', { actionNamespace: 'audit.commands' }],
    ['wrong metadata namespace', { metadataNamespace: 'audit.meta' }],
    ['missing manifest', { manifest: undefined }],
    ['non-function setup', { setup: true }],
  ])('rejects %s', (_, overrides) => {
    expect(() => prepare(createPlugin(overrides))).toThrow(TypeError);
  });

  it('commits explicit reserved prefixes and library-owned collision keys', () => {
    expect(DATA_TABLE_RESERVED_PLUGIN_ID_PREFIXES).toEqual([
      'data-table',
      'constructor-lab',
      'tanstack',
    ]);
    expect(DATA_TABLE_LIBRARY_OWNED_EXTENSION_KEYS).toContain(
      'data-table.actions.reset'
    );
    expect(DATA_TABLE_LIBRARY_OWNED_EXTENSION_KEYS).toContain(
      'data-table.metadata.request-key'
    );
  });

  it('rejects duplicate plugin IDs before setup', () => {
    const setup = vi.fn();
    const plugin = createPlugin({ setup });

    expect(() =>
      prepareDataTableExtensions({ plugins: [plugin, plugin] })
    ).toThrow(/Duplicate.*id/);
    expect(setup).not.toHaveBeenCalled();
  });

  it.each([
    ['action', { actionNamespace: 'audit.actions' }],
    ['metadata', { metadataNamespace: 'audit.metadata' }],
  ])('rejects duplicate %s namespaces before setup', (_, overrides) => {
    const firstSetup = vi.fn();
    const secondSetup = vi.fn();
    const first = createPlugin({ setup: firstSetup });
    const second = createPlugin({
      id: 'metrics',
      actionNamespace: 'metrics.actions',
      metadataNamespace: 'metrics.metadata',
      setup: secondSetup,
      ...overrides,
    });

    expect(() =>
      prepareDataTableExtensions({ plugins: [first, second] })
    ).toThrow(/Duplicate.*namespace/);
    expect(firstSetup).not.toHaveBeenCalled();
    expect(secondSetup).not.toHaveBeenCalled();
  });

  it.each([
    ['bare option key', { options: ['debugTable'] }],
    ['wrong plugin namespace', { actions: ['other.actions.refresh'] }],
    ['unnamespaced action', { actions: ['refresh'] }],
    ['unnamespaced metadata', { metadata: ['status'] }],
    ['namespaced TanStack option', { options: ['audit.options.debugTable'] }],
    [
      'duplicate manifest entry',
      {
        actions: ['audit.actions.refresh', 'audit.actions.refresh'],
      },
    ],
    ['unknown manifest surface', { hooks: [] }],
  ])('rejects %s manifests', (_, manifestOverrides) => {
    expect(() =>
      prepare(
        createPlugin({
          manifest: { ...emptyManifest, ...manifestOverrides },
        })
      )
    ).toThrow(TypeError);
  });

  it('rejects a cross-plugin manifest collision attempt before setup', () => {
    const firstSetup = vi.fn();
    const secondSetup = vi.fn();
    const first = createPlugin({
      manifest: {
        ...emptyManifest,
        actions: ['audit.actions.refresh'],
      },
      setup: firstSetup,
    });
    const second = createPlugin({
      id: 'metrics',
      actionNamespace: 'metrics.actions',
      metadataNamespace: 'metrics.metadata',
      manifest: {
        ...emptyManifest,
        actions: ['audit.actions.refresh'],
      },
      setup: secondSetup,
    });

    expect(() =>
      prepareDataTableExtensions({ plugins: [first, second] })
    ).toThrow(TypeError);
    expect(firstSetup).not.toHaveBeenCalled();
    expect(secondSetup).not.toHaveBeenCalled();
  });

  it('rejects an explicit library-owned manifest collision before setup', () => {
    const setup = vi.fn();

    expect(() =>
      prepare(
        createPlugin({
          manifest: {
            ...emptyManifest,
            actions: [DATA_TABLE_LIBRARY_OWNED_EXTENSION_KEYS[8]],
          },
          setup,
        })
      )
    ).toThrow(/library-owned/);
    expect(setup).not.toHaveBeenCalled();
  });

  it('rejects raw TableFeature descriptors', () => {
    const rawFeature: TableFeature<Person> = {
      createTable: () => undefined,
    };

    expect(() =>
      prepareDataTableExtensions({
        plugins: [rawFeature] as unknown as DataTableEnginePlugin<Person>[],
      })
    ).toThrow(/descriptor/);
  });

  it('keeps descriptor rejection enabled in production', () => {
    vi.stubEnv('NODE_ENV', 'production');

    expect(() => prepare(createPlugin({ id: 'data-table-owned' }))).toThrow(
      /reserved prefix/
    );
  });

  it('rejects non-enumerable descriptor and manifest properties', () => {
    const descriptor = createPlugin();
    Object.defineProperty(descriptor, 'hidden', {
      enumerable: false,
      value: true,
    });
    const manifest = { ...emptyManifest };
    Object.defineProperty(manifest, 'hidden', {
      enumerable: false,
      value: true,
    });

    expect(() => prepare(descriptor)).toThrow(/hidden/);
    expect(() => prepare(createPlugin({ manifest }))).toThrow(/hidden/);
  });

  it('rejects own __proto__ keys without invoking a poisoned prototype getter', () => {
    const prototypeGetter = vi.fn(() => []);
    const poisonedPrototype = {};
    Object.defineProperty(poisonedPrototype, 'plugins', {
      get: prototypeGetter,
    });

    const extensions = {};
    Object.defineProperty(extensions, '__proto__', {
      enumerable: false,
      value: poisonedPrototype,
    });

    const descriptor = createPlugin();
    Object.defineProperty(descriptor, '__proto__', {
      enumerable: false,
      value: poisonedPrototype,
    });

    const manifest = { ...emptyManifest };
    Object.defineProperty(manifest, '__proto__', {
      enumerable: false,
      value: poisonedPrototype,
    });

    expect(() =>
      prepareDataTableExtensions<Person>(
        extensions as DataTableReactExtensions<Person>
      )
    ).toThrow(/__proto__/);
    expect(() => prepare(descriptor)).toThrow(/__proto__/);
    expect(() => prepare(createPlugin({ manifest }))).toThrow(/__proto__/);
    expect(prototypeGetter).not.toHaveBeenCalled();
  });

  it('rejects symbol keys on descriptors and manifests', () => {
    const descriptor = createPlugin();
    Object.defineProperty(descriptor, Symbol('descriptor'), {
      value: true,
    });
    const manifest = { ...emptyManifest };
    Object.defineProperty(manifest, Symbol('manifest'), {
      value: true,
    });

    expect(() => prepare(descriptor)).toThrow(/symbol keys/);
    expect(() => prepare(createPlugin({ manifest }))).toThrow(/symbol keys/);
  });

  it('rejects descriptor, manifest, and array accessors without invoking them', () => {
    const descriptorGetter = vi.fn(() => 'audit');
    const descriptor = createPlugin();
    Object.defineProperty(descriptor, 'id', {
      configurable: true,
      get: descriptorGetter,
    });

    const manifestGetter = vi.fn(() => []);
    const manifest = { ...emptyManifest };
    Object.defineProperty(manifest, 'actions', {
      configurable: true,
      get: manifestGetter,
    });

    const entryGetter = vi.fn(() => 'audit.actions.refresh');
    const actions: string[] = [];
    Object.defineProperty(actions, '0', {
      configurable: true,
      enumerable: true,
      get: entryGetter,
    });
    actions.length = 1;

    expect(() => prepare(descriptor)).toThrow(/accessors/);
    expect(() => prepare(createPlugin({ manifest }))).toThrow(/accessors/);
    expect(() =>
      prepare(
        createPlugin({
          manifest: { ...emptyManifest, actions },
        })
      )
    ).toThrow(/accessors/);
    expect(descriptorGetter).not.toHaveBeenCalled();
    expect(manifestGetter).not.toHaveBeenCalled();
    expect(entryGetter).not.toHaveBeenCalled();
  });

  it('does not invoke descriptor property get traps while snapshotting a proxy', () => {
    const get = vi.fn();
    const descriptor = new Proxy(createPlugin(), { get });

    expect(() => prepare(descriptor)).not.toThrow();
    expect(get).not.toHaveBeenCalled();
  });

  it('snapshots every descriptor and manifest before any setup mutation', () => {
    const auditManifest = {
      ...emptyManifest,
      actions: ['audit.actions.refresh'],
    };
    const metricsManifest = {
      ...emptyManifest,
      metadata: ['metrics.metadata.status'],
    };
    const metricsSetup = vi.fn(
      (registrar: DataTablePluginRegistrar<Person>) => {
        registrar.metadata('status', () => 'ready');
      }
    );
    const metrics = createPlugin({
      id: 'metrics',
      actionNamespace: 'metrics.actions',
      metadataNamespace: 'metrics.metadata',
      manifest: metricsManifest,
      setup: metricsSetup,
    });
    const audit = createPlugin({
      manifest: auditManifest,
      setup(registrar: DataTablePluginRegistrar<Person>) {
        auditManifest.actions.length = 0;
        metricsManifest.metadata.length = 0;
        (
          metrics as unknown as {
            setup: (registrar: DataTablePluginRegistrar<Person>) => void;
          }
        ).setup = () => {
          throw new Error('mutated setup must not run');
        };
        registrar.action('refresh', () => 'refresh');
      },
    });

    const prepared = prepareDataTableExtensions<Person>({
      plugins: [audit, metrics],
    });

    expect(metricsSetup).toHaveBeenCalled();
    expect(prepared.registry.byPlugin.audit?.actions).toHaveProperty(
      'audit.actions.refresh'
    );
    expect(prepared.registry.byPlugin.metrics?.metadata).toEqual({
      'metrics.metadata.status': 'ready',
    });
  });
});

describe('DataTable recording registrar', () => {
  it('rejects undeclared and duplicate registrations', () => {
    expect(() =>
      prepare(
        createPlugin({
          setup(registrar: DataTablePluginRegistrar<Person>) {
            registrar.action('refresh', () => undefined);
          },
        })
      )
    ).toThrow(/undeclared/);

    expect(() =>
      prepare(
        createPlugin({
          manifest: {
            ...emptyManifest,
            actions: ['audit.actions.refresh'],
          },
          setup(registrar: DataTablePluginRegistrar<Person>) {
            registrar.action('refresh', () => undefined);
            registrar.action('refresh', () => undefined);
          },
        })
      )
    ).toThrow(/duplicate/);
  });

  it('rejects missing declared registrations and asynchronous setup', () => {
    expect(() =>
      prepare(
        createPlugin({
          manifest: {
            ...emptyManifest,
            metadata: ['audit.metadata.status'],
          },
        })
      )
    ).toThrow(/did not register/);

    expect(() =>
      prepare(
        createPlugin({
          setup: async () => undefined,
        })
      )
    ).toThrow(/synchronous/);
    expect(() =>
      prepare(
        createPlugin({
          setup: () => ({ then: () => undefined }),
        })
      )
    ).toThrow(/synchronous/);
  });

  it('rejects asynchronous factories before exposing a registry', () => {
    expect(() =>
      prepare(
        createPlugin({
          manifest: {
            ...emptyManifest,
            metadata: ['audit.metadata.status'],
          },
          setup(registrar: DataTablePluginRegistrar<Person>) {
            registrar.metadata('status', async () => 'ready');
          },
        })
      )
    ).toThrow(/factory must be synchronous/);
  });

  it('closes a retained registrar after deterministic setup', () => {
    let retained: DataTablePluginRegistrar<Person> | undefined;
    prepare(
      createPlugin({
        setup(registrar: DataTablePluginRegistrar<Person>) {
          retained = registrar;
        },
      })
    );

    expect(() => retained?.action('late', () => undefined)).toThrow(/closed/);
  });

  it('keeps the registrar closed while registered factories run', () => {
    let retained: DataTablePluginRegistrar<Person> | undefined;
    const plugin = createPlugin({
      manifest: {
        ...emptyManifest,
        metadata: ['audit.metadata.status'],
      },
      setup(registrar: DataTablePluginRegistrar<Person>) {
        retained = registrar;
        registrar.metadata('status', () => {
          retained?.action('late', () => undefined);
          return 'ready';
        });
      },
    });

    expect(() => prepare(plugin)).toThrow(/registrar is closed/);
  });

  it.each(['setup throw', 'registration throw'])(
    'closes a retained registrar after %s',
    (failure) => {
      let retained: DataTablePluginRegistrar<Person> | undefined;
      const plugin = createPlugin({
        setup(registrar: DataTablePluginRegistrar<Person>) {
          retained = registrar;

          if (failure === 'setup throw') {
            throw new Error('setup failed');
          }

          registrar.action('undeclared', () => undefined);
        },
      });

      expect(() => prepare(plugin)).toThrow();
      expect(() => retained?.metadata('late', () => undefined)).toThrow(
        /closed/
      );
    }
  );
});

describe('DataTable private plugin registry and derived feature', () => {
  function createValidPlugin(
    hookOutput: Record<string, unknown> = {
      'audit.actions.refresh': 'hook-action',
      'audit.metadata.status': 'ready',
    }
  ): DataTableEnginePlugin<Person> {
    return createPlugin({
      manifest: {
        options: ['audit.options.endpoint'],
        state: ['audit.state.enabled'],
        callbacks: ['audit.callbacks.complete'],
        rowModels: ['audit.rowModels.visible'],
        actions: ['audit.actions.refresh'],
        metadata: ['audit.metadata.status'],
      },
      setup(registrar: DataTablePluginRegistrar<Person>) {
        registrar.option('endpoint', () => '/audit');
        registrar.state('enabled', ({ registry }) => ({
          endpoint: registry.options['audit.options.endpoint'],
          value: true,
        }));
        registrar.callback('complete', () => vi.fn());
        registrar.rowModel('visible', () => ['row-1']);
        registrar.action('refresh', () => vi.fn());
        registrar.metadata('status', () => 'idle');
        registrar.hook('createTable', () => hookOutput);
      },
    });
  }

  it('keeps all registered surfaces namespaced and options out of TableOptions', () => {
    const prepared = prepareDataTableExtensions<Person>({
      engineOptions: { debugTable: true },
      plugins: [createValidPlugin()],
    });
    const registry = prepared.registry.byPlugin.audit;

    expect(prepared.engineOptions).toEqual({ debugTable: true });
    expect(prepared.engineOptions).not.toHaveProperty('audit.options.endpoint');
    expect(prepared.engineOptions).not.toHaveProperty('_features');
    expect(registry?.options).toEqual({
      'audit.options.endpoint': '/audit',
    });
    expect(registry?.state).toEqual({
      'audit.state.enabled': { endpoint: '/audit', value: true },
    });
    expect(Object.keys(registry?.callbacks ?? {})).toEqual([
      'audit.callbacks.complete',
    ]);
    expect(Object.keys(registry?.rowModels ?? {})).toEqual([
      'audit.rowModels.visible',
    ]);
    expect(Object.keys(registry?.actions ?? {})).toEqual([
      'audit.actions.refresh',
    ]);
    expect(registry?.metadata).toEqual({
      'audit.metadata.status': 'idle',
    });
  });

  it('produces equivalent results when deterministic preparation is replayed', () => {
    const plugin = createValidPlugin();
    const first = prepare(plugin);
    const second = prepare(plugin);
    const firstTarget: Record<string, unknown> = {};
    const secondTarget: Record<string, unknown> = {};

    first.features[0]?.createTable?.(firstTarget as unknown as Table<Person>);
    second.features[0]?.createTable?.(secondTarget as unknown as Table<Person>);

    expect(first.registry.byPlugin.audit?.options).toEqual(
      second.registry.byPlugin.audit?.options
    );
    expect(first.registry.byPlugin.audit?.metadata).toEqual(
      second.registry.byPlugin.audit?.metadata
    );
    expect(firstTarget).toEqual(secondTarget);
  });

  it('derives an internal lifecycle feature only after validation', () => {
    const prepared = prepare(createValidPlugin());
    const tableTarget: Record<string, unknown> = {};

    expect(prepared.features).toHaveLength(1);

    prepared.features[0]?.createTable?.(
      tableTarget as unknown as Table<Person>
    );

    expect(tableTarget['audit.actions.refresh']).toBe('hook-action');
    expect(tableTarget['audit.metadata.status']).toBe('ready');
    expect(
      Object.getOwnPropertyDescriptor(tableTarget, 'audit.actions.refresh')
        ?.writable
    ).toBe(false);
  });

  it('rejects undeclared runtime output before any output becomes observable', () => {
    const prepared = prepare(
      createValidPlugin({
        'audit.actions.refresh': 'would-have-been-visible',
        triggerRerender: true,
      })
    );
    const tableTarget: Record<string, unknown> = {};

    expect(() =>
      prepared.features[0]?.createTable?.(
        tableTarget as unknown as Table<Person>
      )
    ).toThrow(/undeclared runtime key/);
    expect(tableTarget).toEqual({});
  });

  it('validates non-enumerable hook output keys before attachment', () => {
    const output = {
      'audit.actions.refresh': 'would-have-been-visible',
    };
    Object.defineProperty(output, 'hidden', {
      enumerable: false,
      value: true,
    });
    const prepared = prepare(createValidPlugin(output));
    const tableTarget: Record<string, unknown> = {};

    expect(() =>
      prepared.features[0]?.createTable?.(
        tableTarget as unknown as Table<Person>
      )
    ).toThrow(/hidden/);
    expect(tableTarget).toEqual({});
  });

  it('rejects hook output accessors without invoking them', () => {
    const getter = vi.fn(() => 'ready');
    const output = {
      'audit.actions.refresh': 'refresh',
    };
    Object.defineProperty(output, 'audit.metadata.status', {
      enumerable: false,
      get: getter,
    });
    const prepared = prepare(createValidPlugin(output));
    const tableTarget: Record<string, unknown> = {};

    expect(() =>
      prepared.features[0]?.createTable?.(
        tableTarget as unknown as Table<Person>
      )
    ).toThrow(/accessors/);
    expect(getter).not.toHaveBeenCalled();
    expect(tableTarget).toEqual({});
  });

  it('rejects own __proto__ and symbol hook output keys', () => {
    const protoOutput = {
      'audit.actions.refresh': 'refresh',
      'audit.metadata.status': 'ready',
    };
    Object.defineProperty(protoOutput, '__proto__', {
      enumerable: false,
      value: { triggerRerender: true },
    });
    const symbolOutput = {
      'audit.actions.refresh': 'refresh',
      'audit.metadata.status': 'ready',
    };
    Object.defineProperty(symbolOutput, Symbol('runtime'), {
      value: true,
    });
    const protoPrepared = prepare(createValidPlugin(protoOutput));
    const symbolPrepared = prepare(createValidPlugin(symbolOutput));
    const protoTarget: Record<string, unknown> = {};
    const symbolTarget: Record<string, unknown> = {};

    expect(() =>
      protoPrepared.features[0]?.createTable?.(
        protoTarget as unknown as Table<Person>
      )
    ).toThrow(/__proto__/);
    expect(() =>
      symbolPrepared.features[0]?.createTable?.(
        symbolTarget as unknown as Table<Person>
      )
    ).toThrow(/symbol keys/);
    expect(protoTarget).toEqual({});
    expect(symbolTarget).toEqual({});
  });

  it('rejects runtime collisions before overwriting the target', () => {
    const prepared = prepare(createValidPlugin());
    const tableTarget = {
      'audit.actions.refresh': 'owned-by-target',
    };

    expect(() =>
      prepared.features[0]?.createTable?.(
        tableTarget as unknown as Table<Person>
      )
    ).toThrow(/collides/);
    expect(tableTarget['audit.actions.refresh']).toBe('owned-by-target');
    expect(tableTarget).not.toHaveProperty('audit.metadata.status');
  });

  it('rejects synchronous mutation attempts against hook context', () => {
    const plugin = createPlugin({
      manifest: {
        ...emptyManifest,
        metadata: ['audit.metadata.status'],
      },
      setup(registrar: DataTablePluginRegistrar<Person>) {
        registrar.metadata('status', () => 'idle');
        registrar.hook('createTable', (context) => {
          try {
            (context as { phase: string }).phase = 'createRow';
          } catch {
            // The tracker must still invalidate the plugin if it catches the proxy error.
          }
          return { 'audit.metadata.status': 'ready' };
        });
      },
    });
    const prepared = prepare(plugin);
    const tableTarget: Record<string, unknown> = {};

    expect(() =>
      prepared.features[0]?.createTable?.(
        tableTarget as unknown as Table<Person>
      )
    ).toThrow(/read-only context/);
    expect(tableTarget).toEqual({});
  });

  it('rejects asynchronous lifecycle hooks', () => {
    const plugin = createPlugin({
      setup(registrar: DataTablePluginRegistrar<Person>) {
        registrar.hook('createTable', (async () => ({})) as never);
      },
    });
    const prepared = prepare(plugin);

    expect(() =>
      prepared.features[0]?.createTable?.({} as unknown as Table<Person>)
    ).toThrow(/hook must be synchronous/);
  });
});
