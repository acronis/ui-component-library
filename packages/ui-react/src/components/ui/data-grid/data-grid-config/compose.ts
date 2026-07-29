import type { ReactNode } from 'react';
import type { ColumnDef } from '@tanstack/react-table';

import type { DataTableViewProps } from '../../data-table';
import {
  DATA_GRID_CONTRIBUTABLE_CONTROLLER_OPTIONS,
  type DataGridChromeSlot,
  DataGridChromeSlotContext,
  DataGridColumnContext,
  DataGridConfigModule,
  DataGridControllerContext,
  DataGridControllerOptionsContribution,
  DataGridProps,
  type DataGridViewContext,
  type ResolvedDataGrid,
} from './registry';

// OWNERSHIP: **F4/F5** (on standby). The runtime half of the mechanism.

// The runtime half of the config registry: it walks the manifest and folds every
// module's contribution into one value per seam. It is pure — the module list is
// a parameter — so it is unit-testable without rendering a grid.
//
// Two invariants make this safe rather than merely tidy (ADR-0002):
//
//  1. Order is committed. The manifest order is the one order used for
//     resolution, the column pipeline, and chrome; `index.ts` pins it and a test
//     asserts it.
//  2. Contributions are additive and collision-checked. A module may not
//     overwrite a controller option or a view prop another module set; the
//     composer throws on a duplicate key rather than letting the later module in
//     the list silently win.
//  3. Contributed controller-option keys are checked against the real option set.
//     `tsc` cannot do this: a module's contribution is written as conditional
//     spreads to avoid passing explicit `undefined`, and **an unknown key inside a
//     spread escapes excess-property checking**, so a misspelled or nonexistent
//     option type-checks and is then silently dropped — leaving the whole group
//     inert with no error anywhere. A runtime check is the only thing a spread
//     cannot evade.

const EMPTY_WARNINGS: readonly string[] = [];

/** Inputs a preset must never carry (design §5.2). */
const FORBIDDEN_PRESET_KEYS: ReadonlySet<string> = new Set([
  'columns',
  'rows',
  'state',
  'defaultState',
  'server',
  'callbacks',
]);

/**
 * The grouped-config keys a preset may set, each mapped to the deprecated flat
 * aliases that normalize into it. Derived from the manifest — a group is
 * preset-addressable precisely because its module declares `kind: 'grouped'`,
 * which is the same declaration that puts it on `DataGridGroupedConfig`.
 *
 * This replaces the hand-listed `satisfies Record<keyof DataGridGroupedConfig,
 * …>` total record, which made `data-grid.tsx` fail to compile until every new
 * group was added to it.
 */
export function buildGroupedConfigAliases(
  modules: readonly DataGridConfigModule[]
): Readonly<Record<string, readonly string[]>> {
  const aliases: Record<string, readonly string[]> = {};
  for (const module of modules) {
    if (module.kind === 'grouped') {
      aliases[module.key] = module.aliases;
    }
  }
  return aliases;
}

/**
 * Applies `presets` into an effective prop set consumed by `resolveConfig`.
 * Detected presets apply first, then `apply` left-to-right (later writes win),
 * and any group the caller supplied is left untouched — precedence rises with
 * explicitness (design §5.2).
 */
export function applyPresets<TData, TValue>(
  props: DataGridProps<TData, TValue>,
  detectedPresetIds: readonly string[],
  groupedAliases: Readonly<Record<string, readonly string[]>>
): { props: DataGridProps<TData, TValue>; warnings: readonly string[] } {
  const { presets } = props;
  if (presets === undefined) {
    return { props, warnings: EMPTY_WARNINGS };
  }

  const warnings: string[] = [];
  const definitions = new Map(
    presets.definitions.map((definition) => [definition.id, definition])
  );
  const merged: Record<string, unknown> = {};

  for (const id of [...detectedPresetIds, ...presets.apply]) {
    const definition = definitions.get(id);
    if (definition === undefined) {
      warnings.push(
        `DataGrid: preset "${id}" is not defined in \`presets.definitions\`.`
      );
      continue;
    }
    for (const [key, value] of Object.entries(definition.config)) {
      if (FORBIDDEN_PRESET_KEYS.has(key)) {
        warnings.push(
          `DataGrid: preset "${id}" cannot set \`${key}\`; presets carry grouped configs only.`
        );
        continue;
      }
      if (!(key in groupedAliases)) {
        warnings.push(
          `DataGrid: preset "${id}" sets \`${key}\`, which is not a grouped config.`
        );
        continue;
      }
      if (value !== undefined) {
        merged[key] = value;
      }
    }
  }

  // Normalization boundary: the groups are addressed by key, so this walk is
  // typed through the derived alias record rather than the props interface.
  const source = props as unknown as Record<string, unknown>;
  const effective = { ...source };
  for (const [group, aliases] of Object.entries(groupedAliases)) {
    if (!(group in merged)) {
      continue;
    }
    const callerSupplied =
      source[group] !== undefined ||
      aliases.some((alias) => source[alias] !== undefined);
    if (!callerSupplied) {
      effective[group] = merged[group];
    }
  }

  return {
    props: effective as unknown as DataGridProps<TData, TValue>,
    warnings,
  };
}

/**
 * Runs every module's `resolve` in manifest order, so a module may read the
 * values resolved before it (`toolbar` reads `filters`; `pagination` reads
 * `server`).
 */
