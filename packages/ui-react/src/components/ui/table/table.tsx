import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowsDownUpIcon,
} from '@constructor-lab/icons-react/stroke-mono';

import { cn } from '@/lib/utils';
import { ScrollArea } from '../scroll-area';

// Composable table primitives ported from the legacy shadcn UI kit's `table`
// and informed by the "pre-release" Table design in the shadcn-uikit Figma
// (node 2948-2416). Unlike
// Card/Dialog, a `--ui-table-*` token tier already exists, so these parts theme
// directly from it (imported in styles/index.css):
//   • cell   -> --ui-table-global-cell-{padding-x,padding-y,min-height}
//   • row    -> --ui-table-global-row-border-{color,style,width} +
//              --ui-table-data-row-color-{idle,hover,active}  (active = selected)
//   • header -> --ui-table-header-{label-color,cell-color-hover,gap}
//   • sort   -> --ui-table-header-sort-icon-{color-active,color-inactive,size}
//   • data   -> --ui-table-data-value-color-{idle,disabled}
// The design's row checkboxes, tags, links and the column-settings button are
// consumer composition (use Checkbox / Tag / Link / ButtonIcon in cells). The
// TanStack-backed `DataTable` (sorting/selection logic over these primitives)
// owns row data and feature state; Table stays presentational. Reconcile with
// `/figma-component Table <url> --update` once the design is ready for dev.
//
// ── Presentation + scroll/sticky container (table-parity P1, unit F3) ────────
// `Table` grew the box/surface cluster the parity design calls `appearance`
// (size, width, height, maxHeight, background, borders) plus the scroll
// container's ref/class, and the parts grew the sticky/pin surfaces that
// virtualization, footers and grouping all need. Three mechanisms make that
// composable across parts that do not share a React context:
//
//  1. **Descendant rules from the root.** `size` and `borders` are declared on
//     `<Table>` but apply to cells and rows. They compile to `[&_td]:…`-style
//     rules on the `<table>`, whose specificity (0,1,1) beats the part's own
//     utility (0,1,0) — so a part keeps emitting exactly today's classes and
//     the root overrides only what the caller asked for. Defaults therefore
//     render byte-identically to the pre-F3 primitive.
//  2. **`--table-sticky-surface`.** A sticky or pinned cell must paint an
//     opaque background over whatever scrolls beneath it, and only the root
//     knows which surface that is. The `background` variant publishes it as a
//     local custom property (deliberately *not* `--ui-*`: it is an indirection
//     to a token, not a token) which every sticky part reads with a fallback.
//  3. **A fixed z ladder**, so the three sticky mechanisms never fight:
//     pinned body cell 10 < sticky row 20 (pinned within: 30) < sticky
//     header/footer 40 (pinned within: 50) < **container overlay 55** < the
//     scrollbar 60 (`scroll-area.tsx`). The `[&_th[data-pinned]]` rules are
//     one specificity step above their unpinned siblings, which is what keeps a
//     start-pinned header cell above the header cells that follow it in DOM
//     order during horizontal scroll.
//
//     **55 is reserved, and its bounds are forced rather than chosen.** An
//     overlay painted on the container box — anything drawn across the whole
//     region rather than inside one cell, e.g. DataTable's column-resize
//     indicator — must clear the *entire* sticky ladder: at `z-index: auto` it
//     paints below the z-50 pinned header cells, so it disappears exactly across
//     the header band, which is the one band a dragging pointer is in. It must
//     also stay under 60, because a scrollbar an overlay can paint over is not a
//     scrollbar (the reasoning at `scroll-area.tsx`'s `z-[60]`). That leaves the
//     open interval, and 55 sits in it. `Table` does not render such an overlay:
//     it is `containerClassName` + `containerStyle` on the consumer's side, and
//     this rung exists so the next one does not collide with the ladder.
//
// `border-collapse: collapse` paints row borders as part of the table's border
// grid rather than on the cell, so a sticky header's bottom border scrolls away
// with the content. Sticky sections therefore draw their divider as an inset
// box-shadow instead (same technique as `switch.tsx`), and `borders.horizontal
// = false` suppresses that shadow too.
//
// ── The scroll container is `ScrollArea` ─────────────────────────────────────
// So table scrollbars match the rest of the kit instead of being whatever the
// platform draws. Three things follow, and all three are load-bearing:
//
//  • **The container is two elements, and this is why.** The box that sizes the
//    region and the element that scrolls are different nodes, and they cannot be
//    merged: an element carries exactly one `data-slot`, the viewport already
//    carries `data-slot="scroll-area-viewport"`, and overriding that would break
//    ScrollArea's own contract. So `data-slot="table-container"` names the outer
//    box while the viewport does the scrolling.
//
//    **Corrected (#76): where the height constraints go is *not* a free choice,
//    and the earlier claim here that the two placements "measure identically" was
//    right for `height` and wrong for `maxHeight`.** That measurement was taken
//    with `height` only, and generalised. `maxHeight` on the root leaves the
//    viewport unbounded — it grows to its content and cannot scroll at all, while
//    the root clips. So the constraints live on the viewport; see the note at
//    `boxStyle`'s replacement below. The slot stays on the root either way, which
//    is the part that was correct.
//  • **The scrolling element is the viewport, one level in.** `ScrollArea`'s root
//    is `overflow: hidden`; `containerRef` and `containerProps` therefore go to
//    `viewportRef`/`viewportProps`, and `data-bounded` sits on the viewport
//    because that is the element an owner holds. Pointing a virtualizer at the
//    root would measure a permanently static box.
//  • **`getByRole('table').parentElement` is no longer the container.** The
//    table's parent is `ScrollArea`'s content wrapper. Reach the container by
//    `[data-slot="table-container"]` or the viewport by
//    `[data-slot="scroll-area-viewport"]`.
//  • **Sticky positioning still resolves against the viewport**, verified in a
//    browser under simultaneous vertical and horizontal scroll. `ScrollArea`
//    isolates its stacking context rather than using `contain`/`transform`,
//    which would create a containing block and break every sticky rule above.
//    The scrollbar sits above the z ladder, so it is not hidden by a sticky
//    header.

