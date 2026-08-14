import type { DataTableRowRange } from '../../data-table/data-table-features/virtualization';
import { defineDataGridConfig } from './registry';

// OWNERSHIP: **U6**. The `virtualization` behavior group (design §5.2).
//
// The mechanism is not here and not in a contribution point: windowing wraps the
// whole row list rather than decorating one row, so it lives in the named seam
// `../../data-table/data-table-body-window.ts`, which U6a already replaced with a
// `@tanstack/react-virtual` implementation. This file is only the public prop and
// its route to that seam — `controllerOptions` → the DataTable `virtualization`
// config → `useDataTableBodyWindow`'s `config`.
//
// ── This group carries no defaults, deliberately ─────────────────────────────
//
// Design §5.2's defaults (40px, `fixed`, overscan 8) are **already implemented in
// the seam** (`DEFAULT_ROW_HEIGHT`, `DEFAULT_OVERSCAN`, and `measure === 'dynamic'`
// read as a flag). So `resolve` here passes through **only the members the caller
// actually set** and manufactures nothing.
//
// That is a departure from `tree`, which resolves `indent` against its own
// `DATA_GRID_TREE_DEFAULT_INDENT` and passes the result down — leaving the same
// design §5.2 number written in two files. Two constants for one default is a drift
// surface, and it is also the #60 hazard in miniature: once a value is always
// present, nothing downstream can tell "the caller chose 40" from "nobody chose
// anything". Passing through only what was set keeps one source of truth per default
// and keeps that distinction intact.
//
// ── The bounded-height precondition is NOT checked here ──────────────────────
//
// Virtualization requires a bounded scroll container (design §5.1), and it would be
// natural to warn at resolve time when neither `appearance.height` nor
// `appearance.maxHeight` is set. **The seam already owns that check and its version
// is strictly better**, so duplicating it would only produce two console errors for
// one mistake:
//
//  - It reads `data-bounded` off the element that actually scrolls, so it verifies
//    the height *reached the DOM* rather than that a prop was passed — a
//    config-shape check cannot tell those apart.
//  - It carries a second, geometric check the config layer could not express at
//    all. It compares the viewport against the box that bounds it, which catches a
//    constraint that was *accepted* and still failed to bound — today that is a
//    PERCENTAGE `height`/`maxHeight`, which computes to `auto` against the outer
//    box's indefinite height, so the viewport grows to its content and reports
//    itself bounded. No config-shape check can see that; it is a computed-style
//    outcome, not a config shape.
//
//    (An earlier version of this bullet said `maxHeight` *alone* could not bound.
//    That was true until `4be051e1` moved the constraints onto the element that
//    actually scrolls, and false by the time it was written here.)
//
// So this module deliberately warns about nothing. If a config-shape warning is ever
// wanted it belongs beside the DOM one, and it needs a reason the DOM check does not
// already cover.

/**
 * Row windowing. Every member is optional; the seam supplies design §5.2's defaults
 * (40px row estimate, `fixed` measurement, overscan 8).
 *
 * **Requires a bounded height** — `appearance.height` or `appearance.maxHeight`.
 * Without one there is no viewport to window against and every row renders; the
 * engine reports that against the DOM rather than against this config.
 */
export interface DataGridVirtualizationConfig {
  /**
   * Row height estimate in px, or a function of the row index. Only an estimate:
   * with `measure: 'dynamic'` real heights replace it as rows are measured.
   */
  estimateRowHeight?: number | ((rowIndex: number) => number);
  /**
   * `'fixed'` trusts `estimateRowHeight`; `'dynamic'` measures each rendered row.
   * Dynamic is correct for variable-height content and costs a measurement pass.
   */
  measure?: 'fixed' | 'dynamic';
  /** Rows rendered beyond each edge of the viewport, to cover fast scrolling. */
  overscan?: number;
  /** Scrolls this row index into view, and again whenever the value changes. */
  scrollToIndex?: number;
  /**
   * LOCAL(ui_tools): observes the rendered row range as it moves.
   *
   * Purely an observer. The fetch trigger built on the same signal is
   * `server.onEndReached`, which this module composes ahead of this handler in
   * exactly the way `callbacks.ts` composes `server.onQueryChange` ahead of
   * `callbacks.onQueryChange` — one signal, an authoritative consumer and an
   * observing one, rather than two mechanisms.
   *
   * Indices are **display-row** indices and `endIndex` is the last overscanned
   * row; see `DataTableRowRange`.
   */
  onRangeChange?: (range: DataTableRowRange) => void;
}

export interface ResolvedDataGridVirtualization {
  readonly enabled: boolean;
  /**
   * The caller's members, unresolved on purpose — an absent member here means "the
   * caller said nothing", and the seam's own default applies. See the no-defaults
   * note at the top of this file.
   */
  readonly estimateRowHeight?: number | ((rowIndex: number) => number);
  readonly measure?: 'fixed' | 'dynamic';
  readonly overscan?: number;
  readonly scrollToIndex?: number;
  readonly onRangeChange?: (range: DataTableRowRange) => void;
  /**
   * LOCAL(ui_tools): the composed range handler this module hands the seam, or
   * `undefined` when neither a server fetch trigger nor an observer is
   * configured. Published as a ready-made closure so nothing downstream — and
   * nothing in the seam — learns what a server config is.
   */
  readonly onEndReached?: (range: DataTableRowRange) => void;
  readonly endReachedThreshold?: number;
}

