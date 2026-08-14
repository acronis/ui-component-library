import type { ReactNode } from 'react';

import { defineDataGridConfig } from './registry';

// OWNERSHIP: **F4**. No Wave 1 owner.

// The `labels` behavior group (design §5.2): every string DataGrid renders that
// the caller did not supply.
//
// PLTFRM-93117. Content a caller passes in — column headers, action labels, filter
// labels, `footer.render`, `dataState.empty`, `filters.global.placeholder` — was
// always the caller's to translate. The grid's *own* chrome was not: roughly two
// dozen English strings were literals at their render sites, so a console shipping
// in another language had no way to reach them short of forking the package.
//
// ── WHY THIS GROUP IS FIRST IN THE MANIFEST ─────────────────────────────────
// Resolution runs in manifest order and each module sees the `resolved` object
// built so far — the mechanism `state.ts` uses to read `pagination.initialSlice`.
// Every other group renders strings, so this one has to resolve before any of
// them. Moving it later does not fail the typecheck; it makes `resolved.labels`
// `undefined` in whichever group now runs first, which is a runtime hole. Keep it
// at the head of the array in `index.ts`.
//
// ── WHY SOME MEMBERS ARE FUNCTIONS ──────────────────────────────────────────
// A string cannot express "2 of 4 row(s) selected." in a language with plural
// classes other than English's two, and cannot reorder "Reorder <column> column"
// where the noun precedes the verb. Anything interpolated is therefore a function
// taking the values and returning the finished node, which also lets a caller hand
// the arguments straight to their own ICU/plural library. The static members stay
// strings: a function there would be ceremony with no capability behind it.
//
// ── WHAT IS NOT HERE ────────────────────────────────────────────────────────
//  - `dataState.empty` / `emptyMessage` — already caller-owned, and it takes a
//    `ReactNode` rather than a string. Duplicating it here would give one message
//    two sources and no rule about which wins.
//  - `Sort by <column>` in `data-table/data-table-column-header.tsx`. That part is
//    unreferenced — DataGrid's sortable header renders through
//    `data-grid-column-header-controls.tsx` — and `data-table` is not importable
//    through the `exports` map, so the string is unreachable from a consumer.
//    Noted rather than wired, to keep this group's members provably rendered.

/**
 * Caller overrides for the strings DataGrid renders itself.
 *
 * Every member is optional; an omitted one keeps its English default, so adopting
 * this group is never all-or-nothing and a new default never breaks a caller who
 * translated only part of the surface.
 */
export interface DataGridLabels {
  // ── Pagination ────────────────────────────────────────────────────────────
  /** Label and accessible name of the page-size select. */
  rowsPerPage?: string;
  /** Accessible name of the first-page button. */
  firstPage?: string;
  /** Accessible name of the previous-page button. */
  previousPage?: string;
  /** Accessible name of the next-page button. */
  nextPage?: string;
  /** Accessible name of the last-page button. */
  lastPage?: string;
  /**
   * The selection summary beside the pager.
   *
   * `selected` is the resolved count — under a server `all-results` token that is
   * the server's number rather than the loaded rows', which is the whole reason it
   * is passed rather than read from the table.
   */
  selectedCount?: (selected: number, total: number) => ReactNode;
  /**
   * The page counter, when the total is known.
   *
   * Missed by the first pass of PLTFRM-93117 and caught by looking at the German
   * story's baseline, where "Page 1 of 2" was the one thing still in English. Worth
   * knowing how it hid: no test asserted it, and reading the file found
   * `Rows per page` on the line above without the eye travelling further.
   */
  pageOf?: (page: number, total: number) => ReactNode;
  /** The page counter under an unknown total, where there is no "of N" to show. */
  page?: (page: number) => ReactNode;

  // ── Selection ─────────────────────────────────────────────────────────────
  /** Accessible name of the header select-all checkbox. */
  selectAllRows?: string;
  /** Accessible name of a row's checkbox. */
  selectRow?: string;
  /** Accessible name of a group header's select-all checkbox. */
  selectAllRowsInGroup?: (group: string) => string;

