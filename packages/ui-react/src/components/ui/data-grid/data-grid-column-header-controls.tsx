import { useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { HandleGripIcon } from '@constructor-lab/icons-react/stroke-mono';

import type {
  DataTableColumnControls,
  DataTableColumnIntent,
} from '../data-table/data-table-features/columns';
import {
  inlineDirectionSign,
  resolveInlineDirection,
} from '../data-table/data-table-inline-direction';
import { useDataGridColumnAnnounce } from './data-grid-column-announcer';

import {
  DATA_GRID_DEFAULT_LABELS,
  type ResolvedDataGridLabels,
} from './data-grid-config/labels';

// OWNERSHIP: **U3.** Private DataGrid chrome (design §4.3) — the per-column resize
// handle and reorder grip, mounted into `<TableHead>`'s `trailing` slot through
// `ColumnPresentation.headerAdornments` with `placement: 'edge'`.
//
// **`edge` is not a styling choice.** `before-label`/`after-label` adornments
// render as `<TableHead>` children, and a sortable header wraps its children in
// the sort `<button>`: a control placed there has its pointer release fire
// `onSort`, its Enter/Space sort instead of act, and its label absorbed into the
// sort button's accessible name (a `must` grammar rule). A records grid is
// normally sortable *and* resizable, so that is the ordinary case rather than an
// edge one. `trailing` is a sibling of the sort button.
//
// It is also why the `<th>` names itself from its label region: `TableHead` points
// `aria-labelledby` at the label whenever `trailing` is occupied, so the
// `aria-label`s below are structurally excluded from the header's accessible name.
// Without that, "Resize name column" would be announced on **every cell** of the
// column, on every row.
//
// ── Why this file exists at all, and not one in `data-table/` ────────────────
//
// `ui-spec/…/data-table/behavior.md`'s "Keyboard column manipulation" scenario:
// the render context exposes constrained resize/reorder commands and announcement
// intents, *DataTable renders no handle and no live region*, and DataGrid or a
// custom composer maps keyboard controls to those commands. So the engine owns the
// constraints (§6.9 pin regions, §6.10 size clamps) and this file owns the keys,
// the wording and the DOM.

/** One arrow press. Small enough to tune a column, large enough to be worth it. */
const RESIZE_STEP = 16;

/**
 * Turns an intent into words. The engine deliberately reports *what changed*
 * rather than a message, so wording and localization live on this side.
 *
 * `pinned` reads `start`/`end` because that is what a person perceives, while the
 * engine's own call is `column.pin('left')` — TanStack's pin API is physical, and
 * in a right-to-left locale the start-pinned column appears on the right. The two
 * disagreeing is correct; see the note at the `pin` command.
 */
function announcementFor(
  intent: DataTableColumnIntent,
  labels: ResolvedDataGridLabels
): string {
  switch (intent.kind) {
    case 'resize':
      return labels.columnResized(intent.columnId, intent.size);
    case 'pin':
      return intent.pinned === false
        ? labels.columnUnpinned(intent.columnId)
        : labels.columnPinned(intent.columnId, intent.pinned);
    case 'reorder':
      return labels.columnMoved(intent.columnId, intent.position, intent.total);
  }
}

/**
 * Which physical arrow means "wider" / "later".
 *
 * Both operations are on the inline axis, and the handle sits at the column's
 * **inline-end** edge — which is the left edge in a right-to-left locale, so
 * ArrowLeft grows the column there. The same logical-vs-physical split as pinning,
 * one layer down.
 *
 * ⚠ **The read itself moved out of this file, and that is #97's fix.** This path was
 * always correct; the *drag* was inverted, because it inherited `table-core`'s
 * build-time `columnResizeDirection` default while this read happened live. They
 * disagreed about where direction comes from, so both now come from
 * `resolveInlineDirection` — see that module. Reintroducing a local
 * `getComputedStyle(…).direction` here would restore the defect in its original
 * shape.
 */
const inlineDirection = (element: Element): 1 | -1 =>
  inlineDirectionSign(resolveInlineDirection(element));

/* -------------------------------------------------------------------------- */
/*                    The pointer half of column reordering                   */
/* -------------------------------------------------------------------------- */

/**
 * How far the pointer travels before a press on the grip becomes a drag.
 *
 * Small enough that a deliberate drag is recognised immediately; large enough that
 * a click with an unsteady hand still reads as a click, which matters because the
 * click has its own meaning (it engages the keyboard reorder mode below).
 *
 * ⚠ **Reaching it cannot start a resize instead**, even though the resize handle is
 * a sibling 2px away in the same cell: `setPointerCapture` on the grip retargets
 * every subsequent pointer *and* mouse event to the grip, so the handle's own
 * `onPointerDown`/`onMouseDown` — the pair `columns.tsx`'s boxed invariant depends
 * on — never fire for this gesture. And a pointer that ends up over the handle is
 * inside the *source* column's cell, which `dropCandidates` excludes, so the
 * degenerate target is unavailable rather than merely unlikely.
 */
const REORDER_DRAG_THRESHOLD_PX = 4;

/**
 * Marks the grip's own element. A drag reads it off *other* header cells to decide
 * which of them are reorderable — see `dropCandidates`.
 */
const REORDER_GRIP_SLOT = 'column-reorder-grip';

/**
 * The attribute the drop affordance paints from. The rule lives with the rest of
 * the column presentation (`columns.tsx`, `DROP_TARGET_CLASS`); this file is the
 * only thing that ever sets it, and React never writes it — so the gesture also has
 * to be the thing that removes it.
 */
const DROP_TARGET_ATTRIBUTE = 'data-reorder-target';

/** A candidate drop target, reduced to what the hit test needs. */
export interface DataGridColumnDropRect {
  readonly columnId: string;
  /** The header cell's physical left edge, from `getBoundingClientRect()`. */
  readonly left: number;
  /** Its physical right edge. */
  readonly right: number;
}

/**
 * Which column the pointer is over.
 *
 * ── THE POINT OF THIS FUNCTION IS WHAT IT DOES NOT COMPUTE ───────────────────
 * **It never forms a direction.** There is no "moved left / moved right", no sign,
 * no comparison against the dragged column's own position, and no `clientX` delta
 * — only containment. That is why the pointer path needs no right-to-left branch
 * at all while the keyboard path needs `inlineDirection`: a client rect is already
 * expressed in the physical positions a person is looking at, in both writing
 * directions, so a target chosen by containment is chosen correctly in both without
 * a flip to get wrong.
 *
 * This is the generalisation of the resize indicator's anchor fix, one step
 * further: that one replaced a *notional* quantity with a *measured* one; this
 * removes the derived quantity instead of measuring it. #97 records a drag whose
 * direction is inverted in a right-to-left document — a failure mode this function
 * cannot express rather than one it is careful about.
 *
 * ── THE INTERVAL IS HALF-OPEN, AND ZERO WIDTH DECLINES ───────────────────────
 * `[left, right)`, so two adjacent cells sharing an edge cannot both match and the
 * answer does not depend on iteration order. A cell whose rect has no width matches
 * nothing at all — under happy-dom, or in any un-laid-out subtree, every rect reads
 * zero and this returns `undefined` rather than picking the first candidate. Same
 * discipline as `spansTableTrailingEdge`: a function comparing measurements
 * requires there to have been a measurement.
 *
 * @returns the column id, or `undefined` when the pointer is over no candidate —
 *   which is how "no drop target" is expressed.
 */
export function columnAtClientX(
  rects: readonly DataGridColumnDropRect[],
  clientX: number
): string | undefined {
  for (const rect of rects) {
    if (clientX >= rect.left && clientX < rect.right) return rect.columnId;
  }
  return undefined;
}

/** A candidate plus the element the rect was measured from. */
interface ReorderDropCandidate extends DataGridColumnDropRect {
  readonly cell: HTMLElement;
}

/**
 * The header cells this column may legally be dropped on, measured now.
 *
 * **Legality is read off the rendered output rather than restated here**, which is
 * what keeps this from becoming a second copy of `moveTo`'s rules:
 *
 *  - a cell that carries a reorder grip *is* a reorderable, unlocked column — the
 *    grip renders only when `controls.canReorder`, so locked and
 *    reordering-disabled columns are absent by construction rather than filtered;
 *  - `data-pinned` is absent on a centre column and `'start'`/`'end'` on a pinned
 *    one, which is exactly the three pin regions §6.9 clamps a move to;
 *  - the source cell is excluded, so a release over the dragged column itself
 *    produces no target instead of a no-op move.
 *
 * `moveTo` remains the authority and may still refuse — it is called with whatever
 * this returns and reports `undefined` when it declines, at which point nothing is
 * announced. The filters above exist so the *affordance* does not promise a move
 * that will not happen, not to decide whether it may.
 *
 * Scoped to the source cell's own `<tr>`: with grouped headers each row is a
 * separate level, and a leaf column's peers are its own row's cells.
 *
 * ⚠ **Re-measured on every pointer move, deliberately.** Caching at drag start
 * would be cheaper and is wrong the moment the region scrolls under the pointer —
 * the same staleness the resize indicator answers with a scroll listener. Here the
 * measurement is already on the path that consumes it, so the honest option is also
 * the simple one: every hit test uses rects from one fresh layout read.
 */
function dropCandidates(
  sourceCell: HTMLElement
): readonly ReorderDropCandidate[] {
  const row = sourceCell.parentElement;
  if (row === null) return [];

  const candidates: ReorderDropCandidate[] = [];
  for (const cell of Array.from(row.children)) {
    if (cell === sourceCell || !(cell instanceof HTMLElement)) continue;

    const columnId = cell.dataset.columnId;
    if (columnId === undefined) continue;
    if (cell.querySelector(`[data-slot="${REORDER_GRIP_SLOT}"]`) === null) {
      continue;
    }
    if (cell.dataset.pinned !== sourceCell.dataset.pinned) continue;

    const rect = cell.getBoundingClientRect();
    candidates.push({ cell, columnId, left: rect.left, right: rect.right });
  }
  return candidates;
}

/** Everything one in-flight grip drag needs to remember. */
interface ReorderDragState {
  readonly pointerId: number;
  readonly startX: number;
  readonly startY: number;
  /** The grip's own header cell — the origin of the candidate set. */
  readonly cell: HTMLElement;
  /** `false` until the pointer passes `REORDER_DRAG_THRESHOLD_PX`. */
  dragging: boolean;
  /** The cell currently painted as the drop target, if any. */
  target: HTMLElement | undefined;
  /** The Escape listener, kept so the same reference can be removed. */
  keyListener: ((event: KeyboardEvent) => void) | undefined;
  /**
   * Capture has gone, but the record is kept so a `pointerup` arriving *after*
   * `lostpointercapture` can still commit. See `loseCapture`. Once set, moves are
   * ignored — the gesture is over as far as tracking goes.
   */
  captureLost: boolean;
}

/**
 * The pointer gesture, mapped onto the engine's existing `moveTo`.
 *
 * ── HOW IT COEXISTS WITH THE GRIP'S CLICK ────────────────────────────────────
 * The click already means something — it engages the keyboard reorder mode, for the
 * reasons at `reordering` below — so this gesture must not consume presses that
 * were only clicks. It does not change any mode on `pointerdown`; it records a
 * position. A move past the threshold *promotes* the press to a drag and sets
 * `consumedClickRef`, which the click handler reads to bow out. Below the
 * threshold nothing is recorded as consumed and the click path runs exactly as it
 * did before this gesture existed.
 *
 * ── WHAT COMMITS AND WHAT DOES NOT ───────────────────────────────────────────
 * Release commits, once, through `moveTo`. Escape and `pointercancel` abort with no
 * move — which is possible only because nothing is applied until release, unlike
 * the keyboard path where every arrow press is already applied and Escape can only
 * end the interaction. Both paths announce through the same `announcementFor`, so
 * a pointer user and a keyboard user hear the same sentence.
 *
 * `lostpointercapture` is deliberately **not** an abort, so the commit does not
 * depend on it arriving after `pointerup` — see the box above `loseCapture`.
 */
function usePointerReorder(
  controls: DataTableColumnControls,
  report: (intent: DataTableColumnIntent | undefined) => void
) {
  const dragRef = useRef<ReorderDragState | undefined>(undefined);
  // Read by `onClick`, which arrives *after* the drag has already ended — so it
  // cannot be a field on `dragRef`.
  const consumedClickRef = useRef(false);

  /**
   * Everything the gesture put outside its own state: the window listener and an
   * attribute on a cell this component does not own. **Idempotent** — it is reached
   * from four places and two of them can both run for one gesture.
   *
   * `drag.target` is deliberately NOT cleared: only `data-reorder-target` is swept,
   * so the element and its `data-column-id` remain readable and a release arriving
   * after capture was lost can still name its target.
   */
  const releaseTransients = useCallback((drag: ReorderDragState) => {
    if (drag.keyListener !== undefined) {
      window.removeEventListener('keydown', drag.keyListener, true);
      drag.keyListener = undefined;
    }
    // A sweep of the row rather than `drag.target?.removeAttribute(…)`. The
    // attribute is written outside React, so React will not clean it up on the
    // next render — and asking the DOM which cells carry it is a total operation,
    // where clearing the one cell this closure happens to remember is not.
    drag.cell.parentElement
      ?.querySelectorAll(`[${DROP_TARGET_ATTRIBUTE}]`)
      .forEach((marked) => marked.removeAttribute(DROP_TARGET_ATTRIBUTE));
  }, []);

  const endDrag = useCallback(() => {
    const drag = dragRef.current;
    dragRef.current = undefined;
    if (drag === undefined) return;
    releaseTransients(drag);
  }, [releaseTransients]);

  /* ══════════════════════════════════════════════════════════════════════════
     ⚠ WHY THIS IS NOT `endDrag`, AND WHY THE DIFFERENCE IS THE WHOLE POINT.

     `lostpointercapture` fires on EVERY normal release too, not only when capture
     is yanked — so using it to abort makes the commit path depend on it arriving
     AFTER `pointerup`. It did abort here at first, and the failure that bought was
     the worst shape available: `endDrag` nulls `dragRef`, `onPointerUp` returns
     early on `undefined`, so an inverted order **silently loses the move and the
     drag appears to do nothing** — indistinguishable from the feature never having
     been built, and therefore triaged as a feature request rather than a defect.

     The spec does order them `pointerup` → `lostpointercapture`, and it was
     MEASURED that way in **Chromium 148.0.7778.96** (Playwright 1.60.0) — one
     engine, one version, and the only place this feature's rendered behaviour can
     be checked at all (#78). So the order is not relied on: this releases the
     transients and leaves the record armed, and `onPointerUp` commits whichever
     way round the two arrive.

     That is worth eight lines for a reason beyond robustness: **order-independence
     is assertable in CI and the order itself is not.** happy-dom will dispatch the
     two events in either sequence, so "either order commits" is a unit test, where
     "Chromium happens to order them this way" is a measurement that no test can
     hold. On a feature whose correctness otherwise lives entirely outside CI, that
     converts one dependency from outside to inside.
     ══════════════════════════════════════════════════════════════════════════ */
  const loseCapture = useCallback(() => {
    const drag = dragRef.current;
    // Already finished — the ordinary case, where `onPointerUp` ran first and this
    // is the implicit release following it.
    if (drag === undefined) return;
    drag.captureLost = true;
    releaseTransients(drag);
  }, [releaseTransients]);

  // A drag holds a window listener and an attribute on a cell this component does
  // not own, so unmounting mid-gesture has to release both. `endDrag` reads only
  // refs and `window`, so the one instance this captures stays correct.
  useEffect(() => endDrag, [endDrag]);

  const markTarget = (
    drag: ReorderDragState,
    cell: HTMLElement | undefined
  ) => {
    if (drag.target === cell) return;
    drag.target?.removeAttribute(DROP_TARGET_ATTRIBUTE);
    drag.target = cell;
    cell?.setAttribute(DROP_TARGET_ATTRIBUTE, '');
  };

  const gripProps = {
    onPointerDown: (event: ReactPointerEvent<HTMLElement>) => {
      // Any gesture still armed here was interrupted in a way no event reported.
      endDrag();
      // Reset where every gesture *starts*, not only where one ends: a press that
      // never became a drag must not suppress the click after it.
      consumedClickRef.current = false;
      // Secondary buttons open context menus; they must not start a drag.
      if (event.button !== 0) return;

      const cell = event.currentTarget.closest('th');
      if (cell === null) return;

      // Retargets every later pointer and mouse event for this pointer to the
      // grip, which is what lets the gesture follow a pointer that has left the
      // button — and what keeps it off the resize handle beside it.
      event.currentTarget.setPointerCapture(event.pointerId);
      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        cell,
        dragging: false,
        target: undefined,
        keyListener: undefined,
        captureLost: false,
      };
    },

    onPointerMove: (event: ReactPointerEvent<HTMLElement>) => {
      const drag = dragRef.current;
      if (drag === undefined || event.pointerId !== drag.pointerId) return;
      // The record outlives capture so a late release can commit, but tracking
      // does not: without this a stray move would re-add the Escape listener and
      // repaint a drop target for a gesture that is already over.
      if (drag.captureLost) return;

      if (!drag.dragging) {
        const travelled = Math.hypot(
          event.clientX - drag.startX,
          event.clientY - drag.startY
        );
        if (travelled < REORDER_DRAG_THRESHOLD_PX) return;

        drag.dragging = true;
        consumedClickRef.current = true;
        const keyListener = (keyEvent: KeyboardEvent) => {
          if (keyEvent.key !== 'Escape') return;
          // Aborts outright: nothing has been applied, so there is nothing to
          // undo and no position to announce. Claimed in the capture phase and
          // stopped, so an Escape meant for this drag does not also close a
          // dialog or dismiss a menu around it.
          keyEvent.preventDefault();
          keyEvent.stopPropagation();
          endDrag();
        };
        drag.keyListener = keyListener;
        window.addEventListener('keydown', keyListener, true);
      }

      // Only `clientX`. A column occupies the full height of the header row and
      // the whole point of the gesture is horizontal, so requiring the pointer to
      // stay within the row's vertical band would make a drag fussy without
      // making it clearer. Leaving the table vertically keeps the last target.
      const candidates = dropCandidates(drag.cell);
      const targetId = columnAtClientX(candidates, event.clientX);
      markTarget(
        drag,
        candidates.find((candidate) => candidate.columnId === targetId)?.cell
      );
    },

    onPointerUp: (event: ReactPointerEvent<HTMLElement>) => {
      const drag = dragRef.current;
      if (drag === undefined || event.pointerId !== drag.pointerId) return;

      const targetId = drag.target?.dataset.columnId;
      const dragged = drag.dragging;
      endDrag();

      if (!dragged || targetId === undefined) return;
      // `moveTo` is the authority on legality — pin region, locked target, and
      // "already there" all return `undefined`, and `report` then announces
      // nothing. The gesture contributes the target and nothing else.
      report(controls.moveTo(targetId));
    },

    // A genuine abort: the pointer is gone and no release is coming — a browser
    // gesture took over, or a touch was cancelled. Committing a move the person
    // never released into would be worse than dropping it.
    onPointerCancel: () => endDrag(),
    // NOT an abort. See the box above `loseCapture`: this fires on every normal
    // release too, so aborting here is what made the commit path depend on event
    // order.
    onLostPointerCapture: () => loseCapture(),
  };

  return {
    gripProps,
    /**
     * Whether this click is the tail of a drag, and so already spoken for.
     *
     * ⚠ **`detail > 0` is load-bearing, not defensive.** A `click` from a pointer
     * carries a click count; one synthesized by **keyboard activation** (Enter or
     * Space on the button) or by `element.click()` carries `detail === 0` and no
     * `pointerdown` before it. Without the test, an abandoned drag whose trailing
     * click never arrived — capture lost, released over a scrolled-away element —
     * leaves the flag set, and the *next keyboard activation* is the thing that
     * clears it. That silently eats one Enter press on the control whose whole
     * reason for existing is the keyboard path, which is the one regression this
     * feature was told not to introduce. A unit test caught it; nothing else could.
     *
     * The flag is reset on `pointerdown` rather than here for the mirror-image
     * reason: a press that never became a drag must not suppress the click after
     * it, and `pointerdown` is the one point every pointer gesture passes through.
     */
    consumedClick: (event: { readonly detail: number }) => {
      if (!consumedClickRef.current || event.detail === 0) return false;
      consumedClickRef.current = false;
      return true;
    },
  };
}