export function resolveDataGridConfig<TData, TValue>(
  props: DataGridProps<TData, TValue>,
  modules: readonly DataGridConfigModule[]
): { resolved: ResolvedDataGrid<TData>; warnings: readonly string[] } {
  const resolved: Record<string, unknown> = {};
  const warnings: string[] = [];
  // The manifest is declared over `unknown` rows (see `DataGridConfigModule`);
  // every value it carries is passed through, never inspected as `TData`.
  const context = {
    props: props as unknown as DataGridProps<unknown, unknown>,
    resolved: resolved as Partial<ResolvedDataGrid<unknown>>,
  };

  for (const module of modules) {
    const result = module.resolve(context);
    resolved[module.key] = result.value;
    if (result.warnings !== undefined && result.warnings.length > 0) {
      warnings.push(...result.warnings);
    }
  }

  return { resolved: resolved as ResolvedDataGrid<TData>, warnings };
}

/**
 * Folds the `columns` transforms in manifest order. The order is what makes the
 * output identical to a hand-written pipeline: `filters` rewrites the caller's
 * defs, `actions` splices its column at `placement`, and `selection` prepends
 * `__select__` in front of both.
 */
export function composeColumns<TData, TValue>(
  columns: readonly ColumnDef<TData, TValue>[],
  modules: readonly DataGridConfigModule[],
  context: DataGridColumnContext<TData>
): readonly ColumnDef<TData, TValue>[] {
  const moduleContext = context as unknown as DataGridColumnContext<unknown>;
  let current = columns as readonly ColumnDef<unknown, unknown>[];
  for (const module of modules) {
    if (module.columns !== undefined) {
      current = module.columns(current, moduleContext);
    }
  }
  return current as readonly ColumnDef<TData, TValue>[];
}

const CONTRIBUTABLE_CONTROLLER_OPTIONS: ReadonlySet<string> = new Set(
  DATA_GRID_CONTRIBUTABLE_CONTROLLER_OPTIONS
);

/**
 * Rejects a controller option the controller does not have.
 *
 * Unconditional rather than development-only: a contribution under an unknown key
 * is never a degraded experience, it is a feature that does nothing, and shipping
 * that quietly is worse than throwing. The set is kept exactly in step with the
 * real option type by two compile-time assertions in `registry.ts`, so this can
 * only fire on a genuine mistake.
 */
function assertUnknownControllerOption(
  moduleKey: string,
  optionKey: string
): void {
  if (CONTRIBUTABLE_CONTROLLER_OPTIONS.has(optionKey)) {
    return;
  }
  throw new Error(
    `DataGrid: config module "${moduleKey}" contributed controller option "${optionKey}", which does not exist. ` +
      'It would have been silently dropped, leaving the group inert — an unknown key inside a conditional spread ' +
      "escapes TypeScript's excess-property check, so nothing else would have reported it. " +
      `Valid options: ${[...CONTRIBUTABLE_CONTROLLER_OPTIONS].sort().join(', ')}.`
  );
}

function assertNoCollision(
  seam: string,
  owners: Map<string, string>,
  moduleKey: string,
  optionKey: string
): void {
  const previous = owners.get(optionKey);
  if (previous !== undefined) {
    throw new Error(
      `DataGrid: config modules "${previous}" and "${moduleKey}" both set ${seam} "${optionKey}". A module may not overwrite another module's contribution.`
    );
  }
  owners.set(optionKey, moduleKey);
}

/**
 * Folds every module's controller options into the single `useDataTable({…})`
 * option set, throwing if two modules set the same option.
 */
export function composeControllerOptions<TData>(
  modules: readonly DataGridConfigModule[],
  context: DataGridControllerContext<TData>
): DataGridControllerOptionsContribution<TData> {
  const moduleContext =
    context as unknown as DataGridControllerContext<unknown>;
  const owners = new Map<string, string>();
  const options: Record<string, unknown> = {};

  for (const module of modules) {
    if (module.controllerOptions === undefined) {
      continue;
    }
    const contribution = module.controllerOptions(moduleContext) as Record<
      string,
      unknown
    >;
    for (const [key, value] of Object.entries(contribution)) {
      if (value === undefined) {
        continue;
      }
      assertUnknownControllerOption(module.key, key);
      assertNoCollision('controller option', owners, module.key, key);
      options[key] = value;
    }
  }

  return options as DataGridControllerOptionsContribution<TData>;
}

/**
 * Folds every module's `DataTableView` props, throwing if two modules set the
 * same prop.
 */
export function composeViewProps<TData>(
  modules: readonly DataGridConfigModule[],
  context: DataGridViewContext<TData>
): Partial<DataTableViewProps<TData>> {
  const moduleContext = context as unknown as DataGridViewContext<unknown>;
  const owners = new Map<string, string>();
  const props: Record<string, unknown> = {};

  for (const module of modules) {
    if (module.viewProps === undefined) {
      continue;
    }
    const contribution = module.viewProps(moduleContext) as Record<
      string,
      unknown
    >;
    for (const [key, value] of Object.entries(contribution)) {
      if (value === undefined) {
        continue;
      }
      assertNoCollision('view prop', owners, module.key, key);
      props[key] = value;
    }
  }

  return props as Partial<DataTableViewProps<TData>>;
}

/** Every module's chrome for one slot, in manifest order. */
export function renderChromeSlot<TData>(
  slot: DataGridChromeSlot,
  modules: readonly DataGridConfigModule[],
  context: DataGridChromeSlotContext<TData>
): readonly { key: string; node: ReactNode }[] {
  const moduleContext =
    context as unknown as DataGridChromeSlotContext<unknown>;
  const nodes: { key: string; node: ReactNode }[] = [];

  for (const module of modules) {
    if (module.chrome === undefined) {
      continue;
    }
    const node = module.chrome(slot, moduleContext);
    if (node !== null && node !== undefined && node !== false) {
      nodes.push({ key: module.key, node });
    }
  }

  return nodes;
}
