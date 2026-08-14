import type { ColumnDef } from '@tanstack/react-table';
import { act, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';

import type {
  DataTableChangeEvent,
  DataTableSlice,
} from '../data-table-contract';
import {
  useDataTable,
  type DataTableController,
} from '../data-table-controller';
import { DataTableRoot } from '../data-table-root';
import { DataTableView } from '../data-table-view';
import { DataGridToolbar } from '../../data-grid/data-grid-toolbar';

// U6b — design §7 focus clauses 3 and 4. Acceptance target:
//   packages/ui-spec/components/data-grid/behavior.md:275-277
//     "When data removes it / Then same-index, previous-last, toolbar,
//      scroll-container fallback order applies / And exactly one data-reconcile
//      event updates current row"
//
// All four rungs. Rungs 1 and 2 name a surviving row and are decided in the
// controller; rungs 3 and 4 move DOM focus and are decided in the body-window seam,
// reached through `DataTableViewBridge.focusAfterRowLoss`. The controller calls it
// at one junction — when rungs 1 and 2 have both missed.
//
// ── Why these tests drive data rather than asserting the fallback directly ────
//
// A focus fallback is unusually easy to assert into existence: a test that sets the
// expected id and then checks it is set proves nothing. So every case here **removes
// a row from `data`** and lets the controller's own reconcile effect decide, then
// observes `currentRowId`. The component produces the state; the test only reads it.
//
// ── What the rung tests assert, and why a focus LOCATION is not enough ───────
//
// The rung-3 MISS is the ordinary configuration, not an edge case: DataGrid renders
// no toolbar row unless `toolbar` is passed or a search column exists, and a
// rendered row can still hold no focusable control. A miss must FALL THROUGH to
// rung 4 — and "fell through to rung 4" and "never implemented rung 3" leave focus
// on the SAME element, so `document.activeElement` alone cannot tell them apart.
//
// So every rung test asserts the whole ORDERED SEQUENCE of `focus()` receivers, via
// a `HTMLElement.prototype.focus` spy. That pins three separate things a location
// assertion cannot: which rung ran, that exactly ONE did (a chain that focused the
// wrong thing then the right thing ends up correct and fires twice), and — in the
// negative cases — that none did.
//
// ── Environment limit, stated rather than dressed up ─────────────────────────
//
// happy-dom has no layout engine. Nothing here observes scrolling, and rung 4's
// value to a person partly IS that the container can then be scrolled with the
// arrow keys. What is asserted is WHICH ELEMENT receives focus and in what order.
// The scroll behaviour itself needs a browser (#78).

interface Row {
  id: string;
  value: number;
}

const columns: ColumnDef<Row, unknown>[] = [
  { accessorKey: 'value', header: 'Value' },
];

/** `r0…r{n-1}`, with `value` matching the index so a sort is predictable. */
const rows = (ids: readonly number[]): Row[] =>
  ids.map((n) => ({ id: `r${n}`, value: n }));

function Harness({
  data,
  onStateChange,
  sorting,
  capture,
  toolbar,
  rowNav,
  columns: columnDefs = columns,
}: {
  data: Row[];
  onStateChange?: (
    event: DataTableChangeEvent<DataTableSlice, unknown, string>
  ) => void;
  sorting?: readonly { id: string; desc: boolean }[];
  capture: (controller: DataTableController<Row>) => void;
  /**
   * Chrome rendered ABOVE the table, as DataGrid renders its toolbar — a sibling
   * of the table, not an ancestor, which is the shape rung 3's ancestor walk has
   * to cope with. A function so a real `DataGridToolbar` can be handed the table.
   */
  toolbar?: ReactNode | ((controller: DataTableController<Row>) => ReactNode);
  /** Roving focus, which is what gives the current row a tab stop to focus. */
  rowNav?: boolean;
  /** Overridden only by the nested-grid case, which needs a cell to render into. */
  columns?: ColumnDef<Row, unknown>[];
}) {
  const controller = useDataTable({
    columns: columnDefs,
    data,
    getRowId: (row) => row.id,
    // BOTH, and the second is easy to forget: `state.sorting` records the order, but
    // `getSortedRowModel()` is only installed when the sorting feature is enabled
    // (`sorting.ts:52`, via `ctx.gates.sortingEnabled`). Without `sorting: true` the
    // state is tracked and the rows come out in `data` order — which silently turns
    // the discriminating test below into a duplicate of the first one.
    ...(sorting === undefined ? {} : { sorting: true, state: { sorting } }),
    // No cast. The prop is typed as the controller types it, which is the point: the
    // first version declared the slice as `never`, so `event.slice === 'currentRowId'`
    // below was compared against a type nothing inhabits. The assertions still passed
    // — they read a `vi.fn()`'s recorded calls at runtime — so `vitest run` was green
    // while the test's types meant nothing. `pnpm test` does not typecheck here, which
    // is why only `pnpm typecheck` caught it.
    ...(onStateChange === undefined ? {} : { onStateChange }),
  });
  capture(controller);

  return (
    <div>
      {typeof toolbar === 'function' ? toolbar(controller) : toolbar}
      <DataTableRoot table={controller}>
        <DataTableView<Row>
          {...(rowNav === true ? { currentRow: true } : {})}
        />
      </DataTableRoot>
      {/* Focusable, and NOT inside a toolbar — so rung 3 must never find it. It
          exists to be focused on purpose in the "do not steal focus" case. */}
      <button data-testid="elsewhere">elsewhere</button>
    </div>
  );
}

/** The `value` of each rendered body row, in DOM order — i.e. what the user sees. */
const visibleValues = (): number[] =>
  [...document.querySelectorAll('tbody tr')]
    .map((row) => Number.parseInt(row.textContent ?? '', 10))
    .filter((value) => !Number.isNaN(value));

/**
 * Renders, makes a row current, then removes rows — the sequence the clause is about.
 * Returns the controller so the test reads state rather than being told it.
 */
function removeRows({
  initial,
  current,
  remaining,
  sorting,
  onStateChange,
  expectVisibleBefore,
}: {
  initial: readonly number[];
  current: string;
  remaining: readonly number[];
  sorting?: readonly { id: string; desc: boolean }[];
  onStateChange?: (
    event: DataTableChangeEvent<DataTableSlice, unknown, string>
  ) => void;
  expectVisibleBefore?: readonly number[];
}) {
  let controller: DataTableController<Row> | undefined;
  const capture = (next: DataTableController<Row>) => {
    controller = next;
  };
  const props = {
    capture,
    ...(sorting === undefined ? {} : { sorting }),
    ...(onStateChange === undefined ? {} : { onStateChange }),
  };
  const view = render(<Harness data={rows(initial)} {...props} />);

  if (expectVisibleBefore !== undefined) {
    expect(visibleValues()).toEqual([...expectVisibleBefore]);
  }

  act(() => {
    controller!.requestChange('currentRowId', current, 'api');
  });
  expect(controller!.getState().currentRowId).toBe(current);

  // A NEW array identity, which is what the reconcile effect keys off.
  view.rerender(<Harness data={rows(remaining)} {...props} />);

  return controller!;
}

describe('§7 clause 3 — rung 1, the row now at the removed row’s position', () => {
  it('makes the row that shifted into the vacated index current', () => {
    // r0 r1 [r2] r3 r4 → remove r2 → r0 r1 r3 r4, so index 2 is now r3.
    const controller = removeRows({
      initial: [0, 1, 2, 3, 4],
      current: 'r2',
      remaining: [0, 1, 3, 4],
    });

    // Not `undefined`: clearing it strands the keyboard user with nowhere to resume.
    expect(controller.getState().currentRowId).toBe('r3');
  });

  it('POSITION IS THE VISIBLE ONE, not the order of `data`', () => {
    // The discriminating case, and the reason it exists: a `flatRows`-based
    // implementation passes every other test in this file. `flatRows` is pre-sort, so
    // the two readings only diverge once the visible order differs from `data` order.
    //
    // Sorted DESC by value, the visible list is r4 r3 r2 [r1] r0 — r1 sits at visible
    // index 3. Remove r1 and the visible list is r4 r3 r2 r0, whose index 3 is r0.
    // Over `flatRows` (data order r0 r1 r2 r3 r4) r1 sits at index 1, and after
    // removal index 1 is r2. So: r0 if position means what the user sees, r2 if it
    // means the data array.
    const controller = removeRows({
      initial: [0, 1, 2, 3, 4],
      current: 'r1',
      remaining: [0, 2, 3, 4],
      sorting: [{ id: 'value', desc: true }],
      // THE PREMISE, ASSERTED. This test is worthless unless the visible order really
      // differs from `data` order, and the first version of it silently did not:
      // `state.sorting` alone tracks the order without installing the sort model, so
      // the rows came out 0 1 2 3 4 and the test failed against a correct
      // implementation. Checking the premise is what turned that from "the code is
      // wrong" into "the harness was wrong".
      expectVisibleBefore: [4, 3, 2, 1, 0],
    });

    expect(controller.getState().currentRowId).toBe('r0');
    expect(controller.getState().currentRowId).not.toBe('r2');
  });
});

describe('§7 clause 3 — rung 2, the last surviving row', () => {
  it('falls back to the new last row when the vacated index no longer exists', () => {
    // r4 was last, so after removal index 4 is past the end and rung 1 has no answer.
    const controller = removeRows({
      initial: [0, 1, 2, 3, 4],
      current: 'r4',
      remaining: [0, 1, 2, 3],
    });

    expect(controller.getState().currentRowId).toBe('r3');
  });

  it('falls back to the last row when several rows go at once', () => {
    // Current row AND everything after it removed — rung 1 is out of range again.
    const controller = removeRows({
      initial: [0, 1, 2, 3, 4],
      current: 'r3',
      remaining: [0, 1],
    });

    expect(controller.getState().currentRowId).toBe('r1');
  });
});

describe('§7 clause 3 — no row survives', () => {
  it('clears the current row when the table empties, rather than naming a dead id', () => {
    const controller = removeRows({
      initial: [0, 1, 2],
      current: 'r1',
      remaining: [],
    });

    // No row can carry it, so `undefined` is the only honest value — and it stays
    // `undefined` after rungs 3 and 4 run. Those move DOM FOCUS and touch no state,
    // which is design §7's "without changing logical current row"; the seam has no
    // access to `currentRowId` at all, so it holds by construction.
    expect(controller.getState().currentRowId).toBeUndefined();
  });
});

describe('§7 clause 4 — exactly one data-reconcile event updates the current row', () => {
  it('emits one currentRowId reconcile, not one per rung considered', () => {
    const onStateChange = vi.fn();
    const controller = removeRows({
      initial: [0, 1, 2, 3, 4],
      current: 'r2',
      remaining: [0, 1, 3, 4],
      onStateChange,
    });

    const reconciles = onStateChange.mock.calls
      .map(
        ([event]) =>
          event as DataTableChangeEvent<DataTableSlice, unknown, string>
      )
      .filter(
        (event) =>
          event.slice === 'currentRowId' && event.cause === 'data-reconcile'
      );

    // The COUNT is the assertion, not the final value. A chain that requested
    // `undefined` for the clear and then the fallback id would land on the right
    // value and emit twice — a controlled caller applying both would see the current
    // row blink out and back, and a value-only assertion cannot tell the two apart.
    expect(reconciles).toHaveLength(1);
    expect(reconciles[0]!.value).toBe('r3');
    expect(controller.getState().currentRowId).toBe('r3');
  });

  it('emits nothing when the current row survives the data change', () => {
    // The opposite failure, and the reason this test is here: reconciling on every
    // data change would fire a `data-reconcile` for a row nothing happened to. r1
    // survives — only r4 goes.
    const observed = vi.fn();
    const surviving = removeRows({
      initial: [0, 1, 2, 3, 4],
      current: 'r1',
      remaining: [0, 1, 2, 3],
      onStateChange: observed,
    });

    const reconciles = observed.mock.calls
      .map(
        ([event]) =>
          event as DataTableChangeEvent<DataTableSlice, unknown, string>
      )
      .filter(
        (event) =>
          event.slice === 'currentRowId' && event.cause === 'data-reconcile'
      );

    expect(reconciles).toHaveLength(0);
    expect(surviving.getState().currentRowId).toBe('r1');
  });
});

// ── Rungs 3 and 4 ───────────────────────────────────────────────────────────────

/**
 * A short, stable name for a focus receiver, so a test can assert the SEQUENCE.
 *
 * `data-testid` first, so the fixtures below name themselves; `data-slot` next,
 * which is how the scroll container (`scroll-area-viewport`) and the toolbar row
 * (`data-grid-toolbar`) identify themselves in shipped markup.
 */
const labelOf = (element: Element | null): string =>
  element === null
    ? 'null'
    : element === document.body
      ? 'body'
      : (element.getAttribute('data-testid') ??
        element.getAttribute('data-slot') ??
        element.tagName.toLowerCase());

/**
 * Records every `HTMLElement.focus()` receiver in call order, then restores.
 *
 * Patched on the prototype rather than on one element on purpose: the point is to
 * catch focus landing on an element the test did NOT expect — the toolbar row
 * itself, or a second call after the first — and a per-element spy can only ever
 * confirm the element it was attached to.
 */
function installFocusSpy(): { calls: string[]; restore: () => void } {
  const calls: string[] = [];
  const original = HTMLElement.prototype.focus;
  HTMLElement.prototype.focus = function spy(
    this: HTMLElement,
    ...args: Parameters<typeof original>
  ) {
    calls.push(labelOf(this));
    original.apply(this, args);
  };

  return {
    calls,
    restore: () => {
      HTMLElement.prototype.focus = original;
    },
  };
}

/** A toolbar row carrying the shipped hook, whose CONTENTS the test controls. */
const stubToolbar = (children?: ReactNode) => (
  // The real `DataGridToolbar` cannot be configured into every state the chain has
  // to handle — an empty row needs `viewOptions: false` AND no search column AND no
  // active filter, and a disabled-only row is not reachable through its props at
  // all. So the CONTENTS are stubbed while the hook itself stays exactly the shipped
  // attribute, and one case below runs the real component to join the two.
  <div data-slot="data-grid-toolbar">{children}</div>
);

/**
 * Focuses a row, then removes rows, and reports every `focus()` that the removal
 * caused — in order.
 *
 * The spy is installed AFTER the setup focus so only the reconcile's own calls are
 * recorded, and both setup steps assert their own premise: a test that silently
 * failed to focus anything would see an empty sequence and read as "the chain
 * correctly did nothing".
 */
function focusChain({
  toolbar,
  initial = [0, 1, 2],
  current = 'r1',
  remaining = [],
  focusSelector = 'tbody tr[tabindex="0"]',
  focusElsewhere = false,
  focusNothing = false,
  blurFirst = false,
  onStateChange,
}: {
  toolbar?: ReactNode | ((controller: DataTableController<Row>) => ReactNode);
  initial?: readonly number[];
  current?: string;
  remaining?: readonly number[];
  focusSelector?: string;
  /** Put focus on a control OUTSIDE the table instead of on the current row. */
  focusElsewhere?: boolean;
  /**
   * Focus nothing at all, so `activeElement` is `<body>` because nobody has
   * touched the page — not because a focused row was removed.
   */
  focusNothing?: boolean;
  /** Focus a row, then blur it — focus was in the table and is now on `<body>`. */
  blurFirst?: boolean;
  onStateChange?: (
    event: DataTableChangeEvent<DataTableSlice, unknown, string>
  ) => void;
}) {
  let controller: DataTableController<Row> | undefined;
  const props = {
    capture: (next: DataTableController<Row>) => {
      controller = next;
    },
    rowNav: true,
    ...(toolbar === undefined ? {} : { toolbar }),
    ...(onStateChange === undefined ? {} : { onStateChange }),
  };
  const view = render(<Harness data={rows(initial)} {...props} />);

  act(() => {
    controller!.requestChange('currentRowId', current, 'api');
  });

  if (focusNothing) {
    // PREMISE: `<body>` for the untouched-page reason, which is the case that has to
    // be told apart from `<body>` because a row was just removed.
    expect(document.activeElement).toBe(document.body);
  } else {
    const seed = document.querySelector<HTMLElement>(
      focusElsewhere ? '[data-testid="elsewhere"]' : focusSelector
    );
    // PREMISE. Without a focused element there is nothing for the chain to react to,
    // and every assertion below would pass vacuously.
    expect(seed).not.toBeNull();
    seed!.focus();
    expect(document.activeElement).toBe(seed);

    if (blurFirst) {
      seed!.blur();
      // PREMISE: focus is lost, which is the state the fallback exists for.
      expect(document.activeElement).toBe(document.body);
    }
  }

  const spy = installFocusSpy();
  // A NEW array identity, which is what the reconcile effect keys off.
  view.rerender(<Harness data={rows(remaining)} {...props} />);
  spy.restore();

  return {
    calls: spy.calls,
    landed: labelOf(document.activeElement),
    controller: controller!,
  };
}

describe('§7 clause 3 — rung 3, the toolbar', () => {
  it('focuses the toolbar’s first control, and only it', () => {
    const { calls, landed } = focusChain({
      toolbar: stubToolbar(
        <>
          <button data-testid="search">search</button>
          <button data-testid="settings">settings</button>
        </>
      ),
    });

    // ONE call, on the FIRST control in document order. This is the test that kills
    // "rung 3 was never implemented" — that version leaves focus on the scroll
    // container, which is a perfectly plausible place for focus to be.
    expect(calls).toEqual(['search']);
    expect(landed).toBe('search');
  });

  it('finds the real DataGridToolbar, not just a stub shaped like one', () => {
    // Joins this file to `data-grid-toolbar.test.tsx`: that one pins the attribute
    // on the shipped component, this one pins that the shipped component is
    // REACHABLE by the query. Neither alone would catch the hook moving to an inner
    // wrapper, or the contract selector failing to match a Base UI trigger.
    const { calls, landed } = focusChain({
      toolbar: (controller) => (
        <DataGridToolbar
          table={controller.table}
          trailing={<button type="button">Add node</button>}
        />
      ),
    });

    // A member is now required to make this case non-empty. It used to be the
    // column-settings trigger, which a default toolbar always rendered — PLTFRM-93130
    // moved that control into the trailing column's header, so the *default* real
    // toolbar renders no control at all and belongs with the miss cases below. What
    // this still pins is the part the stub cannot: the shipped row carries the
    // `data-slot` hook where the ancestor walk looks for it, and the contract
    // selector matches a control inside it.
    expect(calls).toHaveLength(1);
    expect(landed).toBe('button');
    expect(document.activeElement?.textContent).toBe('Add node');
  });
});

describe('§7 clause 3 — rung 3 MISSES and the chain falls through to rung 4', () => {
  // THE DEFAULT CONFIGURATION, twice over. Both of these are misses, and a miss that
  // stopped would strand a keyboard user with focus on `<body>`.

  it('falls through when the toolbar row holds no focusable control', () => {
    const { calls, landed } = focusChain({ toolbar: stubToolbar() });

    // Kills TWO plausible-but-wrong versions at once. A chain that treated the row
    // element as a landing (`tabIndex={-1}` on it, considered and rejected — an
    // empty layout div announces nothing) would read `['data-grid-toolbar']`. A
    // chain that stopped on finding a toolbar with nothing in it would read `[]`.
    expect(calls).toEqual(['scroll-area-viewport']);
    expect(landed).toBe('scroll-area-viewport');
  });

  it('falls through when there is no toolbar at all — the out-of-the-box case', () => {
    // DataGrid renders no toolbar row unless `toolbar` is passed or a search column
    // exists (`data-grid-config/toolbar.tsx:106-109`), so this is not an exotic
    // configuration: it is what a plain grid does.
    const { calls, landed } = focusChain({ toolbar: undefined });

    expect(calls).toEqual(['scroll-area-viewport']);
    expect(landed).toBe('scroll-area-viewport');
  });

  it('falls through past controls that cannot actually take focus', () => {
    // A landing on an inert control is worse than a miss: `.focus()` on it does
    // nothing, so focus stays on `<body>` and the chain reports success having moved
    // nobody. `[]` would be the failure here, and `['disabled-*']` would mean the
    // selector matched something unfocusable.
    const { calls, landed } = focusChain({
      toolbar: stubToolbar(
        <>
          <button data-testid="disabled-attr" disabled>
            no
          </button>
          <button data-testid="disabled-aria" aria-disabled="true">
            no
          </button>
          <div data-testid="not-a-tab-stop" tabIndex={-1}>
            no
          </div>
        </>
      ),
    });

    expect(calls).toEqual(['scroll-area-viewport']);
    expect(landed).toBe('scroll-area-viewport');
  });

  it('ignores a toolbar belonging to a grid nested inside this table', () => {
    // A detail panel may hold its own grid, and its toolbar is a DESCENDANT of our
    // scroll container. Stealing focus into a child grid's chrome is worse than
    // falling through, so the walk skips toolbars inside the container. Rendered
    // through a cell so it lands where a nested grid's would.
    // ANNOTATED, not cast. `as` on an object literal strips that literal's
    // contextual type, and contextual typing is what types the callbacks INSIDE it
    // — so a cast here would widen `cell`'s own context and hide an error that
    // `pnpm test` cannot see either way.
    const nested: ColumnDef<Row, unknown>[] = [
      { accessorKey: 'value', header: 'Value' },
      {
        id: 'nested',
        header: 'Nested',
        cell: () => stubToolbar(<button data-testid="inner">inner</button>),
      },
    ];
    let controller: DataTableController<Row> | undefined;
    const props = {
      capture: (next: DataTableController<Row>) => {
        controller = next;
      },
      rowNav: true,
      columns: nested,
    };
    const view = render(<Harness data={rows([0, 1, 2])} {...props} />);
    act(() => {
      controller!.requestChange('currentRowId', 'r1', 'api');
    });
    // PREMISE: the nested toolbar really is inside the scroll container.
    const inner = document.querySelector('[data-testid="inner"]')!;
    const viewport = document.querySelector(
      '[data-slot="scroll-area-viewport"]'
    )!;
    expect(viewport.contains(inner)).toBe(true);

    const seed = document.querySelector<HTMLElement>('tbody tr[tabindex="0"]')!;
    seed.focus();
    const spy = installFocusSpy();
    view.rerender(<Harness data={rows([])} {...props} />);
    spy.restore();

    expect(spy.calls).toEqual(['scroll-area-viewport']);
  });
});

describe('§7 clause 3 — the chain does not fire when it was not asked', () => {
  it('takes no focus when the person moved it out of the table on purpose', () => {
    // The other half of the claim, and a separate one: "the fallback moves focus"
    // and "it does not move focus when unasked" cannot be shown by the same test.
    const { calls, landed } = focusChain({
      toolbar: stubToolbar(<button data-testid="search">search</button>),
      focusElsewhere: true,
    });

    expect(calls).toEqual([]);
    expect(landed).toBe('elsewhere');
  });

  it('takes no focus when focus was never inside the table', () => {
    // `<body>` is the signal that focus was LOST, but it is also what `activeElement`
    // is before anyone has touched the page — so the guard cannot be `<body>` alone.
    // A controlled `currentRowId` reaches this with no interaction at all: a
    // background refresh empties an untouched table, and a chain guarding only on
    // `<body>` would pull focus into it out of nowhere.
    const { calls, landed } = focusChain({
      toolbar: stubToolbar(<button data-testid="search">search</button>),
      focusNothing: true,
    });

    expect(calls).toEqual([]);
    expect(landed).toBe('body');
  });

  it('takes no focus when a row survives, because rung 1 answered', () => {
    // Rungs 3-4 are the chain's TAIL. Firing them on every reconcile would move DOM
    // focus away from a table that just got a perfectly good current row.
    const { calls, controller } = focusChain({
      initial: [0, 1, 2, 3, 4],
      current: 'r2',
      remaining: [0, 1, 3, 4],
      toolbar: stubToolbar(<button data-testid="search">search</button>),
    });

    expect(calls).toEqual([]);
    expect(controller.getState().currentRowId).toBe('r3');
  });

  it('takes no focus when the removed current row was not in the visible list', () => {
    // `fallback === undefined` has TWO causes and only one is a §7 case. Here the
    // current row is a stale id that no visible row holds — the state a filtered-out
    // or off-page current row is in — so DOM focus was never on it and moving focus
    // would TAKE it from wherever the person is.
    //
    // Focus is deliberately on `<body>` (a row was focused, then blurred), so the
    // seam's own "was focus lost" guard cannot mask this: the only thing standing
    // between a stale id and a focus theft is the controller's `removedIndex >= 0`.
    const { calls, landed } = focusChain({
      current: 'r99',
      focusSelector: 'tbody tr',
      blurFirst: true,
      remaining: [0, 1],
      toolbar: stubToolbar(<button data-testid="search">search</button>),
    });

    expect(calls).toEqual([]);
    expect(landed).toBe('body');
  });
});

describe('§7 clause 4 — rungs 3-4 add no second reconcile', () => {
  it('emits one currentRowId event and places focus exactly once', () => {
    const onStateChange = vi.fn();
    const { calls, controller } = focusChain({
      toolbar: stubToolbar(<button data-testid="search">search</button>),
      onStateChange,
    });

    const reconciles = onStateChange.mock.calls
      .map(
        ([event]) =>
          event as DataTableChangeEvent<DataTableSlice, unknown, string>
      )
      .filter(
        (event) =>
          event.slice === 'currentRowId' && event.cause === 'data-reconcile'
      );

    // BOTH counts, because the two failure modes are independent: the DOM half could
    // fire twice while the state half fires once, or the junction could be placed so
    // that continuing into rungs 3-4 re-ran the request.
    expect(reconciles).toHaveLength(1);
    expect(reconciles[0]!.value).toBeUndefined();
    expect(calls).toEqual(['search']);
    expect(controller.getState().currentRowId).toBeUndefined();
  });
});
