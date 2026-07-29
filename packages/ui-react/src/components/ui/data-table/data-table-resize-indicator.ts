import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from 'react';
import type { Table as TanStackTable } from '@tanstack/react-table';

// ── The column-resize drag indicator (table-parity P1, unit F19) ─────────────
// A thin vertical line marking where the column's trailing edge will land, drawn
// while a resize handle is being dragged.
//
// **It is the only feedback a drag has.** `columnsFeatures` defaults
// `columnResizeMode` to `'onEnd'` (`data-table-features/columns.tsx`), so the
// column does not move until release: without this line, grabbing a handle
// produces no response at all and the new width appears when the pointer is
// already up. The line is not decoration on top of a working interaction — in the
// deferred mode it *is* the interaction's visible half.
//
// ── Why the line is painted on the container box, not in the header cell ──────
// The offset this module computes is consumed as a CSS custom property on
// `[data-slot="table-container"]` — `Table`'s `containerStyle` — and drawn by an
// `::after` rule that `containerClassName` supplies. Three reasons, and the first
// is the one that decides it:
//
//  1. **A line hosted inside the table would resize the scrollbar mid-drag.** A
//     `<th>` lives in the viewport's scrolled content, so a line long enough to
//     span the body has to overflow it downward — and bottom overflow from an
//     absolutely-positioned descendant is *scrollable* overflow, which grows the
//     viewport's `scrollHeight`. The vertical scrollbar would shrink while the
//     user drags. That is a worse artifact than having no indicator.
//  2. **The viewport is not an alternative**, even though `containerProps` already
//     reaches it. The viewport *is* the scroll container, so its own pseudo-element
//     and its absolutely-positioned children scroll with the content: the line
//     would drift away from the column on horizontal scroll and contribute
//     overflow of its own. That is why this needed a new seam on the box rather
//     than the seam that already existed.
//  3. The container box is the element that owns the region's edges — border,
//     radius, `overflow: hidden` and `width` all sit there (#90). The line is
//     clipped by that radius, which is intended: the radius belongs to the border,
//     and a guide that crossed the corner would paint over the boundary it is
//     measured against.
//
// The rule needs `z-index: 55` — see the z-ladder note in `table.tsx`. At
// `z-index: auto` the line paints *below* the z-50 pinned sticky header cells, so
// it vanishes across the header band, which is the one band a dragging pointer is
// in.

/**
 * The custom property the indicator's `left` reads.
 *
 * Deliberately not `--ui-*`: it is a computed geometry value local to this
 * mechanism, not a design token (the same distinction `--table-sticky-surface`
 * makes in `table.tsx`).
 */
const OFFSET_PROPERTY = '--table-resize-indicator-x';

/**
 * The `::after` that paints the line, on the container box.
 *
 * Built from the **`Resizable` tier**, which is the kit's own vocabulary for a
 * resize divider: `resizable.tsx` draws its separator as an `::after` of
 * `--ui-resizable-border-width` and paints it
 * `--ui-resizable-border-color-active` *while dragging*. This is the same object
 * in the same state, so it takes the same two tokens rather than a look-alike —
 * the header handle already borrows that component's 6px/1px geometry.
 *
 * `left` is physical on purpose. The offset is produced by rect arithmetic, which
 * is physical, so `inset-inline-start` would flip it in a right-to-left locale and
 * put the line on the wrong side of the table.
 */