type CssLength = number | string;

/** CSS length from a bare number (px) or a ready-made string. */
function toCssLength(value: CssLength | undefined): string | undefined {
  if (value === undefined) return undefined;
  return typeof value === 'number' ? `${value}px` : value;
}

declare const process: {
  readonly env: { readonly NODE_ENV?: string };
};

/**
 * A percentage does not bound this container, and the failure is silent — so it is
 * named here, at the value, rather than left to be found in layout.
 *
 * Both height constraints sit on the scrolling element (see the note in `Table`),
 * whose containing block is the outer box, whose own height is `auto`. **A
 * percentage against an indefinite height computes as `none`/`auto`**, so the
 * scrolling element grows to its content: it reports itself bounded, does not
 * scroll, and now overflows its parent.
 *
 * Measured, both members, 60 rows in a 400px parent: `maxHeight="50%"` and
 * `height="50%"` each produce a 2440px viewport whose `scrollHeight` equals its
 * `clientHeight`, with `scrollTop` stuck at 0.
 *
 * **A percentage previously *appeared* to work, and that is worth saying plainly**:
 * before the constraint moved to the scrolling element, a percentage resolved
 * against the app's own definite-height parent, so the outer box came out the right
 * size — and **clipped** its overflow rather than scrolling it. So a layout that
 * just changed was never scrolling; it only looked bounded.
 */
function useUnboundedPercentageWarning(
  height: string | undefined,
  maxHeight: string | undefined
): void {
  // The prop travels with the value, because "a percentage height" reads as a lie
  // when the caller passed `maxHeight` and is the first thing they would check.
  const offence = (
    [
      ['height', height],
      ['maxHeight', maxHeight],
    ] as const
  ).find(([, value]) => value !== undefined && value.trim().endsWith('%'));
  const offender = offence?.[1];
  const prop = offence?.[0];

  React.useEffect(() => {
    if (process.env.NODE_ENV === 'production' || offender === undefined) {
      return;
    }
    console.error(
      `Table: a percentage \`${prop}\` (\`${offender}\`) does not bound the scroll ` +
        'container, so the table will not scroll and its content will overflow. ' +
        "Percentages resolve against the container's own height, which is `auto`. " +
        'Use a length (`320`, `"20rem"`) or a viewport unit (`"50vh"`). Note that a ' +
        'percentage may have appeared to work before: it sized the outer box against ' +
        'your layout and clipped the overflow, so it was never scrolling.'
    );
  }, [offender, prop]);
}

/* -------------------------------------------------------------------------- */
/*                                    Table                                   */
/* -------------------------------------------------------------------------- */

/** Border strength for one dimension of {@link TableBorders}. */
export type TableBorderStrength = 'subtle' | 'default' | 'strong';

/** A border dimension: `false` off, `true` the default strength, or a strength. */
export type TableBorderValue = boolean | TableBorderStrength;

/**
 * Independent border dimensions. Each edge/direction resolves on its own —
 * enabling one never implies another. `horizontal` defaults to the row divider
 * the primitive has always drawn; the other three default to off.
 */
