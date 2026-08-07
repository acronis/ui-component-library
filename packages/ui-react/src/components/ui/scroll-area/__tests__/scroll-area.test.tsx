import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ScrollArea, ScrollBar } from '../scroll-area';

describe('ScrollArea', () => {
  it('renders its children inside the content', () => {
    render(<ScrollArea>scrollable body</ScrollArea>);
    expect(screen.getByText('scrollable body')).toBeInTheDocument();
  });

  it('exposes the structural parts via data-slot', () => {
    const { container } = render(<ScrollArea>body</ScrollArea>);
    expect(
      container.querySelector('[data-slot="scroll-area"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-slot="scroll-area-viewport"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-slot="scroll-area-content"]')
    ).toBeInTheDocument();
  });

  it('forwards a ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<ScrollArea ref={ref}>body</ScrollArea>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute('data-slot', 'scroll-area');
  });

  it('merges a custom className onto the root', () => {
    const { container } = render(
      <ScrollArea className="h-40">body</ScrollArea>
    );
    expect(container.querySelector('[data-slot="scroll-area"]')).toHaveClass(
      'h-40'
    );
  });

  it.each(['vertical', 'horizontal', 'both'] as const)(
    'renders for orientation=%s without crashing',
    (orientation) => {
      const { container } = render(
        <ScrollArea orientation={orientation}>body</ScrollArea>
      );
      expect(
        container.querySelector('[data-slot="scroll-area"]')
      ).toBeInTheDocument();
    }
  );

  // The root's `ref` reaches an element that never scrolls (`overflow: hidden`),
  // so anything that measures or scrolls the region needs the viewport instead.
  it('forwards viewportRef to the element that actually scrolls', () => {
    const root = createRef<HTMLDivElement>();
    const viewport = createRef<HTMLDivElement>();
    render(
      <ScrollArea ref={root} viewportRef={viewport}>
        body
      </ScrollArea>
    );
    expect(viewport.current).toHaveAttribute(
      'data-slot',
      'scroll-area-viewport'
    );
    expect(viewport.current).not.toBe(root.current);
    expect(root.current).toContainElement(viewport.current);
  });

  it('puts viewportProps on the viewport, not the root', () => {
    const { container } = render(
      <ScrollArea
        viewportProps={{
          'data-bounded': 'true',
          tabIndex: 0,
          className: 'scroll-smooth',
        }}
      >
        body
      </ScrollArea>
    );
    const viewport = container.querySelector(
      '[data-slot="scroll-area-viewport"]'
    );
    expect(viewport).toHaveAttribute('data-bounded', 'true');
    expect(viewport).toHaveAttribute('tabindex', '0');
    // Merged, not replaced — the component's own viewport classes survive.
    expect(viewport).toHaveClass('scroll-smooth', 'size-full');
    expect(
      container.querySelector('[data-slot="scroll-area"]')
    ).not.toHaveAttribute('data-bounded');
  });

  it('isolates its stacking order and keeps the scrollbar above content', () => {
    const { container } = render(
      <ScrollArea>
        <ScrollBar keepMounted />
      </ScrollArea>
    );
    // `isolate` contains any z-index set on scrolled content, so the scrollbar
    // only has to outrank content inside this scroll area — and content inside
    // cannot outrank overlays outside it. Deliberately `isolation` rather than
    // `contain`/`transform`, which would create a containing block and break
    // `position: sticky` in the viewport.
    expect(container.querySelector('[data-slot="scroll-area"]')).toHaveClass(
      'isolate'
    );
    expect(
      container.querySelector('[data-slot="scroll-area-scrollbar"]')
    ).toHaveClass('z-[60]');
  });

  // The thumb color is the whole point of `tone`, and it is not observable from
  // the DOM beyond the class, so assert the token each tone resolves to. Both
  // states are wired to the same token at different alphas deliberately: the
  // hover step is an alpha step, not a different color.
  it('paints the thumb from the themed token by default', () => {
    const { container } = render(
      <ScrollArea>
        <ScrollBar keepMounted />
      </ScrollArea>
    );
    const thumb = container.querySelector('[data-slot="scroll-area-thumb"]');
    expect(thumb?.className).toContain(
      'color-mix(in_oklab,var(--ui-background-inverse-primary)_40%,transparent)'
    );
    expect(thumb?.className).toContain(
      'hover:[background-color:color-mix(in_oklab,var(--ui-background-inverse-primary)_60%,transparent)]'
    );
  });

  // A brand surface is dark in BOTH themes, so the themed token would be
  // invisible there — `inverse` pins the thumb to the on-brand (white) token.
  it('paints the thumb from the on-brand token for tone="inverse"', () => {
    const { container } = render(
      <ScrollArea tone="inverse">
        <ScrollBar keepMounted tone="inverse" />
      </ScrollArea>
    );
    for (const thumb of container.querySelectorAll(
      '[data-slot="scroll-area-thumb"]'
    )) {
      expect(thumb.className).toContain(
        'color-mix(in_oklab,var(--ui-glyph-on-brand-primary)_40%,transparent)'
      );
      expect(thumb.className).not.toContain('--ui-background-inverse-primary');
    }
  });

  // The bar is a 6px track that grows to a 10px thumb while pointed at. happy-dom
  // has no layout, so this asserts the classes; the measured behaviour (6px → 10px,
  // outer edge staying flush with the viewport edge) was verified in a browser.
  it.each([
    ['vertical', 'w-1.5', 'hover:w-2.5', 'hover:-ms-0.5'],
    ['horizontal', 'h-1.5', 'hover:h-2.5', 'hover:-mt-0.5'],
  ] as const)(
    'grows the %s thumb inward when pointed at',
    (orientation, rest, grown, shift) => {
      const { container } = render(
        <ScrollArea>
          <ScrollBar orientation={orientation} keepMounted />
        </ScrollArea>
      );
      const thumb = container.querySelector('[data-slot="scroll-area-thumb"]');
      expect(thumb).toHaveClass(rest, grown, shift);
      // The growth is a flex item exceeding its track, so without this it is
      // shrunk back to 8px — measurably wrong rather than visibly broken.
      expect(thumb).toHaveClass('shrink-0');
      // `active:` too, so the thumb stays grown for the whole drag.
      expect(thumb?.className).toContain(grown.replace('hover:', 'active:'));
    }
  );

  // The 2px gutter has to be margin: Base UI pins the bar with inline
  // `top`/`bottom`/`inset-inline-end`, which a class cannot override.
  it('insets the bar from the viewport edges with margin, not offsets', () => {
    const { container } = render(
      <ScrollArea>
        <ScrollBar keepMounted />
      </ScrollArea>
    );
    const bar = container.querySelector('[data-slot="scroll-area-scrollbar"]');
    expect(bar).toHaveClass('m-0.5', 'w-1.5');
    // A 100% cross size would over-constrain the box against that inline `top`,
    // and the browser would drop the `bottom` that reserves the corner.
    expect(bar).not.toHaveClass('h-full');
  });

  // The remaining hop — `ScrollArea`'s own `tone` reaching the bars it renders
  // itself — is NOT asserted here, deliberately. happy-dom has no layout, so
  // Base UI never sees overflow and never mounts those bars; every assertion
  // above works only because it mounts a `ScrollBar` explicitly with
  // `keepMounted`. That hop is covered where a bar actually exists: the `Tones`
  // story's light and dark baselines, and the SidebarPrimary stories, which are
  // the reason `inverse` exists.

  it('renders a standalone ScrollBar with the requested orientation', () => {
    const { container } = render(
      <ScrollArea orientation="vertical">
        body
        <ScrollBar orientation="horizontal" keepMounted />
      </ScrollArea>
    );
    expect(
      container.querySelector('[data-slot="scroll-area-scrollbar"]')
    ).toBeInTheDocument();
  });
});
