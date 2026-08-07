import * as React from 'react';
import { ScrollArea as ScrollAreaPrimitive } from '@base-ui/react/scroll-area';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// A scrollable region with a custom **overlay** scrollbar built on Base UI's
// Scroll Area. Unlike a native `overflow: auto` element, the scrollbar floats
// over the content and reserves **zero** layout space, so full-bleed content
// (e.g. edge-to-edge selected rows in a sidebar) is never cropped by a gutter —
// on every OS and browser, not just where the platform provides overlay bars.
// The bar is revealed on hover/scroll and hidden at rest.

// The thumb is translucent rather than a flat grey, because an overlay bar
// floats over content it does not control: a partly transparent thumb reads
// against whatever it crosses, where an opaque border grey vanished over
// anything of a similar tone.
//
// TWO TONES, because the theme does not decide this on its own. `surface`
// resolves through `--ui-background-inverse-primary`, which is already
// near-black in light mode and white in dark, so one token covers the
// light/dark flip that the legacy Vue kit needed a second variable
// (`--av-scroll-thumb-inverse`) for. But a *brand* surface is dark in **both**
// themes — `SidebarPrimary` is the case — and there the light-mode value would
// paint near-black on navy. `inverse` is for those: white, fixed across themes,
// which is what the on-brand glyph token means.
//
// `rounded-full` is the whole radius story: at the 6px rest size it resolves to
// 3px and at the 10px hover size to 5px, which are exactly the two radii the Vue
// kit hard-coded.
//
// NO `flex-1`, and `shrink-0` instead — both because the thumb is a flex item
// and the flex algorithm, not `width`, has the last word on its cross size.
// `flex-1` would let the bar dictate the width outright, so the hover growth
// would do nothing at all; leaving the default `flex-shrink: 1` was subtler and
// measured wrong rather than unchanged: the 10px hover size exceeds the 6px
// track, so the item shrank by the 2px overflow and grew to 8px instead of 10.
// The along-axis size still comes from Base UI's inline
// `--scroll-area-thumb-height/width`.
const scrollThumbVariants = cva(
  'relative shrink-0 rounded-full transition-colors',
  {
    variants: {
      tone: {
        surface:
          '[background-color:color-mix(in_oklab,var(--ui-background-inverse-primary)_40%,transparent)] hover:[background-color:color-mix(in_oklab,var(--ui-background-inverse-primary)_60%,transparent)]',
        inverse:
          '[background-color:color-mix(in_oklab,var(--ui-glyph-on-brand-primary)_40%,transparent)] hover:[background-color:color-mix(in_oklab,var(--ui-glyph-on-brand-primary)_60%,transparent)]',
      },
    },
    defaultVariants: { tone: 'surface' },
  }
);

export interface ScrollBarProps
  extends
    React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Scrollbar>,
    VariantProps<typeof scrollThumbVariants> {
  /**
   * Which surface the bar floats over. `surface` follows the theme; `inverse`
   * is for a surface that stays dark in both themes (a brand-colored sidebar,
   * an inverse panel), where the themed value would be invisible.
   *
   * @default 'surface'
   */
  tone?: 'surface' | 'inverse';
}

