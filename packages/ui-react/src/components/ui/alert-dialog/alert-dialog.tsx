import * as React from 'react';
import { AlertDialog as AlertDialogPrimitive } from '@base-ui/react/alert-dialog';

import { usePortalContainer } from '@/lib/portal-container';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

// Ported from the legacy shadcn UI kit's `alert-dialog`, which already used
// `@base-ui/react`'s AlertDialog (imported here via the `/alert-dialog`
// subpath, matching this package's `dialog.tsx` wrapping pattern) — so this
// port is mostly a token pass, not a primitive swap. No `--ui-alert-dialog-*`
// tier exists yet, so this design-pending v1 themes from the shared semantic
// tokens:
//   • overlay  -> bg-[var(--ui-background-backdrop-screen)] (legacy hard-coded
//     `bg-black/80`, a raw un-tokenized value)
//   • popup    -> bg-background + border-border + text-foreground
//   • description -> text-muted-foreground (unchanged from legacy — already
//     token-based)
// The popup's enter/exit transform+animation classes are copied from this
// package's own `dialog.tsx` (translate -50%/-50% + zoom/fade via
// `tw-animate-css`) rather than the legacy version's slide-from-top variant,
// which depended on a `dialog-offset` Tailwind theme value that only existed
// in the legacy shadcn UI kit's Tailwind preset and has no ui-react equivalent.
// `AlertDialogAction`/`AlertDialogCancel` reuse this package's `buttonVariants`;
// ui-react's Button has no `outline` variant (unlike legacy shadcn), so
// `AlertDialogCancel` uses `secondary` — the closest bordered/neutral analog.
// Reconcile with `/figma-component AlertDialog <url> --update` once a mockup
// lands.

// AlertDialogPrimitive.Root is the provider — re-export as the plain
// `AlertDialog` name callers expect (avoids a naming collision with the
// `AlertDialogPrimitive` namespace import above).
const AlertDialogRoot = AlertDialogPrimitive.Root;

const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogPortal = AlertDialogPrimitive.Portal;

const AlertDialogOverlay = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Backdrop>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Backdrop>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Backdrop
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-[var(--ui-background-backdrop-screen)] duration-200 data-[open]:animate-in data-[open]:fade-in-0 data-[closed]:animate-out data-[closed]:fade-out-0',
      className
    )}
    {...props}
  />
));
AlertDialogOverlay.displayName = 'AlertDialogOverlay';

export interface AlertDialogContentProps extends React.ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Popup
> {
  /**
   * Render the content inside a portal (default `true`). Base UI requires the
   * Popup to sit in a Portal for correct stacking; set `false` for inline usage
   * (e.g. in tests).
   */
  portal?: boolean;
  /** Portal container. Pass a shadow-root mount for isolated-style previews. */
  portalContainer?: AlertDialogPrimitive.Portal.Props['container'];
  /** Keep the content mounted while closed (Base UI `Portal` prop). */
  keepMounted?: AlertDialogPrimitive.Portal.Props['keepMounted'];
}

const AlertDialogContent = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Popup>,
  AlertDialogContentProps
>(
  (
    { className, portal = true, portalContainer, keepMounted, ...props },
    ref
  ) => {
    const ctxContainer = usePortalContainer();
    const resolvedContainer = portalContainer ?? ctxContainer;
    const popup = (
      <>
        <AlertDialogOverlay />
        <AlertDialogPrimitive.Popup
          ref={ref}
          className={cn(
            'fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg border border-border bg-background p-6 text-foreground shadow-lg duration-200 data-[open]:animate-in data-[open]:fade-in-0 data-[open]:zoom-in-95 data-[closed]:animate-out data-[closed]:fade-out-0 data-[closed]:zoom-out-95',
            className
          )}
          {...props}
        />
      </>
    );

    return portal ? (
      <AlertDialogPrimitive.Portal
        container={resolvedContainer}
        keepMounted={keepMounted}
      >
        {popup}
      </AlertDialogPrimitive.Portal>
    ) : (
      popup
    );
  }
);
AlertDialogContent.displayName = 'AlertDialogContent';

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-2 text-center sm:text-start',
      className
    )}
    {...props}
  />
);
AlertDialogHeader.displayName = 'AlertDialogHeader';

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className
    )}
    {...props}
  />
);
AlertDialogFooter.displayName = 'AlertDialogFooter';

const AlertDialogTitle = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold text-foreground', className)}
    {...props}
  />
));
AlertDialogTitle.displayName = 'AlertDialogTitle';

const AlertDialogDescription = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
AlertDialogDescription.displayName = 'AlertDialogDescription';

// Base UI has no dedicated Action/Cancel — both become styled Close buttons.
const AlertDialogAction = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Close>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Close
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
));
AlertDialogAction.displayName = 'AlertDialogAction';

const AlertDialogCancel = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Close>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Close
    ref={ref}
    className={cn(
      buttonVariants({ variant: 'secondary' }),
      'mt-2 sm:mt-0',
      className
    )}
    {...props}
  />
));
AlertDialogCancel.displayName = 'AlertDialogCancel';

export {
  AlertDialogRoot as AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
