import { useCallback, useEffect, useRef, type RefObject } from 'react';
import {
  defaultRangeExtractor,
  useVirtualizer,
  type Range,
} from '@tanstack/react-virtual';

import type { DataTableDisplayRow } from './data-table-display-rows';
import type { DataTableVirtualizationConfig } from './data-table-features/virtualization';

// The body-window seam (ADR-0002, "The body-window seam").
//
// Virtualization cannot be expressed as a per-row contribution — it wraps the
// whole list — so the body render goes through one named seam instead of gaining
// a contribution point. **This file IS the mechanism**, and U6 owns it. F2 shipped
// the identity implementation; this is the windowing one.
//
// ── The two index spaces, which is the thing to get right ────────────────────
//
// `displayRows` is the FULL list. `rows` is the window this seam returns, and the
// view maps that with a fresh index (`data-table-view.tsx:297-300`), so
// **`measureRow`'s second argument indexes `rows`, not `displayRows`.** The window
// is always a CONTIGUOUS slice, so the two spaces differ by one offset and nothing
// more.
//
// Keeping it contiguous is not a simplification. `bodyWindow.rows` is one flat
// index space that U4's sticky group rows and the tree's ARIA both build on — it is
// why the multi-`<tbody>` option was rejected — so a pinned row appended out of
// order would break both that flatness and the spacer arithmetic.
//
// ── Why `measureRow` is supplied even in `fixed` mode ───────────────────────
//
// The member's own doc says `undefined` means "do not measure", which invites
// omitting it when `measure: 'fixed'`. **Do not.** It is the only channel through
// which the view ever hands this seam a row element, and the focus policy below
// needs an element↔index map in both modes. In `fixed` mode it records the element
// and skips the measurement.
//
// ── `containerRef` is the ScrollArea VIEWPORT ────────────────────────────────
//
// Not the box around it. `Table`'s container is a `ScrollArea` whose root is
// `overflow: hidden` and never scrolls, so a ref on the root reports
// `scrollTop: 0` forever and a virtualizer pointed at it measures nothing.
// `Table` routes `containerRef` to the viewport for that reason, and `data-bounded`
// sits there too, while the caller's `height`/`maxHeight` land on the root.

/** Design §5.2 / `api.yaml` defaults: 40px, `fixed`, overscan 8. */
const DEFAULT_ROW_HEIGHT = 40;
const DEFAULT_OVERSCAN = 8;

/**
 * How far beyond the rendered range the seam will stretch to keep a focused row
 * mounted, in rows.
 *
 * A budget rather than "always", because pinning is implemented by **extending the
 * contiguous range** — the only way to pin without breaking the flat index space —
 * so an unbounded pin would render every row between the window and the focused one,
 * defeating windowing exactly when it matters most. When the budget is exhausted
 * focus moves to the scroll container instead. That is design §7's "when pinning
 * cannot retain it" clause, and it is the *same condition*, which is why the two
 * are one mechanism rather than two features.
 */
const FOCUS_PIN_BUDGET = 32;

export interface DataTableBodyWindowInput<TData> {
  /** The full display-row list, in render order. */
  readonly displayRows: readonly DataTableDisplayRow<TData>[];
  /**
   * The scrolling element — the ScrollArea **viewport**, which is what carries
   * `data-bounded`. `null` until the view has mounted.
   */
  readonly containerRef: RefObject<HTMLDivElement | null>;
  /** The resolved `virtualization` config, or `false` when the feature is off. */
  readonly config: unknown;
  readonly visibleColumnCount: number;
}

