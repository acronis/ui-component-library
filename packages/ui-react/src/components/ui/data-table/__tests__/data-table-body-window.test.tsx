import { useEffect, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  useDataTable,
  type DataTableController,
} from '../data-table-controller';
import { DataTableRoot } from '../data-table-root';
import { DataTableView } from '../data-table-view';

// U6a — the windowing seam. Acceptance targets:
//   packages/ui-spec/components/data-table/behavior.md  "Virtualization is presentation only"
//   packages/ui-spec/components/data-grid/behavior.md   "Virtual expanded rows retain focus" (clauses 1–2)
//
// ── happy-dom has no layout, and that is the whole difficulty here ───────────
//
// `@tanstack/react-virtual` windows against measured geometry, and in happy-dom
// every element is 0×0 with `scrollTop` permanently 0. So a virtualization test
// that "just renders" measures nothing and windows nothing — it would pass while
// asserting the identity behaviour, which is the shape of a check that cannot fail.
//
// `layOut()` below stubs the three geometry reads the virtualizer actually makes,
// on the prototype rather than per element, because the viewport and the rows are
// created inside the view. Every windowing assertion in this file is gated on it,
// and the first test proves the stub is load-bearing by asserting the DOM really
// does shrink.
//
// **This does not replace browser verification.** Sticky ancestors, stacking
// contexts, the overlay scrollbar and real scroll geometry are not expressible
// here; U6's brief requires a browser pass and this file does not discharge it.
//
// ── And it PRESUPPOSES the precondition rather than checking it ──────────────
//
// `layOut()` reports a bounded `clientHeight` for the viewport because the harness
// says so, **not** because the composition produced one. So the virtualizer here is
// handed the enabling condition, and **every windowing assertion below would stay
// green even if the real bounding mechanism failed in the app** — which was not
// hypothetical: before `4be051e1`, `maxHeight` alone genuinely left the viewport
// unbounded (#76). That is **fixed** — both constraints now sit on the element that
// scrolls — so the gap this paragraph describes is now about a FUTURE bounding
// failure rather than a present one. The `data-bounded`
// test is no help there either, since it reads an attribute set independently of
// whether the element can actually scroll.
//
// Three things narrow that gap, and none of them closes it:
//   - the harness passes **`height`**, the one configuration measured to bound for
//     real — it used to pass `maxHeight`, which does not;
//   - the container's `clientHeight` is stubbed too, so the viewport-vs-container
//     comparison the seam makes is meaningful here;
//   - `viewportClientHeight` flips the presupposition, which is how the
//     escaped-viewport error gets a test at all.
//
// **The distinction to keep when adding to this file:** an assertion that stubs or
// asserts the *enabling condition* certifies its own premise; one that lets the
// component produce the state and observes the *outcome* does not. All three defects
// found in this seam were the first kind and all three passed green — the focus
// clauses were inert and untested, the spacer arithmetic was wrong on a path this
// environment cannot reach, and the windowing premise rests on this stub. The focus
// tests below are deliberately the second kind.

interface Row {
  id: string;
  name: string;
}

const columns: ColumnDef<Row, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
];

const rows = (n: number): Row[] =>
  Array.from({ length: n }, (_, i) => ({ id: `r${i}`, name: `Row ${i}` }));

const VIEWPORT_HEIGHT = 400;
const ROW_HEIGHT = 40;

const spies: (() => void)[] = [];

/**
 * Gives happy-dom just enough layout for the virtualizer: a bounded viewport and
 * uniform row heights.
 */
