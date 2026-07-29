import type {
  CSSProperties,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
  TouchEvent as ReactTouchEvent,
} from 'react';
import type { Column, ColumnDef, Header, Table } from '@tanstack/react-table';

import { cn } from '@/lib/utils';
import {
  defineDataTableFeature,
  type DataTableFeatureContext,
} from './registry';
import { resolveUpdater } from './translate';

// OWNERSHIP: created by F2 with the shipped state wiring; **U3 owns this file**
// and completes the `columnsFeatures` group here.
//
// Two design rules live here rather than in the DataGrid layer, and they are why
// pinning, resizing, reordering and fitting are one unit instead of four:
//
//  - **§6.9 pin regions win over order.** A reorder stays inside the moving
//    column's pin region unless the action explicitly unpins, so `moveTo` has to
//    know the pin state to compute a legal target. Selection and actions columns
//    are locked by default (`lockSystemColumns`).
//  - **§6.10 explicit size constraints win**, and fit only distributes the width
//    that is left. So `fit` cannot be resolved without knowing which columns the
//    *caller* sized — and neither `getSize()` nor `columnDef.size` can tell you,
//    because TanStack merges its 150px default into the resolved def. Only the
//    caller's own `options.columns` is ground truth; see `callerColumnSizing`.
//
// **Pin offsets are accumulated here, not in the primitive.** `Table` presents a
// pin at whatever offset it is handed; only this layer knows the column order and
// each column's width, so only it can compute how far a start-pinned column sits
// from the edge. `pinned`/`pinOffset` go through `ColumnPresentation` so the cell
// gets `data-pinned` — which every pin-related specificity step keys off, the
// z-ladder and the row's hover/selected tint rules alike. Setting the same
// geometry through `style` alone renders identically and silently loses both.

/**
 * Column behavior: visibility, order, size, pinning, and the fit/overflow rules.
 *
 * Every member is optional by design — the owning unit tightens optionality
 * inside this file, which keeps the options unions closed to Wave 1.
 */
export interface DataTableColumnsFeaturesConfig {
  readonly visibility?: boolean;
  readonly pinning?: boolean;
  /** Pointer-drag and keyboard resizing, through the header controls. */
  readonly resizing?: boolean;
  /**
   * Column reordering, through the header controls.
   *
   * **This layer still ships no gesture at all** — it publishes the commands
   * (`moveBy`, `moveTo`) and the drop-target *paint rule*, and a composer maps
   * whatever gesture it wants onto them. DataGrid's grip
   * (`data-grid-column-header-controls.tsx`) maps both a keyboard path and, since
   * #106, a pointer drag; a direct DataTable consumer maps its own.
   *
   * The one thing this layer contributes to the pointer path is presentational:
   * every header cell carries the `data-reorder-target` paint rule (see
   * `DROP_TARGET_CLASS`), so a composer's gesture can mark a drop target without
   * authoring colour of its own. Inert until something sets the attribute.
   */
  readonly reordering?: boolean;
  /**
   * When the sizing state commits during a drag. `'onEnd'` writes once on
   * release; `'onChange'` writes on every pointer move, which re-renders the
   * whole table per frame. Defaults to `'onEnd'`.
   */
  readonly resizeMode?: 'onChange' | 'onEnd';
  /** `false` disables fitting; otherwise fit to content or to the container. */
  readonly fit?: 'content' | 'container' | false;
  readonly overflowTooltip?: boolean;
  /**
   * Columns that may not be moved, pinned or resized (design §6.9) — they offer
   * no header controls at all.
   *
   * The ids rather than a `lockSystemColumns` flag, because "system column"
   * is a DataGrid concept — `__select__` and `__actions__` are its chrome, and
   * `DATA_GRID_SELECTION_COLUMN_ID` / `DATA_GRID_ACTIONS_COLUMN_ID` live on that
   * side. DataTable is the layer below and must not import from it, so the policy
   * (`columnsFeatures.lockSystemColumns`) resolves into this mechanism on the
   * DataGrid side. A direct DataTable consumer names its own locked columns.
   */
  readonly lockedColumnIds?: readonly string[];
  /**
   * Renders the column's own header chrome — a resize handle, a reorder grip —
   * into the header cell's `edge` adornment slot.
   *
   * **A renderer, so it belongs to whoever composes the table**, exactly as
   * `detailExpansion.render` does: `ui-spec/…/data-table/behavior.md`'s "Keyboard
   * column manipulation" scenario requires that DataTable expose the constrained
   * commands and announcement intents and render *no* handle and *no* live
   * region. DataGrid supplies this (`data-grid-column-header-controls.tsx`); a
   * direct DataTable consumer is the scenario's "custom composer".
   *
   * `edge` is the only placement a control may use — `before-label`/`after-label`
   * render inside the sort `<button>` on a sortable column, where a pointer
   * release fires `onSort`, Enter/Space sorts instead of acting, and the button's
   * accessible name absorbs the control's label.
   */
  readonly renderHeaderControls?: (
    controls: DataTableColumnControls
  ) => ReactNode;
}

/** Which pin region a column sits in. `false` is the scrollable middle. */
export type DataTableColumnPinRegion = 'start' | 'end' | false;

