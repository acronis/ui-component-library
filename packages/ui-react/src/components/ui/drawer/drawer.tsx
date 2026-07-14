import * as React from 'react';
import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer';
import { TimesIcon } from '@spec-lab/icons-react/stroke-mono';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// Design-pending v1 wrapping Base UI's `Drawer` primitive — a panel that slides
// in from a screen edge with swipe-to-dismiss gestures (Base UI provides the
// keyboard, focus trap, scroll lock, ARIA, and the drag physics; Drawer extends
// Dialog). Standalone from `Sheet`, which is a plain positioned Dialog with no
// gesture support. No `--ui-drawer-*` token tier exists yet, so this mirrors the
// Sheet/Dialog family's semantic theming:
//   • backdrop -> var(--ui-background-backdrop-screen)
//   • panel    -> bg-muted        = --ui-background-surface-secondary
//   • header / footer -> bg-background = --ui-background-surface-primary bars,
//     divided by border-border
//   • title    -> text-foreground / description -> text-muted-foreground
//   • close    -> text-muted-foreground → hover text-foreground, focus ring
//     var(--ui-focus-primary)
//   • swipe-area handle -> border-border bar
// The `side` prop picks the edge and is mapped to Base UI's Root `swipeDirection`
// (bottom→'down', top→'up', left→'left', right→'right'); the Popup transform
// tracks Base UI's `--drawer-swipe-movement-x/y` vars and the enter/exit
// translate is keyed to the `data-[starting-style]` / `data-[ending-style]`
// attributes Base UI exposes. Reconcile against the real design with
// `/figma-component Drawer <url> --update` once a mockup is ready for dev.

export type DrawerSide = 'top' | 'bottom' | 'left' | 'right';

const SIDE_TO_SWIPE_DIRECTION = {
  top: 'up',
  bottom: 'down',
  left: 'left',
  right: 'right',
} as const satisfies Record<
  DrawerSide,
  DrawerPrimitive.Root.Props['swipeDirection']
>;

// The edge is a Base UI *Root* concern (`swipeDirection` lives on Root), so the
// root wrapper is the source of truth and publishes it to the content parts.
const DrawerSideContext = React.createContext<DrawerSide>('bottom');

// Viewport alignment: a full-screen flex box that pins the popup to the edge.
const drawerViewportVariants = cva('fixed inset-0 z-50 flex', {
  variants: {
    side: {
      top: 'items-start justify-center',
      bottom: 'items-end justify-center',
      left: 'items-stretch justify-start',
      right: 'items-stretch justify-end',
    },
  },
  defaultVariants: { side: 'bottom' },
});

// The sliding panel. Idle transform follows Base UI's swipe-movement vars; the
// enter/exit offset is the full off-screen translate keyed to the transition
// data attributes. `left`/`right` anchor to a fixed physical edge in every locale.
const drawerPopupVariants = cva(
  'relative z-50 flex flex-col overflow-hidden bg-muted text-foreground shadow-lg outline-none will-change-transform transition-transform duration-300 ease-out data-[swiping]:duration-0',
  {
    variants: {
      side: {
        top: 'w-full max-h-[80vh] border-b border-border [transform:translateY(var(--drawer-swipe-movement-y))] data-[starting-style]:[transform:translateY(-100%)] data-[ending-style]:[transform:translateY(-100%)]',
        bottom:
          'w-full max-h-[80vh] border-t border-border [transform:translateY(var(--drawer-swipe-movement-y))] data-[starting-style]:[transform:translateY(100%)] data-[ending-style]:[transform:translateY(100%)]',
        left: 'h-full w-3/4 border-r border-border sm:max-w-md [transform:translateX(var(--drawer-swipe-movement-x))] data-[starting-style]:[transform:translateX(-100%)] data-[ending-style]:[transform:translateX(-100%)]',
        right:
          'h-full w-3/4 border-l border-border sm:max-w-md [transform:translateX(var(--drawer-swipe-movement-x))] data-[starting-style]:[transform:translateX(100%)] data-[ending-style]:[transform:translateX(100%)]',
      },
    },
    defaultVariants: { side: 'bottom' },
  }
);

export interface DrawerProps extends DrawerPrimitive.Root.Props {
  /**
   * Screen edge the panel anchors to and slides in from. Maps to Base UI's
   * `swipeDirection` (`bottom`→`down`, `top`→`up`, `left`/`right` unchanged) and
   * is shared with `DrawerContent` for positioning. Defaults to `bottom`.
   */
  side?: DrawerSide;
}

/**
 * Root of the drawer. Owns the open state (Base UI `Drawer.Root`) and the `side`
 * edge, which it maps to `swipeDirection` and publishes to the content parts.
 */
function Drawer({
  side = 'bottom',
  swipeDirection,
  children,
  ...props
}: DrawerProps) {
  return (
    <DrawerSideContext value={side}>
      <DrawerPrimitive.Root
        swipeDirection={swipeDirection ?? SIDE_TO_SWIPE_DIRECTION[side]}
        {...props}
      >
        {children}
      </DrawerPrimitive.Root>
    </DrawerSideContext>
  );
}
Drawer.displayName = 'Drawer';

const DrawerTrigger = DrawerPrimitive.Trigger;

const DrawerPortal = DrawerPrimitive.Portal;

