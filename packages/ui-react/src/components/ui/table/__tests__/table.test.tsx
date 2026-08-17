import { createRef, type CSSProperties } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  type TableRowProps,
} from '../table';

function InvoiceTable() {
  return (
    <Table>
      <TableCaption>Recent invoices</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>INV001</TableCell>
          <TableCell>Paid</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>1 invoice</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

describe('Table', () => {
  it('renders native table, caption, section, row, header, and cell elements', () => {
    const { container } = render(<InvoiceTable />);
    expect(screen.getByRole('table').tagName).toBe('TABLE');
    expect(container.querySelector('caption')?.textContent).toBe(
      'Recent invoices'
    );
    expect(container.querySelector('thead')).toBeInTheDocument();
    expect(container.querySelector('tbody')).toBeInTheDocument();
    expect(container.querySelector('tfoot')).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Invoice' })
    ).toHaveProperty('tagName', 'TH');
    expect(screen.getByRole('cell', { name: 'INV001' })).toHaveProperty(
      'tagName',
      'TD'
    );
    expect(screen.getAllByRole('row')).toHaveLength(3);
  });

  // Rewritten, not deleted. This was the F3 guard on a plain
  // `relative w-full overflow-auto` wrapper; the container is now `ScrollArea`,
  // so the kit draws table scrollbars instead of the platform. The guard's
  // purpose survives — the table is wrapped in a scrollable region it does not
  // itself provide — but the element chain it asserted does not, and neither
  // does `parentElement` as a way to reach it.
  it('wraps the native table in a ScrollArea that owns the scrolling', () => {
    const { container: root } = render(<InvoiceTable />);
    const box = root.querySelector('[data-slot="table-container"]');
    const viewport = root.querySelector('[data-slot="scroll-area-viewport"]');

    expect(box).toHaveClass('w-full');
    expect(box).toContainElement(viewport as HTMLElement);
    expect(viewport).toContainElement(screen.getByRole('table'));
    // The scrolling is the viewport's, not the box's — the box is
    // `overflow: hidden` and never scrolls.
    expect(box).toHaveClass('overflow-hidden');
  });

  it('themes the cells from the --ui-table-* tier', () => {
    render(<InvoiceTable />);
    expect(screen.getByRole('cell', { name: 'INV001' })).toHaveClass(
      'px-[var(--ui-table-global-cell-padding-x)]'
    );
  });

  it('marks a sortable header with aria-sort and fires onSort on pointer and keyboard activation', async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable sortDirection={false} onSort={onSort}>
              Name
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    const header = screen.getByRole('columnheader', { name: /Name/ });
    expect(header).toHaveAttribute('aria-sort', 'none');
    const sortButton = screen.getByRole('button', { name: /Name/ });
    await user.click(sortButton);
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onSort).toHaveBeenCalledTimes(3);
  });

  it.each([
    ['asc', 'ascending'],
    ['desc', 'descending'],
  ] as const)(
    'reflects %s sort direction in aria-sort',
    (direction, ariaSort) => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead sortable sortDirection={direction}>
                Name
              </TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );
      expect(
        screen.getByRole('columnheader', { name: /Name/ })
      ).toHaveAttribute('aria-sort', ariaSort);
    }
  );

  it('applies the selected (active) row state', () => {
    render(
      <Table>
        <TableBody>
          <TableRow selected data-testid="row">
            <TableCell>Selected</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    const row = screen.getByTestId('row');
    expect(row).toHaveAttribute('data-state', 'selected');
    expect(row).toHaveClass(
      'data-[state=selected]:bg-[var(--ui-table-data-row-color-active)]'
    );
  });

  it('forwards the ref to the table element', () => {
    const ref = createRef<HTMLTableElement>();
    render(
      <Table ref={ref}>
        <TableBody>
          <TableRow>
            <TableCell>x</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(ref.current).toBeInstanceOf(HTMLTableElement);
  });
});