/**
 * TanStack models pinning as `'left' | 'right'`, which is physical. The neutral
 * contract is logical, and the Table primitive's pin hook takes `'start'`/
 * `'end'`, so translate at the boundary rather than leaking `left`/`right` into
 * the render contexts.
 */
function pinRegionOf<TData>(
  column: Column<TData, unknown>
): DataTableColumnPinRegion {
  const pinned = column.getIsPinned();
  if (pinned === 'left') return 'start';
  if (pinned === 'right') return 'end';
  return false;
}

/**
 * The sizing members the **caller** actually set, per column id.
 *
 * Never read these off `column.columnDef`. TanStack builds every column as
 * `{ ...defaultColumn, ...columnDef }` (`core/column.ts:71`) and merges
 * `defaultColumnSizing`, so the resolved def *always* carries `size` (150),
 * `minSize` (20) and `maxSize` (`Number.MAX_SAFE_INTEGER`). **A value with a
 * default cannot express "unset"**, so `!== undefined` on the resolved def is
 * always true and every column reads as explicitly constrained. That is how this
 * file once emitted `max-width: 9007199254740991px`.
 *
 * The caller's own array is the only ground truth. Ids are derived the way
 * TanStack does for the two ordinary cases; a column identified only by a string
 * `header` is not matched and is treated as unconstrained.
 */
interface CallerColumnSizing {
  readonly size?: number;
  readonly minSize?: number;
  readonly maxSize?: number;
}

function callerColumnSizing<TData>(
  table: Table<TData>
): ReadonlyMap<string, CallerColumnSizing> {
  const sizing = new Map<string, CallerColumnSizing>();

  const walk = (defs: readonly ColumnDef<TData, unknown>[]): void => {
    for (const def of defs) {
      const groupChildren = (def as { columns?: ColumnDef<TData, unknown>[] })
        .columns;
      if (groupChildren) walk(groupChildren);

      const id =
        def.id ??
        (def as { accessorKey?: string | number }).accessorKey?.toString();
      if (id === undefined) continue;
      if (
        def.size === undefined &&
        def.minSize === undefined &&
        def.maxSize === undefined
      ) {
        continue;
      }
      sizing.set(id, {
        ...(def.size === undefined ? {} : { size: def.size }),
        ...(def.minSize === undefined ? {} : { minSize: def.minSize }),
        ...(def.maxSize === undefined ? {} : { maxSize: def.maxSize }),
      });
    }
  };

  walk(table.options.columns ?? []);
  return sizing;
}

/**
 * The same answer, cached on the caller's own array.
 *
 * `callerColumnSizing` walks the whole column tree and `columnPresentation` runs
 * once per column per render, so an uncached read is quadratic in the column
 * count. The caller's array is the right key because it is the only thing that
 * would have to change for the answer to change.
 */
const callerSizingCache = new WeakMap<
  object,
  ReadonlyMap<string, CallerColumnSizing>
>();

function cachedCallerColumnSizing<TData>(
  table: Table<TData>
): ReadonlyMap<string, CallerColumnSizing> {
  const defs = table.options.columns;
  if (defs === undefined) return callerColumnSizing(table);

  const cached = callerSizingCache.get(defs);
  if (cached !== undefined) return cached;

  const sizing = callerColumnSizing(table);
  callerSizingCache.set(defs, sizing);
  return sizing;
}

/**
 * How far a pinned column sits from its edge — the accumulated width of the
 * columns pinned before it on the same side.
 *
 * Start-pinned columns accumulate left-to-right; end-pinned columns accumulate
 * **right-to-left**, because the one nearest the end edge has offset zero. Using
 * a single direction for both puts the end-pinned columns in reverse order, which
 * looks like a rendering bug rather than an arithmetic one.
 */
function pinOffsetOf<TData>(
  table: Table<TData>,
  column: Column<TData, unknown>
): number {
  const region = pinRegionOf(column);
  if (!region) return 0;

  const siblings =
    region === 'start'
      ? table.getLeftLeafColumns()
      : [...table.getRightLeafColumns()].reverse();

  let offset = 0;
  for (const sibling of siblings) {
    if (sibling.id === column.id) break;
    offset += sibling.getSize();
  }
  return offset;
}

/* ══════════════════════════════════════════════════════════════════════════════
   ⚠⚠ INVARIANT — TWO HALVES, AND REMOVING EITHER ONE MAKES THINGS WORSE THAN
       LEAVING BOTH OUT. Read this before deleting anything below (#107).

   The halves are `seedRenderedSize` (immediately below) and the `authored !==
   undefined` arm of `columnPresentation`'s `style`. They landed in ONE commit
   deliberately, and they must leave in one too.

     • BOTH present  — a restored width binds; a drag moves the edge by the pointer
                       distance; the drag indicator's residual is 0.0px.
     • NEITHER       — today's old behaviour: a restored 320px column rendered
                       643.1px, and a 60px drag moved the edge 82.0px.
     • HALF 1 ALONE  — the presentation arm without the seed. **A first drag of an
                       unsized column jumps BACKWARDS 139px**, because the engine
                       commits notional(150) + delta while the column renders 348.7.
                       This is the worst state of the three and it looks like a fix.

   *** WHY THIS COMMENT EXISTS RATHER THAN A TEST. ***
   The seed cannot fail loudly. If it stops running — a reordered handler, a changed
   React flush semantic, someone spreading only `onMouseDown`, someone "simplifying"
   a pointerdown that appears to do nothing — the code does not revert to the old
   behaviour. It reverts to HALF 1 ALONE, silently, and **nothing in CI catches it**:
   happy-dom performs no layout, every `getBoundingClientRect().width` is 0, and the
   seed's own zero-guard returns early, so every unit test passes either way. See #78
   — this workspace has no behavioural browser check, and this is the second feature
   whose correctness lives entirely outside CI (the first is the resize indicator).

   THE CONTRACT IT DEPENDS ON, so that a future reader can check whether it still
   holds: `pointerdown` is dispatched before `mousedown`, both are discrete-priority
   events in React, and React flushes a discrete event's state update synchronously
   before dispatching the next event. That is what makes the seed visible to the
   engine's own `header.getSize()` read inside `onMouseDown`. If any of those three
   clauses stops being true, half 2 is inert and half 1 must come out with it.
   ══════════════════════════════════════════════════════════════════════════════ */