export interface TableBorders {
  /** Top edge of the table. Default: off. */
  top?: TableBorderValue;
  /** Bottom edge of the table. Default: off. */
  bottom?: TableBorderValue;
  /** Dividers between rows. Default: on, at the `default` strength. */
  horizontal?: TableBorderValue;
  /** Dividers between columns. Default: off. */
  vertical?: TableBorderValue;
}

// Every class below is written out in full: Tailwind scans source text for
// complete candidates, so a class assembled by string concatenation would never
// be generated.
const TOP_BORDER: Record<TableBorderStrength, string> = {
  subtle: 'border-t border-t-[color:var(--ui-border-on-surface-divider)]',
  default: 'border-t border-t-[color:var(--ui-table-global-row-border-color)]',
  strong: 'border-t border-t-[color:var(--ui-border-on-surface-border-active)]',
};

const BOTTOM_BORDER: Record<TableBorderStrength, string> = {
  subtle: 'border-b border-b-[color:var(--ui-border-on-surface-divider)]',
  default: 'border-b border-b-[color:var(--ui-table-global-row-border-color)]',
  strong: 'border-b border-b-[color:var(--ui-border-on-surface-border-active)]',
};

const HORIZONTAL_BORDER: Record<TableBorderStrength, string> = {
  subtle: '[&_tr]:border-b-[color:var(--ui-border-on-surface-divider)]',
  default: '[&_tr]:border-b-[color:var(--ui-table-global-row-border-color)]',
  strong: '[&_tr]:border-b-[color:var(--ui-border-on-surface-border-active)]',
};

// Suppress the dividers *and* the sticky sections' stand-in shadow — the two
// together are what "no horizontal borders" means once a header is sticky.
const HORIZONTAL_BORDER_OFF =
  '[&_tr]:border-b-0 [&_thead_th]:shadow-none [&_tfoot_td]:shadow-none [&_tfoot_th]:shadow-none';

const VERTICAL_BORDER: Record<TableBorderStrength, string> = {
  subtle:
    '[&_tr>*:not(:last-child)]:border-e [&_tr>*:not(:last-child)]:border-e-[color:var(--ui-border-on-surface-divider)]',
  default:
    '[&_tr>*:not(:last-child)]:border-e [&_tr>*:not(:last-child)]:border-e-[color:var(--ui-table-global-row-border-color)]',
  strong:
    '[&_tr>*:not(:last-child)]:border-e [&_tr>*:not(:last-child)]:border-e-[color:var(--ui-border-on-surface-border-active)]',
};

/** Normalize a border dimension to a strength, or `null` when it is off. */
function borderStrength(
  value: TableBorderValue | undefined
): TableBorderStrength | null {
  if (value === undefined || value === false) return null;
  return value === true ? 'default' : value;
}

function borderClasses(borders: TableBorders | undefined): string | undefined {
  if (!borders) return undefined;
  const top = borderStrength(borders.top);
  const bottom = borderStrength(borders.bottom);
  const vertical = borderStrength(borders.vertical);
  const horizontal = borderStrength(borders.horizontal);
  return cn(
    top && TOP_BORDER[top],
    bottom && BOTTOM_BORDER[bottom],
    vertical && VERTICAL_BORDER[vertical],
    // `undefined` keeps the shipped default (a `default`-strength row divider);
    // only an explicit `false` turns dividers off.
    borders.horizontal === false
      ? HORIZONTAL_BORDER_OFF
      : horizontal && HORIZONTAL_BORDER[horizontal]
  );
}

const tableVariants = cva(
  'w-full caption-bottom border-collapse text-sm text-[var(--ui-table-data-value-color-idle)]',
  {
    variants: {
      // Density. `medium` emits nothing: the parts already carry the
      // `--ui-table-global-cell-*` defaults, and re-stating them here would
      // only add a second place to keep in sync. The tier defines one set of
      // cell metrics, so small/large step through the `--ui-units-*` scale.
      size: {
        small:
          '[&_th]:h-[var(--ui-units-size-32)] [&_td]:h-[var(--ui-units-size-32)] [&_th]:px-[var(--ui-units-size-8)] [&_td]:px-[var(--ui-units-size-8)] [&_td]:py-[var(--ui-units-gap-4)]',
        medium: '',
        large:
          '[&_th]:h-[var(--ui-units-size-48)] [&_td]:h-[var(--ui-units-size-48)] [&_td]:py-[var(--ui-units-gap-12)]',
      },
      // Surface. Legacy `backgroundColor` (transparent | solid-brand-accent |
      // solid-brand-lightest | fixed-white) normalizes onto these four. Each
      // variant also publishes the surface a sticky/pinned cell must paint.
      //
      // `subtle` and `surface` use the bridged Tailwind names, which is the
      // house rule for shared semantic color. The other two reference their
      // token directly: `--ui-background-surface-transparent` has no bridged
      // name, and the bridged `accent` name aliases
      // `--ui-background-surface-hover` — the row hover token — so using it
      // here would silently erase hover feedback on an accent table.
      background: {
        transparent:
          'bg-[var(--ui-background-surface-transparent)] [--table-sticky-surface:var(--ui-background-surface-primary)]',
        accent:
          'bg-[var(--ui-background-surface-active)] [--table-sticky-surface:var(--ui-background-surface-active)]',
        subtle:
          'bg-muted [--table-sticky-surface:var(--ui-background-surface-secondary)]',
        surface:
          'bg-background [--table-sticky-surface:var(--ui-background-surface-primary)]',
      },
    },
    defaultVariants: { size: 'medium', background: 'transparent' },
  }
);

