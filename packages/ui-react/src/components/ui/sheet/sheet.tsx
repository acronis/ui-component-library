import * as React from 'react';
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { TimesIcon } from '@constructor-lab/icons-react/stroke-mono';
import { cva, type VariantProps } from 'class-variance-authority';

import { usePortalContainer } from '@/lib/portal-container';
import { cn } from '@/lib/utils';

// Initial version ported from the legacy shadcn UI kit's `sheet`. A modal
// side panel — the same Base UI Dialog primitive the `Dialog` component uses
// (keyboard, focus
// trap, scroll lock, ARIA come from Base UI), but anchored to a screen edge with
// a slide transition. In the Vue kit this was `Details`; it's re-exported under
// `Details*` aliases for a 1:1 drop-in. No `--ui-sheet-*` token tier exists yet,
// so this design-pending v1 mirrors the Dialog family's semantic theming:
//   • overlay  -> var(--ui-background-backdrop-screen)
//   • panel    -> bg-muted        = --ui-background-surface-secondary
//   • header / footer -> bg-background = --ui-background-surface-primary bars,
//     divided by border-border
//   • title    -> text-foreground / description -> text-muted-foreground
//   • close    -> text-muted-foreground → hover text-foreground, focus ring
//     var(--ui-focus-primary)
// Enter/exit slide animations use `tw-animate-css` (imported in styles/index.css),
// keyed to Base UI's data-[open] / data-[closed] state attributes. Reconcile
// against the real design with `/figma-component Sheet <url> --update`
// (Cyber-Compliance node 3442-31542) once the mockup is ready for dev.

const sheetVariants = cva(
  'fixed z-50 flex flex-col overflow-hidden bg-muted text-foreground shadow-lg duration-300 data-[open]:animate-in data-[closed]:animate-out',
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 max-h-[80vh] border-b border-border data-[open]:slide-in-from-top data-[closed]:slide-out-to-top',
        bottom:
          'inset-x-0 bottom-0 max-h-[80vh] border-t border-border data-[open]:slide-in-from-bottom data-[closed]:slide-out-to-bottom',
        // `left`/`right` anchor to a fixed physical edge in every locale.
        left: 'inset-y-0 left-0 h-full w-3/4 border-r border-border data-[open]:slide-in-from-left data-[closed]:slide-out-to-left sm:max-w-md',
        right:
          'inset-y-0 right-0 h-full w-3/4 border-l border-border data-[open]:slide-in-from-right data-[closed]:slide-out-to-right sm:max-w-md',
        // `start`/`end` are direction-aware: they anchor to the inline-start /
        // inline-end edge, so a panel flips sides (and slide direction) under RTL.
        start:
          'inset-y-0 start-0 h-full w-3/4 border-e border-border ltr:data-[open]:slide-in-from-left rtl:data-[open]:slide-in-from-right ltr:data-[closed]:slide-out-to-left rtl:data-[closed]:slide-out-to-right sm:max-w-md',
        end: 'inset-y-0 end-0 h-full w-3/4 border-s border-border ltr:data-[open]:slide-in-from-right rtl:data-[open]:slide-in-from-left ltr:data-[closed]:slide-out-to-right rtl:data-[closed]:slide-out-to-left sm:max-w-md',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  }
);

const Sheet = DialogPrimitive.Root;

const SheetTrigger = DialogPrimitive.Trigger;

const SheetPortal = DialogPrimitive.Portal;

const SheetClose = DialogPrimitive.Close;

const SheetOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Backdrop>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Backdrop>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Backdrop
    ref={ref}
    className={cn(
      // duration-300 matches the panel slide (sheetVariants). If the backdrop
      // fade finishes earlier than the panel, Base UI keeps the dialog mounted
      // for the longer panel exit while the backdrop reverts to its resting
      // opacity — a one-frame flash on close. Keep the two exits the same length.
      'fixed inset-0 z-50 bg-[var(--ui-background-backdrop-screen)] duration-300 data-[open]:animate-in data-[open]:fade-in-0 data-[closed]:animate-out data-[closed]:fade-out-0',
      className
    )}
    {...props}
  />
));
SheetOverlay.displayName = 'SheetOverlay';

export interface SheetContentProps
  extends
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Popup>,
    VariantProps<typeof sheetVariants> {
  /**
   * Edge the panel anchors to. Defaults to `right`. `top`/`bottom` are
   * full-width; `left`/`right` anchor to a fixed physical edge; `start`/`end`
   * are direction-aware (inline-start / inline-end) and flip under RTL — prefer
   * these for locale-agnostic layouts.
   */
  side?: VariantProps<typeof sheetVariants>['side'];
  /**
   * Render the content inside a portal (default `true`). Base UI requires the
   * Popup to sit in a Portal for correct stacking; set `false` for inline usage
   * (e.g. when the caller supplies its own `SheetPortal`, or in tests).
   */
  portal?: boolean;
  /**
   * Portal container. Pass a shadow-root mount for isolated-style previews
   * (the docs demos do this via `useShadowMount`).
   */
  portalContainer?: DialogPrimitive.Portal.Props['container'];
  /** Keep the content mounted while closed (Base UI `Portal` prop). */
  keepMounted?: DialogPrimitive.Portal.Props['keepMounted'];
}

const SheetContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Popup>,
  SheetContentProps
>(
  (
    {
      className,
      children,
      side,
      portal = true,
      portalContainer,
      keepMounted,
      ...props
    },
    ref
  ) => {
    const ctxContainer = usePortalContainer();
    const resolvedContainer = portalContainer ?? ctxContainer;
    const popup = (
      <>
        <SheetOverlay />
        <DialogPrimitive.Popup
          ref={ref}
          className={cn(sheetVariants({ side }), className)}
          {...props}
        >
          {children}
        </DialogPrimitive.Popup>
      </>
    );

    return portal ? (
      <DialogPrimitive.Portal
        container={resolvedContainer}
        keepMounted={keepMounted}
      >
        {popup}
      </DialogPrimitive.Portal>
    ) : (
      popup
    );
  }
);
SheetContent.displayName = 'SheetContent';

const SheetHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex h-16 shrink-0 items-center gap-4 border-b border-border bg-background px-5 py-4',
      className
    )}
    {...props}
  />
));
SheetHeader.displayName = 'SheetHeader';

const SheetFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex h-16 shrink-0 items-center justify-end gap-4 border-t border-border bg-background px-6 py-4',
      className
    )}
    {...props}
  />
));
SheetFooter.displayName = 'SheetFooter';

const SheetBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-1 overflow-auto p-6', className)}
    {...props}
  />
));
SheetBody.displayName = 'SheetBody';

const SheetTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'flex-1 text-lg font-semibold leading-7 text-foreground',
      className
    )}
    {...props}
  />
));
SheetTitle.displayName = 'SheetTitle';

const SheetDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
SheetDescription.displayName = 'SheetDescription';

const SheetCloseButton = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Close
    ref={ref}
    className={cn(
      'rounded p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-primary)] disabled:pointer-events-none',
      className
    )}
    {...props}
  >
    <TimesIcon size={24} />
    <span className="sr-only">Close</span>
  </DialogPrimitive.Close>
));
SheetCloseButton.displayName = 'SheetCloseButton';

export {
  Sheet,
  SheetTrigger,
  SheetPortal,
  SheetClose,
  SheetCloseButton,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetBody,
  SheetTitle,
  SheetDescription,
  sheetVariants,
};
