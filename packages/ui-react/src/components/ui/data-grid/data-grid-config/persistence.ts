// From the owning feature module rather than the `data-table` barrel — the same
// emergency valve `footer.tsx:1-14` documents, for the same reason. These are
// public surface and belong in the barrel; that line is staged as hop 4 in
// `.ai/team/table-parity-p1/integration/U10.md` with the other public-type
// re-exports (#43). Switch to the barrel once the batch lands.
import type {
  DataTablePersistableSlice,
  DataTablePersistenceConfig,
  DataTablePersistenceStorage,
} from '../../data-table/data-table-features/persistence';
import { DATA_TABLE_PERSISTABLE_SLICES } from '../../data-table/data-table-persistence';
import { defineDataGridConfig } from './registry';

// OWNERSHIP: **U10 owns this file.**
//
// The `persistence` behavior group (design §5.2, §8) — persisted preferences
// behind a versioned storage envelope.
//
// **This group has no chrome, and that is its whole layer split.** DataGrid owns
// the config prop and its defaults; every mechanic — read, validate, migrate,
// prune, restore, write — belongs to the DataTable engine
// (`../../data-table/data-table-persistence.ts`), reached through
// `controllerOptions`. So all six config members have a consumer, and none of them
// is a control a caller presses: the *effect* of a restore appears in chrome that
// already exists for whichever slice was restored into — a hidden column, a
// column width, a sort indicator. Inventing a slot would mean inventing a control
// the spec does not ask for. The atom is therefore three parts, not four.
//
// **This file stays a `.ts`, deliberately.** `data-grid-config/README.md` names
// `persistence.ts` as one of three templates whose unit "may need JSX", so the
// absence is worth stating rather than leaving to inference: the group renders
// nothing and contributes no `columns` transform, so there is no `.ts`/`.tsx` pair
// to strand — the failure that cost an hour when `footer.ts` and `footer.tsx`
// coexisted.

/**
 * Persistence config. **`key`, `version` and `storage` are required here** and
 * optional on `DataTablePersistenceConfig`, which is not an inconsistency: design
 * §8 requires all three at the DataGrid layer, while the DataTable interface stays
 * fully optional so the controller's options unions could reference it before this
 * unit existed (features README rule 5). The engine re-checks them at runtime, so a
 * partially-configured **direct** `useDataTable` caller gets an inert feature
 * rather than a crash.
 */
export interface DataGridPersistenceConfig {
  /** Storage key. Required (design §8). */
  readonly key: string;
  /**
   * Schema version. Required (design §8). Bump it when the meaning of a stored
   * slice changes and supply `migrate`; a bump without one discards old payloads.
   */
  readonly version: number;
  /** The storage adapter. Required (design §8). May be sync or async. */
  readonly storage: DataTablePersistenceStorage;
  /**
   * Which slices participate. **Left as the caller wrote it** — the default (the
   * four column slices) is applied by the engine, in
   * `DATA_TABLE_DEFAULT_PERSISTED_SLICES`. Defaulting here as well would put two
   * copies of one default in two layers, which is how they drift.
   */
  readonly include?: readonly DataTablePersistableSlice[];
  /** Upgrades a payload stored under a different `version`. */
  readonly migrate?: (stored: unknown, fromVersion: number) => unknown;
  /** Receives a corrupt payload, a failing adapter, or a throwing `migrate`. */
  readonly onError?: (error: unknown) => void;
}

export interface ResolvedDataGridPersistence {
  readonly enabled: boolean;
  readonly key: string | undefined;
  readonly version: number | undefined;
  readonly storage: DataTablePersistenceStorage | undefined;
  readonly include: readonly DataTablePersistableSlice[] | undefined;
  readonly migrate:
    ((stored: unknown, fromVersion: number) => unknown) | undefined;
  readonly onError: ((error: unknown) => void) | undefined;
}

/* eslint-disable unused-imports/no-unused-vars -- declaration merging requires
   every augmentation to repeat the target's type-parameter list verbatim, so
   `TData` must be named even in a group whose shape does not use it. */
declare module './registry' {
  interface DataGridGroupedConfigMap<TData> {
    /**
     * Persisted column preferences behind a versioned storage envelope (§8).
     * `false`/omitted persists nothing.
     */
    persistence: false | DataGridPersistenceConfig;
  }
  interface DataGridResolvedConfigMap<TData> {
    persistence: ResolvedDataGridPersistence;
  }
}
/* eslint-enable unused-imports/no-unused-vars */