// ── Presentation + scroll/sticky container (table-parity P1, unit F3) ────────
// The suite above is the frozen guard: every prop below is additive and its
// default must leave that output untouched.

/**
 * The scroll container's outer box — where `width` and `containerClassName` land.
 *
 * **The height constraints are not here (#76).** They go on the scrolling element:
 * a `maxHeight` on this box leaves the viewport free to grow to its content, so it
 * reports itself bounded, clips, and never scrolls.
 */
function container() {
  return document.querySelector(
    '[data-slot="table-container"]'
  ) as HTMLDivElement;
}

/**
 * The element that actually scrolls, and the one `containerRef` points at.
 * `ScrollArea`'s viewport, one level inside the box — so `data-bounded` and
 * `containerProps` are asserted here rather than on the box.
 */
function scroller() {
  return document.querySelector(
    '[data-slot="scroll-area-viewport"]'
  ) as HTMLDivElement;
}

/**
 * Every inline property that could bound the box, read off the CSSStyleDeclaration.
 *
 * `ScrollArea` always sets some inline style (its position and corner-size custom
 * properties), so "no box size" cannot be expressed as "no style attribute". It
 * is also not safely expressed as a regex over the style string: a pattern for
 * `width|height|max-height` silently misses `min-height`, and the logical
 * aliases (`block-size`, `inline-size`) miss entirely. Enumerating the
 * properties is checkable — anything unset reads `''`.
 */
const BOX_SIZE_PROPERTIES = [
  'width',
  'minWidth',
  'maxWidth',
  'height',
  'minHeight',
  'maxHeight',
  'blockSize',
  'minBlockSize',
  'maxBlockSize',
  'inlineSize',
  'minInlineSize',
  'maxInlineSize',
] as const;

function inlineBoxSizes(element: HTMLElement): Record<string, string> {
  return Object.fromEntries(
    BOX_SIZE_PROPERTIES.map((property) => [
      property,
      element.style[property] as string,
    ]).filter(([, value]) => value !== '')
  );
}

describe('Table — density', () => {
  it('emits no density override at the default size', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>x</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(screen.getByRole('table').className).not.toMatch(/\[&_td\]:h-/);
    // The cell keeps the shipped metrics; only the root ever overrides them.
    expect(screen.getByRole('cell', { name: 'x' })).toHaveClass(
      'h-10',
      'px-[var(--ui-table-global-cell-padding-x)]',
      'py-[var(--ui-table-global-cell-padding-y)]'
    );
  });

  it.each([
    [
      'small',
      [
        '[&_th]:h-[var(--ui-units-size-32)]',
        '[&_td]:h-[var(--ui-units-size-32)]',
        '[&_td]:px-[var(--ui-units-size-8)]',
        '[&_td]:py-[var(--ui-units-gap-4)]',
      ],
    ],
    [
      'large',
      [
        '[&_th]:h-[var(--ui-units-size-48)]',
        '[&_td]:h-[var(--ui-units-size-48)]',
        '[&_td]:py-[var(--ui-units-gap-12)]',
      ],
    ],
  ] as const)('drives %s density from the root', (size, classes) => {
    render(
      <Table size={size}>
        <TableBody>
          <TableRow>
            <TableCell>x</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(screen.getByRole('table')).toHaveClass(...classes);
  });
});

describe('Table — background surface', () => {
  it.each([
    ['transparent', 'bg-[var(--ui-background-surface-transparent)]'],
    ['accent', 'bg-[var(--ui-background-surface-active)]'],
    ['subtle', 'bg-muted'],
    ['surface', 'bg-background'],
  ] as const)('renders the %s surface from a token', (background, expected) => {
    render(<Table background={background} />);
    expect(screen.getByRole('table')).toHaveClass(expected);
  });

  it('publishes the sticky surface each background needs', () => {
    render(<Table background="subtle" />);
    expect(screen.getByRole('table')).toHaveClass(
      '[--table-sticky-surface:var(--ui-background-surface-secondary)]'
    );
  });

  it('defaults to the transparent surface', () => {
    render(<Table />);
    expect(screen.getByRole('table')).toHaveClass(
      'bg-[var(--ui-background-surface-transparent)]'
    );
  });
});