/**
 * ⚠ **EVERY UTILITY HERE MUST BE A STATIC LITERAL. DO NOT INTERPOLATE
 * `OFFSET_PROPERTY` INTO IT, HOWEVER MUCH TIDIER THAT LOOKS.**
 *
 * This string used to end with `` + ` after:left-[var(${OFFSET_PROPERTY})]` ``,
 * and that one utility was **silently inert for the whole life of the feature**:
 * Tailwind's scanner is static text over source files, so a class name assembled
 * at runtime is never seen and no rule is generated. Measured in Chromium: the
 * pseudo-element rendered with the correct `width`, `z-index` and
 * `background-color` — all from the literal part — while `left` computed to `0px`,
 * pinning the line to the container's left edge on every drag regardless of column
 * or distance. Zero rules in the document mentioned the custom property.
 *
 * **Nothing in this repo could have caught it.** happy-dom has no Tailwind
 * pipeline and no CSSOM, the unit tests asserted the class string and the property
 * value and both were correct, and the visual gate cannot capture a drag. The
 * docblock above `left` reasoned carefully and correctly about physical vs logical
 * offsets for a declaration that never reached the stylesheet — which is why a
 * well-argued line is the last place anyone looks.
 *
 * `data-table-resize-indicator.test.tsx` guards this by reading **this file as
 * text** and asserting the complete literal is present. That is deliberate: a test
 * asserting the runtime *string* passes on the broken version too, because the
 * runtime string was always right. Only the source text distinguishes them.
 *
 * Built from the **`Resizable` tier**, the kit's own vocabulary for a resize
 * divider: `resizable.tsx` draws its separator as an `::after` of
 * `--ui-resizable-border-width` painted `--ui-resizable-border-color-active`
 * *while dragging*. Same object, same state, same two tokens.
 *
 * `left` is physical on purpose — the offset comes from rect arithmetic, which is
 * physical, so `inset-inline-start` would flip it in a right-to-left locale.
 */
const INDICATOR_CLASS =
  "after:pointer-events-none after:absolute after:inset-y-0 after:left-[var(--table-resize-indicator-x)] after:z-[55] after:w-[var(--ui-resizable-border-width)] after:bg-[var(--ui-resizable-border-color-active)] after:content-['']";

/**
 * The style object the container box takes while a drag is in flight.
 *
 * It **extends** `CSSProperties` rather than declaring the one property alone.
 * Not cosmetic: `CSSProperties` is a weak type (every member optional), so an
 * object type sharing no members with it is rejected outright — and the usual
 * escape, casting the literal, would strip contextual typing from everything
 * inside it. Extending keeps the property checked and the cast unnecessary.
 */
interface ResizeIndicatorStyle extends CSSProperties {
  readonly [OFFSET_PROPERTY]: string;
}

export interface ResizeIndicatorGeometry {
  /**
   * The resizing column's **leading** edge, in the container box's own
   * coordinates. Measured rather than derived: a column's start depends on the
   * columns before it, on the pin regions, and on horizontal scroll position.
   */
  readonly anchor: number;
  /**
   * `columnSizingInfo.startSize` — the column's **notional** width when the drag
   * began, i.e. `column.getSize()`.
   *
   * ⚠ **Notional is not rendered, and for an unsized column the two are wildly
   * different.** `getSize()` falls back to TanStack's 150px default, while the cell
   * actually renders at whatever `table-layout: auto` distributes to it — measured
   * 348.66px at a 1280px viewport and 562px at 1920px on the `Resizing` story. This
   * value drives the delta arithmetic and both clamps, which is correct because
   * those are what TanStack commits; it must **not** be used to locate the edge.
   * See `measuredWidth`.
   */
  readonly startSize: number;
  /**
   * The column's **rendered** width when the drag began, from its client rect.
   *
   * This exists because using `startSize` to place the line was a user-reported
   * defect: "for others its shown at place of previous column". The line was drawn
   * at `anchor + notional prospective width`, so on an unsized column it landed
   * ~199px short of the true trailing edge at 1280px and ~412px short at 1920px —
   * near the column's *leading* edge, which is the previous column's boundary. It
   * looked correct on the first column for one reason only: that column declares
   * `size: 200` and happens to render at exactly 200, so notional and rendered
   * agree there and nowhere else.
   *
   * **Zero means "no layout"**, as everywhere else in this module: happy-dom reports
   * every rect as zero, so `resizeIndicatorOffset` falls back to `startSize`, which
   * is the best estimate of a rendered width available without a layout engine — and
   * is what keeps this file's rendered tests meaningful.
   */
  readonly measuredWidth: number;
  /** `columnSizingInfo.deltaOffset` — pointer travel so far, in px. */
  readonly deltaOffset: number;
  /** The column's resolved minimum. TanStack defaults it to 20. */
  readonly minSize: number;
  /** The caller's maximum, or `Number.POSITIVE_INFINITY` when uncapped. */
  readonly maxSize: number;
}