/**
 * Writes the column's **rendered** width into `columnSizing` at the instant a resize
 * gesture begins, so the engine's notional size and the width on screen agree before
 * the engine reads either (#107).
 *
 * ── WHY THIS EXISTS AT ALL ───────────────────────────────────────────────────
 * TanStack computes a drag as `startSize + delta`, where `startSize` is
 * `header.getSize()` — a **notional** number: `columnSizing[id] ?? columnDef.size`,
 * i.e. its own 150px default for a column that declares no size. Under `w-full` +
 * `table-layout: auto` that column does not render at 150; measured, a column whose
 * notional size was 150 rendered **348.7px**. So the drag was arithmetic in one
 * coordinate system applied to an edge the user was watching in another, and every
 * symptom followed from that single mismatch:
 *
 *  - a 60px drag moved the edge **82.0px** (and 40px moved it 56.9 then 48.3 —
 *    non-linear, because raising a *floor* redistributes surplus across the other
 *    unsized columns rather than setting a width)
 *  - under `fit: 'container'` the drag moved the edge **0px** — the container arm
 *    emits no `min-width` at all, so the committed size had no CSS expression
 *  - the drag indicator's own arithmetic could only be honest about the *drag* and
 *    not the *outcome*, with residuals of +22.0 / -19.0px at 1280 and +72.2 / +6.1px
 *    at 1920 recorded in `data-table-resize-indicator.ts`
 *
 * Seeding the rendered width makes `startSize === measuredWidth`, at which point
 * `resizeIndicatorOffset`'s two coordinate systems collapse into one and it reduces
 * to the sized-column case its own comment calls exact.
 *
 * ── WHY `onPointerDown` AND NOT `onMouseDown` ────────────────────────────────
 * **The event order is the mechanism, not an implementation detail.** `startSize` is
 * a `const` local to TanStack's `getResizeHandler` closure, read at invocation — it
 * cannot be passed in. The only way to change what the engine reads is to change the
 * state it reads *from*, before it reads it. `pointerdown` fires before `mousedown`,
 * both are discrete-priority events in React, and React flushes a discrete event's
 * state update synchronously before dispatching the next one — so by the time
 * `onMouseDown` hands the native event to the engine, `getSize()` already returns the
 * seeded width. Moving this to `onMouseDown` would put the write and the read in the
 * same event and silently restore every symptom above.
 *
 * ⚠ **That ordering is verified in a browser and by nothing in CI.** happy-dom
 * performs no layout, so every `getBoundingClientRect().width` is 0 and the guard
 * below returns early — the seed is unreachable from a unit test. The conditional
 * `width` in `columnPresentation` that this pairs with *is* unit-testable, because it
 * reads state rather than layout.
 *
 * ── WHAT IT DELIBERATELY DOES NOT DO ─────────────────────────────────────────
 * Nothing when the notional size already matches what is rendered — a column that
 * declares `size` (the browser honours it, so they agree) or one that already carries
 * a sizing entry. That keeps this off the path #98 fixed, and it means no extra
 * `columnSizing` event where there is nothing to correct.
 */
function seedRenderedSize(
  event: ReactPointerEvent,
  ctx: DataTableFeatureContext<unknown>,
  column: Column<unknown, unknown>
): void {
  const cell = (event.target as Element | null)?.closest('th');
  if (cell === null || cell === undefined) return;

  const rendered = cell.getBoundingClientRect().width;
  // Zero means "no layout" — happy-dom, or a detached node — not "a zero-width
  // column". Writing 0 would clamp the column to its minimum on the next render.
  if (!(rendered > 0)) return;

  // Two decimals, matching what the engine itself writes
  // (`Math.round(size * 100) / 100`). Rounding to an integer here shifted the
  // measured 348.7 to 349 and moved two neighbouring columns by 0.2px — a seed whose
  // whole purpose is to be visually inert should not be the thing that moves.
  const seeded = Math.round(rendered * 100) / 100;
  if (Math.abs(seeded - column.getSize()) < 0.5) return;

  // `'pointer'`: the write originates in a pointer gesture, and an owner watching
  // `onStateChange` should see it as one rather than as an unexplained `'api'` call.
  ctx.requestChange(
    'columnSizing',
    (previous) => ({ ...previous, [column.id]: seeded }),
    'pointer'
  );
}