/* eslint-disable unused-imports/no-unused-vars -- declaration merging requires
   every augmentation to repeat the target's type-parameter list verbatim, so
   `TData` must be named even in a group whose shape does not use it. */
declare module './registry' {
  interface DataGridGroupedConfigMap<TData> {
    /**
     * Row windowing: only the rows near the viewport are rendered.
     * `false`/omitted disables it. Requires `appearance.height` or
     * `appearance.maxHeight`.
     *
     * Windowing applies to the **display-row** list rather than to the record rows,
     * which is what keeps row index and count metadata intact for a windowed table
     * (design §7).
     */
    virtualization: false | DataGridVirtualizationConfig;
  }
  interface DataGridResolvedConfigMap<TData> {
    virtualization: ResolvedDataGridVirtualization;
  }
  // No `DataGridIdentityFreeMap` entry. Windowing is presentation over the rendered
  // list and is keyed by INDEX, never by row id — design §3.1's list of
  // identity-bearing features does not include it, and `scrollToIndex` is an index by
  // name. So a grid may virtualize without `getRowId`;
  // `../__tests__/props-virtualization.types.test.ts` asserts that absence, because
  // adding the entry would silently force identity on every caller and read as
  // intended.
}
/* eslint-enable unused-imports/no-unused-vars */

export const virtualizationConfig = defineDataGridConfig({
  key: 'virtualization',
  kind: 'grouped',
  // No deprecated flat aliases: `virtualization` is new DataGrid surface, so there is
  // no shipped boolean prop for it to normalize.
  aliases: [],

  resolve({ props, resolved }) {
    const config =
      props.virtualization !== undefined && props.virtualization !== false
        ? props.virtualization
        : undefined;
    const enabled = config !== undefined;

    /* ── LOCAL(ui_tools): the server fetch trigger, composed here ─────────────
       `server.onEndReached` is a server member and its mechanism is a windowing
       one, so the two have to meet somewhere. Here rather than in `server.ts`,
       for the same reason `pagination.tsx` reads `server` rather than the other
       way round: the manifest puts `server` first, so this module can see it and
       it cannot see this one. Composing here also keeps the seam ignorant of
       server mode — it receives one closure and one number. */
    const server = resolved.server?.config;
    const warnings: string[] = [];

    if (server?.onEndReached !== undefined && !enabled) {
      warnings.push(
        'DataGrid: `server.onEndReached` needs `virtualization` — the trigger is the rendered row range, and an unwindowed grid renders every row, so there is no range to reach the end of. Enable `virtualization` (with `appearance.height`/`appearance.maxHeight`), or drive loading from `server.onQueryChange` instead.'
      );
    }

    // Both affordances navigate the same result set, in incompatible ways: the
    // footer replaces the window, the scroll trigger extends it. Keyed to the
    // resolved chrome flag rather than to the prop, because in server mode the
    // footer is on unless the caller passed `pagination: false`.
    if (server?.onEndReached !== undefined && resolved.pagination?.chrome) {
      warnings.push(
        'DataGrid: `server.onEndReached` renders alongside the pagination footer, which offers the same navigation by replacing the loaded window rather than extending it. Pass `pagination: false` for an infinite list, or drop `onEndReached` for a paged one.'
      );
    }

    const observe = config?.onRangeChange;
    const authoritative = server?.onEndReached;

    // Conditional spreads rather than `?? default`: an absent member must stay absent
    // all the way to the seam, or its default moves here.
    return {
      value: {
        enabled,
        ...(config?.estimateRowHeight === undefined
          ? {}
          : { estimateRowHeight: config.estimateRowHeight }),
        ...(config?.measure === undefined ? {} : { measure: config.measure }),
        ...(config?.overscan === undefined
          ? {}
          : { overscan: config.overscan }),
        ...(config?.scrollToIndex === undefined
          ? {}
          : { scrollToIndex: config.scrollToIndex }),
        ...(observe === undefined ? {} : { onRangeChange: observe }),
        ...(authoritative === undefined ? {} : { onEndReached: authoritative }),
        ...(server?.endReachedThreshold === undefined
          ? {}
          : { endReachedThreshold: server.endReachedThreshold }),
      },
      warnings,
    };
  },

  controllerOptions({ resolved }) {
    const {
      enabled,
      estimateRowHeight,
      measure,
      overscan,
      scrollToIndex,
      onRangeChange,
      onEndReached,
      endReachedThreshold,
    } = resolved.virtualization;

    // `false` when off, not an omitted key: the seam treats *any* object as enabled
    // (`enabled: value !== undefined`), so an empty object would turn windowing on
    // for every grid that never asked for it.
    return {
      virtualization: enabled
        ? {
            ...(estimateRowHeight === undefined ? {} : { estimateRowHeight }),
            ...(measure === undefined ? {} : { measure }),
            ...(overscan === undefined ? {} : { overscan }),
            ...(scrollToIndex === undefined ? {} : { scrollToIndex }),
            ...(onRangeChange === undefined ? {} : { onRangeChange }),
            ...(onEndReached === undefined ? {} : { onEndReached }),
            ...(endReachedThreshold === undefined
              ? {}
              : { endReachedThreshold }),
          }
        : false,
    };
  },
});