function layOut({
  rowHeight = ROW_HEIGHT,
  viewportClientHeight = VIEWPORT_HEIGHT,
}: { rowHeight?: number; viewportClientHeight?: number } = {}) {
  const el = HTMLElement.prototype;
  const restore = [
    vi.spyOn(el, 'clientHeight', 'get').mockImplementation(function (
      this: HTMLElement
    ) {
      // The CONTAINER is stubbed as well as the viewport, and it has to be: the seam
      // compares the two to catch a viewport that has escaped its bound, so leaving
      // the container at 0 would make every bounded table look escaped. They are
      // equal in a correct composition — measured in a browser at `height={400}`:
      // container 400, viewport 400. `viewportClientHeight` is the knob that
      // reproduces the broken one (browser-measured 400040 against a 400 container).
      if (this.dataset.slot === 'scroll-area-viewport') {
        return viewportClientHeight;
      }

      return this.dataset.slot === 'table-container' ? VIEWPORT_HEIGHT : 0;
    }),
    vi.spyOn(el, 'offsetHeight', 'get').mockImplementation(function (
      this: HTMLElement
    ) {
      return this.tagName === 'TR' ? rowHeight : VIEWPORT_HEIGHT;
    }),
    vi.spyOn(el, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement
    ) {
      const height = this.tagName === 'TR' ? rowHeight : VIEWPORT_HEIGHT;

      return {
        width: 600,
        height,
        top: 0,
        left: 0,
        right: 600,
        bottom: height,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      } as DOMRect;
    }),
  ];
  spies.push(() => restore.forEach((s) => s.mockRestore()));
}

afterEach(() => {
  spies.splice(0).forEach((restore) => restore());
  vi.restoreAllMocks();
});

function View({
  count,
  virtualization,
  bounded = true,
  onCapture,
}: {
  count: number;
  virtualization?: object | false;
  bounded?: boolean;
  onCapture?: (controller: DataTableController<Row>) => void;
}) {
  const controller = useDataTable({
    columns,
    data: rows(count),
    getRowId: (row) => row.id,
    ...(virtualization === undefined || virtualization === false
      ? {}
      : { virtualization }),
  });
  useEffect(() => {
    onCapture?.(controller);
  }, [controller, onCapture]);

  return (
    <DataTableRoot table={controller}>
      {/* `height`, not `maxHeight` — one bound is enough for the harness, and this is
          the one the post-fix measurement used. **Both work**: `4be051e1` moved the
          constraints onto the element that scrolls, so a definite `maxHeight` bounds
          windowing exactly as `height` does, and `table.stories.tsx` requires the two
          to render pixel-identically (`81d68585`). An earlier version of this note
          said `maxHeight` could not work; that was true before the fix and false
          after. What still fails for BOTH is a percentage (`37fe7043`), and the seam
          reports it as a development error. */}
      <DataTableView<Row> {...(bounded ? { height: VIEWPORT_HEIGHT } : {})} />
    </DataTableRoot>
  );
}

const bodyRows = () => [...document.querySelectorAll('tbody tr')];

describe('body window — the stub is load-bearing', () => {
  it('renders every row without virtualization, even with layout available', () => {
    layOut();
    render(<View count={200} />);

    // 200 rows in the DOM. This is the control for every assertion below: if the
    // windowing ones passed while this also passed at 200, the stub would be doing
    // nothing and the suite would be measuring the identity implementation.
    expect(bodyRows()).toHaveLength(200);
  });

  it('renders a window, not the whole list, once virtualization is on', () => {
    layOut();
    render(<View count={200} virtualization={{}} />);

    const rendered = bodyRows().length;
    // A 400px viewport over 40px rows is ~10 visible plus overscan 8, so far fewer
    // than 200 — asserted as a bound rather than an exact count, because the exact
    // number is the virtualizer's business and pinning it would make this a test of
    // @tanstack/react-virtual rather than of the seam.
    expect(rendered).toBeGreaterThan(0);
    expect(rendered).toBeLessThan(200);
  });
});