export interface DataTableBodyWindow<TData> {
  /** The display rows to render. Unwindowed, this is every row. */
  readonly rows: readonly DataTableDisplayRow<TData>[];
  /** Scroll height to reserve above the window, in px. */
  readonly paddingTop: number;
  /** Scroll height to reserve below the window, in px. */
  readonly paddingBottom: number;
  /** True when the seam is windowing, so the view knows to render spacers. */
  readonly isWindowed: boolean;
  /**
   * The absolute display index of the window's first row — `0` when not windowing.
   *
   * Published because `rows` above is already **sliced**, so the view's own index is
   * window-relative and cannot name a row's position in the whole list. That
   * position is what `aria-rowindex` needs (#77): a screen reader otherwise counts
   * the rendered rows and announces "row 3 of 20" for row 1,847 of 4,821.
   *
   * Not recomputable by the view from the scroll offset, and it must not be — the
   * number is `getVirtualItems()[0].index`, the same one `measureRow` already adds to
   * its argument to reach `fullIndex`. Deriving it a second way from geometry is how
   * two answers to one question start disagreeing.
   */
  readonly windowStart: number;
  /**
   * Row-measurement callback ref, or `undefined` when the feature is off.
   *
   * The view calls this for **every** display row it renders, keyed by index into
   * `rows` — record rows and feature-rendered rows alike, because a windowed list
   * has to measure detail, group and status rows too, not only records.
   *
   * For a feature-rendered row the view attaches the ref by cloning the returned
   * element, so `renderDisplayRow` must return **one ref-forwarding element**
   * (a `<TableRow>`) for measurement to reach it. Anything else still renders,
   * just unmeasured.
   */
  readonly measureRow?: (
    element: HTMLTableRowElement | null,
    displayRowIndex: number
  ) => void;
  /**
   * Scrolls a record row into view by its record index. Published to the
   * controller, which is what makes the pre-declared `scroll-to-row` toggle
   * action implementable — pre-declaring the union member does not by itself
   * give the controller a path to the view's scroll container.
   */
  readonly scrollToRecord?: (recordIndex: number) => void;
  /**
   * Re-measures row geometry. Backs the pre-declared `measure-layout` action,
   * which replaces the legacy `doLayout()`, and is published the same way.
   */
  readonly measureLayout?: () => void;
  /**
   * Design §7 clause 3, rungs 3 and 4 — toolbar, then scroll container.
   *
   * **Not optional, unlike the three above.** Those are windowing operations and
   * are absent when the feature is off, so their toggle actions can report "not
   * implemented". This is focus policy: rungs 1 and 2 run for every table, so a
   * chain that stopped at a different rung depending on `virtualization` would let
   * a presentation option change where a keyboard user lands.
   */
  readonly focusAfterRowLoss: () => void;
}

/**
 * The channel by which the view publishes its imperative window operations to
 * the controller.
 *
 * The controller owns the `DataTableToggleAction` union but has no access to the
 * view's scroll container, and the view is rendered *below* the controller. This
 * is a single mutable object created once by the controller and populated by the
 * view in an effect — deliberately not state, because publishing an imperative
 * handle must not trigger a render.
 *
 * Until the seam implements an operation the corresponding toggle action throws,
 * which is why the actions are safe to pre-declare.
 */
export interface DataTableViewBridge {
  scrollToRecord?: (recordIndex: number) => void;
  measureLayout?: () => void;
  /**
   * Design §7 clause 3's **rungs 3 and 4** — toolbar, then scroll container.
   *
   * Rungs 1 and 2 name a surviving row and live in the controller
   * (`data-table-controller.ts`, the reconcile effect); they are answered from the
   * row model. Rungs 3 and 4 move **DOM focus**, and the controller has no route
   * to the DOM — which is what this member is for. The controller calls it only
   * when rungs 1 and 2 both missed, so the four rungs are one chain with one
   * junction rather than two policies that can disagree.
   *
   * Published by the view for **every** table, windowed or not: rungs 1 and 2 are
   * unconditional, so gating their continuation on `virtualization` would make the
   * chain stop at a different rung depending on a presentation option.
   */
  focusAfterRowLoss?: () => void;
}

/** `data-grid-toolbar.tsx`'s row. A published hook, queried — never imported. */
const TOOLBAR_SELECTOR = '[data-slot="data-grid-toolbar"]';

/**
 * U6.md §3.2's contract selector, as a comma list rather than `:is()` — the same
 * thing to `querySelectorAll`, with one fewer engine assumption.
 */
const TOOLBAR_FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex^="-"])',
].join(',');

/**
 * True when focus is somewhere a person put it on purpose, so nothing here may
 * take it.
 *
 * `<body>` is the *signal*, not the guard's enemy: by the time any of this runs the
 * focused row is already gone and the browser has reset focus to `<body>`, so
 * asking "is focus still inside the table" is false exactly when a handoff is
 * needed. Shared by clause 2's pin-budget handoff and clause 3's rung 4 on
 * purpose — two copies of this predicate is a drift surface, and the two paths
 * answer the same question.
 */
function focusMovedElsewhere(): boolean {
  const active = document.activeElement;

  return active !== null && active !== document.body;
}

