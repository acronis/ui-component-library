import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// A chronological event list — activity feeds, audit logs, status history.
// Derived from the Figma `TimelineItem` component (page "Timeline",
// node 7615:7791), which is the design authority here: a 32px marker, a 16px
// gap, and a **bordered card** holding a header (title + optional inline tag ·
// right-aligned timestamp) over a content slot, with an optional footer-actions
// row. A 1px connector runs from the marker's bottom edge, centred under it,
// down through the inter-item gap to the next marker.
//
// Design-true scope. The Figma component is a **single symbol with no variant
// set** and exactly five properties (Title, Tag, Content, Footer,
// FooterActions), so this v1 deliberately ships **no `size`, `density` or
// `current` axes** — nothing in node 6025:24403 backs them, and an unbacked cva
// axis adds spec-conformance rows and VR surface with no design behind it. Add
// them when Figma introduces them.
//
// The marker in the design is an **`Avatar` instance** (initials for a person,
// or a type/status icon on a tinted circle), i.e. an instance of a separate
// component — so `marker` here is a slot. For the common status case, omitting
// `marker` renders the built-in `TimelineMarker`, whose tint is the same
// `--ui-background-status-<s>-pressed` + `--ui-text-on-status-<s>` pairing
// `Metric`'s icon badge uses, so the two badges agree across the kit.
//
// No `--ui-timeline-*` tier exists; every color in the design resolves to a
// shared semantic token (surface/border/text), referenced through the bridged
// Tailwind names.

export type TimelineProps = React.ComponentPropsWithoutRef<'ol'>;

/**
 * The list. A semantic `<ol>` so assistive tech announces the item count and
 * position; order is the caller's (the kit never sorts or groups).
 */
const Timeline = React.forwardRef<HTMLOListElement, TimelineProps>(
  ({ className, ...props }, ref) => (
    <ol
      ref={ref}
      data-slot="timeline"
      className={cn('flex list-none flex-col gap-4', className)}
      {...props}
    />
  )
);
Timeline.displayName = 'Timeline';

// The built-in marker. `--ui-background-status-<s>-pressed` fill +
// `--ui-text-on-status-<s>` glyph — identical to Metric's icon badge.
const timelineMarkerVariants = cva(
  'relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full [&_svg]:shrink-0',
  {
    variants: {
      status: {
        neutral:
          'bg-[var(--ui-background-status-neutral-pressed)] text-[var(--ui-text-on-status-neutral)]',
        info: 'bg-[var(--ui-background-status-info-pressed)] text-[var(--ui-text-on-status-info)]',
        success:
          'bg-[var(--ui-background-status-success-pressed)] text-[var(--ui-text-on-status-success)]',
        warning:
          'bg-[var(--ui-background-status-warning-pressed)] text-[var(--ui-text-on-status-warning)]',
        danger:
          'bg-[var(--ui-background-status-danger-pressed)] text-[var(--ui-text-on-status-danger)]',
        critical:
          'bg-[var(--ui-background-status-critical-pressed)] text-[var(--ui-text-on-status-critical)]',
      },
    },
    defaultVariants: {
      status: 'neutral',
    },
  }
);

export interface TimelineMarkerProps
  extends
    React.ComponentPropsWithoutRef<'span'>,
    VariantProps<typeof timelineMarkerVariants> {}

/**
 * The 32px status mark shown beside an item — a status-tinted circle holding
 * either a supplied icon or a centred dot. Decorative (`aria-hidden`): meaning
 * belongs in the item's title/content, never in the mark alone. Pass a different
 * mark (e.g. an `Avatar`) through `TimelineItem`'s `marker` slot instead.
 */