export interface TableProps
  extends
    React.HTMLAttributes<HTMLTableElement>,
    VariantProps<typeof tableVariants> {
  /** Independent top / bottom / horizontal / vertical border presentation. */
  borders?: TableBorders;
  /** Width of the scroll container. A bare number is px. */
  width?: CssLength;
  /**
   * Height of the scroll container. A bare number is px. Setting this (or
   * `maxHeight`) is what bounds the container, which is the precondition for
   * sticky sections and for windowed/virtual rendering.
   *
   * **Must be a definite length — a percentage does not bound anything.** It
   * resolves against the container's own height, which is `auto`, so the scrolling
   * element grows to its content and never scrolls. Use a length (`320`,
   * `'20rem'`) or a viewport unit (`'50vh'`); a percentage logs a development
   * warning.
   */
  height?: CssLength;
  /**
   * Maximum height of the scroll container. A bare number is px. Bounds the
   * container exactly as `height` does.
   *
   * **Definite lengths only**, for the same reason as `height`.
   */
  maxHeight?: CssLength;
  /**
   * Ref to the scrolling element — what an owner scrolls, observes or measures.
   *
   * This is `ScrollArea`'s **viewport**, not its outer box. The outer box is
   * `overflow: hidden` and never scrolls, so a ref there would report
   * `scrollTop: 0` forever.
   */
  containerRef?: React.Ref<HTMLDivElement>;
  /** Extra classes for the scroll container's box (the `<table>` takes `className`). */
  containerClassName?: string;
  /**
   * Extra inline style for the scroll container's box — the counterpart to
   * `containerClassName`, and the only way to give that element a value a class
   * cannot express: a computed length, or a CSS custom property driving a rule
   * `containerClassName` declares.
   *
   * It exists because the box already accepted a class and a `width` (which lands
   * here as inline style) but had no seam for a *value*, so a caller styling the
   * region it now owns (#90 moved the border and radius onto it) could declare a
   * rule and not feed it. `containerProps` is not that seam: it goes to the
   * **scrolling element**, which is a different node.
   *
   * `width` still wins on conflict, matching `containerProps.style` versus
   * `height`/`maxHeight` on the viewport — a named prop beats the escape hatch, so
   * `appearance.width` cannot be silently overridden from here.
   */
  containerStyle?: React.CSSProperties;
  /**
   * Escape hatch for the scrolling element: `onScroll`, `tabIndex`, `data-*`.
   * Applied to the same element `containerRef` points at, so a scroll handler
   * fires for the scroll an owner can observe.
   */
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  (
    {
      className,
      size,
      background,
      borders,
      width,
      height,
      maxHeight,
      containerRef,
      containerClassName,
      containerStyle,
      containerProps,
      ...props
    },
    ref
  ) => {
    const {
      className: containerPropsClassName,
      style: containerPropsStyle,
      ...restContainerProps
    } = containerProps ?? {};

    const cssWidth = toCssLength(width);
    const cssHeight = toCssLength(height);
    const cssMaxHeight = toCssLength(maxHeight);
    const bounded = cssHeight !== undefined || cssMaxHeight !== undefined;

    // Development-only, and at the value rather than in layout — a percentage
    // fails silently here and used to fail *invisibly*.
    useUnboundedPercentageWarning(cssHeight, cssMaxHeight);

    // **The height constraints go on the viewport, and `width` stays on the root.**
    // Not symmetry for its own sake — measured, both members, in a story whose
    // content overflows (`BoundedByMaxHeightOverflowing`):
    //
    //  • On the root, `maxHeight` bounds the wrong element. The root becomes
    //    `max-height: 320px` with `height: auto`, and the viewport's `size-full`
    //    (`height: 100%`) needs a *definite* parent height, so it resolves to auto
    //    and grows to its content: root 320px against a **2440px** viewport, whose
    //    `scrollHeight === clientHeight`, so `scrollTop` never leaves 0. The root's
    //    `overflow: hidden` then clips the rest. `height` on the root happens to
    //    work, because it *is* definite — which is why one measurement taken with
    //    `height` alone concluded the two placements were interchangeable.
    //  • On the viewport, both work: an inline `height` beats `size-full`, and an
    //    inline `max-height` caps the auto height. The root shrink-wraps to the
    //    viewport, so the box still measures 320px and the scrollbars still align.
    //  • `width` stays on the root because the root is the region's own box: the
    //    scrollbars are its absolutely-positioned children, and a narrower viewport
    //    inside a full-width root would leave the vertical scrollbar detached from
    //    the content it scrolls.
    //
    // What did *not* move: `data-slot="table-container"` (an element carries one
    // slot and the viewport already has ScrollArea's), and `data-bounded` +
    // `containerRef`, which must stay on the viewport because a ref on the root
    // reports `scrollTop: 0` forever. So the split is now **slot on the root,
    // everything an owner touches on the viewport** — three units reason about this
    // box, which is why it is spelled out.
    // `containerStyle` first, so `width` overrides it rather than the other way
    // round: the same precedence `containerProps.style` gets against the height
    // constraints below, and for the same reason — an escape hatch must not be
    // able to silently defeat the prop the caller reached for first.
    const rootStyle: React.CSSProperties = { ...containerStyle };
    if (cssWidth !== undefined) rootStyle.width = cssWidth;

    // `containerProps` is documented as the escape hatch for the *scrolling*
    // element, so its style belongs with the constraints rather than on the root —
    // where it used to land, contradicting its own docblock.
    const viewportStyle: React.CSSProperties = { ...containerPropsStyle };
    if (cssHeight !== undefined) viewportStyle.height = cssHeight;
    if (cssMaxHeight !== undefined) viewportStyle.maxHeight = cssMaxHeight;

    return (
      <ScrollArea
        orientation="both"
        data-slot="table-container"
        className={cn('w-full', containerClassName)}
        style={Object.keys(rootStyle).length ? rootStyle : undefined}
        // `containerRef` and every container attribute go to the **viewport**,
        // not the root: the root is `overflow: hidden` and never scrolls, so a
        // ref there reports `scrollTop: 0` forever and a virtualizer pointed at
        // it would measure nothing.
        viewportRef={containerRef}
        viewportProps={{
          // The seam virtualization keys off: a bounded container is the one
          // precondition windowed rendering cannot supply for itself. It lives
          // on the viewport because that is the element an owner holds.
          'data-bounded': bounded ? 'true' : undefined,
          ...restContainerProps,
          className: containerPropsClassName,
          ...(Object.keys(viewportStyle).length
            ? { style: viewportStyle }
            : {}),
        }}
      >
        <table
          ref={ref}
          className={cn(
            tableVariants({ size, background }),
            borderClasses(borders),
            className
          )}
          {...props}
        />
      </ScrollArea>
    );
  }
);
Table.displayName = 'Table';

