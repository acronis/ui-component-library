import type { DataTableColumnsFeaturesConfig } from '../../data-table';
import type { DataTableColumnControls } from '../../data-table/data-table-features/columns';
import { DATA_GRID_ACTIONS_COLUMN_ID } from './actions';
import { DataGridColumnAnnouncer } from '../data-grid-column-announcer';
import { DataGridColumnHeaderControls } from '../data-grid-column-header-controls';
import { defineDataGridConfig } from './registry';
import { DATA_GRID_DETAIL_COLUMN_ID } from './detail-expansion';
import { DATA_GRID_SELECTION_COLUMN_ID } from './selection';

// OWNERSHIP: **U3 owns this file** — the `columnsFeatures` behavior group
// (design §5.2).
//
// The split with `data-table-features/columns.ts` follows the house rule that
// DataTable owns mechanics and DataGrid owns config. Two consequences worth
// stating, because both were tempting to do the other way round:
//
//  - **`lockSystemColumns` is resolved here, not there.** "System column" is a
//    DataGrid concept — `__select__` and `__actions__` are its own chrome — and
//    DataTable is the layer below and never imports from it. So the policy flag
//    resolves into a plain id list (`lockedColumnIds`) that the engine feature
//    can honor without knowing what a selection column is.
//  - **`fit` and `overflowTooltip` are carried, not implemented, here.** Both are
//    presentation, and presentation reaches the table through
//    `ColumnPresentation` on the DataTable side.
//  - **The header controls are rendered from here, into the engine's seam.**
//    `ui-spec/…/data-table/behavior.md`'s keyboard-manipulation scenario requires
//    that DataTable expose commands and announcement intents and render no handle
//    and no live region, so the resize handle and reorder grip are supplied as a
//    *renderer* (`renderHeaderControls`) the engine mounts as an `edge` header
//    adornment — exactly as `detailExpansion.render` is supplied.
//
// This file is a `.tsx` because of those two contributions. The `.ts` was removed
// in the same commit: with both present, `./columns-features` is ambiguous and Vite
// and `tsc` resolve it differently — the failure that cost an hour when `footer.ts`
// and `footer.tsx` coexisted for one commit.
//
// The column-settings menu is rendered by `toolbar.tsx` (it belongs to the toolbar
// row) from this group's resolved flags. That is why `chrome` here contributes only
// the live region.

export interface DataGridColumnsFeaturesConfig {
  /** Offer column show/hide. */
  visibility?: boolean;
  /** Offer pinning a column to the start or end edge. */
  pinning?: boolean;
  /** Offer column resizing — a drag handle, and arrow keys once it has focus. */
  resizing?: boolean;
  /**
   * Offer column reordering — a grip that can be dragged onto another column, or
   * activated and driven with the arrow keys, either way inside its pin region.
   *
   * Both paths drive the engine's one `moveTo`/`moveBy` pair and announce the same
   * sentence, so neither is a reduced version of the other. A pointer drag commits
   * once, on release, and Escape abandons it; the keyboard path applies each arrow
   * press as it happens, so its Escape ends the interaction rather than undoing it.
   */
  reordering?: boolean;
  /**
   * How sizing commits during a resize drag. `'onEnd'` (the default) writes once
   * on release; `'onChange'` writes every pointer move and re-renders the table
   * per frame.
   */
  resizeMode?: 'onChange' | 'onEnd';
  /**
   * Width distribution. `'content'` sizes to content, `'container'` distributes
   * remaining width among flexible columns, `false` disables fitting. Explicit
   * column sizes always win (design §6.10).
   *
   * ⚠ **`'content'` and `'container'` render identically today.** Measured: the two
   * produce byte-identical captures (0 of 1,024,000 px) and column widths agreeing to
   * the decimal. `'content'` emits `min-width: fit-content` and `'container'` emits
   * nothing, but a `min-width` *floor* below the width auto-layout already
   * distributes is inert — so the pair is currently a distinction without a
   * rendering. What both do change is dropping the default `min-width: 150px` floor,
   * which visibly redistributes unsized columns from even to content-driven. See
   * `__stories__/data-grid-columns-features.stories.tsx`'s `FitContentOnly`.
   */
  fit?: 'content' | 'container' | false;
  /**
   * Show a tooltip when a cell's content is truncated.
   *
   * ⚠ **Truncation needs a capped column; this flag alone will not produce any.** It
   * adds `truncate` (`white-space: nowrap` + `text-overflow: ellipsis`), and `nowrap`
   * makes the column's min-content width the whole string — so under `w-full` +
   * `table-layout: auto` the browser widens the column to fit it and nothing ever
   * reaches an overflow edge. Measured on verbose values with no `maxSize`: the table
   * grew past its container and **0 of 16 body cells clipped**. Declare `maxSize` (or
   * `size` + `maxSize`) on the columns that should truncate.
   */
  overflowTooltip?: boolean;
  /**
   * Keep the selection, detail-expander and actions columns in place. Defaults
   * to `true` (design §6.9).
   */
  lockSystemColumns?: boolean;
}

