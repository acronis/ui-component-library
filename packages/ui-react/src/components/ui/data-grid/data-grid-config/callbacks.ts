import type { DataTableQueryChangeEvent } from '../../data-table';
import {
  resolveSliceCallbacks,
  type DataGridSliceCallbacks,
} from '../data-grid-callbacks';
import type { ResolvedDataGridServer } from './server';
import { defineDataGridConfig } from './registry';

// OWNERSHIP: **F4**. No Wave 1 owner. A feature group that adds a named
// callback extends `DataGridCallbacks` and contributes from its *own*
// module, not here.
//
// **One authorised exception, U8's:** `composeSelectionSlice` at the bottom.
// `server.onSelectionChange` has no other route — `onSliceChange` is the only path
// to a selection-slice handler and this module contributes it, so a second
// contribution throws on the collision check. It is symmetry with the
// `onQueryChange` composition four lines below rather than a new mechanism, and
// `server.ts` publishes the closure so no server semantics live here.

// The named screen callbacks (design §5.3). Not a behavior group: `callbacks` is
// a top-level input and is never preset-addressable.
//
// This module exists so the callback→controller projection has one owner. A
// feature group that adds a named callback (`onDetailExpansionChange`,
// `onTreeExpansionChange`, `onGroupingChange`, `onScroll`, …) extends
// `DataGridCallbacks` in `data-grid-callbacks.ts` and, if the controller needs
// it, contributes from its own module — not from here.
//
// It contributes nothing at resolve time on purpose. Everything it does is a
// per-render projection, so `props.callbacks` stays out of the resolve
// dependencies — otherwise a caller passing `callbacks` as an object literal
// would re-resolve every group, and with it rebuild the column set and TanStack's
// memoized row model, on every render.

export interface ResolvedDataGridCallbacks {
  readonly none?: never;
}

/* eslint-disable unused-imports/no-unused-vars -- declaration merging requires
   every augmentation to repeat the target's type-parameter list verbatim, so
   `TData` must be named even in a group whose shape does not use it. */
declare module './registry' {
  interface DataGridResolvedConfigMap<TData> {
    callbacks: ResolvedDataGridCallbacks;
  }
}
/* eslint-enable unused-imports/no-unused-vars */

const NOTHING: ResolvedDataGridCallbacks = {};

export const callbacksConfig = defineDataGridConfig({
  key: 'callbacks',
  kind: 'top-level',
  aliases: [],
  reads: [],

  resolve() {
    return { value: NOTHING };
  },

  controllerOptions({ resolved, callbacks }) {
    // In server mode `server.onQueryChange` is authoritative and runs first; the
    // named callback only observes the same event and must not start a second
    // request (design §5.3).
    const authoritative = resolved.server.config?.onQueryChange;
    const observe = callbacks?.onQueryChange;

    return {
      onQueryChange:
        authoritative === undefined && observe === undefined
          ? undefined
          : (event: DataTableQueryChangeEvent) => {
              authoritative?.(event);
              observe?.(event);
            },
      onStateChange: callbacks?.onStateChange,
      onSliceChange: composeSelectionSlice(
        resolveSliceCallbacks(callbacks),
        resolved.server.onSelectionChange
      ),
    };
  },
});

/**
 * The same authoritative-then-observing composition as `onQueryChange` above, for
 * the selection slice: a controlled `server.selection` reports through
 * `server.onSelectionChange` first, and `callbacks.onSelectionChange` observes.
 *
 * It lives here rather than in `server.ts` for one reason only: `onSliceChange` is
 * a single controller option and this module owns it, so a second module
 * contributing it would throw on the composer's cross-module collision check.
 * **`server.ts` publishes a ready-made closure** and this file composes an opaque
 * function — the same arrangement as `onQueryChange`, and the reason nothing about
 * server selection semantics appears in this module.
 */
function composeSelectionSlice(
  slices: DataGridSliceCallbacks | undefined,
  authoritative: ResolvedDataGridServer['onSelectionChange']
): DataGridSliceCallbacks | undefined {
  if (authoritative === undefined) {
    return slices;
  }
  const observe = slices?.selection;
  return {
    ...slices,
    selection: (event) => {
      authoritative(event);
      observe?.(event);
    },
  };
}