/**
 * Where the line goes: the column's leading edge plus the width the drag will
 * actually commit.
 *
 * **The clamp is the whole point.** TanStack writes the dragged width into
 * `columnSizing` unclamped and clamps on *read*, in `column.getSize()` — so a
 * line tracking the raw `startSize + deltaOffset` keeps travelling after the
 * column has already stopped at its minimum. That is worse than no line, because
 * it asserts something false about where the edge will land.
 *
 * The arithmetic mirrors `table-core`'s `ColumnSizing.js` rather than the
 * algebraically equivalent `startSize + deltaOffset`, because two details of that
 * path are load-bearing and neither survives simplification: the percentage is
 * floored at `-0.999999`, and the committed value is rounded to two decimals. A
 * line computed the tidy way disagrees with the committed width in the last
 * fraction of a pixel at every position.
 *
 * **Leaf headers only.** A column-*group* header resizes each of its leaves
 * proportionally and each leaf clamps independently, so a single
 * `startSize`-based figure can diverge from the sum. Handles render per leaf
 * column today, so that shape is unreachable — which is not the same as handled.
 *
 * @returns the offset in px, or `undefined` when no line can be drawn — which is
 *   how "no indicator" is expressed, so a non-finite input cannot reach the DOM
 *   as `left: NaNpx`.
 */
export function resizeIndicatorOffset(
  geometry: ResizeIndicatorGeometry
): number | undefined {
  const { anchor, startSize, measuredWidth, deltaOffset, minSize, maxSize } =
    geometry;

  const deltaPercentage = Math.max(deltaOffset / startSize, -0.999999);
  const prospective =
    Math.round(Math.max(startSize + startSize * deltaPercentage, 0) * 100) /
    100;
  const clamped = Math.min(Math.max(prospective, minSize), maxSize);

  // ── The two coordinate systems, and the one term that crosses between them ──
  // `clamped` is a **notional** width: it is what TanStack will write into
  // `columnSizing`, computed from and bounded by notional numbers. The edge the user
  // is looking at is at a **rendered** position. Adding a notional width to a
  // measured anchor mixes the two, and that mix was the defect — on an unsized
  // column it drew the line up to 412px inside the column.
  //
  // So the notional side contributes only the **displacement** (`clamped -
  // startSize`, how much the committed width is allowed to change), and the measured
  // side contributes the **origin** (`anchor + width`, where the edge is now). Both
  // terms then live in the system they belong to.
  //
  // For a column whose declared size the browser honours, `width === startSize` and
  // this reduces exactly to the previous `anchor + clamped` — which is why the sized
  // column's behaviour, and every expectation recorded for it, is unchanged.
  //
  // The clamp keeps its documented meaning: when the notional width stops at a
  // bound, `clamped - startSize` stops changing and so does the line.
  //
  // ── WHAT THE LINE PROMISES, AND WHAT IT STILL CANNOT ─────────────────────────
  // For a column the browser sizes as declared, the line is exact: measured on
  // `name` (`size: 200`), the released edge lands where the line was, residual 0px at
  // both a 1280px and a 1920px viewport.
  //
  // **For an UNSIZED column it is honest about the drag but still approximate about
  // the outcome**, and that is a property of the column, not of this arithmetic. The
  // resize commits a *notional* width (150 → 210 for a +60 drag), and because the
  // unsized presentation arm publishes only `min-width`, `table-layout: auto` then
  // redistributes the surplus across every unsized column — so the edge moves by
  // something other than the pointer distance. Measured residuals after release, +60
  // drag: `region` +22.0px / `status` -19.0px at 1280, +72.2px / +6.1px at 1920.
  // Before this term existed the line was off by -198.7px and -412px *during* the
  // drag, i.e. before any redistribution — so this is a different and much smaller
  // error, but it is not zero and should not be reported as such.
  //
  // Closing that gap means making notional and rendered agree, i.e. publishing a
  // `width` for unsized columns too. That changes at-rest rendering for every
  // unsized column in the kit and is deliberately not done here.
  const width = measuredWidth > 0 ? measuredWidth : startSize;
  const offset = anchor + width + (clamped - startSize);

  // One guard, on the value that would reach the DOM, rather than a check per
  // input. Each input has its own way of poisoning the result — a zero
  // `startSize` divides, a `NaN` anchor survives every intermediate test because
  // it is only added at the end — and a guard that inspects the parts is a guard
  // that can be complete for the parts it names and wrong anyway.
  return Number.isFinite(offset) ? offset : undefined;
}