/**
 * Rung 4. The viewport is not focusable by default, so `tabIndex` is set
 * imperatively on the ref this seam already holds — no new prop on `table.tsx`
 * or the view.
 */
function focusScrollContainer(element: HTMLElement): void {
  element.tabIndex = -1;
  element.focus({ preventScroll: true });
}

/**
 * Rung 3. The first focusable control of the nearest toolbar, or `null` — and
 * `null` is a **MISS that must fall through to rung 4**, never a landing.
 *
 * That case is the ordinary one, not an edge: DataGrid renders no toolbar row at
 * all unless `toolbar` is passed or a search column exists
 * (`data-grid-config/toolbar.tsx:106-109`), and a rendered toolbar can still be
 * empty of controls under `toolbar={{ viewOptions: false }}`. Focusing the row
 * `<div>` itself was considered and rejected: an empty layout div announces
 * nothing, so it would convert a miss into a silent dead end.
 *
 * Resolved by an **ancestor walk**, per U6.md §3.3 — no prop, no imperative
 * handle, no ref plumbing, so the toolbar stays ignorant of all of this. Nearest
 * enclosing toolbar wins.
 *
 * Two limits, both deliberate:
 * - Toolbars *inside* the scroll container are skipped. One there belongs to a
 *   nested grid (a detail panel may hold its own table), and stealing focus into
 *   a child grid's chrome is worse than falling through.
 * - A standalone `DataTable` nested inside an unrelated DataGrid can still resolve
 *   that outer grid's toolbar. Fixing it wants a marker on DataGrid's wrapper;
 *   until then the mis-hit lands focus outside the emptied table either way,
 *   which is the outcome rung 4 would produce anyway.
 */
function toolbarFocusTarget(container: HTMLElement): HTMLElement | null {
  let scope: HTMLElement | null = container.parentElement;
  while (scope !== null) {
    const toolbar = [...scope.querySelectorAll<HTMLElement>(TOOLBAR_SELECTOR)]
      // A nested grid's toolbar is not this table's.
      .find((candidate) => !container.contains(candidate));
    if (toolbar !== undefined) {
      // Document order, so this is the leading control — the search box when there
      // is one, otherwise the reset button, otherwise the column-settings trigger.
      // `aria-disabled` counts as disabled: `.focus()` on an inert control would
      // leave focus on `<body>`, which is a dead end dressed as a landing.
      return (
        [...toolbar.querySelectorAll<HTMLElement>(TOOLBAR_FOCUSABLE)].find(
          (control) => control.getAttribute('aria-disabled') !== 'true'
        ) ?? null
      );
    }
    scope = scope.parentElement;
  }

  return null;
}

interface ResolvedVirtualization {
  readonly enabled: boolean;
  readonly estimateSize: (index: number) => number;
  readonly dynamic: boolean;
  readonly overscan: number;
  readonly scrollToIndex?: number;
}

function resolveConfig(config: unknown): ResolvedVirtualization {
  const value =
    typeof config === 'object' && config !== null
      ? (config as DataTableVirtualizationConfig)
      : undefined;
  const estimate = value?.estimateRowHeight ?? DEFAULT_ROW_HEIGHT;

  return {
    enabled: value !== undefined,
    estimateSize: typeof estimate === 'function' ? estimate : () => estimate,
    dynamic: value?.measure === 'dynamic',
    overscan: value?.overscan ?? DEFAULT_OVERSCAN,
    ...(value?.scrollToIndex === undefined
      ? {}
      : { scrollToIndex: value.scrollToIndex }),
  };
}

/**
 * Windows the display-row list over `@tanstack/react-virtual`.
 *
 * A hook rather than a plain function because the view calls it unconditionally,
 * which is the shape F2's identity version established so this replacement did not
 * have to reopen the view.
 */