const DrawerClose = DrawerPrimitive.Close;

const DrawerProvider = DrawerPrimitive.Provider;

const DrawerBackdrop = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Backdrop>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Backdrop>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Backdrop
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-[var(--ui-background-backdrop-screen)] transition-opacity duration-200 data-[swiping]:duration-0 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0',
      className
    )}
    {...props}
  />
));
DrawerBackdrop.displayName = 'DrawerBackdrop';

export interface DrawerViewportProps
  extends
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Viewport>,
    VariantProps<typeof drawerViewportVariants> {
  /** Edge to pin the popup to. Falls back to the root `Drawer` `side`. */
  side?: DrawerSide;
}

const DrawerViewport = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Viewport>,
  DrawerViewportProps
>(({ className, side, ...props }, ref) => {
  const contextSide = React.use(DrawerSideContext);
  return (
    <DrawerPrimitive.Viewport
      ref={ref}
      className={cn(
        drawerViewportVariants({ side: side ?? contextSide }),
        className
      )}
      {...props}
    />
  );
});
DrawerViewport.displayName = 'DrawerViewport';

export interface DrawerPopupProps
  extends
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Popup>,
    VariantProps<typeof drawerPopupVariants> {
  /** Edge the panel anchors to. Falls back to the root `Drawer` `side`. */
  side?: DrawerSide;
}

const DrawerPopup = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Popup>,
  DrawerPopupProps
>(({ className, side, ...props }, ref) => {
  const contextSide = React.use(DrawerSideContext);
  return (
    <DrawerPrimitive.Popup
      ref={ref}
      className={cn(
        drawerPopupVariants({ side: side ?? contextSide }),
        className
      )}
      {...props}
    />
  );
});
DrawerPopup.displayName = 'DrawerPopup';

export interface DrawerContentProps extends DrawerPopupProps {
  /**
   * Render the content inside a portal (default `true`). Base UI requires the
   * Popup to sit in a Portal for correct stacking; set `false` for inline usage
   * (e.g. when the caller supplies its own `DrawerPortal`, or in tests).
   */
  portal?: boolean;
  /**
   * Portal container. Pass a shadow-root mount for isolated-style previews
   * (the docs demos do this via `useShadowMount`).
   */
  portalContainer?: DrawerPrimitive.Portal.Props['container'];
  /** Keep the content mounted while closed (Base UI `Portal` prop). */
  keepMounted?: DrawerPrimitive.Portal.Props['keepMounted'];
}

/**
 * Batteries-included panel: renders the backdrop, the edge-pinning viewport, and
 * the sliding popup (in a portal by default), mirroring `SheetContent`. Compose
 * header / body / footer parts as children.
 */
const DrawerContent = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Popup>,
  DrawerContentProps
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
    const contextSide = React.use(DrawerSideContext);
    const resolvedSide = side ?? contextSide;
    const popup = (
      <>
        <DrawerBackdrop />
        <DrawerViewport side={resolvedSide}>
          <DrawerPopup
            ref={ref}
            side={resolvedSide}
            className={className}
            {...props}
          >
            {children}
          </DrawerPopup>
        </DrawerViewport>
      </>
    );

    return portal ? (
      <DrawerPortal container={portalContainer} keepMounted={keepMounted}>
        {popup}
      </DrawerPortal>
    ) : (
      popup
    );
  }
);
DrawerContent.displayName = 'DrawerContent';

const DrawerHeader = React.forwardRef<
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
DrawerHeader.displayName = 'DrawerHeader';

const DrawerFooter = React.forwardRef<
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
DrawerFooter.displayName = 'DrawerFooter';

const DrawerBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-1 overflow-auto p-6', className)}
    {...props}
  />
));
DrawerBody.displayName = 'DrawerBody';

const DrawerTitle = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      'flex-1 text-lg font-semibold leading-7 text-foreground',
      className
    )}
    {...props}
  />
));
DrawerTitle.displayName = 'DrawerTitle';

const DrawerDescription = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
DrawerDescription.displayName = 'DrawerDescription';

// Base UI's swipe-to-open gesture area, styled as a visible grab handle. Renders
// a centered bar tinted with `border-border`.
const DrawerSwipeArea = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.SwipeArea>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.SwipeArea>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.SwipeArea
    ref={ref}
    className={cn(
      'mx-auto my-3 h-1 w-12 shrink-0 rounded-full bg-border',
      className
    )}
    {...props}
  />
));
DrawerSwipeArea.displayName = 'DrawerSwipeArea';

const DrawerCloseButton = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Close>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Close
    ref={ref}
    className={cn(
      'rounded p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-primary)] disabled:pointer-events-none',
      className
    )}
    {...props}
  >
    <TimesIcon size={24} />
    <span className="sr-only">Close</span>
  </DrawerPrimitive.Close>
));
DrawerCloseButton.displayName = 'DrawerCloseButton';

export {
  Drawer,
  DrawerTrigger,
  DrawerPortal,
  DrawerProvider,
  DrawerClose,
  DrawerCloseButton,
  DrawerBackdrop,
  DrawerViewport,
  DrawerPopup,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerBody,
  DrawerTitle,
  DrawerDescription,
  DrawerSwipeArea,
  drawerPopupVariants,
  drawerViewportVariants,
};