export interface ResolvedDataGridColumnsFeatures {
  /**
   * Whether any of the four user-facing **affordances** is on — `visibility`,
   * `pinning`, `resizing`, `reordering`.
   *
   * ⚠ **NOT "any member of the group".** `fit` and `overflowTooltip` are excluded
   * deliberately: they are presentation, they offer the user no control, and two of
   * this flag's three readers key behaviour off "is there an affordance?" rather than
   * "did the caller configure anything?" — see the enumeration in
   * `controllerOptions`. It said "any sub-feature enabled" until #96, which was
   * false, and reading it as true is what made the discard guard there look correct.
   */
  readonly enabled: boolean;
  readonly visibility: boolean;
  readonly pinning: boolean;
  readonly resizing: boolean;
  readonly reordering: boolean;
  readonly resizeMode: 'onChange' | 'onEnd';
  readonly fit: 'content' | 'container' | false;
  readonly overflowTooltip: boolean;
  /** Columns the engine must refuse to move, pin or resize (design §6.9). */
  readonly lockedColumnIds: readonly string[];
}

/* eslint-disable unused-imports/no-unused-vars -- declaration merging requires
   every augmentation to repeat the target's type-parameter list verbatim, so
   `TData` must be named even in a group whose shape does not use it. */
declare module './registry' {
  interface DataGridGroupedConfigMap<TData> {
    /**
     * Column visibility, pinning, resizing, reordering, fit, and overflow
     * tooltips. `false`/omitted leaves the column set fixed.
     */
    columnsFeatures: false | DataGridColumnsFeaturesConfig;
  }
  interface DataGridResolvedConfigMap<TData> {
    columnsFeatures: ResolvedDataGridColumnsFeatures;
  }
}
/* eslint-enable unused-imports/no-unused-vars */

// No `DataGridIdentityFreeMap` entry: every member of this group is keyed by
// column, so none of it needs stable row identity and all of it stays available
// without `getRowId`.

/**
 * The `edge` header adornment for one column.
 *
 * **Returning `undefined` when the column has no affordances is load-bearing, not
 * tidiness.** The engine treats a rendered node as "this header hosts a control"
 * and hands it to `<TableHead trailing>`, and an occupied `trailing` slot changes
 * the header's markup — it switches to naming itself from an explicit label region.
 * Returning an element whose component then renders `null` would apply that change
 * to every locked and non-resizable column, for nothing.
 *
 * Declared at module scope so its identity is stable across renders.
 */
function renderColumnHeaderControls(controls: DataTableColumnControls) {
  if (!controls.canResize && !controls.canReorder) return undefined;
  return <DataGridColumnHeaderControls controls={controls} />;
}

