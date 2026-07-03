import * as React from 'react';

import { cn } from '@/lib/utils';

// Composable dashboard-widget protection-summary parts, ported from
// `@spec-lab/shadcn-uikit`'s `widget-protection-summary`
// (packages/ui-legacy/src/components/ui/widget-protection-summary.tsx). Plain
// styled elements — no Base UI primitive. No `--ui-widget-protection-summary-*`
// tier exists yet, so this design-pending v1 themes the chrome from the shared
// semantic vocabulary (same root/header/icon mapping as `widget-placeholder`
// and `widget-protection-status`):
//   • root      -> border-border + bg-background + text-foreground
//   • icon (was --av-fixed-link) -> text-secondary (the brand action blue)
//   • interactive hover/active -> bg-accent (surface-hover) /
//     surface-active; focus -> the standard 3px --ui-focus-primary ring
//   • divider / footer border (was --av-brand-accent) -> border-border;
//     footer caption -> text-muted-foreground (matches widget-placeholder's
//     footer, a deliberate de-emphasis not present in the legacy source)
//   • row status dot -> mirrors the Alert component's status vocabulary
//     (packages/ui-react/src/components/ui/alert/alert.tsx), one tier up in
//     saturation: the dot is a solid swatch (was the raw `--av-chart-*` chart
//     colors), so it uses `--ui-background-status-strong-<status>` rather than
//     Alert's pale `--ui-background-status-*` fill or `--ui-border-on-status-*`
//     border — the same "strong" tier DataTable/Calendar use for saturated
//     fills. Matches `widget-protection-status`'s indicator dot.
// Reconcile with `/figma-component WidgetProtectionSummary <url> --update`
// once a mockup lands (Figma: Charts-anatomy / Protection-Summary, node
// 538:78584).

export interface WidgetProtectionSummaryProps
  extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

const WidgetProtectionSummary = React.forwardRef<
  HTMLDivElement,
  WidgetProtectionSummaryProps
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
WidgetProtectionSummary.displayName = 'WidgetProtectionSummary';

const WidgetProtectionSummaryHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center gap-2 px-6 pt-4 pb-2', className)}
    {...props}
  />
));
WidgetProtectionSummaryHeader.displayName = 'WidgetProtectionSummaryHeader';

const WidgetProtectionSummaryTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-1 truncate text-sm font-semibold leading-6', className)}
    {...props}
  />
));
WidgetProtectionSummaryTitle.displayName = 'WidgetProtectionSummaryTitle';

const WidgetProtectionSummaryIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-shrink-0 text-secondary [&>svg]:size-4', className)}
    {...props}
  />
));
WidgetProtectionSummaryIcon.displayName = 'WidgetProtectionSummaryIcon';

const WidgetProtectionSummaryContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-1 flex-col gap-2 px-6 py-2', className)}
    {...props}
  />
));
WidgetProtectionSummaryContent.displayName = 'WidgetProtectionSummaryContent';

type ProtectionStatusTone =
  | 'success'
  | 'warning'
  | 'critical'
  | 'danger'
  | 'info'
  | 'neutral';

export interface WidgetProtectionSummaryRowProps
  extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  status?: ProtectionStatusTone;
}

// Solid swatch color per status — see the file-level doc comment for why this
// is the "strong" background tier rather than Alert's border/glyph roles.
const statusIndicatorDotClasses: Record<ProtectionStatusTone, string> = {
  success: 'bg-[var(--ui-background-status-strong-success)]',
  warning: 'bg-[var(--ui-background-status-strong-warning)]',
  critical: 'bg-[var(--ui-background-status-strong-critical)]',
  danger: 'bg-[var(--ui-background-status-strong-danger)]',
  info: 'bg-[var(--ui-background-status-strong-info)]',
  neutral: 'bg-[var(--ui-background-status-strong-neutral)]',
};

const WidgetProtectionSummaryRow = React.forwardRef<
  HTMLDivElement,
  WidgetProtectionSummaryRowProps
>(({ className, label, value, status, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex items-center justify-between py-1', className)}
      {...props}
    >
      <div className="flex items-center gap-2 text-sm">
        {status && (
          <div
            className={cn(
              'h-2 w-2 flex-shrink-0 rounded-full',
              statusIndicatorDotClasses[status]
            )}
          />
        )}
        <span>{label}</span>
      </div>
      <span className="text-sm font-semibold tabular-nums">{value}</span>
    </div>
  );
});
WidgetProtectionSummaryRow.displayName = 'WidgetProtectionSummaryRow';

const WidgetProtectionSummaryDivider = React.forwardRef<
  HTMLHRElement,
  React.HTMLAttributes<HTMLHRElement>
>(({ className, ...props }, ref) => (
  <hr
    ref={ref}
    className={cn('mx-6 border-t border-border', className)}
    {...props}
  />
));
WidgetProtectionSummaryDivider.displayName = 'WidgetProtectionSummaryDivider';

const WidgetProtectionSummaryFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'border-t border-border px-6 py-2 text-xs text-muted-foreground',
      className
    )}
    {...props}
  />
));
WidgetProtectionSummaryFooter.displayName = 'WidgetProtectionSummaryFooter';

export {
  WidgetProtectionSummary,
  WidgetProtectionSummaryHeader,
  WidgetProtectionSummaryTitle,
  WidgetProtectionSummaryIcon,
  WidgetProtectionSummaryContent,
  WidgetProtectionSummaryRow,
  WidgetProtectionSummaryDivider,
  WidgetProtectionSummaryFooter,
};