  // ── Columns ───────────────────────────────────────────────────────────────
  /** Accessible name of the column-settings (`⚙`) trigger. */
  columnSettings?: string;
  /** Heading of the visibility section inside the column-settings menu. */
  toggleColumns?: string;
  /** Heading of the pinning section inside the column-settings menu. */
  pinColumns?: string;
  /** The menu item that unpins every pinned column. */
  unpinAll?: string;
  /** Announced in the live region when the last pinned column is unpinned. */
  allColumnsUnpinned?: string;
  /** Accessible name of a header's reorder grip. */
  reorderColumn?: (columnId: string) => string;
  /** Accessible name of a header's resize handle. */
  resizeColumn?: (columnId: string) => string;
  /**
   * Announced after a resize, in pixels.
   *
   * This and the four members below are live-region announcements for the column
   * header controls: a screen-reader user's only feedback that a drag or an arrow
   * press did anything. All of them interpolate, so all of them are functions.
   */
  columnResized?: (columnId: string, size: number) => string;
  /**
   * `edge` is the engine's **logical** edge (`start`/`end`), not the physical
   * `left`/`right` that `meta.pin` uses — `tsc` is what said so. The two vocabularies
   * genuinely differ in this codebase; do not "fix" one to match the other.
   */
  columnPinned?: (columnId: string, edge: 'start' | 'end') => string;
  /** Announced when a column is unpinned from either edge. */
  columnUnpinned?: (columnId: string) => string;
  /** Announced after each arrow press or drop while reordering. */
  columnMoved?: (columnId: string, position: number, total: number) => string;
  /** Announced when keyboard reordering ends, reporting where the column landed. */
  columnPosition?: (
    columnId: string,
    position: number,
    total: number
  ) => string;
  /** Announced when keyboard reordering starts, naming the keys that drive it. */
  columnReorderHint?: (columnId: string) => string;

  // ── Row actions ───────────────────────────────────────────────────────────
  /** Accessible name of the per-row actions trigger, and its `sr-only` header. */
  rowActions?: string;
  /** Accessible name of the bulk-actions group in the toolbar row. */
  bulkActions?: string;
  /** Accessible name of the bulk bar's clear-selection control. */
  clearSelection?: string;

  // ── Expansion: tree, grouping, detail ─────────────────────────────────────
  /**
   * Accessible name of a collapsed tree row's toggle. `level` is the row's nesting
   * depth as rendered, 1-based.
   */
  expandChildren?: (level: number) => string;
  /** Accessible name of an expanded tree row's toggle. */
  collapseChildren?: (level: number) => string;
  /** Accessible name of a collapsed group header's toggle. */
  expandGroup?: (group: string) => string;
  /** Accessible name of an expanded group header's toggle. */
  collapseGroup?: (group: string) => string;
  /**
   * Title of the alert shown when a tree row's lazy load fails. `tree.renderLoadError`
   * replaces the whole row; this replaces only its title.
   */
  treeLoadError?: string;
  /** `sr-only` header of the detail-expansion column. */
  detailColumnHeader?: string;
  /**
   * Accessible name of a row's detail toggle. `DataGridDetailExpander`'s own
   * `label` prop still wins for a caller composing that part directly.
   */
  toggleDetails?: string;

  // ── Data state ────────────────────────────────────────────────────────────
  /** Title of the error alert. Its body is `dataState.error`, already caller-owned. */
  errorTitle?: string;
}

/** Every member present, so a render site never branches on `undefined`. */
export type ResolvedDataGridLabels = Required<DataGridLabels>;

/**
 * The English defaults, and the single definition of them.
 *
 * Exported because two audiences need to read it rather than re-type it: a caller
 * translating part of the surface, and `__tests__/data-grid-labels.test.tsx`,
 * which asserts every member is actually rendered somewhere. Keeping the strings
 * here rather than at their render sites is what makes that test possible — a
 * literal left behind in a component is invisible to it.
 */
