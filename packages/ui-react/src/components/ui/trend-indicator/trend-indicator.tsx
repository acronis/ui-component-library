import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  ArrowRightIcon,
  ArrowTrendDownIcon,
  ArrowTrendUpIcon,
} from '@constructor-lab/icons-react/stroke-mono';

import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip';

// A small, presentational trend/delta indicator: a direction glyph + a
// pre-formatted change value + an optional comparison label. It deliberately
// separates `direction` (what happened mathematically) from `sentiment`
// (whether that change is good or bad), because the kit can't assume up = good —
// revenue ↑ is positive, threats ↑ is negative, MTTR ↓ is positive. The consumer
// computes both and passes an already-formatted `value`; this component never
// diffs two numbers, rounds, or interprets domain rules.
//
// Design-pending v1: there is no Figma node for a trend indicator (in this file
// or upstream), so there is no `--ui-trend-indicator-*` tier. `sentiment` drives
// the color through the **semantic status text tokens** — the same "status color
// directly on a plain surface" role Toast, ProgressCircle and `WidgetTextTrend`
// already use — and the glyph inherits it via `currentColor`. The `badge`
// variant adds the matching light status-background tint. `--ui-chart-*` is
// deliberately NOT used: that palette is for data-series marks, and a trend
// arrow carries *status* meaning, not series identity.
//
// Overlaps `widget-text`'s `WidgetTextTrend` (a `direction`-only trend line
// inside the WidgetText surface). Reconciling the two — `WidgetTextTrend`
// delegating here — is recorded as reconciliation debt in
// `packages/ui-spec/grammar/LEDGER.md`. Don't add a third trend surface;
// extend this one.
const trendIndicatorVariants = cva(
  'inline-flex items-center align-middle font-medium [&_svg]:shrink-0',
  {
    variants: {
      sentiment: {
        positive: 'text-[var(--ui-text-on-status-success)]',
        negative: 'text-[var(--ui-text-on-status-danger)]',
        neutral: 'text-[var(--ui-text-on-status-neutral)]',
      },
      size: {
        small: 'gap-0.5 text-xs [&_svg]:size-3.5',
        medium: 'gap-1 text-sm [&_svg]:size-4',
      },
      variant: {
        inline: '',
        badge: 'rounded-sm px-1.5 py-0.5',
      },
    },
    // The badge tint pairs with the same status family as the text color.
    compoundVariants: [
      {
        variant: 'badge',
        sentiment: 'positive',
        className: 'bg-[var(--ui-background-status-success)]',
      },
      {
        variant: 'badge',
        sentiment: 'negative',
        className: 'bg-[var(--ui-background-status-danger)]',
      },
      {
        variant: 'badge',
        sentiment: 'neutral',
        className: 'bg-[var(--ui-background-status-neutral)]',
      },
    ],
    defaultVariants: {
      sentiment: 'neutral',
      size: 'medium',
      variant: 'inline',
    },
  }
);

// `flat` uses a horizontal arrow (the "no meaningful change" glyph); up/down use
// the trend arrows. All three carry a horizontal direction, so they mirror under
// `dir="rtl"` (`rtl:-scale-x-100`) to stay aligned with the mirrored text flow.
const DIRECTION_ICON = {
  up: ArrowTrendUpIcon,
  down: ArrowTrendDownIcon,
  flat: ArrowRightIcon,
} as const;

export interface TrendIndicatorProps
  extends
    Omit<React.ComponentPropsWithoutRef<'span'>, 'children'>,
    VariantProps<typeof trendIndicatorVariants> {
  /** What changed mathematically — selects the direction glyph. */
  direction: 'up' | 'down' | 'flat';
  /**
   * Already-formatted change to display — e.g. `"12%"`, `"3.5 h"`,
   * `"Improving"`, `"4.2 h → 2.8 h"`. The kit does not format or compute it.
   */
  value?: React.ReactNode;
  /** Secondary comparison caption — e.g. `"vs previous quarter"`, `"YoY"`. */
  comparisonLabel?: React.ReactNode;
  /** Contextual hint shown on hover/focus (Base UI Tooltip). */
  tooltip?: React.ReactNode;
  /** Show the leading direction glyph. Defaults to `true` — color alone isn't enough. */
  showIcon?: boolean;
  /**
   * Accessible sentence describing the trend (e.g. "Revenue increased 12%
   * compared with the previous quarter"). Applied as the element's label via
   * `role="img"`, since the kit can't build a correct, localized sentence from
   * `direction` + `value` alone. Without it, assistive tech reads the visible
   * `value` / `comparisonLabel` text (the glyph is decorative).
   */
  ariaLabel?: string;
}

// The root's props are built once and then either rendered directly or handed to
// the Tooltip trigger's `render`. React's span props type has no index signature,
// so the `data-*` keys need declaring for the object literal (they are fine
// inline in JSX, but not in a typed object).
type TrendIndicatorRootProps = React.ComponentPropsWithoutRef<'span'> & {
  [key: `data-${string}`]: string | undefined;
};

const TrendIndicator = React.forwardRef<HTMLSpanElement, TrendIndicatorProps>(
  (
    {
      className,
      direction,
      sentiment,
      size,
      variant,
      value,
      comparisonLabel,
      tooltip,
      showIcon = true,
      ariaLabel,
      ...props
    },
    ref
  ) => {
    const Icon = DIRECTION_ICON[direction];
    const hasTooltip = tooltip != null;

    const rootProps: TrendIndicatorRootProps = {
      'data-direction': direction,
      'data-sentiment': sentiment ?? 'neutral',
      className: cn(
        trendIndicatorVariants({ sentiment, size, variant }),
        className
      ),
      // With an explicit sentence the whole unit is one labelled image and the
      // inner text/glyph is decorative; otherwise the visible text carries the
      // meaning and the glyph stays hidden.
      ...(ariaLabel ? { role: 'img', 'aria-label': ariaLabel } : {}),
      ...props,
    };

    const content = (
      <>
        {showIcon && <Icon aria-hidden className="rtl:-scale-x-100" />}
        {value != null && <span className="tabular-nums">{value}</span>}
        {comparisonLabel != null && (
          <span className="text-muted-foreground">{comparisonLabel}</span>
        )}
      </>
    );

    if (!hasTooltip) {
      return (
        <span ref={ref} {...rootProps}>
          {content}
        </span>
      );
    }

    return (
      <Tooltip>
        {/* Base UI's Trigger is typed to its default <button>; `render` swaps in
            the span, so the runtime ref is that span. `tabIndex` makes the hint
            keyboard-reachable instead of hover-only. */}
        <TooltipTrigger
          ref={ref as React.Ref<HTMLButtonElement>}
          render={
            <span {...rootProps} tabIndex={0}>
              {content}
            </span>
          }
        />
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    );
  }
);
TrendIndicator.displayName = 'TrendIndicator';

export { TrendIndicator, trendIndicatorVariants };
