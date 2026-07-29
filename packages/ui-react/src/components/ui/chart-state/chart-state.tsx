'use client';

import * as React from 'react';
import {
  CircleWarningIcon,
  InboxIcon,
} from '@constructor-lab/icons-react/stroke-mono';

import { cn } from '@/lib/utils';
import { Spinner } from '../spinner';

// A shared loading / empty / error placeholder for the chart types. A chart can
// only render once recharts' `ResponsiveContainer` has data and real dimensions,
// so every type needs the same "there's nothing to plot yet" surface — this is
// that surface, dropped in place of the chart inside the same sized slot.
//
// It themes from the status/text semantic tokens, not the `--ui-chart-*`
// data-viz palette: a state placeholder carries status meaning (info/warning),
// not series identity, so the categorical chart palette is the wrong vocabulary
// here.
//   • label      -> text-foreground (--ui-text-on-surface-primary)
//   • empty icon  -> --ui-glyph-on-status-info
//   • error icon  -> --ui-glyph-on-status-warning
//   • loading      -> the shared Spinner (brand action blue)
// The generic full-page `Empty` component is the larger, page-level sibling;
// this one is compact and fills a chart slot.

const DEFAULT_MESSAGE: Record<ChartStateProps['state'], string> = {
  loading: 'Data is loading…',
  empty: 'No data found',
  error: 'Something went wrong',
};

export interface ChartStateProps extends Omit<
  React.ComponentPropsWithoutRef<'div'>,
  'children'
> {
  /** Which placeholder to show. Drives the leading glyph and default label. */
  state: 'loading' | 'empty' | 'error';
  /** Overrides the default label for the current `state`. */
  message?: string;
  /** Trailing action (e.g. a "Try again" button) — shown for `error` only. */
  action?: React.ReactNode;
}

const ChartState = React.forwardRef<HTMLDivElement, ChartStateProps>(
  ({ className, state, message, action, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex size-full min-h-32 flex-col items-center justify-center gap-2 text-center text-sm leading-6 text-foreground',
        className
      )}
      {...props}
      // The status/alert live-region contract is intrinsic to the state, so it
      // wins over any consumer-passed a11y prop (spread above). No `aria-busy`
      // here: this element IS the live region, and some AT defer announcing a
      // busy region's content until busy clears — but this placeholder is
      // unmounted (swapped for the chart) rather than un-busied, so a busy flag
      // would risk swallowing the "Data is loading…" announcement. A consumer
      // that wants a busy signal sets `aria-busy` on the chart-slot container.
      role={state === 'error' ? 'alert' : 'status'}
      aria-live={state === 'error' ? 'assertive' : 'polite'}
    >
      {/* aria-hidden: the root is already the loading live region (+ the label),
          so the Spinner's own role="status"/sr-only would double-announce. */}
      {state === 'loading' && <Spinner size="lg" aria-hidden />}
      {state === 'empty' && (
        <InboxIcon
          size={24}
          className="text-[var(--ui-glyph-on-status-info)]"
        />
      )}
      {state === 'error' && (
        <CircleWarningIcon
          size={24}
          className="text-[var(--ui-glyph-on-status-warning)]"
        />
      )}
      <p>{message ?? DEFAULT_MESSAGE[state]}</p>
      {state === 'error' && action}
    </div>
  )
);
ChartState.displayName = 'ChartState';

export { ChartState };