export const columnsFeaturesConfig = defineDataGridConfig({
  key: 'columnsFeatures',
  kind: 'grouped',
  aliases: [],

  resolve({ props }) {
    const config = props.columnsFeatures;

    if (config === undefined || config === false) {
      return {
        value: {
          enabled: false,
          visibility: false,
          pinning: false,
          resizing: false,
          reordering: false,
          resizeMode: 'onEnd',
          fit: false,
          overflowTooltip: false,
          lockedColumnIds: [],
        },
      };
    }

    const visibility = config.visibility ?? false;
    const pinning = config.pinning ?? false;
    const resizing = config.resizing ?? false;
    const reordering = config.reordering ?? false;

    // Locked by default, per §6.9. Only an explicit `false` unlocks, so `{}`
    // keeps the system columns in place.
    //
    // **`__detail__` joined this set with #91, and its absence was an oversight
    // rather than a decision** — the expander was movable, pinnable and resizable
    // while its two siblings were not. The invariant is that the **locked set
    // matches the generated set**: these are exactly the three columns DataGrid
    // generates as its own chrome (`detail-expansion.tsx:116` documents the order
    // `[__select__, __detail__, …data, __actions__]`), and none of them is a
    // caller's column to reorder.
    //
    // This is also the *only* control over chrome resizing, deliberately.
    // `enableResizing: false` on the generated column defs would be absolute and
    // would make `lockSystemColumns: false` unreachable — see
    // `chrome-column.ts`, which explains why it is not set there.
    const lockedColumnIds =
      config.lockSystemColumns === false
        ? []
        : [
            DATA_GRID_SELECTION_COLUMN_ID,
            DATA_GRID_DETAIL_COLUMN_ID,
            DATA_GRID_ACTIONS_COLUMN_ID,
          ];

    return {
      value: {
        enabled: visibility || pinning || resizing || reordering,
        visibility,
        pinning,
        resizing,
        reordering,
        resizeMode: config.resizeMode ?? 'onEnd',
        fit: config.fit ?? false,
        overflowTooltip: config.overflowTooltip ?? false,
        lockedColumnIds,
      },
    };
  },

  controllerOptions({ resolved }) {
    const {
      enabled,
      pinning,
      resizing,
      reordering,
      resizeMode,
      fit,
      overflowTooltip,
      lockedColumnIds,
      visibility,
    } = resolved.columnsFeatures;

    // The column slices are always tracked by the engine feature, so a grid with
    // no affordances still honors a controlled `columnOrder`/`columnSizing`
    // slice. Passing `false` would be a behavior change, not a no-op, so pass
    // `undefined` and let the engine keep its shipped wiring.
    //
    // ── #96: THIS GUARD, DELIBERATELY, AND NOT `enabled` ITSELF ────────────────
    // **The question here is "does the ENGINE need this config?", which is not the
    // question `enabled` answers.** `enabled` is the four user-facing affordances;
    // the engine's `columnPresentation` also consumes `fit` and `overflowTooltip`,
    // and those two were resolved, carried in the resolved value, and then discarded
    // right here — so `columnsFeatures={{ fit: 'content' }}` or
    // `{{ overflowTooltip: true }}` reached nothing at all, and both documented props
    // only worked when an unrelated affordance happened to be switched on.
    //
    // **Adding them to `enabled` would fix this reader and break another.**
    // `enabled` has three readers and they do not ask the same thing:
    //
    //  1. here — "does the engine need the config?" → must include both members.
    //  2. `toolbar.tsx`: `visibility: columns.enabled ? columns.visibility : true`.
    //     The `true` fallback is deliberate and documented there — a grid that never
    //     opted in still gets the column list, because that is what the control the
    //     menu replaced always did. Widening `enabled` flips that ternary for a
    //     `{ fit: 'content' }` caller (`enabled` true, `visibility` false) and
    //     **silently removes the column list from their settings menu**. Measured:
    //     the last case in `data-grid-columns-features-fit-tooltip.test.tsx` fails
    //     with `enabled` widened, and it exists to keep that from being "tidied" in.
    //  3. `chrome` below: `columns.enabled || (toolbar.enabled && toolbar.viewOptions)`
    //     decides whether to mount the announcer. Widening it mounts a live region
    //     for a config that produces no announcements — `fit` and `overflowTooltip`
    //     announce nothing.
    //
    // So the shared flag keeps its meaning and the one guard that was asking the
    // wrong question is the only thing that changes. Fixing a value by widening a
    // flag that three readers share is the same shape as the defect itself.
    //
    // `fit !== false` rather than `fit`: the type is
    // `false | 'content' | 'container'`, where `false` is the *designated* off value.
    // Truthiness happens to agree today only because no member is falsy, so it is a
    // test that relies on the absence of a value nobody has needed yet; comparing
    // against `false` states the contract instead of the accident.
    const engineNeedsConfig = enabled || fit !== false || overflowTooltip;
    if (!engineNeedsConfig) return { columnsFeatures: undefined };

    const columnsFeatures: DataTableColumnsFeaturesConfig = {
      visibility,
      pinning,
      resizing,
      reordering,
      resizeMode,
      fit,
      overflowTooltip,
      lockedColumnIds,
      renderHeaderControls: renderColumnHeaderControls,
    };
    return { columnsFeatures };
  },

  chrome(slot, { controller, resolved }) {
    if (slot !== 'bottom') return null;

    const columns = resolved.columnsFeatures;
    // Reading another group is legal in `chrome` — unlike `resolve`, it receives
    // every group already resolved, regardless of manifest position.
    const toolbar = resolved.toolbar;
    // The region is only worth mounting if something can announce into it: the
    // header controls (this group) or the column-settings menu (the toolbar's, but
    // driven by this group's flags and announcing column preferences).
    const announces =
      columns.enabled || (toolbar.enabled && toolbar.viewOptions);

    return announces ? (
      <DataGridColumnAnnouncer table={controller.table} />
    ) : null;
  },
});
