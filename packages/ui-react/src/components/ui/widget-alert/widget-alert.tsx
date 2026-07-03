import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// WidgetAlert — dashboard alert-notification widget, ported from
// `@spec-lab/shadcn-uikit`'s `widget-alert`
// (packages/ui-legacy/src/components/ui/widget-alert.tsx). No
// `--ui-widget-alert-*` tier exists yet, so this design-pending v1 themes its
// per-variant surface from the same status vocabulary the Alert component
// uses (packages/ui-react/src/components/ui/alert/alert.tsx):
//   • surface -> --ui-background-status-*   (pale per-status fill)
//   • border  -> --ui-border-on-status-*    (subtle per-status border)
//   • body text (was --av-fixed-primary)    -> text-foreground
//   • action icon (was --av-brand-primary, the action-blue accent) ->
//     text-secondary
//   • interactive hover/active -> bg-accent / --ui-background-surface-active
//     (a neutral affordance, same treatment as widget-placeholder — legacy's
//     own interactive hover also overrode the status tint uniformly)
//   • focus -> the standard --ui-focus-primary ring
// Legacy's variant set is `info | success | warning | danger` (no
// `destructive`/`critical`/`neutral`/`ai`); kept 1:1 since that's the ported
// contract.
// Reconcile with `/figma-component WidgetAlert <url> --update` once a mockup
// lands (Figma: Charts-anatomy / Alert-Widget, node 201:65481).

const widgetAlertVariants = cva(
  'relative flex items-start rounded-lg border transition-colors',
  {
    variants: {
      variant: {
        info: 'bg-[var(--ui-background-status-info)] border-[var(--ui-border-on-status-info)]',
        success:
          'bg-[var(--ui-background-status-success)] border-[var(--ui-border-on-status-success)]',
        warning:
          'bg-[var(--ui-background-status-warning)] border-[var(--ui-border-on-status-warning)]',
        danger:
          'bg-[var(--ui-background-status-danger)] border-[var(--ui-border-on-status-danger)]',
      },
      interactive: {
        true: 'cursor-pointer hover:bg-accent active:bg-[var(--ui-background-surface-active)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ui-focus-primary)]',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'info',
      interactive: false,
    },
  }
);

export interface WidgetAlertProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof widgetAlertVariants> {}

const WidgetAlert = React.forwardRef<HTMLDivElement, WidgetAlertProps>(
  ({ className, variant, interactive, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      tabIndex={interactive ? 0 : undefined}
      className={cn(widgetAlertVariants({ variant, interactive }), className)}
      {...props}
    />
  )
);
WidgetAlert.displayName = 'WidgetAlert';

const WidgetAlertIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex-shrink-0 flex items-start pl-6 pt-4 [&>svg]:h-4 [&>svg]:w-4',
      className
    )}
    {...props}
  />
));
WidgetAlertIcon.displayName = 'WidgetAlertIcon';

const WidgetAlertContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex-1 flex flex-col gap-2 px-4 py-4 min-w-0 text-foreground',
      className
    )}
    {...props}
  />
));
WidgetAlertContent.displayName = 'WidgetAlertContent';

const WidgetAlertTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm font-semibold leading-6 truncate', className)}
    {...props}
  />
));
WidgetAlertTitle.displayName = 'WidgetAlertTitle';

const WidgetAlertDate = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm leading-6 text-foreground', className)}
    {...props}
  />
));
WidgetAlertDate.displayName = 'WidgetAlertDate';

const WidgetAlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm leading-6 text-foreground', className)}
    {...props}
  />
));
WidgetAlertDescription.displayName = 'WidgetAlertDescription';

const WidgetAlertActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex-shrink-0 flex items-start pr-6 pt-4 text-secondary [&>svg]:h-4 [&>svg]:w-4',
      className
    )}
    {...props}
  />
));
WidgetAlertActions.displayName = 'WidgetAlertActions';

export {
  WidgetAlert,
  WidgetAlertIcon,
  WidgetAlertContent,
  WidgetAlertTitle,
  WidgetAlertDate,
  WidgetAlertDescription,
  WidgetAlertActions,
  widgetAlertVariants,
};
