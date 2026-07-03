import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { TimesIcon } from '@spec-lab/icons-react/stroke-mono';

import { cn } from '@/lib/utils';

// Ported from the legacy shadcn UI kit's `alert` and reconciled with the Figma
// "Alert" set (node 4313-4953): a rounded banner with a subtle status border, a
// pale status surface, foreground text, a status-tinted icon, and an optional
// dismiss (×) button. No Base UI primitive — semantic markup with `role="alert"`.
// Each variant maps to the `--ui-*` status tokens by role (matching the design's
// variables):
//   • border  -> --ui-border-on-status-*      (pastel, subtle)
//   • surface -> --ui-background-status-*      (pale fill)
//   • icon / close glyph -> --ui-glyph-on-status-*
//   • close hover surface -> --ui-background-status-*-hover
// `destructive` uses the `danger` tokens; Figma's `Unknown` type is `neutral`.
// (This retheme fixes drift: the border/icon previously used the saturated
// `--ui-background-status-strong-*` fill instead of the border/glyph roles.)
const alertVariants = cva(
  'relative flex w-full items-start gap-3 rounded-md border p-4 text-foreground',
  {
    variants: {
      variant: {
        info: 'border-[var(--ui-border-on-status-info)] bg-[var(--ui-background-status-info)] [&_[data-slot=alert-icon]]:text-[var(--ui-glyph-on-status-info)] [&_[data-slot=alert-close]]:border-[var(--ui-border-on-status-info)] [&_[data-slot=alert-close]]:text-[var(--ui-glyph-on-status-info)] [&_[data-slot=alert-close]]:hover:bg-[var(--ui-background-status-info-hover)]',
        success:
          'border-[var(--ui-border-on-status-success)] bg-[var(--ui-background-status-success)] [&_[data-slot=alert-icon]]:text-[var(--ui-glyph-on-status-success)] [&_[data-slot=alert-close]]:border-[var(--ui-border-on-status-success)] [&_[data-slot=alert-close]]:text-[var(--ui-glyph-on-status-success)] [&_[data-slot=alert-close]]:hover:bg-[var(--ui-background-status-success-hover)]',
        warning:
          'border-[var(--ui-border-on-status-warning)] bg-[var(--ui-background-status-warning)] [&_[data-slot=alert-icon]]:text-[var(--ui-glyph-on-status-warning)] [&_[data-slot=alert-close]]:border-[var(--ui-border-on-status-warning)] [&_[data-slot=alert-close]]:text-[var(--ui-glyph-on-status-warning)] [&_[data-slot=alert-close]]:hover:bg-[var(--ui-background-status-warning-hover)]',
        critical:
          'border-[var(--ui-border-on-status-critical)] bg-[var(--ui-background-status-critical)] [&_[data-slot=alert-icon]]:text-[var(--ui-glyph-on-status-critical)] [&_[data-slot=alert-close]]:border-[var(--ui-border-on-status-critical)] [&_[data-slot=alert-close]]:text-[var(--ui-glyph-on-status-critical)] [&_[data-slot=alert-close]]:hover:bg-[var(--ui-background-status-critical-hover)]',
        destructive:
          'border-[var(--ui-border-on-status-danger)] bg-[var(--ui-background-status-danger)] [&_[data-slot=alert-icon]]:text-[var(--ui-glyph-on-status-danger)] [&_[data-slot=alert-close]]:border-[var(--ui-border-on-status-danger)] [&_[data-slot=alert-close]]:text-[var(--ui-glyph-on-status-danger)] [&_[data-slot=alert-close]]:hover:bg-[var(--ui-background-status-danger-hover)]',
        neutral:
          'border-[var(--ui-border-on-status-neutral)] bg-[var(--ui-background-status-neutral)] [&_[data-slot=alert-icon]]:text-[var(--ui-glyph-on-status-neutral)] [&_[data-slot=alert-close]]:border-[var(--ui-border-on-status-neutral)] [&_[data-slot=alert-close]]:text-[var(--ui-glyph-on-status-neutral)] [&_[data-slot=alert-close]]:hover:bg-[var(--ui-background-status-neutral-hover)]',
        // ai border is the pale violet --ui-border-on-status-ai (= palette
        // violet-4, #e4cced); note --ui-border-on-status-ai-strong is the ai
        // *gradient*, not a border color.
        ai: 'border-[var(--ui-border-on-status-ai)] bg-[var(--ui-background-status-ai)] [&_[data-slot=alert-icon]]:text-[var(--ui-glyph-on-status-ai)] [&_[data-slot=alert-close]]:border-[var(--ui-border-on-status-ai)] [&_[data-slot=alert-close]]:text-[var(--ui-glyph-on-status-ai)] [&_[data-slot=alert-close]]:hover:bg-[var(--ui-background-status-ai-hover)]',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      data-slot="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
);
Alert.displayName = 'Alert';

const AlertIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  // Color is set by the Alert variant (targets [data-slot=alert-icon]). The icon
  // sits in a line-height-matched box (h-6 = leading-6) and is centered in it, so
  // it optically aligns with the first line of the title/description.
  <div
    ref={ref}
    data-slot="alert-icon"
    className={cn('flex h-6 shrink-0 items-center', className)}
    {...props}
  />
));
AlertIcon.displayName = 'AlertIcon';

const AlertContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="alert-content"
    className={cn('flex min-w-0 flex-1 flex-col gap-0.5', className)}
    {...props}
  />
));
AlertContent.displayName = 'AlertContent';

const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    data-slot="alert-title"
    className={cn('mb-0 text-sm font-semibold leading-6', className)}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="alert-description"
    className={cn('text-sm font-normal leading-6', className)}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';

// Action slot for alert buttons. Two placements (see the Figma): as a direct
// child of Alert after AlertContent it sits at the right edge (AlertContent is
// flex-1) — add `self-center` to center it vertically; placed inside AlertContent
// (under the description) it flows below the text.
const AlertActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="alert-actions"
    className={cn('flex items-center gap-2', className)}
    {...props}
  />
));
AlertActions.displayName = 'AlertActions';

// Optional dismiss button (the design's `Dismissable`). A full-height cell at the
// right edge with a left-border divider and a centered × — its divider, glyph,
// and hover surface are tinted by the Alert variant (targets
// [data-slot=alert-close]). The negative `-my-4 -mr-4` cancel the Alert's `p-4`
// so the cell spans edge-to-edge; wire onClick to hide the alert. Defaults to a
// 16px × icon and an accessible label ("Dismiss").
const AlertClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, 'aria-label': ariaLabel = 'Dismiss', ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    aria-label={ariaLabel}
    data-slot="alert-close"
    className={cn(
      '-my-4 -mr-4 flex shrink-0 items-center justify-center self-stretch rounded-r-md border-l px-4 outline-none transition-colors focus-visible:relative focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ui-focus-primary)]',
      className
    )}
    {...props}
  >
    {children ?? <TimesIcon size={16} />}
  </button>
));
AlertClose.displayName = 'AlertClose';

export {
  Alert,
  AlertIcon,
  AlertContent,
  AlertTitle,
  AlertDescription,
  AlertActions,
  AlertClose,
};