export function useDataTableBodyWindow<TData>({
  displayRows,
  containerRef,
  config,
}: DataTableBodyWindowInput<TData>): DataTableBodyWindow<TData> {
  const resolved = resolveConfig(config);
  const count = displayRows.length;

  // Bookkeeping in refs, because writing it must never schedule a render.
  // `elements` is keyed by FULL display index, and it is what turns a focus event's
  // target element back into an index — see the `focusin` effect below.
  const elementsRef = useRef(new Map<number, HTMLTableRowElement>());
  const focusedIndexRef = useRef<number | undefined>(undefined);
  // Whether focus has been inside this table and has not deliberately left it.
  // Clause 3's rungs 3-4 need it and `focusedIndexRef` cannot serve: that one is an
  // INDEX, and indices only exist while windowing, whereas the fallback runs on
  // every table. See the guard in `focusAfterRowLoss`.
  const focusWasInsideRef = useRef(false);
  const pinReleasedRef = useRef(false);
  const warnedRef = useRef(false);
  const unboundedWarnedRef = useRef(false);

  // ── The focus pin lives INSIDE the virtualizer, and that is load-bearing ────
  //
  // The pin has to extend the rendered range, and the obvious place to do that is
  // after `getVirtualItems()` — widen `start`/`end` and slice. That is wrong, and
  // wrong invisibly: `paddingTop` is `items[0].start`, the offset of the
  // *unextended* first item, so the pinned rows would render **in addition** to a
  // spacer that already reserved their height and the whole body would shift down
  // by the height of the pinned span. Symmetric at the bottom.
  //
  // `rangeExtractor` is the virtualizer's own hook for this. The indices it returns
  // get real measured offsets, so `items[0].start` and `items[last].end` stay true
  // by construction and the spacer arithmetic below needs no special case.
  //
  // A FRESH function every render, deliberately. `getVirtualIndexes` memoizes on
  // `[rangeExtractor, overscan, count, startIndex, endIndex]` — the focused index is
  // in none of them, so a stable extractor would hand back a CACHED range that
  // ignores a newly focused row, and `pinReleasedRef` would go stale with it. A new
  // identity invalidates that memo; it costs one O(window) pass and is the price of
  // the flag being trustworthy.
  const rangeExtractor = (range: Range): number[] => {
    const base = defaultRangeExtractor(range);
    const focused = focusedIndexRef.current;
    pinReleasedRef.current = false;
    if (focused === undefined || focused >= range.count || base.length === 0) {
      return base;
    }
    const first = base[0]!;
    const last = base[base.length - 1]!;
    if (focused >= first && focused <= last) {
      return base;
    }
    // EXTEND the contiguous range; never append out of order. `bodyWindow.rows` is
    // one flat index space that U4's sticky group rows and the tree's ARIA both
    // build on, and the padding arithmetic is only true of a contiguous slice.
    const extended: number[] = [];
    if (focused < first) {
      if (first - focused > FOCUS_PIN_BUDGET) {
        pinReleasedRef.current = true;

        return base;
      }
      for (let index = focused; index < first; index += 1) {
        extended.push(index);
      }

      return [...extended, ...base];
    }
    if (focused - last > FOCUS_PIN_BUDGET) {
      pinReleasedRef.current = true;

      return base;
    }
    for (let index = last + 1; index <= focused; index += 1) {
      extended.push(index);
    }

    return [...base, ...extended];
  };

  const virtualizer = useVirtualizer({
    count: resolved.enabled ? count : 0,
    getScrollElement: () => (resolved.enabled ? containerRef.current : null),
    estimateSize: resolved.estimateSize,
    overscan: resolved.overscan,
    rangeExtractor,
  });

  // The invalid combination, as a real development error rather than a config-shape
  // guess. F3 published `data-bounded` on the element that actually scrolls so this
  // could be checked against the DOM (design §5.1): an unbounded container has no
  // viewport height, so the virtualizer would window against zero and render
  // everything — a silent performance cliff rather than a visible break.
  //
  // Once per mount, because a warning that repeats every render is a warning people
  // learn to filter out.
  useEffect(() => {
    if (!resolved.enabled || warnedRef.current) {
      return;
    }
    const element = containerRef.current;
    if (element !== null && element.dataset.bounded !== 'true') {
      warnedRef.current = true;
      console.error(
        'DataTable: `virtualization` requires a bounded scroll container. Set `height` or `maxHeight` (from DataGrid, `appearance.height` / `appearance.maxHeight`) — without one there is no viewport to window against and every row renders.'
      );
    }
  }, [containerRef, resolved.enabled]);

  // ── The second precondition, because the first one can pass while broken ────
  //
  // `data-bounded` asks whether an owner *asked* for a bound. That is not the same as
  // the element the virtualizer measures actually having one, and the gap is real
  // rather than theoretical: with `maxHeight` and no `height`, the ScrollArea root is
  // clamped but its `height` stays `auto`, so the viewport's `height: 100%` has no
  // definite parent to resolve against and grows to its content instead. The root then
  // clips it. `data-bounded` still reads `true`.
  //
  // Measured in a browser at `height`-less `maxHeight={400}` over 10,000 rows: root
  // `clientHeight` 400, **viewport `clientHeight` 400040**, zero spacers, all 10,000
  // rows in the DOM, and the viewport cannot scroll at all. So the first guard passes
  // and the feature is inert — exactly the silent cliff it exists to prevent.
  //
  // **That cause is now fixed upstream** (`4be051e1`): `Table` moved the height
  // constraints onto the viewport, so `maxHeight` bounds the element that scrolls and
  // the pathological geometry can no longer be reached through `height`/`maxHeight`.
  // Re-measured after that fix, at `height={400}` over 10,000 rows: viewport 400,
  // container 400, **this guard silent**, windowing intact.
  //
  // It is kept deliberately, as a REGRESSION detector rather than a live-bug one: it
  // is what would catch the constraints migrating back to the wrapper, or a consumer's
  // CSS overriding the viewport's height. If that is judged not worth its two
  // `clientHeight` reads per render, delete it on purpose — not because it looks dead.
  // Its test drives the broken geometry through `layOut`'s `viewportClientHeight`, so
  // it is still exercised in both directions.
  //
  // This guard therefore checks GEOMETRY, not configuration: a viewport taller than
  // the box that contains it has escaped its bound, whatever any attribute says. It
  // reads `parentElement` deliberately — the ScrollArea root is the viewport's parent
  // (see the header note) — because that comparison needs no magic row-count
  // threshold, and a bounded viewport can never be taller than its own container.
  //
  // No dependency array on purpose: the inputs are measured geometry, which no value in
  // this hook's scope changes with. It costs two `clientHeight` reads per render and
  // stops entirely after it reports, once per mount — the same budget as the guard
  // above, for the same reason: a warning that repeats is one people learn to filter.
  useEffect(() => {
    if (!resolved.enabled || unboundedWarnedRef.current) {
      return;
    }
    const element = containerRef.current;
    const box = element?.parentElement;
    if (
      element == null ||
      box == null ||
      element.clientHeight <= box.clientHeight + 1
    ) {
      return;
    }
    unboundedWarnedRef.current = true;
    console.error(
      `DataTable: \`virtualization\` is inert — the scroll viewport (${element.clientHeight}px) is taller than the container that bounds it (${box.clientHeight}px), so there is nothing to window against and every row renders. The viewport has escaped its bound, which \`height\`/\`maxHeight\` can no longer cause on their own: look for the height constraint landing somewhere other than the viewport, or app CSS overriding the viewport's height. (A percentage value is reported separately by \`Table\` itself.)`
    );
  });

  // `scrollToIndex` honoured on change. Without this it is a declared config member
  // reaching nothing.
  const { scrollToIndex } = resolved;
  useEffect(() => {
    if (!resolved.enabled || scrollToIndex === undefined) {
      return;
    }
    virtualizer.scrollToIndex(scrollToIndex);
  }, [resolved.enabled, scrollToIndex, virtualizer]);

  // Running the extractor is a side effect of this call, so `pinReleasedRef` is only
  // meaningful after it — see the read below.
  const items = resolved.enabled ? virtualizer.getVirtualItems() : [];

  // The window. Already contiguous, already overscanned, and already extended by the
  // focus pin, because `rangeExtractor` did all three inside the virtualizer.
  const isWindowed = resolved.enabled && items.length > 0;
  const start = isWindowed ? items[0]!.index : 0;
  const end = isWindowed ? items[items.length - 1]!.index : -1;
  const rows = isWindowed ? displayRows.slice(start, end + 1) : displayRows;

  const totalSize = resolved.enabled ? virtualizer.getTotalSize() : 0;
  const paddingTop = isWindowed ? items[0]!.start : 0;
  const paddingBottom = isWindowed
    ? Math.max(0, totalSize - items[items.length - 1]!.end)
    : 0;

  // Read AFTER `getVirtualItems()`, which is the call that runs the extractor.
  const focusReleased = isWindowed && pinReleasedRef.current;

  // ── Which row holds focus, recorded from the event that carries it ──────────
  //
  // Design §7 clause 1 needs the focused index **during render**, because that is
  // when the range is decided. Recording it from `measureRow` instead — i.e. during
  // commit, on the way past a row element — is always exactly one render too late,
  // and in practice never fires at all: focusing a row does not cause a render, so
  // the next render is the scroll that moves the window, and it reads an index that
  // has not been written yet. Verified before this was changed — a row focused and
  // then scrolled past was unmounted with focus landing on `<body>`.
  //
  // `focusin` is the event that actually carries the information, it bubbles, and the
  // seam already holds the container ref — so this costs no change to `table.tsx` or
  // the view.
  //
  // NOT gated on `resolved.enabled`, and that is a deliberate widening: clause 3's
  // rungs 3-4 run on every table, windowed or not, and they need to know whether
  // focus was ever in here. The index half below stays inert without windowing —
  // `elementsRef` is filled by `measureRow`, which only the enabled path supplies —
  // so an unwindowed table pays two listeners and one boolean write.
  useEffect(() => {
    const element = containerRef.current;
    if (element === null) {
      return;
    }
    const onFocusIn = (event: FocusEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }
      // Recorded before the index walk, because it is true of ANY focus in here —
      // a cell button, the container itself — not only of a row this seam mapped.
      focusWasInsideRef.current = true;
      // Walk out through ANY nesting: a detail panel may hold its own table, whose
      // `<tr>` is the nearest one but is not in our map. Only a row this seam
      // rendered can name an index.
      let row = target.closest('tr');
      while (row !== null) {
        for (const [index, candidate] of elementsRef.current) {
          if (candidate === row) {
            focusedIndexRef.current = index;

            return;
          }
        }
        row = row.parentElement?.closest('tr') ?? null;
      }
    };
    const onFocusOut = (event: FocusEvent) => {
      // Only when focus leaves the table entirely. `relatedTarget === null` is the
      // focused-row-just-unmounted case, which is precisely when the handoffs below
      // still need this — so that case must NOT clear it. THREE clauses now depend
      // on that: clause 2's pin-budget handoff, and clause 3's rungs 3 and 4.
      //
      // A real `relatedTarget` outside the table means the person moved focus on
      // purpose, and then a later emptying of the table must not pull it back.
      const next = event.relatedTarget;
      if (next instanceof Node && !element.contains(next)) {
        focusedIndexRef.current = undefined;
        focusWasInsideRef.current = false;
      }
    };
    element.addEventListener('focusin', onFocusIn);
    element.addEventListener('focusout', onFocusOut);

    return () => {
      element.removeEventListener('focusin', onFocusIn);
      element.removeEventListener('focusout', onFocusOut);
    };
  }, [containerRef]);

  // Design §7, second clause: the pin budget is exhausted, so the focused row has
  // just unmounted and focus moves to the scroll container — **without touching
  // `currentRowId`**. This seam has no access to that state at all, so "the logical
  // current row does not change" holds by construction rather than by care.
  //
  // The guard cannot be "is focus still inside the container": by the time an effect
  // runs the row is already gone and the browser has already reset focus to `<body>`,
  // so that test is false exactly when the handoff is needed. It is the reason this
  // clause silently never fired. `<body>` is instead the *signal* — and testing for
  // it is also what stops us stealing focus the user moved somewhere deliberate in
  // the meantime, because then `activeElement` is that element, not `<body>`.
  //
  // Both halves are the shared module-level helpers, and deliberately so: clause 3's
  // rung 4 is the *same landing* reached by a different route, so a second copy of
  // either the guard or the `tabIndex`/`focus` pair would be a place for the two to
  // drift apart.
  useEffect(() => {
    if (!focusReleased) {
      return;
    }
    const element = containerRef.current;
    if (element === null || focusMovedElsewhere()) {
      return;
    }
    focusScrollContainer(element);
    // Cleared so the released row stops extending the range on every later render.
    focusedIndexRef.current = undefined;
  }, [containerRef, focusReleased]);

  const { dynamic } = resolved;
  // `start` is captured in the closure rather than read from a ref at call time, and
  // that is what makes the detach correct. React calls the PREVIOUS render's ref with
  // `null` during the *next* commit, so a ref read at call time would already hold the
  // new window's start and delete the entry for an unrelated row that is still
  // mounted. Capturing it means each closure deletes exactly the index it added.
  // (It also means this identity changes whenever the window moves, which is fine —
  // the view holds it in no dependency array.)
  const measureRow = useCallback(
    (element: HTMLTableRowElement | null, displayRowIndex: number) => {
      const fullIndex = start + displayRowIndex;
      if (element === null) {
        elementsRef.current.delete(fullIndex);

        return;
      }
      // The element↔index map. Its consumer is the `focusin` handler above, which has
      // no other way to turn a focus event's target back into a display index — and
      // that is the reason `measureRow` is supplied in `fixed` mode too, where nothing
      // is measured.
      elementsRef.current.set(fullIndex, element);
      if (dynamic) {
        // `measureElement` identifies the item by `data-index` and refuses to
        // measure without it — it logs "Missing attribute name" and silently keeps
        // the estimate, so a table of uniform rows would look correct while dynamic
        // measurement did nothing at all. The seam owns the attribute so the view
        // needs no change, and it must be the FULL index, which is what the
        // virtualizer counts in.
        element.dataset.index = String(fullIndex);
        virtualizer.measureElement(element);
      }
    },
    [dynamic, start, virtualizer]
  );

  const scrollToRecord = useCallback(
    (recordIndex: number) => {
      // Records are addressed by `recordIndex` and the window by display index, and
      // the two diverge as soon as any feature projects a row. Resolve through the
      // display list rather than assuming they coincide.
      const target = displayRows.findIndex(
        (row) => 'recordIndex' in row && row.recordIndex === recordIndex
      );
      virtualizer.scrollToIndex(target < 0 ? recordIndex : target);
    },
    [displayRows, virtualizer]
  );

  const measureLayout = useCallback(() => {
    virtualizer.measure();
  }, [virtualizer]);

  // ── Design §7 clause 3, rungs 3 and 4 ──────────────────────────────────────
  //
  // Called by the controller through the view bridge, and only once rungs 1 and 2
  // have both missed — i.e. no focusable row survived the data change. The
  // controller owns "which row", this owns "which element", and neither can do the
  // other's half.
  //
  // EXACTLY ONE RUNG PLACES FOCUS. There is no path here that focuses twice: rung 3
  // returns, or rung 4 runs. That is structural rather than remembered, and it
  // matters because a chain that focused the wrong thing and then the right thing
  // would end on the correct element and fire two focus events — indistinguishable
  // from correct if a test only reads `document.activeElement` at the end.
  //
  // Touches no state, so §7's "without changing logical current row" holds by
  // construction: this seam cannot reach `currentRowId` at all.
  const focusAfterRowLoss = useCallback(() => {
    const element = containerRef.current;
    if (element === null) {
      return;
    }
    // TWO preconditions, and they reject different things.
    //
    // `focusWasInsideRef` — focus has to have BEEN here. `<body>` alone cannot carry
    // that: it is also what `activeElement` is before anyone has touched the page, so
    // without this a background refresh that empties an untouched table would pull
    // focus into it. A controlled `currentRowId` makes that reachable with no
    // interaction at all.
    //
    // `focusMovedElsewhere` — focus must not have been re-placed since. Together they
    // read as "focus was in this table and was lost when the row went", which is the
    // only situation §7 is about.
    if (!focusWasInsideRef.current || focusMovedElsewhere()) {
      return;
    }
    // Cleared BEFORE the handoff, not after. Rung 3 lands outside the container, so
    // no `focusin` follows to correct the flag; rung 4 lands on the container, whose
    // own listener sets it back to `true`. Either way it ends up telling the truth.
    focusWasInsideRef.current = false;
    const toolbarTarget = toolbarFocusTarget(element);
    if (toolbarTarget !== null) {
      toolbarTarget.focus();

      return;
    }
    focusScrollContainer(element);
  }, [containerRef]);

  if (!resolved.enabled) {
    // Identity. The WINDOWING members stay `undefined`, so their toggle actions keep
    // reporting "not implemented" rather than silently no-opping on a table with no
    // window to scroll. `focusAfterRowLoss` is not one of them — it is focus policy
    // for every table, and omitting it here would make `virtualization` decide which
    // rung the chain stops at.
    return {
      rows: displayRows,
      paddingTop: 0,
      paddingBottom: 0,
      isWindowed: false,
      // Every row is rendered on this path, so the window's first row is the list's
      // first row. The view gates the aria positions on `isWindowed` anyway.
      windowStart: 0,
      focusAfterRowLoss,
    };
  }

  return {
    rows,
    paddingTop,
    paddingBottom,
    isWindowed,
    // `start` is `getVirtualItems()[0].index` — the same number `measureRow` adds to
    // its window-relative argument to reach `fullIndex`. One source, two consumers.
    windowStart: start,
    measureRow,
    scrollToRecord,
    measureLayout,
    focusAfterRowLoss,
  };
}