/* -------------------------------------------------------------------------- */
/*                    The header controls and their commands                  */
/* -------------------------------------------------------------------------- */

/**
 * What a column command changed — the "announcement intent" that
 * `ui-spec/…/data-table/behavior.md`'s keyboard-manipulation scenario requires
 * the render context to expose.
 *
 * **Structured, not a message string.** Wording and localization belong to
 * whatever renders the live region — design §4.3 puts live regions on the DataGrid
 * side, and the scenario says DataTable renders neither the handle nor the region.
 * So a command reports what it did and announces nothing itself.
 *
 * `undefined` from a command means **nothing changed**: the feature is off, the
 * column is locked, the move would leave the pin region, or the width was already
 * at its clamp. A composer announces nothing in that case.
 */
export type DataTableColumnIntent =
  | {
      readonly kind: 'resize';
      readonly columnId: string;
      readonly size: number;
    }
  | {
      readonly kind: 'pin';
      readonly columnId: string;
      readonly pinned: DataTableColumnPinRegion;
    }
  | {
      readonly kind: 'reorder';
      readonly columnId: string;
      /** 1-based position among the columns a person can see, after the move. */
      readonly position: number;
      readonly total: number;
    };

/**
 * The pointer half of resizing. TanStack owns the maths, so these forward the
 * **native** event: its handler reads `type`, `touches` and `clientX`, and calls
 * `persist` only if it exists — all true of the native event, and forwarding it
 * avoids casting React's synthetic type onto TanStack's DOM one.
 */
export interface DataTableColumnResizeHandleProps {
  /**
   * Runs before `onMouseDown` and must be spread with it (#107). See
   * `seedRenderedSize`: it writes the column's rendered width into `columnSizing` so
   * the engine's `startSize` and the edge on screen are the same number. Dropping it
   * from the spread makes every drag of an unsized column overshoot.
   */
  readonly onPointerDown: (event: ReactPointerEvent) => void;
  readonly onMouseDown: (event: ReactMouseEvent) => void;
  readonly onTouchStart: (event: ReactTouchEvent) => void;
}

/**
 * The constrained commands and measurements a header control needs.
 *
 * Published on the header render context as `columns` **and** handed to
 * `renderHeaderControls` — deliberately one shape, so the documented render
 * context and the chrome's argument cannot drift apart.
 */
export interface DataTableColumnControls {
  readonly columnId: string;
  readonly pinned: DataTableColumnPinRegion;
  readonly canPin: boolean;
  readonly pin: (
    next: DataTableColumnPinRegion
  ) => DataTableColumnIntent | undefined;
  /** The width the engine resolved — including its own 150px default. */
  readonly size: number;
  /**
   * Whether the **caller** set `size`. §6.10 ("an explicit size beats fit")
   * cannot be decided from `size`, which resolves through that default and so
   * reads as explicit for every column.
   */
  readonly hasExplicitSize: boolean;
  /** The effective minimum. A resize clamps up to it, never through it (§6.10). */
  readonly minSize: number;
  /**
   * The cap the **caller** set; `undefined` when they set none.
   *
   * Deliberately not the resolved `columnDef.maxSize`, which is
   * `Number.MAX_SAFE_INTEGER` when unset. That value is a harmless clamp and a
   * nonsense thing to publish: it already reached the DOM once as
   * `max-width: 9007199254740991px`, and as an `aria-valuemax` it would be the
   * same defect read out loud.
   */
  readonly maxSize?: number;
  readonly canResize: boolean;
  /** Commits a width. The keyboard path, where there is no drag to measure. */
  readonly resizeTo: (width: number) => DataTableColumnIntent | undefined;
  /** The drag path. Absent when resizing is off. */
  readonly resizeHandleProps?: DataTableColumnResizeHandleProps;
  readonly canReorder: boolean;
  /**
   * Moves this column to another column's position (§6.9: inside its own pin
   * region, and never onto or off a locked column).
   */
  readonly moveTo: (
    targetColumnId: string
  ) => DataTableColumnIntent | undefined;
  /**
   * Moves the column `delta` positions inside its own pin region — the keyboard
   * path.
   *
   * Neighbours are the **visible** columns of that region. Counting hidden ones
   * would let a keypress apply a reorder nobody can see, which reads as a dead
   * key; `visibility` is a sibling member of this very group, so that is a
   * configuration people will actually have.
   */
  readonly moveBy: (delta: number) => DataTableColumnIntent | undefined;
  /** 1-based position among the columns a person can see. */
  readonly position: number;
  readonly total: number;
}

/**
 * One factory for both consumers. `ctx.table()` is called in here, so every call
 * site must already be past construction — the header resolver and
 * `columnPresentation` both are.
 */