const TimelineMarker = React.forwardRef<HTMLSpanElement, TimelineMarkerProps>(
  ({ className, status, children, ...props }, ref) => (
    <span
      ref={ref}
      aria-hidden
      data-slot="timeline-marker"
      data-status={status ?? 'neutral'}
      className={cn(timelineMarkerVariants({ status }), className)}
      {...props}
    >
      {children ?? <span className="size-2 rounded-full bg-current" />}
    </span>
  )
);
TimelineMarker.displayName = 'TimelineMarker';

export interface TimelineItemProps
  extends
    Omit<React.ComponentPropsWithoutRef<'li'>, 'title'>,
    VariantProps<typeof timelineMarkerVariants> {
  /** Headline for the event — a person's name, an action, a state change. */
  title?: React.ReactNode;
  /**
   * When the event happened, already formatted — a moment
   * (`"Dec 22, 08:30 AM"`) or a range (`"01:54 AM – 03:54 AM (2 hrs)"`). The kit
   * never formats or localizes dates.
   */
  timestamp?: React.ReactNode;
  /** Inline qualifier beside the title — e.g. a `Tag` ("Internal note"). */
  tag?: React.ReactNode;
  /**
   * Replace the built-in status mark — e.g. an `<Avatar>` with initials, which
   * is what the design uses for person-authored events. When set, `status` and
   * `icon` are ignored.
   */
  marker?: React.ReactNode;
  /** Icon rendered inside the built-in status mark. */
  icon?: React.ReactNode;
  /** Footer-actions row below the content — e.g. `Link`s or ghost `Button`s. */
  actions?: React.ReactNode;
  /**
   * The event body: a description, and anything else the event needs — an
   * `Alert`, a `DescriptionList` of properties, a `Collapsible`, even a nested
   * `Timeline`.
   */
  children?: React.ReactNode;
}

/**
 * One event. A semantic `<li>` laying out the marker, the connector, and a
 * bordered content card (header + content + optional actions).
 */
const TimelineItem = React.forwardRef<HTMLLIElement, TimelineItemProps>(
  (
    {
      className,
      title,
      timestamp,
      tag,
      marker,
      icon,
      status,
      actions,
      children,
      ...props
    },
    ref
  ) => (
    <li
      ref={ref}
      data-slot="timeline-item"
      data-status={status ?? 'neutral'}
      className={cn(
        'group/timeline-item relative flex items-start gap-4',
        className
      )}
      {...props}
    >
      {marker ?? <TimelineMarker status={status}>{icon}</TimelineMarker>}

      {/*
        The rail. Runs from the marker's bottom edge (top-8 = 32px, the marker
        height) to 16px past the item — the inter-item gap — so it meets the next
        marker. `start-4` is the marker's centre as a logical inset, so it
        follows the marker to the right under `dir="rtl"`. Hidden on the last
        item, which has nothing to connect to.
      */}
      <span
        aria-hidden
        data-slot="timeline-connector"
        className="absolute -bottom-4 start-4 top-8 w-px bg-border group-last/timeline-item:hidden"
      />

      <div className="flex min-w-0 flex-1 flex-col gap-2 rounded-lg border border-border bg-background px-4 py-2">
        <div className="flex flex-col gap-1">
          {(title != null || tag != null || timestamp != null) && (
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                {title != null && (
                  <span className="min-w-0 truncate text-sm font-semibold leading-6 text-foreground">
                    {title}
                  </span>
                )}
                {tag != null && <span className="shrink-0">{tag}</span>}
              </div>
              {timestamp != null && (
                <span className="shrink-0 whitespace-nowrap text-xs leading-4 text-muted-foreground">
                  {timestamp}
                </span>
              )}
            </div>
          )}
          {children != null && (
            <div className="flex flex-col gap-3 text-sm leading-6 text-foreground">
              {children}
            </div>
          )}
        </div>
        {actions != null && (
          <div className="flex flex-wrap items-center gap-4">{actions}</div>
        )}
      </div>
    </li>
  )
);
TimelineItem.displayName = 'TimelineItem';

export { Timeline, TimelineItem, TimelineMarker, timelineMarkerVariants };
