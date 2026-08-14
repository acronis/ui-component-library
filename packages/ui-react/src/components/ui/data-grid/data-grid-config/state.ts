import type { DataTableSlice, DataTableStateInput } from '../../data-table';
import type { DataGridDataStatus } from './data-state';
import { defineDataGridConfig } from './registry';

// OWNERSHIP: **F5**. No Wave 1 owner. U10 (`persistence`) interacts with it
// through the controlled-slice exclusion rule but does not edit it.

// `state` / `defaultState` (design §3.2, §5.2). Top-level ownership inputs, never
// preset-addressable.
//
// The controller already implements every controlled/uncontrolled rule —
// a slice in `state` is controlled and requests without committing, a slice absent
// from `state` initializes once from `defaultState`, and the same slice in both is
// a development error with controlled winning. This module only exposes them.
//
// It owns the two controller options outright, rather than letting each module
// contribute its own slices, because the merge rules differ by option and both
// rules are precedence rules that need one place to live:
//
//   `state`        — server mode *exclusively* controls the query slices
//                    (design §5.1), so a caller controlling the same slice is an
//                    error, not a precedence question.
//   `defaultState` — the caller is more explicit than a group's default, so a
//                    caller slice beats a module-contributed one (design §5.1,
//                    "defaultState beats config defaults").

/** The identity slices, which a caller may only control alongside `getRowId`. */
const IDENTITY_SLICES: readonly DataTableSlice[] = [
  'selection',
  'detailExpanded',
  'treeExpanded',
  'currentRowId',
];

/**
 * A `DataTableStateInput` with the identity slices removed. The identity-free
 * branch of `DataGridProps` accepts only this, so controlling selection or the
 * current row without `getRowId` does not compile (design §3.1).
 */
export type IdentityFreeDataGridState = Omit<
  DataTableStateInput,
  'selection' | 'detailExpanded' | 'treeExpanded' | 'currentRowId'
> & {
  readonly selection?: never;
  readonly detailExpanded?: never;
  readonly treeExpanded?: never;
  readonly currentRowId?: never;
};

export interface ResolvedDataGridState {
  /** Controlled slices, after merging server's authoritative query slices. */
  readonly state?: DataTableStateInput;
  /** Initial uncontrolled slices, after a caller slice overrides any default. */
  readonly defaultState?: DataTableStateInput;
}

/* eslint-disable unused-imports/no-unused-vars -- declaration merging requires
   every augmentation to repeat the target's type-parameter list verbatim, so
   `TData` must be named even in a group whose shape does not use it. */
declare module './registry' {
  interface DataGridTopLevelConfigMap<TData> {
    /**
     * Controlled slice values; they win over `defaultState` and every config
     * default. A slice present here is controlled: a requested change emits the
     * callbacks but is not committed internally (design §3.2).
     *
     * The string form is the **deprecated** data-status alias for
     * `dataState.status` and is removed next major. The two are structurally
     * disjoint, so `typeof state === 'string'` tells them apart.
     */
    state: DataGridDataStatus | DataTableStateInput;
    /**
     * Initial uncontrolled slice values. Read once, on mount; a slice that is
     * also in `state` is a development error (design §3.2).
     */
    defaultState: DataTableStateInput;
  }
  interface DataGridIdentityFreeMap<TData> {
    state: DataGridDataStatus | IdentityFreeDataGridState;
    defaultState: IdentityFreeDataGridState;
  }
  interface DataGridResolvedConfigMap<TData> {
    state: ResolvedDataGridState;
  }
}
/* eslint-enable unused-imports/no-unused-vars */

/** The controlled slice object, or `undefined` for the deprecated string form. */
function controlledSlices(
  value: DataGridDataStatus | DataTableStateInput | undefined
): DataTableStateInput | undefined {
  return value === undefined || typeof value === 'string' ? undefined : value;
}

function slicesOf(state: DataTableStateInput | undefined): DataTableSlice[] {
  return state === undefined ? [] : (Object.keys(state) as DataTableSlice[]);
}

export const stateConfig = defineDataGridConfig({
  key: 'state',
  kind: 'top-level',
  aliases: [],
  reads: ['state', 'defaultState'],

  resolve({ props, resolved }) {
    const warnings: string[] = [];
    const caller = controlledSlices(props.state);
    const callerDefault = props.defaultState;

    // Server mode controls the query slices exclusively (design §5.1). Report the
    // overlap rather than silently picking a winner.
    const server = resolved.server?.controlledSlices;
    const conflicting = slicesOf(server).filter((slice) =>
      Object.prototype.hasOwnProperty.call(caller ?? {}, slice)
    );
    if (conflicting.length > 0) {
      warnings.push(
        `DataGrid: \`server\` already controls the ${conflicting
          .map((slice) => `\`${slice}\``)
          .join('/')} slice${conflicting.length > 1 ? 's' : ''}; remove ${
          conflicting.length > 1 ? 'them' : 'it'
        } from \`state\`. The server query wins.`
      );
    }

    // A caller slice is more explicit than a group's initial value, so it wins
    // (design §5.1). Two groups contribute one today: `pagination`'s initial page,
    // and `columnsFeatures`' pinning seed read from `meta.pin` (PLTFRM-93016).
    //
    // The merge below is per slice, not deep, which is what makes the precedence
    // legible: a caller's `defaultState.columnPinning` replaces the `meta.pin`
    // seed outright rather than being merged edge-by-edge with it. Two sources
    // half-describing one slice is the kind of state nobody can reason about.
    const groupDefaults = resolved.pagination?.initialSlice;
    const pinningDefaults = resolved.columnsFeatures?.initialSlice;

    const identityInCaller = IDENTITY_SLICES.filter(
      (slice) =>
        Object.prototype.hasOwnProperty.call(caller ?? {}, slice) ||
        Object.prototype.hasOwnProperty.call(callerDefault ?? {}, slice)
    );
    if (identityInCaller.length > 0 && props.getRowId === undefined) {
      warnings.push(
        `DataGrid: controlling the ${identityInCaller
          .map((slice) => `\`${slice}\``)
          .join('/')} slice${
          identityInCaller.length > 1 ? 's' : ''
        } requires \`getRowId\`; row state cannot survive a data change keyed by index.`
      );
    }

    const state =
      caller === undefined && server === undefined
        ? undefined
        : { ...caller, ...server };
    const defaultState =
      callerDefault === undefined &&
      groupDefaults === undefined &&
      pinningDefaults === undefined
        ? undefined
        : {
            ...(groupDefaults ? { pagination: groupDefaults } : {}),
            ...(pinningDefaults ? { columnPinning: pinningDefaults } : {}),
            ...callerDefault,
          };

    return { value: { state, defaultState }, warnings };
  },

  controllerOptions({ resolved }) {
    return {
      state: resolved.state.state,
      defaultState: resolved.state.defaultState,
    };
  },
});