function columnControls(
  ctx: DataTableFeatureContext<unknown>,
  header: Header<unknown, unknown>,
  config: DataTableColumnsFeaturesConfig | undefined,
  isLocked: (columnId: string) => boolean,
  callerSizing: () => ReadonlyMap<string, CallerColumnSizing>
): DataTableColumnControls {
  const { column } = header;
  const region = pinRegionOf(column);
  const locked = isLocked(column.id);
  const caller = callerSizing().get(column.id);
  // A locked column offers no header controls at all, resizing included. The
  // scenario says system columns "stay locked unless explicitly unlocked", and a
  // focusable resize handle on a 40px checkbox column is not what anyone means by
  // locked. `lockSystemColumns: false` is the way to get them back.
  const canResize =
    Boolean(config?.resizing) && column.getCanResize() && !locked;
  const canReorder = Boolean(config?.reordering) && !locked;

  /** Positions are counted over what is on screen, not over the column order. */
  const perceived = (order: readonly string[]): readonly string[] => {
    const visible = new Set(
      ctx
        .table()
        .getVisibleLeafColumns()
        .map((leaf) => leaf.id)
    );
    return order.filter((id) => visible.has(id));
  };

  const moveTo = (
    targetColumnId: string
  ): DataTableColumnIntent | undefined => {
    if (!canReorder || isLocked(targetColumnId)) return undefined;
    const table = ctx.table();
    const target = table.getColumn(targetColumnId);
    // §6.9: the move is clamped to the column's own pin region. A target in
    // another region would silently jump the column across a pin boundary, which
    // reads as a pin change the user did not ask for.
    if (!target || pinRegionOf(target) !== region) return undefined;

    // `getAllLeafColumns` applies the `columnOrder` state (verified against
    // `table-core/core/table.js:191`), so this is the *current* order rather than
    // the definition order — which is what makes a second move build on the first.
    const order = table.getAllLeafColumns().map((leaf) => leaf.id);
    const from = order.indexOf(column.id);
    const to = order.indexOf(targetColumnId);
    if (from < 0 || to < 0 || from === to) return undefined;

    const next = [...order];
    next.splice(from, 1);
    next.splice(to, 0, column.id);
    ctx.requestChange('columnOrder', next);

    // Read the position out of `next`, not out of the table: the state change is
    // still in flight, so the engine would report the position before the move.
    const after = perceived(next);
    return {
      kind: 'reorder',
      columnId: column.id,
      position: after.indexOf(column.id) + 1,
      total: after.length,
    };
  };

  const visible = ctx.table().getVisibleLeafColumns();

  return {
    columnId: column.id,

    pinned: region,
    canPin: Boolean(config?.pinning) && !locked,
    pin: (next) => {
      if (!config?.pinning || locked || next === region) return undefined;
      // `'left'`/`'right'` is not a mismatch to tidy up. TanStack's pin API is
      // **physical**, so start-pinning is `left` even in a right-to-left locale
      // where the column appears on the right. The intent below says `start`
      // because that is what a person perceives; the call says `left` because
      // that is what the engine means. Making the two agree would break one.
      column.pin(next === 'start' ? 'left' : next === 'end' ? 'right' : false);
      return { kind: 'pin', columnId: column.id, pinned: next };
    },

    size: column.getSize(),
    hasExplicitSize: caller?.size !== undefined,
    // The resolved def always carries `minSize` (20 by default), so this is the
    // width a resize will actually stop at — publishing it is honest. `maxSize` is
    // the caller's, for the reason on the member itself.
    minSize: column.columnDef.minSize ?? 0,
    ...(caller?.maxSize === undefined ? {} : { maxSize: caller.maxSize }),
    canResize,
    resizeTo: (width) => {
      if (!canResize) return undefined;
      // §6.10: a minimum causes horizontal scroll rather than compression, so
      // clamp *up* to the minimum instead of letting a narrower value through.
      // The resolved maximum is `Number.MAX_SAFE_INTEGER` when unset, which makes
      // this clamp a no-op there rather than a wrong one.
      const min = column.columnDef.minSize ?? 0;
      const max = column.columnDef.maxSize ?? Number.POSITIVE_INFINITY;
      const clamped = Math.round(Math.min(Math.max(width, min), max));
      // Already at the clamp: nothing changed, so report nothing.
      if (clamped === column.getSize()) return undefined;
      ctx.requestChange('columnSizing', (previous) => ({
        ...previous,
        [column.id]: clamped,
      }));
      return { kind: 'resize', columnId: column.id, size: clamped };
    },
    ...(canResize
      ? {
          resizeHandleProps: {
            onPointerDown: (event) => seedRenderedSize(event, ctx, column),
            onMouseDown: (event) =>
              header.getResizeHandler()(event.nativeEvent),
            onTouchStart: (event) =>
              header.getResizeHandler()(event.nativeEvent),
          },
        }
      : {}),

    canReorder,
    moveTo,
    moveBy: (delta) => {
      if (!canReorder || delta === 0) return undefined;
      const table = ctx.table();
      // TanStack already keeps a visible, ordered list per pin region, which is
      // exactly the neighbour set §6.9 asks for.
      const siblings = (
        region === 'start'
          ? table.getLeftVisibleLeafColumns()
          : region === 'end'
            ? table.getRightVisibleLeafColumns()
            : table.getCenterVisibleLeafColumns()
      ).filter((sibling) => !isLocked(sibling.id));
      const index = siblings.findIndex((sibling) => sibling.id === column.id);
      if (index < 0) return undefined;
      const target = siblings[index + delta];
      // At the region edge. Refusing is the point: the alternative is a silent
      // jump across a pin boundary.
      if (target === undefined) return undefined;
      return moveTo(target.id);
    },
    position: visible.findIndex((leaf) => leaf.id === column.id) + 1,
    total: visible.length,
  };
}