describe('Table — independent borders', () => {
  it('emits no border override when borders are not configured', () => {
    render(<Table />);
    expect(screen.getByRole('table').className).not.toMatch(
      /border-t|\[&_tr\]/
    );
  });

  it.each([
    ['subtle', '--ui-border-on-surface-divider'],
    [true, '--ui-table-global-row-border-color'],
    ['strong', '--ui-border-on-surface-border-active'],
  ] as const)('resolves the %s strength to its own token', (value, token) => {
    render(<Table borders={{ top: value }} />);
    expect(screen.getByRole('table')).toHaveClass(
      'border-t',
      `border-t-[color:var(${token})]`
    );
  });

  it('resolves each dimension independently', () => {
    render(<Table borders={{ bottom: true, vertical: 'subtle' }} />);
    const table = screen.getByRole('table');
    expect(table).toHaveClass(
      'border-b',
      'border-b-[color:var(--ui-table-global-row-border-color)]',
      '[&_tr>*:not(:last-child)]:border-e',
      '[&_tr>*:not(:last-child)]:border-e-[color:var(--ui-border-on-surface-divider)]'
    );
    // Enabling bottom + vertical implies nothing about the top edge.
    expect(table.className).not.toMatch(/\bborder-t\b/);
  });

  it('turns row dividers off — and the sticky sections stand-in with them', () => {
    render(<Table borders={{ horizontal: false }} />);
    expect(screen.getByRole('table')).toHaveClass(
      '[&_tr]:border-b-0',
      // Empties the **y slot** rather than wiping `box-shadow` (PLTFRM-93276):
      // `shadow-none` would also erase a `pinnedDivider: 'always'` line, which
      // lives in the x slot of the same composed declaration.
      '[&_thead_th]:[--table-shadow-y:initial]',
      '[&_tfoot_td]:[--table-shadow-y:initial]'
    );
  });
});

