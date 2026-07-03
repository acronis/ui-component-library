import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// Dashboard-widget container for charts, progress indicators, and data
// displays, ported from `@spec-lab/shadcn-uikit`'s `widget`
// (packages/ui-legacy/src/components/ui/widget.tsx). Plain styled elements —
// no Base UI primitive, mirroring the sibling `widget-placeholder` port. No
// `--ui-widget-*` tier exists yet, so this design-pending v1 themes from the
// shared semantic vocabulary:
//   • root surface/text (was --av-inversed-primary / --av-fixed-primary) ->
//     bg-background / text-foreground; border -> border-border (a bare
//     `border` is transparent here, unlike legacy's Tailwind config)
//   • icon/actions (was --av-fixed-link / --av-brand-primary, both the brand
//     action blue) -> text-secondary
//   • label text (was --av-fixed-primary) -> text-foreground
//   • divider (was --av-brand-accent, a brand tint) -> border-border (no
//     accent-border token exists; matches the divider convention used by
//     `accordion`/`app-shell`)
//   • interactive hover/active -> hover:bg-accent / active surface; focus ->
//     the standard 2px --ui-focus-primary outline (matches widget-placeholder)
// Anatomy:
// - Widget (root container)
//   - WidgetHeader (title row with optional icon and actions)
//     - WidgetIcon
//     - WidgetTitle
//     - WidgetActions (dropdown trigger, etc.)
//   - WidgetContent (main visualization area)
//   - WidgetFooter (optional legend, labels, or actions)
// Reconcile with `/figma-component Widget <url> --update` once a mockup lands
// (Figma: Charts-anatomy design system).

const widgetVariants = cva(
  'relative flex flex-col rounded-lg border border-border bg-background text-foreground transition-colors',
  {
    variants: {
      size: {
        sm: 'min-h-[112px]',
        md: 'min-h-[176px]',
        lg: 'min-h-[240px]',
        xl: 'min-h-[352px]',
      },
      interactive: {
        true: 'cursor-pointer hover:bg-accent active:bg-[var(--ui-background-surface-active)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ui-focus-primary)]',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      interactive: false,
    },
  }
);

export interface WidgetProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof widgetVariants> {}

const Widget = React.forwardRef<HTMLDivElement, WidgetProps>(
  ({ className, size, interactive, ...props }, ref) => (
    <div
      ref={ref}
      tabIndex={interactive ? 0 : undefined}
      className={cn(widgetVariants({ size, interactive }), className)}
      {...props}
    />
  )
);
Widget.displayName = 'Widget';

const WidgetHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center gap-2 px-6 pb-0 pt-4', className)}
    {...props}
  />
));
WidgetHeader.displayName = 'WidgetHeader';

const WidgetIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-shrink-0 text-secondary [&>svg]:size-4', className)}
    {...props}
  />
));
WidgetIcon.displayName = 'WidgetIcon';

const WidgetTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-1 truncate text-sm font-semibold leading-6', className)}
    {...props}
  />
));
WidgetTitle.displayName = 'WidgetTitle';

const WidgetActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex flex-shrink-0 items-center gap-1 text-secondary [&>svg]:size-4',
      className
    )}
    {...props}
  />
));
WidgetActions.displayName = 'WidgetActions';

const WidgetContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex-1 px-6 py-2', className)} {...props} />
));
WidgetContent.displayName = 'WidgetContent';

const WidgetFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('px-6 pb-4 pt-0', className)} {...props} />
));
WidgetFooter.displayName = 'WidgetFooter';

const WidgetValue = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-2xl font-semibold leading-8 tabular-nums', className)}
    {...props}
  />
));
WidgetValue.displayName = 'WidgetValue';

const WidgetLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm leading-6 text-foreground', className)}
    {...props}
  />
));
WidgetLabel.displayName = 'WidgetLabel';

const WidgetDivider = React.forwardRef<
  HTMLHRElement,
  React.HTMLAttributes<HTMLHRElement>
>(({ className, ...props }, ref) => (
  <hr
    ref={ref}
    className={cn('mx-6 border-t border-border', className)}
    {...props}
  />
));
WidgetDivider.displayName = 'WidgetDivider';

export {
  Widget,
  WidgetHeader,
  WidgetIcon,
  WidgetTitle,
  WidgetActions,
  WidgetContent,
  WidgetFooter,
  WidgetValue,
  WidgetLabel,
  WidgetDivider,
  widgetVariants,
};