export const DATA_GRID_DEFAULT_LABELS: ResolvedDataGridLabels = {
  rowsPerPage: 'Rows per page',
  firstPage: 'Go to first page',
  previousPage: 'Go to previous page',
  nextPage: 'Go to next page',
  lastPage: 'Go to last page',
  // A fragment reproducing the original JSX **node structure**, not just its text.
  // The literal used to be `{n} of{' '}{total} row(s) selected.` — three text nodes —
  // and collapsing it to one template string shifted sub-pixel antialiasing enough to
  // re-record 36 baselines per mode. Measured: visually identical, 8 bytes apart. So
  // the default keeps the shape it had, and only a caller's override changes the DOM —
  // which keeps "a baseline moved" meaning "the appearance changed".
  selectedCount: (selected, total) => (
    <>
      {selected} of {total} row(s) selected.
    </>
  ),

  // Same node-shape preservation as `selectedCount` above.
  pageOf: (page, total) => (
    <>
      Page {page} of {total}
    </>
  ),
  page: (page) => <>Page {page}</>,

  selectAllRows: 'Select all rows',
  selectRow: 'Select row',
  selectAllRowsInGroup: (group) => `Select all rows in group ${group}`,

  columnSettings: 'Column settings',
  toggleColumns: 'Toggle columns',
  pinColumns: 'Pin columns',
  unpinAll: 'Unpin all',
  allColumnsUnpinned: 'All columns unpinned',
  reorderColumn: (columnId) => `Reorder ${columnId} column`,
  resizeColumn: (columnId) => `Resize ${columnId} column`,
  columnResized: (columnId, size) => `${columnId} column width ${size} pixels`,
  columnPinned: (columnId, edge) => `${columnId} column pinned to ${edge}`,
  columnUnpinned: (columnId) => `${columnId} column unpinned`,
  columnMoved: (columnId, position, total) =>
    `${columnId} column moved to position ${position} of ${total}`,
  columnPosition: (columnId, position, total) =>
    `${columnId} column at position ${position} of ${total}`,
  columnReorderHint: (columnId) =>
    `${columnId} column: use the arrow keys to move it, then Enter or Escape to finish`,

  rowActions: 'Row actions',
  bulkActions: 'Bulk actions',
  clearSelection: 'Clear selection',

  expandChildren: (level) => `Expand children, level ${level}`,
  collapseChildren: (level) => `Collapse children, level ${level}`,
  // "group" stays in the sentence: the original was `Expand group Engineering`, and
  // dropping the noun changed the announcement. Caught by the grouping tests.
  expandGroup: (group) => `Expand group ${group}`,
  collapseGroup: (group) => `Collapse group ${group}`,
  treeLoadError: 'Could not load child items',
  detailColumnHeader: 'Details',
  toggleDetails: 'Toggle details',

  errorTitle: 'Something went wrong',
};

/* eslint-disable unused-imports/no-unused-vars -- declaration merging requires
   every augmentation to repeat the target's type-parameter list verbatim, so
   `TData` must be named even in a group whose shape does not use it. */
declare module './registry' {
  interface DataGridGroupedConfigMap<TData> {
    /**
     * Strings DataGrid renders itself (PLTFRM-93117). Anything omitted keeps its
     * English default; interpolated members are functions.
     */
    labels: DataGridLabels;
  }
  interface DataGridResolvedConfigMap<TData> {
    labels: ResolvedDataGridLabels;
  }
}
/* eslint-enable unused-imports/no-unused-vars */

// No `DataGridIdentityFreeMap` entry: a label is a string, not a per-row fact, so
// nothing here needs stable row identity.

export const labelsConfig = defineDataGridConfig({
  key: 'labels',
  kind: 'grouped',
  aliases: [],

  resolve({ props }) {
    const config = props.labels;

    // A shallow merge, and per member rather than deep, because every value is a
    // string or a function — there is no nested shape for a deep merge to reach.
    // `undefined` members fall through to the default, so a caller spreading a
    // partial translation object with explicit `undefined`s behaves the same as
    // one that omits the keys.
    if (config === undefined) {
      return { value: DATA_GRID_DEFAULT_LABELS, warnings: [] };
    }

    const resolved = { ...DATA_GRID_DEFAULT_LABELS };
    for (const key of Object.keys(
      DATA_GRID_DEFAULT_LABELS
    ) as (keyof DataGridLabels)[]) {
      const override = config[key];
      if (override !== undefined) {
        // The cast is the index signature's fault, not the value's: `resolved[key]`
        // and `config[key]` are the same union per key, but TypeScript widens both
        // sides independently when the key is a variable.
        (resolved as Record<string, unknown>)[key] = override;
      }
    }

    return { value: resolved, warnings: [] };
  },
});