/* -------------------------------------------------------------------------- */
/*                                  Sections                                  */
/* -------------------------------------------------------------------------- */

const STICKY_HEADER =
  '[&_th]:sticky [&_th]:top-0 [&_th]:z-40 [&_th[data-pinned]]:z-50 ' +
  '[&_th]:bg-[var(--table-sticky-surface,var(--ui-background-surface-primary))] ' +
  '[&_th]:shadow-[inset_0_-1px_0_0_var(--ui-table-global-row-border-color)]';

const STICKY_FOOTER =
  '[&_th]:sticky [&_td]:sticky [&_th]:bottom-0 [&_td]:bottom-0 ' +
  '[&_th]:z-40 [&_td]:z-40 [&_th[data-pinned]]:z-50 [&_td[data-pinned]]:z-50 ' +
  '[&_th]:bg-[var(--table-sticky-surface,var(--ui-background-surface-primary))] ' +
  '[&_td]:bg-[var(--table-sticky-surface,var(--ui-background-surface-primary))] ' +
  '[&_th]:shadow-[inset_0_1px_0_0_var(--ui-table-global-row-border-color)] ' +
  '[&_td]:shadow-[inset_0_1px_0_0_var(--ui-table-global-row-border-color)]';

export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  /**
   * Pin the header to the top of the scroll container. Requires the container
   * to be bounded (`height` or `maxHeight` on `Table`).
   */
  sticky?: boolean;
}

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, sticky, ...props }, ref) => (
    <thead
      ref={ref}
      data-sticky={sticky ? 'true' : undefined}
      className={cn(sticky && STICKY_HEADER, className)}
      {...props}
    />
  )
);
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
));
TableBody.displayName = 'TableBody';