describe('body window — spacers reserve the scroll height', () => {
  it('reserves the rows outside the window so the scrollbar is honest', () => {
    layOut();
    const { container } = render(<View count={200} virtualization={{}} />);
    // The view renders a spacer as a `<TableRow>` holding one `<TableCell>` with an
    // explicit height, identified here by that inline height.
    const spacers = [
      ...container.querySelectorAll('tbody td[style*="height"]'),
    ] as HTMLElement[];

    // Without spacers a windowed list scrolls a fraction of its real height, so the
    // scrollbar lies and the user cannot reach the end.
    const reserved = spacers.reduce(
      (sum, row) => sum + Number.parseFloat(row.style.height || '0'),
      0
    );
    const renderedHeight = bodyRows().length * ROW_HEIGHT;
    expect(reserved).toBeGreaterThan(200 * ROW_HEIGHT - renderedHeight - 1);

    // **`paddingTop` is not guarded by THIS test**, and cannot be: nothing has
    // scrolled, so the window starts at index 0 where `items[0].start` is
    // legitimately 0 and no top spacer should exist. Only one spacer is reachable
    // at rest, so only one is asserted.
    //
    // It **is** guarded, though — by the pinning-arithmetic test further down, which
    // scrolls first. (An earlier note here said guarding it was impossible in
    // happy-dom because it cannot scroll. It can, if you drive the two things the
    // virtualizer actually observes: `scrollTop` and a `scroll` event. See
    // `scrollViewportTo`.) Negative control: zeroing `paddingTop` in the seam leaves
    // this test green and fails that one.
    expect(spacers).toHaveLength(1);
  });

  it('hides the spacers from assistive technology, and only the spacers', () => {
    layOut();
    const { container } = render(<View count={200} virtualization={{}} />);
    const rows = [...container.querySelectorAll('tbody tr')];
    const spacers = rows.filter((row) =>
      row.querySelector('td[style*="height"]')
    );
    const dataRows = rows.filter((row) => !spacers.includes(row));

    expect(spacers.length).toBeGreaterThan(0);
    // A spacer is scroll height, not content. Unhidden it is a `<tr>` with one empty
    // `<td>`, so a screen reader meets a blank row at each end of a windowed table.
    // Only reachable since windowing shipped — `isWindowed` was always false before.
    for (const spacer of spacers) {
      expect(spacer).toHaveAttribute('aria-hidden', 'true');
    }
    // The half that makes the assertion above mean something: a blanket `aria-hidden`
    // on every row would satisfy it while hiding the entire table.
    expect(dataRows.length).toBeGreaterThan(0);
    for (const row of dataRows) {
      expect(row).not.toHaveAttribute('aria-hidden');
    }
  });
});

describe('body window — the bounded-container precondition', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('reports a development error when the container is unbounded', () => {
    layOut();
    render(<View count={50} virtualization={{}} bounded={false} />);

    // design §5.1's invalid combination, checkable because F3 put `data-bounded` on
    // the element that actually scrolls. Without a bound the virtualizer windows
    // against zero and renders everything — a silent performance cliff, which is
    // why this is an error rather than a warning.
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('requires a bounded scroll container')
    );
  });

  it('says nothing when the container is bounded', () => {
    layOut();
    render(<View count={50} virtualization={{}} />);

    expect(console.error).not.toHaveBeenCalledWith(
      expect.stringContaining('requires a bounded scroll container')
    );
  });

  it('says nothing when virtualization is off, however unbounded', () => {
    layOut();
    render(<View count={50} bounded={false} />);

    expect(console.error).not.toHaveBeenCalled();
  });

  // The `data-bounded` check above asks whether an owner ASKED for a bound. This
  // second one asks whether the element the virtualizer measures actually HAS one,
  // and it exists because the first can pass while the feature is completely inert.
  //
  // Found in a browser, not here: with `maxHeight` and no `height`, the ScrollArea
  // root is clamped but its `height` stays `auto`, so the viewport's `height: 100%`
  // has nothing definite to resolve against and grows to its content. Measured at
  // `maxHeight={400}` over 10,000 rows — container 400px, **viewport 400040px**, no
  // spacers, all 10,000 rows in the DOM, and the table could not be scrolled at all,
  // while `data-bounded` still read `true`.
  it('reports a development error when the viewport has escaped the container that bounds it', () => {
    layOut({ viewportClientHeight: 400_040 });
    render(<View count={200} virtualization={{}} />);

    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('is inert')
    );
    // Named numbers, because "something is wrong with the height" is not actionable
    // and this failure is otherwise completely silent.
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('400040px')
    );
  });

  it('says nothing when the viewport matches the container', () => {
    layOut();
    render(<View count={200} virtualization={{}} />);

    expect(console.error).not.toHaveBeenCalledWith(
      expect.stringContaining('is inert')
    );
  });
});

