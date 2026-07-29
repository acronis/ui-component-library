import { defineDataTableFeature } from './registry';

// OWNERSHIP: stub created by F2; **U6 owns this file** and implements the
// `virtualization` group here.
//
// U6 is unusual: its real mechanism is **not** a contribution point. Windowing
// wraps the whole row list rather than decorating one row, so it goes through the
// named seam `data-table-body-window.ts` — U6 replaces that file wholesale and
// owns it from then on. This module is where the *config* and the imperative
// actions live.
//
// What U6 adds:
//
//  - `data-table-body-window.ts`, replacing F2's identity implementation with
//    `@tanstack/react-virtual` (already a dependency, unused by data-table today).
//    F2's signature already carries the bounded scroll container, the padding
//    values and the measurement/scroll callbacks, so U6 does not reopen the view.
//  - `measureLayout()` and automatic layout observation, dispatched through the
//    **`measure-layout` and `scroll-to-row` members F2 pre-declared on
//    `DataTableToggleAction`** — so U6 does not reopen the controller's action
//    union either.
//  - the full §7 focus-fallback chain: pinned DOM row outside overscan,
//    scroll-container fallback, same-index/previous-last/toolbar chain, and
//    exactly one `data-reconcile` event.
//
// **Preconditions, both already satisfiable:** virtualization requires a bounded
// height, which is F3's `Table height`/`maxHeight` (it sets `data-bounded` on the
// scroll container) reachable from DataGrid through F2's box-prop pass-through and
// U9's `appearance` wiring. Windowing applies to the **display-row** list, not
// `getRowModel().rows` — that is what makes §7's "virtual rows preserve row
// index/count metadata" satisfiable, since every display row carries
// `recordIndex`.

/**
 * Virtualization behavior: row-height estimation, measurement mode and overscan.
 *
 * Every member is optional by design — the owning unit tightens optionality
 * inside this file. Design §5.2 defaults: 40px, `fixed`, 8.
 */
export interface DataTableVirtualizationConfig {
  readonly estimateRowHeight?: number | ((rowIndex: number) => number);
  readonly measure?: 'fixed' | 'dynamic';
  readonly overscan?: number;
  readonly scrollToIndex?: number;
}

export const virtualizationFeature = defineDataTableFeature({
  id: 'virtualization',
});