/**
 * The drop affordance for a pointer reorder: the header cell the column will land
 * on. **Nothing at rest** — every rule is behind `[data-reorder-target]`, and no
 * code in this layer ever sets that attribute.
 *
 * ── WHY THE ATTRIBUTE IS THE SEAM, AND NOT A PROP ────────────────────────────
 * A drop target is a *transient* fact about a **sibling** cell: the gesture starts
 * on one column's grip and has to paint a different column's header. Routing that
 * through React state would mean a state change per pointer move — the exact cost
 * `resizeMode: 'onEnd'` and the resize indicator's drag-scoped subscription both
 * exist to avoid — and a seam threaded from the composer down through the feature
 * to a cell it does not own. An attribute the gesture toggles directly is one DOM
 * write per target change, no render, and no new seam. React never writes
 * `data-reorder-target`, so nothing here fights the gesture for it — which is also
 * why the gesture must clear it explicitly rather than expect a render to.
 *
 * ── WHY `outline` AND NOT `ring`/`shadow` ────────────────────────────────────
 * ⚠ **`box-shadow` is already taken on this element and would erase a border.**
 * `table.tsx`'s bordered arms paint the header's own rules as
 * `[&_th]:shadow-[inset_0_-1px_0_0_…]`; a `ring-*`/`shadow-*` utility here compiles
 * to the same property at the same specificity (`.bordered th` vs
 * `th[data-reorder-target]`, both 0-1-1), so which one survives would come down to
 * Tailwind's emission order rather than to anything stated. `outline` is unused on
 * a `<th>`, takes no layout space, and is not clipped by `truncate`.
 *
 * The colour is the resize drag's own active-border token on purpose: both are
 * transient feedback for a pointer gesture on a column, so they read as one
 * mechanism rather than two decorations.
 */
const DROP_TARGET_CLASS =
  '[&[data-reorder-target]]:bg-[var(--ui-table-header-cell-color-hover)] ' +
  '[&[data-reorder-target]]:outline-2 ' +
  '[&[data-reorder-target]]:-outline-offset-2 ' +
  '[&[data-reorder-target]]:outline-[var(--ui-resizable-border-color-active)]';