/**
 * How far apart two edges may measure and still count as the same edge.
 *
 * Sub-pixel layout rounding and a table border are the only things this needs to
 * absorb. It cannot confuse a trailing column with an inner one: the gap between
 * an inner column's trailing edge and the table's is the sum of the columns after
 * it, each of which is at least TanStack's `minSize` default of 20px.
 */
const TRAILING_EDGE_EPSILON_PX = 1;

export interface TrailingEdgeGeometry {
  /** The resizing column's **trailing** edge, in viewport coordinates. */
  readonly columnRight: number;
  /** The table element's right edge, in the same coordinates. */
  readonly tableRight: number;
  /** The table element's laid-out width. See `spansTableTrailingEdge`. */
  readonly tableWidth: number;
}

/**
 * Whether the resizing column's trailing edge *is* the table's right edge — the
 * case that draws no line at all.
 *
 * A drag on the last column has nowhere to put the width: the table is `w-full`
 * under `table-layout: auto`, so its right edge is fixed by the container and the
 * edge the line claims to be moving cannot move. Given the choice between growing
 * the table and dropping the line, the user chose dropping the line.
 *
 * ⚠ **THIS IS MEASURED, AND MUST NOT BE REWRITTEN AS AN INDEX** — no
 * `getVisibleLeafColumns().at(-1)`, no comparison against a column count.
 *
 * The question "is this column's edge the table's edge" is a question about
 * *rendered geometry*, and a column's index is not rendered geometry. Three things
 * in this component move the edge without moving the index, and two of them are
 * configured from the very same object as `resizing`:
 *
 *  • **Reordering** (`columnsFeatures.reordering` — enabled alongside resizing in
 *    the `ResizingAndReordering` and `EveryAffordance` stories) separates
 *    definition order from visual order.
 *  • **Pinning** (same config object) moves a column into a start/end band, so the
 *    trailing column of the centre band is not the trailing column of the table.
 *    Reachable through `columnControls.pin('end')` → `column.pin('right')`, even
 *    though the shipped settings menu currently only wires start-pinning.
 *  • **Horizontal scroll**, which moves every edge and no index at all.
 *
 * A client rect already accounts for all three, because it is the rendered truth
 * after all three — so measuring is not the careful option here, it is the only one
 * that asks the right question. It costs one extra rect on a pass that was already
 * reading `cell.getBoundingClientRect()`.
 *
 * **What is measured and what is not**, so the next reader knows which parts are
 * load-bearing: the suppression itself is verified in Chromium on the `Resizing`
 * story — `owner`'s trailing edge and the table's right edge both measure 1246px
 * and no line is drawn, while `name` and `region` are unaffected. The *pinned*
 * arrangement above has no story to verify it against and its layout was not
 * measured; it is stated as a reason to keep the predicate geometric, not as an
 * observed number.
 *
 * **A zero-width table reports `false`, not `true`.** Under happy-dom — and in any
 * un-laid-out or `display: none` subtree — every rect reads zero, which makes
 * `columnRight === tableRight` vacuously true for *every* column and would suppress
 * the indicator everywhere. This predicate is a comparison of two measurements, so
 * it requires there to have been a measurement; with no layout it declines to
 * answer and the line is drawn, which is the behaviour that existed before it.
 */