describe('body window — the imperative bridge', () => {
  it('publishes both actions only while windowing', () => {
    layOut();
    let windowed: DataTableController<Row> | undefined;
    render(
      <View count={200} virtualization={{}} onCapture={(c) => (windowed = c)} />
    );

    // The two pre-declared toggle actions reach the seam through the bridge. They
    // threw before this unit; asserting they no longer throw is what proves the
    // pre-declaration was finally connected to something.
    expect(() => windowed!.toggle({ type: 'measure-layout' })).not.toThrow();
    expect(() =>
      windowed!.toggle({ type: 'scroll-to-row', index: 120 })
    ).not.toThrow();
  });

  it('still reports "not implemented" with virtualization off', () => {
    let plain: DataTableController<Row> | undefined;
    render(<View count={20} onCapture={(c) => (plain = c)} />);

    // Deliberate: a shipped action that quietly no-ops on a table with no window to
    // scroll is worse than one that says it is not implemented.
    expect(() => plain!.toggle({ type: 'measure-layout' })).toThrow(
      /not implemented/
    );
    expect(() => plain!.toggle({ type: 'scroll-to-row', index: 5 })).toThrow(
      /not implemented/
    );
  });
});

describe('body window — windowing is presentation only', () => {
  it('leaves the row model, counts and selection on the full list', () => {
    layOut();
    let controller: DataTableController<Row> | undefined;
    render(
      <View
        count={500}
        virtualization={{}}
        onCapture={(c) => (controller = c)}
      />
    );

    // behavior.md: "the final row model contains 10,000 processed rows … filter,
    // group, selection, detail/tree expansion and page counts still use the final
    // row model". The DOM is a window; nothing logical is.
    expect(controller!.table.getRowModel().rows).toHaveLength(500);
    expect(bodyRows().length).toBeLessThan(500);

    act(() => {
      controller!.toggle({ type: 'select-row', id: 'r400' });
    });
    // `r400` is far outside the window, so this also proves selection is keyed by
    // id rather than by rendered position.
    expect([...controller!.getState().selection]).toEqual(['r400']);
    expect(controller!.table.getRowModel().rows).toHaveLength(500);
  });
});

describe('body window — dynamic measurement', () => {
  const reservedHeight = (container: HTMLElement) =>
    [...container.querySelectorAll('tbody td[style*="height"]')].reduce(
      (sum, cell) =>
        sum + Number.parseFloat((cell as HTMLElement).style.height || '0'),
      0
    );

  it('reserves a different scroll height than `fixed` when rows differ from the estimate', () => {
    // **`measureRow` is supplied in BOTH modes** — it is the seam's only channel to
    // row elements and the focus policy needs it — so "was the callback supplied"
    // cannot tell the modes apart. Neither can uniform rows: at exactly the
    // estimate, measured and assumed agree and any assertion passes either way.
    // Rows twice the estimate are what make the two modes observably different.
    layOut({ rowHeight: ROW_HEIGHT * 2 });
    const fixed = render(
      <View count={200} virtualization={{ estimateRowHeight: ROW_HEIGHT }} />
    );
    const fixedReserved = reservedHeight(fixed.container);
    fixed.unmount();

    layOut({ rowHeight: ROW_HEIGHT * 2 });
    const dynamic = render(
      <View
        count={200}
        virtualization={{ estimateRowHeight: ROW_HEIGHT, measure: 'dynamic' }}
      />
    );

    // `fixed` trusts the 40px estimate; `dynamic` measures 80px and reserves more.
    expect(reservedHeight(dynamic.container)).toBeGreaterThan(fixedReserved);
  });
});

describe('body window — scrollToIndex reaches the virtualizer', () => {
  it('drives a scroll on the viewport when the config member changes', () => {
    layOut();
    // happy-dom has no scrolling, so the WINDOW cannot move here however correct the
    // wiring is — asserting a moved window would be a check that cannot pass rather
    // than one that cannot fail. What is observable is the reach: the config member
    // must reach the viewport's scroll API. Whether the resulting window is correct
    // is a browser question, and it is on U6's browser-verification list.
    const scrolled = vi
      .spyOn(HTMLElement.prototype, 'scrollTo')
      .mockImplementation(() => {});
    const Harness = () => {
      const [index, setIndex] = useState(0);

      return (
        <>
          <button type="button" onClick={() => setIndex(150)}>
            jump
          </button>
          <View count={300} virtualization={{ scrollToIndex: index }} />
        </>
      );
    };
    render(<Harness />);
    scrolled.mockClear();

    act(() => {
      screen.getByRole('button', { name: 'jump' }).click();
    });

    // `scrollToIndex` had no consumer at all before this unit — a declared config
    // member reaching nothing.
    expect(scrolled).toHaveBeenCalled();
  });
});