export const columnsFeature = defineDataTableFeature({
  id: 'columns',

  engineOptions(ctx) {
    const config = ctx.config as DataTableColumnsFeaturesConfig | undefined;

    return {
      // All four handlers are unconditional today: the column slices are always
      // tracked, and the features that *present* them are what U3 turns on.
      onColumnVisibilityChange: (updater) =>
        ctx.requestChange('columnVisibility', updater),
      onColumnOrderChange: (updater) =>
        ctx.requestChange('columnOrder', (previous) =>
          resolveUpdater(updater, [...previous])
        ),
      onColumnSizingChange: (updater) =>
        ctx.requestChange('columnSizing', updater),
      onColumnPinningChange: (updater) =>
        ctx.requestChange('columnPinning', (previous) => {
          const next = resolveUpdater(updater, {
            left: [...previous.left],
            right: [...previous.right],
          });

          // TanStack's pinning state allows either side to be absent; the neutral
          // contract requires both collections.
          return {
            left: next.left ?? [],
            right: next.right ?? [],
          };
        }),

      // `enableColumnPinning` only. TanStack's `enablePinning` is deprecated in
      // 8.21 in favour of the per-axis flags, and row pinning is not in scope.
      ...(config?.pinning ? { enableColumnPinning: true } : {}),
      ...(config?.resizing
        ? {
            enableColumnResizing: true,
            // Default to committing on release, where TanStack's own default is
            // 'onChange'.
            //
            // **Corrected: what this avoids is re-*laying-out* every row, not
            // re-rendering.** A render per pointer move happens either way —
            // `columnSizingInfo` (`startOffset`, `deltaOffset`) is written on every
            // move in both modes, and it is React state. What `'onChange'` adds is
            // a new `columnSizing` on every move, which changes the width of every
            // cell in the column and reflows the table. The earlier reason here was
            // wider than its mechanism.
            //
            // The consequence for presentation is why it matters: in this mode
            // **nothing moves while the drag is in flight**, so a resize with no
            // drag indicator is a blind operation. See
            // `data-table-resize-indicator.ts`, which reads the delta this mode
            // publishes but does not commit.
            columnResizeMode: config.resizeMode ?? 'onEnd',
          }
        : {}),
    };
  },

  renderContext(ctx) {
    const config = ctx.config as DataTableColumnsFeaturesConfig | undefined;
    const lockedIds = config?.lockedColumnIds ?? [];

    // `ctx.table` is a thunk and `renderContext` runs *before* `useReactTable`
    // returns, so calling it out here throws `Cannot access 'table' before
    // initialization`. Resolve on first use inside a resolver instead, and cache
    // — the caller's column defs cannot change without a new controller.
    //
    // **This rule has two failure modes and only one is loud.** Reading the thunk
    // during composition throws when the value is the `table` const itself, as
    // here — a TDZ error whose message never mentions the thunk. It fails
    // *silently* when the value comes from something published later, e.g. an
    // `effects` hook: you capture an inert stand-in and nothing complains. Having
    // seen one form is no help in recognising the other, which is why both are
    // named here rather than just the one that bit this file.
    let sizing: ReadonlyMap<string, CallerColumnSizing> | undefined;
    const callerSizing = () =>
      (sizing ??= cachedCallerColumnSizing(ctx.table()));

    /** §6.9: a locked column is neither movable nor pinnable. */
    const isLocked = (columnId: string) => lockedIds.includes(columnId);

    return {
      header: (header: Header<unknown, unknown>) => ({
        // The same object `renderHeaderControls` receives — see
        // `DataTableColumnControls`. This is the render context half of the
        // keyboard-manipulation scenario: commands and intents here, chrome
        // nowhere.
        columns: columnControls(ctx, header, config, isLocked, callerSizing),
      }),
    };
  },

  columnPresentation(ctx) {
    const config = ctx.config as DataTableColumnsFeaturesConfig | undefined;

    const { column, header } = ctx;
    const table = ctx.table();
    const region = pinRegionOf(column);
    const callerSizing = () => cachedCallerColumnSizing(table);
    const caller = callerSizing().get(column.id);
    const explicit = caller?.size !== undefined;

    // **An explicitly sized column publishes its width whether or not
    // `columnsFeatures` is configured, and that is the whole of #91's fix.**
    //
    // Everything below this block needs a config; declared sizing does not. The
    // early `if (!config) return undefined` that used to stand here made *every*
    // width conditional on an unrelated feature being switched on, with two
    // consequences that were invisible from either end:
    //
    //  • A caller's `size: 200` on a plain `<DataGrid>` reached nothing. Measured:
    //    no `width` and no `min-width` on any `<th>` in any configuration except
    //    `columnsFeatures` with one of `visibility|pinning|resizing|reordering`
    //    enabled — `{}`, `{fit:'content'}` and `{overflowTooltip:true}` all emit
    //    nothing, because `columns-features.tsx:167` leaves `fit` and
    //    `overflowTooltip` out of its `enabled` disjunction and `:197` then
    //    discards the config. (That second defect is #96 and is not fixed here.)
    //  • The generated chrome columns could not be narrowed at all in the default
    //    configuration. Declaring `size` on them would have worked only where
    //    `columnsFeatures` happened to be on — a fix that works in one prop
    //    combination and silently not the other, which is #76's and #84's shape.
    //
    // **Deliberately still gated on `config`: the fallback for UNSIZED columns.**
    // An unsized column keeps emitting nothing without `columnsFeatures`, exactly
    // as before, so this does not hand `min-width: 150px` to every column in the
    // kit. Only columns whose def actually declares sizing change behaviour.
    // `callerColumnSizing` walks `table.options.columns`, which is the
    // engine-*composed* array (`data-grid.tsx:212-223`), so a generated column
    // that declares `size` is visible to it — the name says "caller" but the
    // array includes the config layer's own columns, and that is what makes the
    // chrome widths reachable without a new seam.
    // **The LIVE width, not the number the def was written with.**
    // `column.getSize()` resolves to `columnSizing[id] ?? columnDef.size`, clamped
    // to the column's own bounds — so it is the *only* expression of a committed
    // resize. Reading `caller.size` here made a sized column **resize-inert**: the
    // handle worked, `columnSizing` updated, `getSize()` followed, and the emitted
    // `width` stayed at the definition's original number forever, with `minWidth`
    // pinned to it blocking compression as well. Inert in both directions, and
    // invisible from the interaction end, because every *other* half of the feature
    // was working — the reported symptom was "the indicator appears at a new spot
    // each time but the column width visually not changing".
    const size = column.getSize();

    /**
     * ⚠ **`width`/`minWidth` read the live size; `maxWidth` reads `caller.maxSize`.
     * The asymmetry is deliberate — do not "tidy" it into one source.**
     *
     * The rule this file lives by is that **a value with a default cannot express
     * "unset"**: TanStack builds every column as `{...defaultColumn, ...columnDef}`,
     * so the *resolved* def always carries `size` (150), `minSize` (20) and
     * `maxSize` (`Number.MAX_SAFE_INTEGER`) whether the caller set them or not.
     * That is why `callerColumnSizing` exists, and it is why reading a resolved
     * `maxSize` here once emitted `max-width: 9007199254740991px`. So `maxWidth`
     * stays on the caller's own def, where absent means absent.
     *
     * **That reasoning is sound outside this branch and void inside it.** The
     * hazard it guards against is a *default* masquerading as a caller's intent —
     * and this object only exists when `explicit` is true, i.e. when the def really
     * does declare a size. Inside the guard `getSize()` cannot fall through to the
     * 150px default, because `columnDef.size` is set; it returns the caller's
     * number until a resize records one, and the resize's number after. There is no
     * "unset" for it to fail to express.
     *
     * `maxSize` has no such guard — `explicit` says nothing about it — so it keeps
     * the caller-def read.
     */
    const declaredSizeStyle: CSSProperties | undefined = explicit
      ? {
          width: size,
          minWidth: size,
          ...(caller!.maxSize === undefined
            ? {}
            : { maxWidth: caller!.maxSize }),
        }
      : undefined;

    if (!config) {
      return declaredSizeStyle === undefined
        ? undefined
        : { style: declaredSizeStyle };
    }

    const lockedIds = config.lockedColumnIds ?? [];
    const isLocked = (columnId: string) => lockedIds.includes(columnId);

    // The header-cell seam (ADR-0002, BL-3a). Guarded on `header` because
    // `columnPresentation` also runs for every **body** cell, where there is no
    // `<TableHead>` to adorn — and a control duplicated into every row would be a
    // tab stop per cell.
    const controls =
      header === undefined || config.renderHeaderControls === undefined
        ? undefined
        : config.renderHeaderControls(
            columnControls(ctx, header, config, isLocked, callerSizing)
          );
    // A renderer that decides this column has no affordances returns nothing, and
    // then there is no adornment and no positioning context to establish.
    const hostsControls =
      controls !== undefined &&
      controls !== null &&
      controls !== false &&
      controls !== '';

    // §6.10: an explicit size wins outright. `fit` may only distribute what is
    // left, and a minimum causes horizontal scroll rather than compression — so
    // width is a floor (`minWidth`), never a cap, unless the caller asked for a
    // specific size.
    //
    // **The explicit arm is `declaredSizeStyle`, not a second computation of the
    // same thing.** Two expressions producing the same width, kept equal by
    // whoever edits them next, is the split brain #76 was and #84 repeated. This
    // is the one place a declared size is turned into CSS; the config'd path adds
    // the `fit` fallback for unsized columns on top of it.
    //
    // Both arms read `column.getSize()` (hoisted above `declaredSizeStyle`, which
    // needs it too) — but only the explicit arm may. `getSize()` returns TanStack's
    // 150px default for a column whose def declares no size, which is exactly the
    // value the unsized arm must not publish unasked; here it is reached only under
    // `config`, and `fit` decides whether it is emitted at all.
    // **A width somebody chose is published as a `width`, not as a floor (#107).**
    //
    // `columnSizing` only ever holds a number some person or some stored preference
    // *chose* — restored from storage, committed by a drag, or set through
    // `resizeTo`. `columnDef.size` and TanStack's 150px default are the notional
    // numbers; this slice is the authored one. Publishing it as `min-width` meant
    // storage could say 320 and the column render at **643.1px**, because a floor
    // below the width auto-layout already distributes does nothing at all — the same
    // mechanism as #91's `min-width: 150px` column rendering 209px, and #108's
    // `fit: 'content'` rendering identically to `fit: 'container'`.
    //
    // ⚠ **HALF 1 OF A TWO-PART FIX, AND WRONG ON ITS OWN — see the boxed INVARIANT
    // above `seedRenderedSize`.** Alone this fixes the restored width and regresses
    // every drag: the engine commits notional + delta, so a first drag of a column
    // rendering 348.7 with a notional 150 publishes 210 and the column jumps
    // *backwards* by 139px. That is worse than the defect it replaces, and nothing in
    // CI can see it. Measured: +60px of pointer travel moves the edge 82.0px with
    // neither half, 60.3px with both.
    //
    // **`minWidth` alongside `width` deliberately.** `width` is a suggestion to
    // `table-layout: auto` and loses to a cell's min-content contribution; the floor
    // is what keeps the browser from compressing below the chosen width, which is
    // §6.10's rule that a minimum causes horizontal scroll rather than compression.
    // It is the same pair `declaredSizeStyle` publishes, for the same reason.
    const authored = table.getState().columnSizing[column.id];
    const style: CSSProperties =
      declaredSizeStyle ??
      (authored !== undefined
        ? { width: size, minWidth: size }
        : config.fit === 'content'
          ? { minWidth: 'fit-content' }
          : config.fit === 'container'
            ? {}
            : { minWidth: size });

    const pinned = Boolean(config.pinning && region);
    const className =
      cn(
        // Truncate rather than wrap when a tooltip will carry the full value —
        // otherwise `overflowTooltip` would have nothing to reveal.
        config.overflowTooltip && 'truncate',
        // An `edge` adornment positions itself against the cell, so the cell has
        // to be the positioning context — which is what F2's seam note
        // anticipated ("positions itself with `className: 'relative'` from the
        // same contribution").
        //
        // Not when the cell is pinned: `pinAttributes` already makes it `sticky`,
        // itself a positioning context, and both utilities set `position`. Which
        // one won would then depend on Tailwind's emission order rather than on
        // anything stated here.
        hostsControls && !pinned && 'relative',
        // **Header cells only.** `columnPresentation` also runs for every body
        // cell, and a drop-target rule on a `<td>` is a rule nothing can ever
        // satisfy — the gesture marks header cells. Gated on `reordering` rather
        // than on `hostsControls` because the paint rule is what the *feature*
        // offers: a composer that renders its own grip still gets it.
        config.reordering && header !== undefined && DROP_TARGET_CLASS
      ) || undefined;

    return {
      style,
      ...(className === undefined ? {} : { className }),
      ...(hostsControls
        ? {
            headerAdornments: [
              {
                id: 'columns-controls',
                // `edge` is the only placement a control may take: it lands in
                // `TableHead`'s `trailing` slot, a **sibling** of the sort button,
                // where its pointer release does not sort, Enter/Space does not
                // sort, and its label stays out of the header's accessible name.
                placement: 'edge' as const,
                node: controls,
              },
            ],
          }
        : {}),
      // Pin through the hook, never through `style`. See the note at the top of
      // this file: `data-pinned` is what the z-ladder and the row's tint rules
      // key off, and it is not expressible as CSS.
      ...(pinned && region
        ? { pinned: region, pinOffset: pinOffsetOf(table, column) }
        : {}),
    };
  },
});