export interface TableFooterProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  /**
   * Pin the footer to the bottom of the scroll container. Requires the
   * container to be bounded (`height` or `maxHeight` on `Table`).
   */
  sticky?: boolean;
}

const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className, sticky, ...props }, ref) => (
    <tfoot
      ref={ref}
      data-sticky={sticky ? 'true' : undefined}
      className={cn(
        // A sticky footer draws its divider as an inset shadow on the cells; the
        // section's own collapsed border would scroll away and double up.
        !sticky &&
          'border-t border-[color:var(--ui-table-global-row-border-color)]',
        sticky && STICKY_FOOTER,
        'font-medium [&>tr]:last:border-b-0',
        className
      )}
      {...props}
    />
  )
);
TableFooter.displayName = 'TableFooter';

/* -------------------------------------------------------------------------- */
/*                                     Row                                    */
/* -------------------------------------------------------------------------- */

// Layout-neutral leading marker for the current row: an inset shadow rather
// than a border, so turning it on never reflows the cell. `box-shadow` has no
// logical form, hence the mirrored `rtl:` variant.
const CURRENT_ROW_MARKER =
  '[&>*:first-child]:shadow-[inset_2px_0_0_0_var(--ui-border-on-surface-border-active)] ' +
  'rtl:[&>*:first-child]:shadow-[inset_-2px_0_0_0_var(--ui-border-on-surface-border-active)]';

// See the comment at the call site: a pinned cell is opaque, so the row has to
// re-apply its state tint to its own pinned children.
const PINNED_ROW_TINT_HOVER =
  'hover:[&>[data-pinned]]:bg-[var(--ui-table-data-row-color-hover)]';
const PINNED_ROW_TINT_SELECTED =
  'data-[state=selected]:[&>[data-pinned]]:bg-[var(--ui-table-data-row-color-active)]';

const STICKY_ROW =
  '[&>th]:sticky [&>td]:sticky ' +
  '[&>th]:top-[var(--table-row-sticky-top,0px)] [&>td]:top-[var(--table-row-sticky-top,0px)] ' +
  '[&>th]:z-20 [&>td]:z-20 [&>[data-pinned]]:z-30 ' +
  '[&>th]:bg-[var(--table-sticky-surface,var(--ui-background-surface-primary))] ' +
  '[&>td]:bg-[var(--table-sticky-surface,var(--ui-background-surface-primary))]';

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  /** Mark the row as selected — applies the active row token + `data-state`. */
  selected?: boolean;
  /**
   * Mark the row as the current record. Distinct from `selected`: it exposes
   * `aria-current` (never `aria-selected`) and a leading marker, so a row can
   * be current, selected, both, or neither.
   */
  current?: boolean;
  /**
   * Reflect a disclosure's state on the row as `data-expanded`, for styling.
   * Table never renders, loads or toggles the child content; its owner does.
   *
   * **This deliberately does not emit `aria-expanded`.** That attribute is only
   * valid on a `treegrid` row — axe flags it `aria-conditional-attr` at serious
   * impact on a `role="table"` row — and it belongs on the **disclosure control**
   * anyway, together with `aria-controls` pointing at the revealed row. That is
   * what `anatomy.yaml` specifies for the `detail-expander` and `tree-expander`
   * parts, and what DataGrid's expander implements.
   *
   * If the family ever adopts `role="treegrid"`, the attribute returns here gated
   * on that role — which needs a `Table`-level prop, because a row cannot know
   * the role of the table containing it.
   */
  expanded?: boolean;
  /**
   * Pin the row to the top of the scroll container (group headers). Sits below
   * a sticky `TableHeader`; use `stickyOffset` to clear it.
   */
  sticky?: boolean;
  /** Offset from the top of the scroll container for a `sticky` row. */
  stickyOffset?: CssLength;
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  (
    {
      className,
      selected,
      current,
      expanded,
      sticky,
      stickyOffset,
      style,
      ...props
    },
    ref
  ) => {
    const offset = toCssLength(stickyOffset);
    return (
      <tr
        ref={ref}
        data-state={selected ? 'selected' : undefined}
        data-current={current ? 'true' : undefined}
        data-expanded={expanded ? 'true' : undefined}
        aria-current={current ? true : undefined}
        // No `aria-expanded` — see the `expanded` prop docs. It is invalid on a
        // `role="table"` row and belongs on the disclosure control.
        style={
          offset === undefined
            ? style
            : ({
                ...style,
                '--table-row-sticky-top': offset,
              } as React.CSSProperties)
        }
        className={cn(
          'border-b border-[color:var(--ui-table-global-row-border-color)] bg-[var(--ui-table-data-row-color-idle)] transition-colors hover:bg-[var(--ui-table-data-row-color-hover)] data-[state=selected]:bg-[var(--ui-table-data-row-color-active)]',
          // A pinned cell has to paint an opaque surface or the columns
          // scrolling beneath it show through — which also paints over the
          // row's own tint, leaving a visible seam down the pinned column. Push
          // each state's tint onto the row's pinned children; `> [data-pinned]`
          // outranks the cell's own background utility.
          PINNED_ROW_TINT_HOVER,
          selected && PINNED_ROW_TINT_SELECTED,
          // Selection wins over expansion, so the two are resolved here rather
          // than left to stylesheet order between two equal-specificity rules.
          expanded &&
            !selected &&
            'data-[expanded=true]:bg-[var(--ui-table-data-row-color-hover)] data-[expanded=true]:[&>[data-pinned]]:bg-[var(--ui-table-data-row-color-hover)]',
          current && CURRENT_ROW_MARKER,
          sticky && STICKY_ROW,
          className
        )}
        {...props}
      />
    );
  }
);
TableRow.displayName = 'TableRow';