export function spansTableTrailingEdge(
  geometry: TrailingEdgeGeometry
): boolean {
  const { columnRight, tableRight, tableWidth } = geometry;

  // Written as `!(x > 0)` rather than `x <= 0` so a `NaN` width — an unmeasurable
  // element, not a narrow one — takes the declining branch too.
  if (!(tableWidth > 0)) return false;

  return Math.abs(tableRight - columnRight) <= TRAILING_EDGE_EPSILON_PX;
}

export interface DataTableResizeIndicator {
  /** `containerClassName` contribution — `undefined` when no drag is in flight. */
  readonly className: string | undefined;
  /** `containerStyle` contribution — `undefined` when no drag is in flight. */
  readonly style: ResizeIndicatorStyle | undefined;
  /**
   * Ref callback for a header cell, keyed by column id. Stable per id, so a
   * header does not detach and re-attach on every render.
   */
  readonly registerHeaderCell: (
    columnId: string
  ) => (node: HTMLTableCellElement | null) => void;
}

export interface UseDataTableResizeIndicatorOptions<TData> {
  readonly table: TanStackTable<TData>;
  /**
   * The **viewport**, which is what `Table`'s `containerRef` points at. Used as
   * the coordinate origin: it is `size-full` inside the container box, so its
   * client rect *is* that box's padding box — the containing block an absolutely
   * positioned `::after` on the box resolves against. Measuring against it
   * therefore needs no `scrollLeft` term, because a cell's client rect already
   * has scroll folded in.
   */
  readonly viewportRef: RefObject<HTMLDivElement | null>;
}

/**
 * Everything the commit-phase layout read produces, in one value.
 *
 * The two halves are measured **together, from the same pair of rects**, on
 * purpose: they are one observation of one layout, and splitting them into two
 * `useState`s would let a scroll update one before the other and paint a frame
 * that mixes the old suppression verdict with the new anchor.
 */
interface ResizeMeasurement {
  /** See `ResizeIndicatorGeometry.anchor`. */
  readonly anchor: number;
  /** See `ResizeIndicatorGeometry.measuredWidth`. Captured at drag start only. */
  readonly measuredWidth: number;
  /** `spansTableTrailingEdge` — when true, no line is drawn at all. */
  readonly atTrailingEdge: boolean;
}