// ── §7 focus clauses 1 and 2 ────────────────────────────────────────────────
//
// These two are ONE mechanism: "pinning cannot retain the focused row" is the same
// condition as "the pin budget is exhausted", so the retention and the hand-off
// cannot be tested — or built — separately.
//
// Both shipped non-functional once, and neither the 12 tests above nor `tsc` saw it,
// because nothing exercised focus. The cause was an ordering flaw: the focused index
// was recorded during *commit* (from `measureRow`) but is needed during *render*, and
// focusing a row causes no render — so the next render was the scroll that moved the
// window, and it read an index nothing had written yet. Every assertion below is
// written to fail against that version.
describe('body window — a focused row is pinned outside the overscan', () => {
  /** Moves the viewport's scroll offset the way the virtualizer observes it. */
  function scrollViewportTo(px: number) {
    const viewport = document.querySelector(
      '[data-slot="scroll-area-viewport"]'
    ) as HTMLElement;
    Object.defineProperty(viewport, 'scrollTop', {
      value: px,
      writable: true,
      configurable: true,
    });
    act(() => {
      viewport.dispatchEvent(new Event('scroll'));
    });

    return viewport;
  }

  const rowLabels = () =>
    [...document.querySelectorAll('tbody tr')]
      .map((row) => row.textContent ?? '')
      .filter((text) => text.startsWith('Row '));

  /** Focuses a cell inside the given row, as a real keyboard user would. */
  function focusCellIn(label: string) {
    const row = [...document.querySelectorAll('tbody tr')].find(
      (candidate) => candidate.textContent === label
    );
    const cell = row?.querySelector('td') as HTMLElement | undefined;
    expect(
      cell,
      `${label} must be rendered before it can be focused`
    ).toBeDefined();
    cell!.tabIndex = 0;
    act(() => {
      cell!.focus();
    });

    return cell!;
  }

  it('keeps the focused row mounted, and keeps focus on it, once the window scrolls past', () => {
    layOut();
    render(<View count={500} virtualization={{}} />);
    const cell = focusCellIn('Row 5');

    // ~15 rows down — comfortably inside the pin budget, and far enough that the
    // unpinned window no longer contains Row 5 (the control below proves that).
    scrollViewportTo(600);

    expect(rowLabels()).toContain('Row 5');
    // The row surviving is only half the clause. Focus has to still BE there — an
    // implementation that re-renders the row but lets the browser reset focus to
    // <body> would satisfy the line above and fail the user.
    expect(document.activeElement).toBe(cell);
  });

  it('NEGATIVE CONTROL: the same scroll drops that row when nothing is focused', () => {
    layOut();
    render(<View count={500} virtualization={{}} />);

    scrollViewportTo(600);

    // Without this, the test above would pass on a window that merely happens to be
    // wide enough — proving nothing about pinning.
    expect(rowLabels()).not.toContain('Row 5');
  });

  it('reserves exactly the right scroll height WHILE pinning — the spacers stay honest', () => {
    layOut();
    const { container } = render(<View count={500} virtualization={{}} />);
    focusCellIn('Row 5');
    scrollViewportTo(600);

    // Precondition: the pin must actually be active, or this asserts nothing.
    expect(rowLabels()).toContain('Row 5');

    const reserved = [
      ...container.querySelectorAll('tbody td[style*="height"]'),
    ].reduce(
      (sum, cell) =>
        sum + Number.parseFloat((cell as HTMLElement).style.height || '0'),
      0
    );
    const rendered = rowLabels().length * ROW_HEIGHT;

    // The invariant: spacers + rendered rows == the full scroll height. This is the
    // assertion that discriminates extending the range INSIDE the virtualizer from
    // the plausible-but-wrong version — widening `start`/`end` after
    // `getVirtualItems()` and slicing. That version leaves `paddingTop` at the
    // *unextended* first item's offset, so the pinned rows render IN ADDITION to a
    // spacer already reserving their height and the body grows by the pinned span.
    // Here that would read 20080 against a true height of 20000.
    expect(reserved + rendered).toBe(500 * ROW_HEIGHT);
  });

  it('hands focus to the scroll container once the budget is exhausted, without touching current row', () => {
    layOut();
    let controller: DataTableController<Row> | undefined;
    render(
      <View
        count={500}
        virtualization={{}}
        onCapture={(c) => (controller = c)}
      />
    );
    const before = controller!.getState().currentRowId;
    focusCellIn('Row 5');

    // ~150 rows away: past the pin budget, so the row cannot be retained. That is
    // the *same condition* as clause 2's "when pinning cannot retain it".
    const viewport = scrollViewportTo(6000);

    expect(rowLabels()).not.toContain('Row 5');
    // The specific failure this catches: focus silently left on <body>, which is
    // where the browser puts it when the focused element is removed. That is what
    // the previous implementation did, because its guard asked whether focus was
    // still inside the container — false by the time any effect can run.
    expect(document.activeElement).toBe(viewport);
    expect(document.activeElement).not.toBe(document.body);
    // "without changing logical current row" — free here, since the seam cannot
    // reach that state at all, but asserted so a future version that can is caught.
    expect(controller!.getState().currentRowId).toBe(before);
  });
});