// **Deliberately NOT declared on `DataGridIdentityFreeMap`.** `registry.ts:98`
// lists "row-state `persistence`" among the identity-bearing features, and that is
// right about a future opt-in and wrong about P1: every slice
// `DataTablePersistableSlice` admits is keyed by **column id**, and the four
// row-keyed slices are not merely excluded by default but *unnameable* — the
// engine's `_AssertNoRowStatePersisted` fails to compile if one is added. So
// persistence needs no `getRowId` today, and requiring one would be a tax on a
// caller who only wants their column widths to survive a reload.
//
// **If a row-keyed slice ever becomes persistable, this map entry becomes
// mandatory in the same change** — declare the narrowest safe shape (see how
// `rowInteraction` declares `{ current?: false }`), because a feature that skips
// the map silently becomes usable without identity.

const DISABLED: ResolvedDataGridPersistence = {
  enabled: false,
  key: undefined,
  version: undefined,
  storage: undefined,
  include: undefined,
  migrate: undefined,
  onError: undefined,
};

const REQUIRED_MEMBERS = ['key', 'version', 'storage'] as const;

export const persistenceConfig = defineDataGridConfig({
  key: 'persistence',
  kind: 'grouped',
  aliases: [],
  // No `reads`: a grouped module implicitly reads its own key, and this one reads
  // nothing else. In particular it does **not** read `state` — controlled-slice
  // exclusion is the controller's verdict (`gates.controlledSlices`), derived from
  // the own-keys of its `state` prop, so the grid neither computes nor duplicates
  // it. Declaring `state` here would tie resolution to a prop this module does not
  // use and rebuild the assembled column set whenever it changed.

  resolve({ props }) {
    const persistence = props.persistence;
    const warnings: string[] = [];

    if (persistence === undefined || persistence === false) {
      return { value: DISABLED };
    }

    // Type-level already; this is the JS-caller path, and it must disable rather
    // than half-configure — a persistence group missing its key is a group that
    // would read and write under `undefined`.
    const missing = REQUIRED_MEMBERS.filter(
      (member) => persistence[member] === undefined
    );
    if (missing.length > 0) {
      warnings.push(
        `DataGrid: \`persistence\` requires ${missing
          .map((member) => `\`${member}\``)
          .join(', ')}; the group is disabled.`
      );

      return { value: DISABLED, warnings };
    }

    // The engine silently drops a slice name it does not recognise, which is the
    // right runtime behaviour and a terrible diagnostic — so the warning is the
    // only signal a caller ever gets that their `include` entry did nothing.
    const unknown = (persistence.include ?? []).filter(
      (slice) =>
        !(DATA_TABLE_PERSISTABLE_SLICES as readonly string[]).includes(slice)
    );
    if (unknown.length > 0) {
      warnings.push(
        `DataGrid: \`persistence.include\` does not recognise ${unknown
          .map((slice) => `\`${String(slice)}\``)
          .join(', ')}; ${unknown.length > 1 ? 'they are' : 'it is'} ignored.`
      );
    }

    return {
      value: {
        enabled: true,
        key: persistence.key,
        version: persistence.version,
        storage: persistence.storage,
        include: persistence.include,
        migrate: persistence.migrate,
        onError: persistence.onError,
      },
      warnings,
    };
  },

  // A fresh config object per render is harmless here, and that is a property of
  // the engine rather than luck: its restore effect keys on `[enabled, key]`, its
  // save effect on the serialized payload, and it reads every other input through
  // a ref refreshed each render. So nothing downstream is memoized on this
  // object's identity.
  controllerOptions({ resolved }) {
    const persistence = resolved.persistence;
    if (!persistence.enabled) {
      return {};
    }

    const config: DataTablePersistenceConfig = {
      key: persistence.key,
      version: persistence.version,
      storage: persistence.storage,
      ...(persistence.include === undefined
        ? {}
        : { include: persistence.include }),
      ...(persistence.migrate === undefined
        ? {}
        : { migrate: persistence.migrate }),
      ...(persistence.onError === undefined
        ? {}
        : { onError: persistence.onError }),
    };

    return { persistence: config };
  },
});
