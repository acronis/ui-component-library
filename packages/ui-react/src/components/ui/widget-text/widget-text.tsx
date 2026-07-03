import * as React from 'react';

import { cn } from '@/lib/utils';

// WidgetText — text-based dashboard metric widget, ported from
// `@spec-lab/shadcn-uikit`'s `widget-text`
// (packages/ui-legacy/src/components/ui/widget-text.tsx). Plain styled
// elements — no Base UI primitive. No `--ui-widget-text-*` tier exists yet,
// so this design-pending v1 themes from the shared semantic vocabulary
// (mirroring the widget-placeholder reference port):
//   • root      -> border-border + bg-background + text-foreground (legacy's
//     `--av-brand-light` border / `--av-inversed-primary` surface have no
//     bridged equivalent — approximated with the neutral surface/border pair)
//   • icon (was --av-fixed-link, the action-blue accent) -> text-secondary
//   • divider (was --av-brand-accent) -> border-border
//   • footer fine print -> text-muted-foreground (consistent with
//     widget-placeholder's footer, deviating slightly from legacy's
//     unstyled/inherited color)
//   • trend up/down/neutral (was --av-chart-success/-danger/-neutral, a
//     token tier that doesn't exist here) -> --ui-text-on-status-success /
//     -danger / -neutral, the same "status color directly on a plain
//     surface" role Toast and ProgressCircle already use
//   • interactive hover/active -> bg-accent / --ui-background-surface-active
//     ; focus -> the standard 3px --ui-focus-primary ring
// Reconcile with `/figma-component WidgetText <url> --update` once a mockup
// lands (Figma: Charts-anatomy / Text-Widgets, node 829:95739).

export interface WidgetTextProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

const WidgetText = React.forwardRef<HTMLDivElement, WidgetTextProps>(
  ({ className, interactive, ...props }, ref) => (
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
  )
);
WidgetText.displayName = 'WidgetText';

const WidgetTextHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center gap-2 px-6 pt-4 pb-2', className)}
    {...props}
  />
));
WidgetTextHeader.displayName = 'WidgetTextHeader';

const WidgetTextTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-1 truncate text-sm font-semibold leading-6', className)}
    {...props}
  />
));
WidgetTextTitle.displayName = 'WidgetTextTitle';

const WidgetTextIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-shrink-0 text-secondary [&>svg]:h-4 [&>svg]:w-4', className)}
    {...props}
  />
));
WidgetTextIcon.displayName = 'WidgetTextIcon';

const WidgetTextContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-1 flex flex-col gap-1 px-6 py-2', className)}
    {...props}
  />
));
WidgetTextContent.displayName = 'WidgetTextContent';

const WidgetTextValue = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-2xl font-semibold leading-8 tabular-nums', className)}
    {...props}
  />
));
WidgetTextValue.displayName = 'WidgetTextValue';

const WidgetTextLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('text-sm leading-6', className)} {...props} />
));
WidgetTextLabel.displayName = 'WidgetTextLabel';

export interface WidgetTextTrendProps
  extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'up' | 'down' | 'neutral';
}

const WidgetTextTrend = React.forwardRef<HTMLDivElement, WidgetTextTrendProps>(
  ({ className, direction = 'neutral', children, ...props }, ref) => {
    const colorMap: Record<string, string> = {
      up: 'text-[var(--ui-text-on-status-success)]',
      down: 'text-[var(--ui-text-on-status-danger)]',
      neutral: 'text-[var(--ui-text-on-status-neutral)]',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-1 text-sm font-semibold',
          colorMap[direction],
          className
        )}
        {...props}
      >
        {direction === 'up' && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6 2L10 7H2L6 2Z" fill="currentColor" />
          </svg>
        )}
        {direction === 'down' && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6 10L2 5H10L6 10Z" fill="currentColor" />
          </svg>
        )}
        {children}
      </div>
    );
  }
);
WidgetTextTrend.displayName = 'WidgetTextTrend';

const WidgetTextDivider = React.forwardRef<
  HTMLHRElement,
  React.HTMLAttributes<HTMLHRElement>
>(({ className, ...props }, ref) => (
  <hr
    ref={ref}
    className={cn('border-t border-border mx-6', className)}
    {...props}
  />
));
WidgetTextDivider.displayName = 'WidgetTextDivider';

const WidgetTextFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('px-6 pb-4 pt-0 text-xs text-muted-foreground', className)}
    {...props}
  />
));
WidgetTextFooter.displayName = 'WidgetTextFooter';

export {
  WidgetText,
  WidgetTextHeader,
  WidgetTextTitle,
  WidgetTextIcon,
  WidgetTextContent,
  WidgetTextValue,
  WidgetTextLabel,
  WidgetTextTrend,
  WidgetTextDivider,
  WidgetTextFooter,
};