describe('body window — identity when the feature is off', () => {
  it('changes nothing about the DOM', () => {
    const { container } = render(<View count={12} />);

    expect(bodyRows()).toHaveLength(12);
    expect(
      container.querySelectorAll('tbody td[style*="height"]')
    ).toHaveLength(0);
  });
});

// ── #77 · row positions for assistive technology ─────────────────────────────
//
// These live here rather than in their own file because `layOut()` above is the ONLY
// thing in this workspace that can reach a windowed state under happy-dom, and a
// second copy of that geometry stub is a drift surface. The arithmetic they exercise
// is unit-tested separately in `data-table-row-positions.test.ts`.
//
// ⚠ **WHAT THESE ESTABLISH AND WHAT THEY DO NOT.** They establish that the attributes
// ARIA specifies reach the `<table>` and each `<tr>`, with the values ARIA specifies —
// which is worth asserting precisely because "the prop typechecks" does not mean the
// attribute is spread onto the element (a constraint landing on the wrong element is
// #90's shape). They do NOT establish that a screen reader announces the right thing:
// an AT that counts the accessibility tree instead of reading `aria-rowcount` would
// ignore all of this. That is #63's owed real-AT pass.

const table = () => document.querySelector('table');

describe('body window — row positions for assistive technology (#77)', () => {
  it('publishes a total that counts every row, not the rendered ones', () => {
    layOut();
    render(<View count={200} virtualization={{}} />);

    const rendered = bodyRows().length;
    // The defect in one assertion: far fewer rows are in the DOM than the table
    // claims to have, and the claim is the true total plus the one header row.
    expect(rendered).toBeLessThan(200);
    expect(table()).toHaveAttribute('aria-rowcount', '201');
  });

  it('numbers the header row 1 and the first body row 2', () => {
    layOut();
    render(<View count={200} virtualization={{}} />);

    // At the top of the list the window starts at display row 0, so the offset is the
    // header alone — the case where a wrong header offset is still invisible.
    expect(document.querySelector('thead tr')).toHaveAttribute(
      'aria-rowindex',
      '1'
    );
    expect(bodyRows()[0]).toHaveAttribute('aria-rowindex', '2');
  });

  it('gives every rendered body row a contiguous index, spacers excluded', () => {
    layOut();
    const { container } = render(<View count={200} virtualization={{}} />);

    // A spacer is `aria-hidden`, so it is not a row in the accessibility tree and
    // must carry no index — otherwise the indices it consumed would be missing from
    // the sequence the rows themselves report.
    const spacers = [...container.querySelectorAll('tbody tr[aria-hidden]')];
    const rows = bodyRows().filter((row) => !spacers.includes(row));

    expect(spacers.length).toBeGreaterThan(0);
    for (const spacer of spacers) {
      expect(spacer).not.toHaveAttribute('aria-rowindex');
    }

    const indices = rows.map((row) =>
      Number(row.getAttribute('aria-rowindex'))
    );
    expect(indices.length).toBeGreaterThan(0);
    expect(indices).not.toContain(0);
    // Contiguous and ascending. A hole would mean a row rendered without an index —
    // which is what would happen if a feature-rendered row missed the clone.
    for (let i = 1; i < indices.length; i += 1) {
      expect(indices[i]).toBe(indices[i - 1]! + 1);
    }
  });

  it('never lets a row index exceed the total it publishes', () => {
    layOut();
    const { container } = render(<View count={200} virtualization={{}} />);

    const spacers = [...container.querySelectorAll('tbody tr[aria-hidden]')];
    const indices = bodyRows()
      .filter((row) => !spacers.includes(row))
      .map((row) => Number(row.getAttribute('aria-rowindex')));
    const total = Number(table()?.getAttribute('aria-rowcount'));

    // "row 202 of 201" is the failure this rules out, and it is the one an off-by-one
    // in either term produces.
    expect(Math.max(...indices)).toBeLessThanOrEqual(total);
    expect(Math.min(...indices)).toBeGreaterThanOrEqual(2);
  });

  it('publishes NOTHING when every row is in the DOM', () => {
    layOut();
    const { container } = render(<View count={200} />);

    // THE NEGATIVE CONTROL, and it is a correctness requirement rather than tidiness:
    // MDN says an explicit count is not needed when all rows are present, because the
    // browser counts them. Publishing one anyway could only replace a correct implicit
    // number with a chance to be wrong — under pagination or grouping especially.
    expect(bodyRows()).toHaveLength(200);
    expect(table()).not.toHaveAttribute('aria-rowcount');
    expect(container.querySelectorAll('[aria-rowindex]')).toHaveLength(0);
  });
});