/* -------------------------------------------------------------------------- */
/*                                    Cells                                   */
/* -------------------------------------------------------------------------- */

/** Which edge of the scroll container a column is pinned to. */
export type TableColumnPin = 'start' | 'end' | false;

/** Pin presentation shared by `TableHead` and `TableCell`. */
const PINNED_CELL =
  'sticky z-10 bg-[var(--table-sticky-surface,var(--ui-background-surface-primary))]';

/**
 * Resolve the pin hook into the attributes a pinned cell needs. The owner
 * computes the offset (Table holds no column model); `data-pinned` is what the
 * sticky section rules key off to lift a pinned cell above its siblings.
 */
function pinAttributes(
  pinned: TableColumnPin | undefined,
  pinOffset: CssLength | undefined,
  style: React.CSSProperties | undefined
): {
  className: string | undefined;
  style: React.CSSProperties | undefined;
  dataPinned?: string;
} {
  if (!pinned) return { className: undefined, style };
  const offset = toCssLength(pinOffset) ?? '0px';
  return {
    className: PINNED_CELL,
    style: {
      ...style,
      ...(pinned === 'start'
        ? { insetInlineStart: offset }
        : { insetInlineEnd: offset }),
    },
    dataPinned: pinned,
  };
}

type SortDirection = 'asc' | 'desc' | false;

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  /** Render the column as sortable — adds a sort affordance and `aria-sort`. */
  sortable?: boolean;
  /** Current sort direction for this column (`false` = sortable but unsorted). */
  sortDirection?: SortDirection;
  /**
   * 1-based sort priority to present next to the direction icon. Only shown for
   * multi-column sorts (omit or `undefined` for a single sort). The Table
   * primitive only presents the priority passed to it; the DataTable engine
   * decides it.
   */
  sortPriority?: number;
  /**
   * Invoked when the user activates a sortable header (click / Enter / Space).
   * Receives the originating event so callers can detect modifier keys (e.g.
   * Shift for multi-sort).
   */
  onSort?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * Pin the column to the start or end edge of the scroll container. Table
   * presents the pin; the owner decides which columns are pinned and supplies
   * `pinOffset` (the accumulated width of the columns pinned before it).
   */
  pinned?: TableColumnPin;
  /** Distance from the pinned edge. A bare number is px. Defaults to `0`. */
  pinOffset?: CssLength;
  /**
   * Content rendered inside the header cell but **outside** the sort control —
   * a resize handle, a reorder grip, anything focusable or clickable.
   *
   * `children` is the column label, and a `sortable` header wraps its label in a
   * `<button>`. A control passed as `children` therefore becomes a descendant of
   * that button, where a pointer release fires `onSort`, Enter/Space sorts
   * instead of acting, and the button's accessible name absorbs the control's
   * label. Since a records grid is normally sortable *and* resizable, that is the
   * common case rather than an edge case. `trailing` is the escape: a sibling of
   * the sort button, so its content keeps its own events, focus and name.
   *
   * Non-interactive decoration of the label (a unit hint, an info icon) can stay
   * in `children` — it is only controls that must not nest.
   *
   * **Consumer:** `data-table-view.tsx` routes `ColumnPresentation`'s
   * `placement: 'edge'` header adornments here, landing in the commit after this
   * one; U3's column resize handle and reorder grip mount through it. An
   * `edge`-placed control positions itself against the cell, so the same
   * contribution supplies `className: 'relative'`.
   */
  trailing?: React.ReactNode;
}

