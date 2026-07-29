import * as React from 'react';
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { TimesIcon } from '@constructor-lab/icons-react/stroke-mono';
import { cva, type VariantProps } from 'class-variance-authority';

import { usePortalContainer } from '@/lib/portal-container';
import { cn } from '@/lib/utils';

// A modal overlay built on the Base UI Dialog primitive (keyboard, focus trap,
// scroll lock, ARIA come from Base UI). Reconciled against Figma (node
// 6343:58898) — themed from the dedicated `--ui-dialog-*` tier
// (`@constructor-lab/tokens`):
//   • overlay   -> var(--ui-background-backdrop-screen)
//   • container -> --ui-dialog-container-{color,border-radius,width-min}
//     (surface-secondary fill, 8px radius, 256px min-width)
//   • header    -> --ui-dialog-header-{color,border-color,border-width,gap,
//     height,padding-x} (white bar, divider border, 64px tall, 16px pad-x);
//     title -> --ui-dialog-header-title-color
//   • body      -> --ui-dialog-body-{gap,padding-y,height-min} (72px min-height,
//     16px vertical pad, 12px gap, content vertically centered)
//   • close     -> text-muted-foreground → hover text-foreground, focus ring
//     var(--ui-focus-primary)
// The footer keeps the shared semantic vocabulary (bg-background + border-border,
// same white/divider values) — Figma's separate Footer tier has no
// `--ui-footer-*` counterpart in `tokens` yet.
// The Figma component set also enumerates content recipes (rename / discard-
// changes / save-changes / reset-password / accept / read-only) and a loading
// overlay; those are compositions over these parts (see the `confirm-dialog`
// composite and the dialog patterns), not props on this primitive.
// Enter/exit animations use `tw-animate-css` (imported in styles/index.css),
// keyed to Base UI's data-[open] / data-[closed] state attributes — overlay
// fades, popup fades + zooms.

// Popup width scale. `sm` (512) and `md` (632) are token-backed by the design
// (`--ui-dialog-container-size-{sm,md}`); `xs`/`lg`/`xl`/`2xl` remain plain
// max-widths pending token definitions. `sm` is the default.
const dialogContentVariants = cva(
  'fixed left-1/2 top-1/2 z-50 flex w-full min-w-[var(--ui-dialog-container-width-min)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[var(--ui-dialog-container-border-radius)] bg-[var(--ui-dialog-container-color)] text-foreground shadow-lg duration-200 data-[open]:animate-in data-[open]:fade-in-0 data-[open]:zoom-in-95 data-[closed]:animate-out data-[closed]:fade-out-0 data-[closed]:zoom-out-95',
  {
    variants: {
      size: {
        xs: 'max-w-[464px]',
        sm: 'max-w-[var(--ui-dialog-container-size-sm)]',
        md: 'max-w-[var(--ui-dialog-container-size-md)]',
        lg: 'max-w-[832px]',
        xl: 'max-w-[992px]',
        '2xl': 'max-w-[1136px]',
      },
    },
    defaultVariants: {
      size: 'sm',
    },
  }
);

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Backdrop>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Backdrop>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Backdrop
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-[var(--ui-background-backdrop-screen)] duration-200 data-[open]:animate-in data-[open]:fade-in-0 data-[closed]:animate-out data-[closed]:fade-out-0',
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = 'DialogOverlay';

export interface DialogContentProps
  extends
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Popup>,
    VariantProps<typeof dialogContentVariants> {
  /**
   * Popup max-width. `sm` 512 · `xs` 464 · `md` 632 · `lg` 832 · `xl` 992 ·
   * `2xl` 1136 (px). Defaults to `sm`.
   */
  size?: VariantProps<typeof dialogContentVariants>['size'];
  /**
   * Render the content inside a portal (default `true`). Base UI requires the
   * Popup to sit in a Portal for correct stacking; set `false` for inline usage
   * (e.g. when the caller supplies its own `DialogPortal`, or in tests).
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

const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Popup>,
  DialogContentProps
>(
  (
    {
      className,
      children,
      size,
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
        <DialogOverlay />
        <DialogPrimitive.Popup
          ref={ref}
          className={cn(dialogContentVariants({ size }), className)}
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
DialogContent.displayName = 'DialogContent';

const DialogHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex h-[var(--ui-dialog-header-height)] items-center gap-[var(--ui-dialog-header-gap)] border-b-[length:var(--ui-dialog-header-border-width)] border-solid border-[var(--ui-dialog-header-border-color)] bg-[var(--ui-dialog-header-color)] px-[var(--ui-dialog-header-padding-x)]',
      className
    )}
    {...props}
  />
));
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex h-16 items-center justify-end gap-4 border-t border-border bg-background px-4',
      className
    )}
    {...props}
  />
));
DialogFooter.displayName = 'DialogFooter';

const DialogBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex min-h-[var(--ui-dialog-body-height-min)] flex-1 flex-col justify-center gap-[var(--ui-dialog-body-gap)] overflow-auto px-4 py-[var(--ui-dialog-body-padding-y)]',
      className
    )}
    {...props}
  />
));
DialogBody.displayName = 'DialogBody';

const DialogTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'flex-1 text-2xl font-normal leading-8 text-[var(--ui-dialog-header-title-color)]',
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = 'DialogTitle';

const DialogDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
DialogDescription.displayName = 'DialogDescription';

const DialogCloseButton = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Close
    ref={ref}
    className={cn(
      'rounded p-1 cursor-pointer text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-primary)] disabled:pointer-events-none',
      className
    )}
    {...props}
  >
    <TimesIcon size={24} />
    <span className="sr-only">Close</span>
  </DialogPrimitive.Close>
));
DialogCloseButton.displayName = 'DialogCloseButton';

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogCloseButton,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogBody,
  DialogDescription,
  dialogContentVariants,
};