const ScrollBar = React.forwardRef<HTMLDivElement, ScrollBarProps>(
  ({ className, orientation = 'vertical', tone, ...props }, ref) => (
    <ScrollAreaPrimitive.Scrollbar
      ref={ref}
      orientation={orientation}
      data-slot="scroll-area-scrollbar"
      className={cn(
        // Above anything the scrolled content stacks. A scrollbar that content
        // can paint over is not a scrollbar — and content inside a scroll area
        // legitimately uses z-index (a sticky table header is the case that
        // found this: it stacks to 50, and with the bar at `auto` the top of
        // the bar disappeared behind the header exactly where a long table is
        // most likely to be scrolled). `Root` isolates, so this competes only
        // inside its own scroll area and never against overlays outside it.
        'z-[60]',
        'flex touch-none select-none opacity-0 transition-opacity duration-150',
        // Revealed on hover/scroll; hidden at rest.
        'data-[hovering]:opacity-100 data-[scrolling]:opacity-100',
        // A 6px track held 2px off the viewport edges, as MARGIN rather than
        // offsets: Base UI pins the bar with inline `top` / `bottom` /
        // `inset-inline-end`, and an inline style cannot be overridden by a
        // class. Margin is also why the cross-axis `h-full` / `w-full` this used
        // to carry is gone — with `top: 0` set inline, a 100% height plus a
        // margin over-constrains the box, so the browser drops Base UI's
        // `bottom` (the corner reservation) and the bar overhangs.
        orientation === 'vertical' && 'm-0.5 w-1.5',
        orientation === 'horizontal' && 'm-0.5 h-1.5 flex-col',
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        className={cn(
          scrollThumbVariants({ tone }),
          // 6px at rest, 10px while pointed at or dragged — the Vue kit's
          // behavior: a hairline that stays out of the way until aimed at, then
          // becomes a target worth hitting.
          //
          // The negative inline-start margin is what keeps the growth from
          // pushing the bar off the edge: 10px shifted back 2px spans exactly the
          // 2px gutter plus the 6px track, so the thumb's outer edge lands flush
          // with the viewport edge and all 4px of growth happens inward. Logical
          // (`-ms-`), not `-ml-`, because Base UI pins the bar with
          // `inset-inline-end` — in RTL the bar is on the left and must grow the
          // other way.
          orientation === 'vertical' &&
            'w-1.5 hover:-ms-0.5 hover:w-2.5 active:-ms-0.5 active:w-2.5',
          orientation === 'horizontal' &&
            'h-1.5 hover:-mt-0.5 hover:h-2.5 active:-mt-0.5 active:h-2.5'
        )}
      />
    </ScrollAreaPrimitive.Scrollbar>
  )
);
ScrollBar.displayName = 'ScrollBar';

export interface ScrollAreaProps extends React.ComponentPropsWithoutRef<
  typeof ScrollAreaPrimitive.Root
> {
  /** Which scrollbar(s) to render. @default 'vertical' */
  orientation?: 'vertical' | 'horizontal' | 'both';
  /**
   * Ref to the **viewport** — the element that actually scrolls.
   *
   * `ref` reaches the root, which is `overflow: hidden` and never scrolls, so it
   * reports `scrollTop: 0` and `scrollHeight === clientHeight` forever. Anything
   * that measures, observes or programmatically scrolls the region needs this
   * one instead: a virtualizer's scroll element, an infinite-scroll observer, a
   * scroll-to-item call.
   */
  viewportRef?: React.Ref<HTMLDivElement>;
  /**
   * Extra props for the viewport — a scroll handler, a tab index, or data
   * attributes that have to sit on the element that scrolls rather than on the
   * wrapper around it.
   *
   * The `data-*` index signature is deliberate: JSX grants intrinsic elements an
   * arbitrary-`data-*` escape hatch, but a props *object* typed as
   * `HTMLAttributes` does not get it — so without this, the main thing this prop
   * exists for (marking the scrolling element for whatever observes it) would not
   * type-check.
   */
  viewportProps?: React.HTMLAttributes<HTMLDivElement> & {
    readonly [attribute: `data-${string}`]: unknown;
  };
  /**
   * Which surface the scrollbar floats over — forwarded to every bar this
   * renders. `inverse` for a surface that is dark in both themes.
   *
   * @default 'surface'
   */
  tone?: ScrollBarProps['tone'];
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  (
    {
      className,
      children,
      orientation = 'vertical',
      viewportRef,
      viewportProps,
      tone,
      ...props
    },
    ref
  ) => (
    <ScrollAreaPrimitive.Root
      ref={ref}
      data-slot="scroll-area"
      // `isolate` contains the scroll area's stacking order. Without it the root
      // is `position: relative` with no z-index — not a stacking context — so a
      // z-index set on scrolled content competes against everything in the
      // document, and the scrollbar's own z-index would too. Isolating keeps
      // both local. It is `isolation`, deliberately, not `contain`/`transform`:
      // those would create a containing block and break `position: sticky`
      // inside the viewport, which several consumers rely on.
      className={cn('relative isolate overflow-hidden', className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        ref={viewportRef}
        data-slot="scroll-area-viewport"
        {...viewportProps}
        className={cn(
          'size-full rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-brand)]',
          viewportProps?.className
        )}
      >
        <ScrollAreaPrimitive.Content data-slot="scroll-area-content">
          {children}
        </ScrollAreaPrimitive.Content>
      </ScrollAreaPrimitive.Viewport>
      {orientation !== 'horizontal' && (
        <ScrollBar orientation="vertical" tone={tone} />
      )}
      {orientation !== 'vertical' && (
        <ScrollBar orientation="horizontal" tone={tone} />
      )}
      {orientation === 'both' && (
        <ScrollAreaPrimitive.Corner data-slot="scroll-area-corner" />
      )}
    </ScrollAreaPrimitive.Root>
  )
);
ScrollArea.displayName = 'ScrollArea';

export { ScrollArea, ScrollBar, scrollThumbVariants };