describe('Table — scroll container', () => {
  it('is unbounded and carries no box size by default', () => {
    render(<Table />);
    expect(container()).toHaveClass('relative', 'w-full', 'overflow-hidden');
    // Enumerated rather than pattern-matched, and asserted as an object so a
    // failure names the offending property instead of just saying "matched".
    expect(inlineBoxSizes(container())).toEqual({});
    expect(scroller()).not.toHaveAttribute('data-bounded');
  });

  // **This is a mechanism assertion, and it is labelled as one deliberately.**
  // happy-dom has no layout engine: `clientHeight` is 0 and `scrollTop` cannot
  // move, so no test in this environment can observe scrolling — which is exactly
  // why the defect it guards survived a green suite (the windowing harness stubbed
  // the viewport height, asserting the precondition instead of observing it). What
  // a unit test *can* check is which element the constraint lands on, which is the
  // thing that was wrong. The behavioural half lives in the browser, against
  // `BoundedByHeightOverflowing` / `BoundedByMaxHeightOverflowing`: measured
  // viewport 320px against a 2440px scrollHeight, scrolling to 2120, versus a
  // 2440px viewport that could not scroll at all before the fix.
  it('puts width on the box and both height constraints on the scrolling element', () => {
    render(<Table width={640} height="20rem" maxHeight={480} />);

    const boxStyle = container().getAttribute('style') ?? '';
    expect(boxStyle).toContain('width: 640px');
    const scrollerStyle = scroller().getAttribute('style') ?? '';
    expect(scrollerStyle).toContain('height: 20rem');
    expect(scrollerStyle).toContain('max-height: 480px');
  });

  // The other direction, and the one that fails on a partial revert: a height
  // constraint left on the box is what made `maxHeight` inert.
  it('leaves no height constraint on the box', () => {
    render(<Table width={640} maxHeight={480} />);
    expect(inlineBoxSizes(container())).toEqual({ width: '640px' });
  });

  // `containerProps` is documented as the escape hatch for the *scrolling*
  // element, so its style belongs there too — it used to land on the box,
  // contradicting its own docblock.
  it('applies containerProps style to the scrolling element', () => {
    render(
      <Table
        maxHeight={480}
        containerProps={{ style: { scrollPaddingTop: 8 } }}
      />
    );
    const scrollerStyle = scroller().getAttribute('style') ?? '';
    expect(scrollerStyle).toContain('scroll-padding-top: 8px');
    expect(scrollerStyle).toContain('max-height: 480px');
  });

  // ── `containerStyle`: the counterpart to `containerClassName` (F19) ─────────
  // The box accepted a class and a `width` but had no seam for a *value*, so a
  // caller could declare a rule on the element that now owns the region (#90) and
  // have no way to feed it. These three assertions are the whole contract.

  it('applies containerStyle to the box, and a custom property survives', () => {
    // Typed, not cast. A cast on an object literal strips its contextual type, and
    // the pattern is banned here for that reason even where — as here — the
    // literal holds no callbacks to widen. Intersecting keeps the value checked.
    const style: CSSProperties & { '--table-resize-indicator-x': string } = {
      '--table-resize-indicator-x': '260px',
    };
    render(<Table containerStyle={style} />);
    // Read through `getPropertyValue` rather than off the style string: a custom
    // property is not a typed CSSOM member, and `toContain` over the attribute
    // would also pass on the property landing under some other name.
    expect(
      container().style.getPropertyValue('--table-resize-indicator-x')
    ).toBe('260px');
  });

  // The direction that matters for #90: this must not become a second place a
  // width can be set. `width` is the named prop, so it wins — the same precedence
  // `containerProps.style` gets against `height`/`maxHeight` on the viewport.
  //
  // **The second property is not padding.** Asserting only `width: 640px` would
  // pass just as well on a `containerStyle` that is ignored altogether, which is
  // the shape of certification this branch keeps finding. `outlineWidth` proves the
  // prop was honoured; `width` proves it lost the collision.
  it('lets width win over containerStyle without ignoring the rest of it', () => {
    render(
      <Table width={640} containerStyle={{ width: 200, outlineWidth: 3 }} />
    );
    expect(inlineBoxSizes(container())).toEqual({ width: '640px' });
    expect(container().getAttribute('style') ?? '').toContain(
      'outline-width: 3px'
    );
  });

  // It is the *box's* seam. `containerProps` already covers the scrolling element,
  // and the two must not leak into each other: an overlay positioned against the
  // box resolves against the wrong element on the viewport, and scrolls with the
  // content. Both halves in one test for the same reason as above — "absent from
  // the scroller" alone is satisfied by the prop doing nothing at all.
  it('lands on the box and not on the scrolling element', () => {
    render(<Table containerStyle={{ outlineWidth: 3 }} />);
    expect(container().getAttribute('style') ?? '').toContain(
      'outline-width: 3px'
    );
    expect(scroller().getAttribute('style') ?? '').not.toContain(
      'outline-width'
    );
  });

  // `data-bounded` sits on the scrolling element, not the box, because that is
  // the element `containerRef` hands an owner — a virtualizer checking the
  // precondition has the viewport, never the wrapper around it.
  it('marks the scrolling element bounded once height is set — the virtualization precondition', () => {
    render(<Table height={320} />);
    expect(scroller()).toHaveAttribute('data-bounded', 'true');
  });

  it('marks the scrolling element bounded once maxHeight is set', () => {
    render(<Table maxHeight={320} />);
    expect(scroller()).toHaveAttribute('data-bounded', 'true');
  });

  /**
   * Only this component's own bounding warning. `ScrollArea` emits React `act`
   * warnings through the same channel, so matching on the message is what keeps
   * these assertions about the rule under test.
   */
  /**
   * Which **values** were warned about, extracted from the messages.
   *
   * Each assertion below is then about its own value rather than about a global
   * call count — and that is not tidiness. React defers this warning's effect past
   * the end of the test that triggered it, so a warning genuinely lands in the
   * *next* test's spy, and `cleanup()` before installing the spy does not prevent
   * it. A count-based assertion therefore depends on its neighbours. Both facts
   * were found by a negative control whose failure named the previous case's value.
   */
  const warnedValues = (spy: { mock: { calls: unknown[][] } }): string[] =>
    boundingWarnings(spy).map(
      (message) => /\(`([^`]+)`\)/.exec(message)?.[1] ?? ''
    );

  const boundingWarnings = (spy: { mock: { calls: unknown[][] } }): string[] =>
    spy.mock.calls
      .map((call) => call[0])
      .filter(
        (first): first is string =>
          typeof first === 'string' &&
          first.includes('does not bound the scroll')
      );

  // #84. A percentage bounds neither member once the constraint sits on the
  // scrolling element, and the failure is silent: the element reports itself
  // bounded, does not scroll, and overflows its parent. Measured in a browser for
  // both members — a 400px parent, `50%`, and a 2440px viewport whose
  // `scrollHeight` equals its `clientHeight` either way.
  //
  // The warning is asserted, not just the docblock, because a documented
  // restriction that nothing enforces is how this arrived: a percentage used to
  // *look* like it worked.
  it.each(['height', 'maxHeight'] as const)(
    'warns that a percentage %s does not bound the container',
    (prop) => {
      // Unmount the previous case's tree *before* the spy exists. Without this the
      // capture is order-coupled: a warning from the preceding render can land in
      // this one's calls. Invisible in the passing suite — where only percentages
      // warn, so there is nothing to leak — and surfaced by the negative control,
      // which made a non-percentage value warn and produced a failure naming the
      // *previous* case's value.
      cleanup();
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      render(<Table {...{ [prop]: '50%' }} />);

      // Names the offending value, so the message is actionable without a diff.
      expect(warnedValues(error)).toContain('50%');
      // And the prop — "a percentage height" reads as a lie when the caller passed
      // `maxHeight`, and is the first thing they would go and check.
      expect(boundingWarnings(error).join(' ')).toContain(prop);
      error.mockRestore();
    }
  );

  it.each([320, '20rem', '50vh'] as const)(
    'stays silent for the definite length %s',
    (value) => {
      cleanup();
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      render(<Table maxHeight={value} />);

      // The complement, and the one that matters for a warning: a rule that fires
      // on the values people actually pass is worse than no rule. `vh` is a
      // viewport unit and definite, which is the escape the message recommends.
      // Filtered to *this* warning rather than asserting `console.error` was never
      // called. `ScrollArea` emits React `act` warnings through the same channel,
      // so the broader assertion is flaky by construction — found by a negative
      // control, which failed these three for a reason that had nothing to do with
      // the control.
      expect(warnedValues(error)).not.toContain(String(value));
      error.mockRestore();
    }
  );

  it('leaves a width-only container unbounded', () => {
    render(<Table width={640} />);
    expect(scroller()).not.toHaveAttribute('data-bounded');
  });

  it('forwards containerRef, containerClassName and containerProps', () => {
    const ref = createRef<HTMLDivElement>();
    const onScroll = vi.fn();
    render(
      <Table
        containerRef={ref}
        containerClassName="rounded-md"
        containerProps={{ onScroll, 'aria-label': 'Invoices scroller' }}
        height={200}
      />
    );
    // The ref reaches the element that scrolls, so an owner can measure and
    // scroll it — the box would report scrollTop 0 forever.
    expect(ref.current).toBe(scroller());
    expect(ref.current).not.toBe(container());
    // `containerClassName` styles the box; `containerProps` ride the scroller,
    // so a scroll handler fires for the scroll the ref can observe.
    expect(container()).toHaveClass('rounded-md');
    expect(scroller()).toHaveAttribute('aria-label', 'Invoices scroller');
    scroller().dispatchEvent(new Event('scroll', { bubbles: true }));
    expect(onScroll).toHaveBeenCalled();
  });
});

describe('TableHeader / TableFooter — sticky', () => {
  it('is not sticky by default', () => {
    const { container: root } = render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    const thead = root.querySelector('thead') as HTMLElement;
    expect(thead).not.toHaveAttribute('data-sticky');
    expect(thead.className).toBe('');
  });

  it('pins the header to the top of the scroll container', () => {
    const { container: root } = render(
      <Table maxHeight={240}>
        <TableHeader sticky>
          <TableRow>
            <TableHead>Invoice</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    const thead = root.querySelector('thead') as HTMLElement;
    expect(thead).toHaveAttribute('data-sticky', 'true');
    expect(thead).toHaveClass(
      '[&_th]:sticky',
      '[&_th]:top-0',
      '[&_th]:z-40',
      '[&_th]:bg-[var(--table-sticky-surface,var(--ui-background-surface-primary))]'
    );
  });

  it('lifts a pinned header cell above the header cells that follow it', () => {
    const { container: root } = render(
      <Table maxHeight={240}>
        <TableHeader sticky>
          <TableRow>
            <TableHead pinned="start">Invoice</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    expect(root.querySelector('thead')).toHaveClass('[&_th[data-pinned]]:z-50');
  });

  it('swaps the footer divider for the sticky stand-in', () => {
    const { container: root, rerender } = render(
      <Table>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );
    expect(root.querySelector('tfoot')).toHaveClass(
      'border-t',
      'border-[color:var(--ui-table-global-row-border-color)]'
    );

    rerender(
      <Table maxHeight={240}>
        <TableFooter sticky>
          <TableRow>
            <TableCell>Total</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );
    const tfoot = root.querySelector('tfoot') as HTMLElement;
    expect(tfoot).toHaveAttribute('data-sticky', 'true');
    expect(tfoot).toHaveClass(
      '[&_td]:sticky',
      '[&_td]:bottom-0',
      '[&_td]:[--table-shadow-y:inset_0_1px_0_0_var(--ui-table-global-row-border-color)]'
    );
    // The collapsed section border would scroll away and double up.
    expect(tfoot.className).not.toMatch(/\bborder-t\b/);
  });
});

describe('TableRow — current, expanded, sticky', () => {
  function renderRow(props: TableRowProps) {
    render(
      <Table>
        <TableBody>
          <TableRow data-testid="row" {...props}>
            <TableCell>web-server-01</TableCell>
            <TableCell>Protected</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    return screen.getByTestId('row');
  }

  it('exposes current with aria-current and never aria-selected', () => {
    const row = renderRow({ current: true });
    expect(row).toHaveAttribute('aria-current', 'true');
    expect(row).toHaveAttribute('data-current', 'true');
    expect(row).not.toHaveAttribute('aria-selected');
    expect(row).not.toHaveAttribute('data-state');
    expect(row).toHaveClass(
      '[&>*:first-child]:[--table-shadow-marker:inset_2px_0_0_0_var(--ui-border-on-surface-border-active)]'
    );
  });

  it('keeps current and selected independent', () => {
    const row = renderRow({ current: true, selected: true });
    expect(row).toHaveAttribute('aria-current', 'true');
    expect(row).toHaveAttribute('data-state', 'selected');
  });

  it.each([true, false] as const)(
    'reflects expanded = %s as a data attribute',
    (expanded) => {
      expect(renderRow({ expanded }).hasAttribute('data-expanded')).toBe(
        expanded
      );
    }
  );

  // The regression guard for a fixed defect: this row used to emit
  // `aria-expanded`, which axe flags `aria-conditional-attr` at serious impact —
  // the attribute is only valid on a `treegrid` row. It belongs on the disclosure
  // control, with `aria-controls`, which is what `anatomy.yaml` specifies for the
  // expander parts. Asserted for all three prop states, because the bug was
  // present for two of them and absent for the third.
  it.each([
    ['expanded', { expanded: true }],
    ['collapsed', { expanded: false }],
    ['no disclosure', {}],
  ] as const)('never emits aria-expanded on the row (%s)', (_label, props) => {
    expect(renderRow(props)).not.toHaveAttribute('aria-expanded');
  });

  it('lets selection win over expansion', () => {
    const both = renderRow({ expanded: true, selected: true });
    expect(both).toHaveClass(
      'data-[state=selected]:bg-[var(--ui-table-data-row-color-active)]'
    );
    expect(both.className).not.toMatch(/data-\[expanded=true\]:bg-/);
  });

  it('pins a group row below the header, at the supplied offset', () => {
    const row = renderRow({ sticky: true, stickyOffset: 40 });
    expect(row).toHaveClass(
      '[&>td]:sticky',
      '[&>td]:top-[var(--table-row-sticky-top,0px)]',
      '[&>td]:z-20'
    );
    expect(row.getAttribute('style')).toContain('--table-row-sticky-top: 40px');
  });
});

describe('TableHead / TableCell — scope and column pinning', () => {
  it('passes native scope through to the header cell', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead colSpan={2} scope="colgroup">
              Contact
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    const header = screen.getByRole('columnheader', { name: 'Contact' });
    expect(header).toHaveAttribute('scope', 'colgroup');
    expect(header).toHaveAttribute('colspan', '2');
  });

  it('is unpinned by default', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>x</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    const cell = screen.getByRole('cell', { name: 'x' });
    expect(cell).not.toHaveAttribute('data-pinned');
    expect(cell).not.toHaveAttribute('style');
  });

  it.each([
    ['start', 'inset-inline-start'],
    ['end', 'inset-inline-end'],
  ] as const)(
    'pins a cell to the %s edge at the given offset',
    (pinned, css) => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell pinned={pinned} pinOffset={48}>
                x
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      const cell = screen.getByRole('cell', { name: 'x' });
      expect(cell).toHaveAttribute('data-pinned', pinned);
      expect(cell).toHaveClass(
        'sticky',
        'z-10',
        'bg-[var(--table-sticky-surface,var(--ui-background-surface-primary))]'
      );
      expect(cell.getAttribute('style')).toContain(`${css}: 48px`);
    }
  );

  it('defaults a pinned column to a zero offset', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead pinned="start">Name</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    const header = screen.getByRole('columnheader', { name: 'Name' });
    expect(header).toHaveAttribute('data-pinned', 'start');
    expect(header.getAttribute('style')).toContain('inset-inline-start: 0px');
  });

  it('re-applies the row state tint over the opaque pinned cell', () => {
    render(
      <Table>
        <TableBody>
          <TableRow data-testid="idle">
            <TableCell pinned="start">a</TableCell>
          </TableRow>
          <TableRow selected data-testid="selected">
            <TableCell pinned="start">b</TableCell>
          </TableRow>
          <TableRow expanded data-testid="expanded">
            <TableCell pinned="start">c</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    // Hover is unconditional — a pinned cell would otherwise paint the flat
    // sticky surface over the row's tint.
    expect(screen.getByTestId('idle')).toHaveClass(
      'hover:[&>[data-pinned]]:bg-[var(--ui-table-data-row-color-hover)]'
    );
    expect(screen.getByTestId('selected')).toHaveClass(
      'data-[state=selected]:[&>[data-pinned]]:bg-[var(--ui-table-data-row-color-active)]'
    );
    expect(screen.getByTestId('expanded')).toHaveClass(
      'data-[expanded=true]:[&>[data-pinned]]:bg-[var(--ui-table-data-row-color-hover)]'
    );
    // Selection still wins: no expansion tint on a selected row.
    expect(screen.getByTestId('selected').className).not.toMatch(
      /data-\[expanded=true\]/
    );
  });

  // The `trailing` slot exists so a control can sit in a header cell without
  // becoming a descendant of the sort button. `textContent` cannot express that
  // — it is identical either way — so every assertion here is about *nesting*.
  it('renders trailing content outside the sort button, not inside it', async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();
    const onResize = vi.fn();
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              sortable
              sortDirection="asc"
              onSort={onSort}
              trailing={
                <button type="button" onClick={onResize}>
                  Resize Name
                </button>
              }
            >
              Name
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );

    const sortButton = screen.getByRole('button', { name: /^Name$/ });
    const resizeButton = screen.getByRole('button', { name: 'Resize Name' });

    // The load-bearing assertion: a control in `trailing` is a sibling of the
    // sort control, so it is not nested inside interactive content.
    expect(sortButton).not.toContainElement(resizeButton);
    expect(screen.getByRole('columnheader')).toContainElement(resizeButton);

    // And the consequence that nesting would have caused: activating the
    // trailing control must not also sort.
    await user.click(resizeButton);
    expect(onResize).toHaveBeenCalledTimes(1);
    expect(onSort).not.toHaveBeenCalled();

    // The sort control still works, and its accessible name is not polluted by
    // the trailing control's label.
    await user.click(sortButton);
    expect(onSort).toHaveBeenCalledTimes(1);
  });

  // The naming half of the same problem, and the more consequential one: a screen
  // reader announces the column header for **every cell** in the column, so an
  // `aria-label`led control folded into the header's name is repeated on every
  // row. `trailing` fixed the nesting and left this open until measured.
  //
  // These assert the *name*, not the nesting — a version that renders the handle
  // in the right place and still pollutes the name passes every nesting test.
  it.each([
    ['not sortable', {}],
    ['sortable', { sortable: true }],
  ] as const)(
    'keeps trailing content out of the header accessible name (%s)',
    (_label, extra) => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                {...extra}
                trailing={
                  <span
                    role="separator"
                    aria-label="Resize Name column"
                    tabIndex={0}
                  />
                }
              >
                Name
              </TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );
      // Not "Name Resize Name column", which is what content-derived naming gives.
      expect(screen.getByRole('columnheader', { name: 'Name' })).toBeVisible();
      // And the control keeps its own name rather than losing it to the exclusion.
      expect(
        screen.getByRole('separator', { name: 'Resize Name column' })
      ).toBeVisible();
    }
  );

  it('leaves a header with no trailing content named from its content', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    // No `aria-labelledby` and no wrapper when there is nothing to exclude, so a
    // plain header's output is byte-identical to before.
    const header = screen.getByRole('columnheader', { name: 'Name' });
    expect(header).not.toHaveAttribute('aria-labelledby');
    expect(header.childElementCount).toBe(0);
  });

  it('renders trailing content on a non-sortable header too', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead trailing={<span data-testid="grip">GRIP</span>}>
              Name
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    const header = screen.getByRole('columnheader');
    expect(header).toContainElement(screen.getByTestId('grip'));
    // Label first, trailing after — the order an `edge` placement expects.
    expect(header.textContent).toBe('NameGRIP');
  });

  it('emits nothing for the trailing slot by default', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable>Name</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    // Guards the byte-identical default: the slot adds no wrapper element.
    expect(screen.getByRole('columnheader').childElementCount).toBe(1);
  });

  it('keeps the sort affordance working on a pinned header', async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();
    render(
      <Table>
        <TableHeader sticky>
          <TableRow>
            <TableHead
              pinned="start"
              sortable
              sortDirection="asc"
              onSort={onSort}
            >
              Name
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    expect(screen.getByRole('columnheader', { name: /Name/ })).toHaveAttribute(
      'aria-sort',
      'ascending'
    );
    await user.click(screen.getByRole('button', { name: /Name/ }));
    expect(onSort).toHaveBeenCalledTimes(1);
  });
});
