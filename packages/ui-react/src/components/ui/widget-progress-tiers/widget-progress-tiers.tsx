import * as React from 'react';

import { cn } from '@/lib/utils';

// Tiered stacked-bar dashboard widget, ported from the legacy shadcn UI kit's
// `widget-progress-tiers`. Plain styled elements — no Base UI primitive,
// mirroring the sibling
// `widget`/`widget-placeholder`/`widget-progress-chunks` ports. No
// `--ui-widget-progress-tiers-*` tier exists yet, so this design-pending v1
// themes from the shared semantic vocabulary:
//   • root surface/text (was --av-inversed-primary / --av-fixed-primary) ->
//     bg-background / text-foreground; border -> border-border
//   • icon (was --av-fixed-link, the brand action blue) -> text-secondary
//   • legend label (was --av-fixed-primary) -> text-foreground
//   • bar segment wrapper border (was --av-fixed-invisible, a deliberately
//     invisible border used only to clip the rounded corners) -> border-transparent
//   • tier fill / legend swatch -> the caller-supplied `color` (a per-tier CSS
//     color, same as `chart`'s consumer-configured series colors) — not
//     tokenized here
//   • divider (was --av-brand-accent, a brand tint) -> border-border (matches
//     the divider convention used by `widget`/`accordion`/`app-shell`)
//   • interactive hover/active -> hover:bg-accent / active surface; focus ->
//     the standard 2px --ui-focus-primary outline (matches widget-placeholder)
// Anatomy:
// - WidgetProgressTiers (root)
//   - WidgetProgressTiersHeader (icon + title)
//   - WidgetProgressTiersBar (stacked horizontal segments)
//   - WidgetProgressTiersLegend
//     - WidgetProgressTiersLegendItem (swatch + label + value) — one per tier
//   - WidgetProgressTiersFooter (optional summary)
// Reconcile with `/figma-component WidgetProgressTiers <url> --update` once a
// mockup lands (legacy Figma ref: Charts-anatomy / Progress-Tiers, node 229:70578).

export interface ProgressTier {
  label: string;
  value: number;
  color: string;
}

export interface WidgetProgressTiersProps
  extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

const WidgetProgressTiers = React.forwardRef<
  HTMLDivElement,
  WidgetProgressTiersProps
>(({ className, interactive, ...props }, ref) => (
  <div
    ref={ref}
    tabIndex={interactive ? 0 : undefined}
    className={cn(
      'relative flex flex-col rounded-lg border border-border bg-background text-foreground transition-colors',
      interactive &&
        'cursor-pointer hover:bg-accent active:bg-[var(--ui-background-surface-active)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ui-focus-primary)]',
      className
    )}
    {...props}
  />
));
WidgetProgressTiers.displayName = 'WidgetProgressTiers';

const WidgetProgressTiersHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center gap-2 px-6 pb-2 pt-4', className)}
    {...props}
  />
));
WidgetProgressTiersHeader.displayName = 'WidgetProgressTiersHeader';

const WidgetProgressTiersTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-1 truncate text-sm font-semibold leading-6', className)}
    {...props}
  />
));
WidgetProgressTiersTitle.displayName = 'WidgetProgressTiersTitle';

const WidgetProgressTiersIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-shrink-0 text-secondary [&>svg]:size-4', className)}
    {...props}
  />
));
WidgetProgressTiersIcon.displayName = 'WidgetProgressTiersIcon';

export interface WidgetProgressTiersBarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  tiers: ProgressTier[];
  total?: number;
}

const WidgetProgressTiersBar = React.forwardRef<
  HTMLDivElement,
  WidgetProgressTiersBarProps
>(({ className, tiers, total, ...props }, ref) => {
  const sum = total ?? tiers.reduce((acc, t) => acc + t.value, 0);

  return (
    <div
      ref={ref}
      className={cn('flex h-6 w-full overflow-hidden rounded px-6', className)}
      {...props}
    >
      <div className="flex h-full w-full overflow-hidden rounded border border-transparent">
        {tiers.map((tier, index) => {
          const pct = sum > 0 ? (tier.value / sum) * 100 : 0;
          return (
            <div
              key={index}
              className="h-full transition-all"
              style={{
                width: `${pct}%`,
                backgroundColor: tier.color,
              }}
              title={`${tier.label}: ${tier.value}`}
            />
          );
        })}
      </div>
    </div>
  );
});
WidgetProgressTiersBar.displayName = 'WidgetProgressTiersBar';

const WidgetProgressTiersLegend = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-wrap gap-x-4 gap-y-1 px-6 py-2', className)}
    {...props}
  />
));
WidgetProgressTiersLegend.displayName = 'WidgetProgressTiersLegend';

export interface WidgetProgressTiersLegendItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  color: string;
  label: string;
  value?: string | number;
}

const WidgetProgressTiersLegendItem = React.forwardRef<
  HTMLDivElement,
  WidgetProgressTiersLegendItemProps
>(({ className, color, label, value, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center gap-1.5 text-xs', className)}
    {...props}
  >
    <div
      className="h-2 w-2 flex-shrink-0 rounded-sm"
      style={{ backgroundColor: color }}
    />
    <span className="text-foreground">{label}</span>
    {value !== undefined && (
      <span className="font-semibold tabular-nums">{value}</span>
    )}
  </div>
));
WidgetProgressTiersLegendItem.displayName = 'WidgetProgressTiersLegendItem';

const WidgetProgressTiersFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('border-t border-border px-6 py-2 text-xs', className)}
    {...props}
  />
));
WidgetProgressTiersFooter.displayName = 'WidgetProgressTiersFooter';

export {
  WidgetProgressTiers,
  WidgetProgressTiersHeader,
  WidgetProgressTiersTitle,
  WidgetProgressTiersIcon,
  WidgetProgressTiersBar,
  WidgetProgressTiersLegend,
  WidgetProgressTiersLegendItem,
  WidgetProgressTiersFooter,
};