function SortIcon({ direction }: { direction: SortDirection }) {
  const size = 'size-[var(--ui-table-header-sort-icon-size)]';
  if (direction === 'asc') {
    return (
      <ArrowUpIcon
        className={cn(
          size,
          'text-[var(--ui-table-header-sort-icon-color-active)]'
        )}
      />
    );
  }
  if (direction === 'desc') {
    return (
      <ArrowDownIcon
        className={cn(
          size,
          'text-[var(--ui-table-header-sort-icon-color-active)]'
        )}
      />
    );
  }
  return (
    <ArrowsDownUpIcon
      className={cn(
        size,
        'text-[var(--ui-table-header-sort-icon-color-inactive)]'
      )}
    />
  );
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  (
    {
      className,
      children,
      sortable,
      sortDirection = false,
      sortPriority,
      onSort,
      pinned,
      pinOffset,
      trailing,
      style,
      ...props
    },
    ref
  ) => {
    const pin = pinAttributes(pinned, pinOffset, style);
    // The header's accessible name must come from its **label**, not from
    // everything inside the cell. Without this, an `aria-label`led control in
    // `trailing` — a resize handle, say — is folded into the name, and a screen
    // reader announces the column header for every cell in the column: "Name
    // Resize name column", on every row. Naming the label region explicitly makes
    // `trailing` structurally excluded, so the mistake is unavailable rather than
    // documented. Only when there is something to exclude, so a plain header's
    // output is unchanged.
    const labelId = React.useId();
    const nameFromLabel = trailing !== undefined && trailing !== null;
    return (
      <th
        ref={ref}
        {...(nameFromLabel ? { 'aria-labelledby': labelId } : {})}
        aria-sort={
          sortDirection === 'asc'
            ? 'ascending'
            : sortDirection === 'desc'
              ? 'descending'
              : sortable
                ? 'none'
                : undefined
        }
        data-pinned={pin.dataPinned}
        style={pin.style}
        className={cn(
          'h-10 px-[var(--ui-table-global-cell-padding-x)] text-start align-middle text-sm font-semibold text-[var(--ui-table-header-label-color)] [&:has([role=checkbox])]:pe-0',
          sortable &&
            'cursor-pointer transition-colors hover:bg-[var(--ui-table-header-cell-color-hover)]',
          pin.className,
          className
        )}
        {...props}
      >
        {sortable ? (
          <button
            type="button"
            {...(nameFromLabel ? { id: labelId } : {})}
            onClick={onSort}
            className="-mx-1 inline-flex items-center gap-[var(--ui-table-header-gap)] rounded-sm px-1 outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-primary)]"
          >
            {children}
            <SortIcon direction={sortDirection} />
            {sortPriority !== undefined && sortDirection !== false && (
              <span
                aria-hidden="true"
                className="inline-flex min-w-4 items-center justify-center rounded-full bg-[var(--ui-table-header-sort-icon-color-active)] px-1 text-[0.625rem] font-semibold leading-4 text-[var(--ui-background-surface-primary)]"
              >
                {sortPriority}
              </span>
            )}
          </button>
        ) : nameFromLabel ? (
          <span id={labelId}>{children}</span>
        ) : (
          children
        )}
        {/* Sibling of the sort button, never a descendant of it. See the
            `trailing` prop docs for why that distinction is the whole point. */}
        {trailing}
      </th>
    );
  }
);
TableHead.displayName = 'TableHead';

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  /** Pin the cell to the start or end edge — see {@link TableHeadProps.pinned}. */
  pinned?: TableColumnPin;
  /** Distance from the pinned edge. A bare number is px. Defaults to `0`. */
  pinOffset?: CssLength;
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, pinned, pinOffset, style, ...props }, ref) => {
    const pin = pinAttributes(pinned, pinOffset, style);
    return (
      <td
        ref={ref}
        data-pinned={pin.dataPinned}
        style={pin.style}
        className={cn(
          'h-10 px-[var(--ui-table-global-cell-padding-x)] py-[var(--ui-table-global-cell-padding-y)] align-middle text-sm [&:has([role=checkbox])]:pe-0',
          pin.className,
          className
        )}
        {...props}
      />
    );
  }
);
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn('mt-4 text-sm text-muted-foreground', className)}
    {...props}
  />
));
TableCaption.displayName = 'TableCaption';

export {
  Table,
  tableVariants,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