export function useDataTableResizeIndicator<TData>({
  table,
  viewportRef,
}: UseDataTableResizeIndicatorOptions<TData>): DataTableResizeIndicator {
  const { isResizingColumn, startSize, deltaOffset } =
    table.getState().columnSizingInfo;

  const cellsRef = useRef(new Map<string, HTMLTableCellElement>());
  const callbacksRef = useRef(
    new Map<string, (node: HTMLTableCellElement | null) => void>()
  );
  const [measurement, setMeasurement] = useState<ResizeMeasurement | undefined>(
    undefined
  );

  const registerHeaderCell = useCallback((columnId: string) => {
    const existing = callbacksRef.current.get(columnId);
    if (existing !== undefined) return existing;
    const callback = (node: HTMLTableCellElement | null) => {
      if (node === null) cellsRef.current.delete(columnId);
      else cellsRef.current.set(columnId, node);
    };
    callbacksRef.current.set(columnId, callback);
    return callback;
  }, []);

  // The anchor is measured in the commit phase, never during render: it is a
  // layout read, and the value it produces is state the next render consumes.
  //
  // Re-measured on scroll for the duration of the drag only. The subscription
  // cannot be hoisted out of the drag: a `scroll` handler that runs when nothing
  // is being resized would set state on every scroll frame of every table.
  useEffect(() => {
    if (isResizingColumn === false) {
      setMeasurement(undefined);
      return;
    }

    const viewport = viewportRef.current;

    // Captured on the FIRST measure of this drag and reused by every scroll
    // re-measure. This closure lives exactly as long as the drag (the effect is
    // keyed on `isResizingColumn`), which is what makes "at drag start" expressible
    // without a ref that would outlive it.
    //
    // **Deliberately not re-read on scroll.** Under the default `'onEnd'` resize
    // mode the column does not move mid-drag, so re-reading would be harmless — but
    // under `resizeMode: 'onChange'` it does move, and a scroll would then fold the
    // in-progress resize into the origin and double-count it.
    let startWidth: number | undefined;

    const measure = () => {
      const cell = cellsRef.current.get(isResizingColumn);
      if (cell === undefined || viewport === null) {
        setMeasurement(undefined);
        return;
      }

      const cellRect = cell.getBoundingClientRect();
      startWidth ??= cellRect.width;
      // `closest`, not new plumbing: the header cell is a `<th>`, so its table is
      // an ancestor by construction, and the rect pair is then guaranteed to come
      // from one layout of one table. A ref threaded down from the composer could
      // point at a different table than the cell that is being dragged.
      const tableRect = cell.closest('table')?.getBoundingClientRect();

      const next: ResizeMeasurement = {
        anchor: cellRect.left - viewport.getBoundingClientRect().left,
        measuredWidth: startWidth,
        atTrailingEdge:
          tableRect !== undefined &&
          spansTableTrailingEdge({
            columnRight: cellRect.right,
            tableRight: tableRect.right,
            tableWidth: tableRect.width,
          }),
      };

      // Bail out when nothing actually moved. This state used to be a bare number,
      // so React's own `Object.is` check did it for free; an object literal is a
      // fresh reference every time and would re-render on **every scroll frame of
      // the drag** — the exact cost the subscription below is scoped to the drag to
      // avoid, reintroduced inside it.
      setMeasurement((previous) =>
        previous !== undefined &&
        previous.anchor === next.anchor &&
        previous.measuredWidth === next.measuredWidth &&
        previous.atTrailingEdge === next.atTrailingEdge
          ? previous
          : next
      );
    };

    measure();
    viewport?.addEventListener('scroll', measure, { passive: true });
    return () => viewport?.removeEventListener('scroll', measure);
  }, [isResizingColumn, viewportRef]);

  if (
    isResizingColumn === false ||
    measurement === undefined ||
    startSize === null ||
    deltaOffset === null
  ) {
    return { className: undefined, style: undefined, registerHeaderCell };
  }

  // The trailing column draws nothing. Checked here rather than folded into the
  // guard above so that "no measurement yet" and "measured, and it is the last
  // column" stay distinguishable — they are one line of output and two different
  // states, and a reader who cannot tell them apart cannot tell a suppressed
  // indicator from a broken one.
  if (measurement.atTrailingEdge) {
    return { className: undefined, style: undefined, registerHeaderCell };
  }

  const column = table.getColumn(isResizingColumn);
  const offset = resizeIndicatorOffset({
    anchor: measurement.anchor,
    measuredWidth: measurement.measuredWidth,
    startSize,
    deltaOffset,
    // The same two bounds the keyboard path clamps to, read the same way: the
    // resolved def always carries `minSize`, while an unset `maxSize` resolves to
    // `Number.MAX_SAFE_INTEGER`, so it is read from the caller's def and treated
    // as uncapped when absent.
    minSize: column?.columnDef.minSize ?? 0,
    maxSize: column?.columnDef.maxSize ?? Number.POSITIVE_INFINITY,
  });

  if (offset === undefined) {
    return { className: undefined, style: undefined, registerHeaderCell };
  }

  return {
    className: INDICATOR_CLASS,
    style: { [OFFSET_PROPERTY]: `${offset}px` },
    registerHeaderCell,
  };
}