// ── #77 · the feature-rendered rows, which the fixture above cannot reach ─────
//
// `View` renders only record rows, so every assertion above exercises
// `renderRecordRow`'s attribute and **none** exercises the `withMeasurement` clone —
// the path a group header, a detail row or a footer row takes, because the feature
// owns those elements and the index has to be injected by cloning. An injection
// nothing covers is an injection that can be deleted silently, so this fixture turns
// grouping on to put non-record rows in the window.

function GroupedView({ count }: { count: number }) {
  const controller = useDataTable<Row>({
    columns,
    data: rows(count),
    getRowId: (row: Row) => row.id,
    grouping: {} as never,
    // ⚠ `virtualization` is a CONTROLLER option, not a view prop. Passed to
    // `DataTableView` it typechecks and does nothing: the seam reads the resolved
    // config off the controller, so the table renders every row and the aria
    // attributes are correctly absent. This fixture asserted a group row had no index
    // and "found a defect" that was only an unwindowed table.
    virtualization: {},
    defaultState: { grouping: ['name'] },
  } as never);

  return (
    <DataTableRoot table={controller}>
      <DataTableView<Row> height={VIEWPORT_HEIGHT} />
    </DataTableRoot>
  );
}

describe('body window — row positions reach a feature-rendered row (#77)', () => {
  it('indexes group-header rows, not only record rows', () => {
    layOut();
    const { container } = render(<GroupedView count={60} />);

    // WINDOWED FIRST, and asserted rather than assumed. An unwindowed table publishes
    // no indices at all by design, so every assertion below would fail for a reason
    // that has nothing to do with the clone path — which is exactly what happened
    // while this fixture passed `virtualization` to the wrong component.
    expect(bodyRows().length).toBeLessThan(120);
    expect(container.querySelector('table')).toHaveAttribute('aria-rowcount');

    const spacers = [...container.querySelectorAll('tbody tr[aria-hidden]')];
    const rendered = bodyRows().filter((row) => !spacers.includes(row));
    // Grouping by a unique-per-row column makes every record its own group, so the
    // window necessarily contains group-header rows. Asserted rather than assumed:
    // without a group row present this test would be checking record rows again.
    // `getAttribute`, not `dataset`: `bodyRows()` yields `Element`, which has no
    // `dataset`. `pnpm test` passed on the `dataset` version — only `pnpm typecheck`
    // caught it, which is the split this workspace documents.
    const groupRows = rendered.filter(
      (row) => row.getAttribute('data-slot') === 'group-row'
    );

    expect(groupRows.length).toBeGreaterThan(0);
    for (const row of groupRows) {
      // The clone path. Before the injection these carried no index at all, which
      // would have left holes in the sequence the record rows report.
      expect(row).toHaveAttribute('aria-rowindex');
      expect(Number(row.getAttribute('aria-rowindex'))).toBeGreaterThan(1);
    }

    const indices = rendered.map((row) =>
      Number(row.getAttribute('aria-rowindex'))
    );
    for (let i = 1; i < indices.length; i += 1) {
      expect(indices[i]).toBe(indices[i - 1]! + 1);
    }
  });
});
