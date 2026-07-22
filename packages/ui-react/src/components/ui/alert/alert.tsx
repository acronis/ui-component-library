import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  CircleCheckGreenIcon,
  CircleInfoBlueIcon,
  CircleMinusGrayIcon,
  CircleWarningOrangeIcon,
  DiamondWarningRedIcon,
  TriangleWarningYellowIcon,
} from '@constructor-lab/icons-react/stroke-multi';
import { AcronisAiMultiIcon } from '@constructor-lab/icons-react/solid-multi';
import { TimesIcon } from '@constructor-lab/icons-react/stroke-mono';

import { cn } from '@/lib/utils';

// Reconciled with the redesigned Figma "Alert" set (node 6768-67288): a white
// surface (bg-background) with a strong status border, a full-height 6px left
// accent bar in the strong status color, a variant-driven full-color status
// icon, foreground text, and an optional compact dismiss button. No Base UI
// primitive — semantic markup with `role="alert"`.
//
// The `variant` drives the root border (--ui-border-on-status-*-strong) and the
// accent bar / default icon. `ai` has no solid `-strong` border or background —
// it uses the pale --ui-border-on-status-ai for the border and the ai gradient
// (--ui-border-on-status-ai-strong) for the accent bar.
const alertVariants = cva(
  'relative flex w-full items-stretch overflow-hidden rounded-lg border border-solid bg-background text-foreground',
  {
    variants: {
      variant: {
        info: 'border-[var(--ui-border-on-status-info-strong)]',
        success: 'border-[var(--ui-border-on-status-success-strong)]',
        warning: 'border-[var(--ui-border-on-status-warning-strong)]',
        critical: 'border-[var(--ui-border-on-status-critical-strong)]',
        destructive: 'border-[var(--ui-border-on-status-danger-strong)]',
        neutral: 'border-[var(--ui-border-on-status-neutral-strong)]',
        // ai has no solid strong border — use the pale one.
        ai: 'border-[var(--ui-border-on-status-ai)]',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
);

type AlertVariant = NonNullable<VariantProps<typeof alertVariants>['variant']>;

// The full-height 6px left accent bar, colored by the strong status background.
const ACCENT_BAR: Record<AlertVariant, string> = {
  info: 'bg-[var(--ui-background-status-strong-info)]',
  success: 'bg-[var(--ui-background-status-strong-success)]',
  warning: 'bg-[var(--ui-background-status-strong-warning)]',
  critical: 'bg-[var(--ui-background-status-strong-critical)]',
  destructive: 'bg-[var(--ui-background-status-strong-danger)]',
  neutral: 'bg-[var(--ui-background-status-strong-neutral)]',
  // ai gradient — there is no --ui-background-status-strong-ai.
  ai: 'bg-[var(--ui-border-on-status-ai-strong)]',
};

// The full-color status icon rendered by default for each variant. The AlertIcon
// slot can still override it via children.
const VARIANT_ICON: Record<AlertVariant, React.ReactNode> = {
  info: <CircleInfoBlueIcon size={16} />,
  success: <CircleCheckGreenIcon size={16} />,
  warning: <TriangleWarningYellowIcon size={16} />,
  critical: <CircleWarningOrangeIcon size={16} />,
  destructive: <DiamondWarningRedIcon size={16} />,
  neutral: <CircleMinusGrayIcon size={16} />,
  ai: <AcronisAiMultiIcon size={16} />,
};

const AlertVariantContext = React.createContext<AlertVariant>('info');

export interface AlertProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, children, ...props }, ref) => {
    const resolved: AlertVariant = variant ?? 'info';
    return (
      <AlertVariantContext value={resolved}>
        <div
          ref={ref}
          role="alert"
          data-slot="alert"
          className={cn(alertVariants({ variant }), className)}
          {...props}
        >
          <span
            aria-hidden
            data-slot="alert-accent"
            className={cn('w-1.5 shrink-0 self-stretch', ACCENT_BAR[resolved])}
          />
          <div
            data-slot="alert-body"
            className="flex min-w-0 flex-1 items-start gap-3 p-4"
          >
            {children}
          </div>
        </div>
      </AlertVariantContext>
    );
  }
);
Alert.displayName = 'Alert';

// Leading status-icon slot. When empty it renders the variant's default
// full-color icon (read from context); pass children to override it. The icon
// sits in a line-height-matched box (h-6 = leading-6) so it optically aligns
// with the first line of the title/description. Full-color icons — no text-color
// class here.
const AlertIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const variant = React.use(AlertVariantContext);
  return (
    <div
      ref={ref}
      data-slot="alert-icon"
      className={cn('flex h-6 shrink-0 items-center [&_svg]:size-4', className)}
      {...props}
    >
      {children ?? VARIANT_ICON[variant]}
    </div>
  );
});
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

// Optional dismiss button (the design's `Dismissable`) — a compact 32px
// ButtonIcon with a neutral glyph, a hover surface, and a focus ring. Wire its
// onClick to hide the alert. Defaults to a 16px × icon and an accessible label
// ("Dismiss").
const AlertClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(
  (
    { className, children, 'aria-label': ariaLabel = 'Dismiss', ...props },
    ref
  ) => (
    <button
      ref={ref}
      type="button"
      aria-label={ariaLabel}
      data-slot="alert-close"
      className={cn(
        'flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-primary)]',
        className
      )}
      {...props}
    >
      {children ?? <TimesIcon size={16} />}
    </button>
  )
);
AlertClose.displayName = 'AlertClose';

export {
  Alert,
  AlertIcon,
  AlertContent,
  AlertTitle,
  AlertDescription,
  AlertActions,
  AlertClose,
  alertVariants,
};