export interface DataGridColumnHeaderControlsProps {
  /**
   * The strings this adornment renders and announces (PLTFRM-93117).
   * `columns-features.tsx` closes over `resolved.labels` to supply it.
   */
  readonly labels?: ResolvedDataGridLabels;
  /** The engine's constrained commands for this column. */
  readonly controls: DataTableColumnControls;
}

export function DataGridColumnHeaderControls({
  controls,
  labels = DATA_GRID_DEFAULT_LABELS,
}: DataGridColumnHeaderControlsProps) {
  const announce = useDataGridColumnAnnounce();
  // Arrow keys move the column only while the grip is engaged. Two reasons were
  // recorded for that, and **one of them has since stopped applying** — worth
  // saying rather than quietly deleting, because it is the reason the click had to
  // survive the pointer gesture unchanged:
  //
  //  - *it gives the grip's click a meaning, so it is not a button that does
  //    nothing for a pointer user* — **superseded.** A pointer user now drags the
  //    grip (#106). This is no longer why the click has to do something, and it is
  //    also no longer an argument for engaging on click at all; the mode stays on
  //    click because that is the shipped, tested and announced keyboard entry
  //    point, not because the pointer needs it.
  //  - *a header sits inside a grid with its own arrow-key handling, so
  //    unconditionally claiming arrows from a focused grip is a conflict waiting
  //    for the next feature* — **still the load-bearing reason**, and untouched by
  //    the pointer path, which claims no keys except Escape while a drag is live.
  const [reordering, setReordering] = useState(false);

  const report = (intent: DataTableColumnIntent | undefined) => {
    // `undefined` means nothing changed — locked column, region edge, or a width
    // already at its clamp. Announcing anyway would report a move that did not
    // happen.
    if (intent !== undefined) announce(announcementFor(intent, labels));
  };

  const endReordering = () => {
    setReordering(false);
    announce(
      labels.columnPosition(
        controls.columnId,
        controls.position,
        controls.total
      )
    );
  };

  // The pointer path onto the same `moveTo` the arrow keys drive. Declared after
  // `report` because it announces through it — one sentence for both paths.
  const pointerReorder = usePointerReorder(controls, report);

  return (
    <span className="absolute inset-y-0 end-0 flex items-center gap-0.5">
      {controls.canReorder && (
        <button
          type="button"
          // Read by *other* columns' drags: a cell carrying this is a reorderable
          // column, which is how `dropCandidates` decides legality without
          // restating `moveTo`'s rules.
          data-slot="column-reorder-grip"
          aria-pressed={reordering}
          // A fixed name. The state travels through `aria-pressed` and the live
          // region, because a name change on the element that already has focus is
          // not reliably announced.
          aria-label={labels.reorderColumn(controls.columnId)}
          {...pointerReorder.gripProps}
          onClick={(event) => {
            // A press that became a drag has already done its work on release.
            // Below the drag threshold — and for every keyboard activation — this
            // is false and everything after it runs exactly as it did before the
            // pointer path existed.
            if (pointerReorder.consumedClick(event)) return;
            if (reordering) {
              endReordering();
              return;
            }
            setReordering(true);
            announce(labels.columnReorderHint(controls.columnId));
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              if (!reordering) return;
              // Ends the interaction; it does not undo it. Every arrow press is
              // applied and announced as it happens, so there is no pending move
              // to roll back — and pretending otherwise would need the engine to
              // hold a transaction it has no reason to.
              event.stopPropagation();
              endReordering();
              return;
            }
            if (!reordering) return;
            if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
            event.preventDefault();
            // The grid has its own arrow-key handling; a claimed key must not
            // also reach it.
            event.stopPropagation();
            const step = event.key === 'ArrowRight' ? 1 : -1;
            report(
              controls.moveBy(step * inlineDirection(event.currentTarget))
            );
          }}
          // The glyph carries the header label's colour, not the inactive sort
          // icon's. The sort icon can afford to be faint because the header's own
          // text names the control; this button has no text, so its glyph *is* the
          // affordance and the inactive token measures about 1.6:1 against the
          // surface in both light and dark (checked in a browser).
          //
          // `touch-none` for the same reason the resize handle carries it: without
          // it a touch drag scrolls the region instead of reaching the gesture.
          // `cursor-grab`/`active:cursor-grabbing` is the only at-rest change this
          // feature makes to the grip, and a cursor is not in a screenshot.
          className="flex size-4 cursor-grab touch-none select-none items-center justify-center rounded-sm text-[var(--ui-table-header-label-color)] hover:text-[var(--ui-table-header-sort-icon-color-active)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-primary)] active:cursor-grabbing aria-pressed:text-[var(--ui-table-header-sort-icon-color-active)]"
        >
          <HandleGripIcon aria-hidden="true" className="size-3" />
        </button>
      )}

      {controls.canResize && (
        <span
          // The ARIA window-splitter shape: a focusable separator carrying the
          // width it controls, so the value is inspectable and assistive
          // technology has something to report while focus is on the handle.
          role="separator"
          aria-orientation="vertical"
          aria-label={labels.resizeColumn(controls.columnId)}
          aria-valuenow={controls.size}
          aria-valuemin={controls.minSize}
          // Only when the caller capped the column. The engine's resolved maximum
          // is `Number.MAX_SAFE_INTEGER`, which as an `aria-valuemax` would be the
          // nine-quadrillion `max-width` defect read out loud.
          {...(controls.maxSize === undefined
            ? {}
            : { 'aria-valuemax': controls.maxSize })}
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
            event.preventDefault();
            event.stopPropagation();
            const step = event.key === 'ArrowRight' ? 1 : -1;
            report(
              controls.resizeTo(
                controls.size +
                  step * RESIZE_STEP * inlineDirection(event.currentTarget)
              )
            );
          }}
          // The drag half. TanStack owns the pointer maths and the resolved
          // `columnResizeMode` decides whether it commits per frame or on release.
          {...(controls.resizeHandleProps ?? {})}
          // A 6px hit area painting a centred 1px divider, which is the geometry
          // the kit's own `Resizable` handle uses: the grab target has to be
          // bigger than the line people see. The line is the table's own row
          // border colour, so a resizable header reads as part of the table
          // rather than as a decoration on top of it, and it takes the accent on
          // hover and focus.
          className="relative h-full w-1.5 cursor-ew-resize touch-none select-none before:absolute before:inset-y-1 before:start-1/2 before:w-px before:-translate-x-1/2 before:bg-[var(--ui-table-global-row-border-color)] before:content-[''] hover:before:w-0.5 hover:before:bg-[var(--ui-table-header-sort-icon-color-active)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-primary)] focus-visible:before:bg-[var(--ui-table-header-sort-icon-color-active)]"
        />
      )}
    </span>
  );
}
