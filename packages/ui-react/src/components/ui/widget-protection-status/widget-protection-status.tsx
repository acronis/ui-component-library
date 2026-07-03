import * as React from 'react';

import { cn } from '@/lib/utils';

// Composable dashboard-widget protection-status parts, ported from
// `@spec-lab/shadcn-uikit`'s `widget-protection-status`
// (packages/ui-legacy/src/components/ui/widget-protection-status.tsx). Plain
// styled elements — no Base UI primitive. No `--ui-widget-protection-status-*`
// tier exists yet, so this design-pending v1 themes the chrome from the shared
// semantic vocabulary (same root/header/icon mapping as `widget-placeholder`):
//   • root      -> border-border + bg-background + text-foreground
//   • icon (was --av-fixed-link) -> text-secondary (the brand action blue)
//   • interactive hover/active -> bg-accent (surface-hover) /
//     surface-active; focus -> the standard 3px --ui-focus-primary ring
//   • footer border (was --av-brand-accent) -> border-border; caption ->
//     text-muted-foreground (matches widget-placeholder's footer, a
//     deliberate de-emphasis not present in the legacy source)
//   • status indicator dot -> mirrors the Alert component's status vocabulary
//     (packages/ui-react/src/components/ui/alert/alert.tsx), one tier up in
//     saturation: the dot is a solid swatch (was the raw `--av-chart-*` chart
//     colors), so it uses `--ui-background-status-strong-<status>` rather than
//     Alert's pale `--ui-background-status-*` fill or `--ui-border-on-status-*`
//     border — the same "strong" tier DataTable/Calendar use for saturated fills.
// Reconcile with `/figma-component WidgetProtectionStatus <url> --update` once
// a mockup lands (Figma: Charts-anatomy / Protection-Status, node 533:75562).

export interface WidgetProtectionStatusProps
  extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

const WidgetProtectionStatus = React.forwardRef<
  HTMLDivElement,
  WidgetProtectionStatusProps
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
WidgetProtectionStatus.displayName = 'WidgetProtectionStatus';

const WidgetProtectionStatusHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center gap-2 px-6 pt-4 pb-2', className)}
    {...props}
  />
));
WidgetProtectionStatusHeader.displayName = 'WidgetProtectionStatusHeader';

const WidgetProtectionStatusTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-1 truncate text-sm font-semibold leading-6', className)}
    {...props}
  />
));
WidgetProtectionStatusTitle.displayName = 'WidgetProtectionStatusTitle';

const WidgetProtectionStatusIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-shrink-0 text-secondary [&>svg]:size-4', className)}
    {...props}
  />
));
WidgetProtectionStatusIcon.displayName = 'WidgetProtectionStatusIcon';

const WidgetProtectionStatusContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-1 flex-col gap-2 px-6 py-2', className)}
    {...props}
  />
));
WidgetProtectionStatusContent.displayName = 'WidgetProtectionStatusContent';

type ProtectionStatusTone =
  | 'success'
  | 'warning'
  | 'critical'
  | 'danger'
  | 'info'
  | 'neutral';

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

const WidgetProtectionStatusIndicator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    status?: ProtectionStatusTone;
  }
>(({ className, status = 'success', ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex items-center gap-2', className)}
      {...props}
    >
      <div
        className={cn(
          'h-3 w-3 flex-shrink-0 rounded-full',
          statusIndicatorDotClasses[status]
        )}
      />
      {props.children}
    </div>
  );
});
WidgetProtectionStatusIndicator.displayName = 'WidgetProtectionStatusIndicator';

const WidgetProtectionStatusValue = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-2xl font-semibold leading-8 tabular-nums', className)}
    {...props}
  />
));
WidgetProtectionStatusValue.displayName = 'WidgetProtectionStatusValue';

const WidgetProtectionStatusLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('text-sm leading-6', className)} {...props} />
));
WidgetProtectionStatusLabel.displayName = 'WidgetProtectionStatusLabel';

const WidgetProtectionStatusFooter = React.forwardRef<
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
WidgetProtectionStatusFooter.displayName = 'WidgetProtectionStatusFooter';

export {
  WidgetProtectionStatus,
  WidgetProtectionStatusHeader,
  WidgetProtectionStatusTitle,
  WidgetProtectionStatusIcon,
  WidgetProtectionStatusContent,
  WidgetProtectionStatusIndicator,
  WidgetProtectionStatusValue,
  WidgetProtectionStatusLabel,
  WidgetProtectionStatusFooter,
};
