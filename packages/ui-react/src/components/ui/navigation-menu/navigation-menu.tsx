import * as React from 'react';
import { NavigationMenu as NavigationMenuPrimitive } from '@base-ui/react/navigation-menu';
import { ChevronDownIcon } from '@constructor-lab/icons-react/stroke-mono';
import { cva } from 'class-variance-authority';

import { usePortalContainer } from '@/lib/portal-container';
import { cn } from '@/lib/utils';

// Ported from the legacy shadcn UI kit's `navigation-menu`, which used
// `@radix-ui/react-navigation-menu`. Rebuilt on the Base UI NavigationMenu
// primitive (keyboard/hover/click activation, focus management, positioning,
// ARIA come from Base UI). No `--ui-navigation-menu-*` tier exists yet, so this
// design-pending v1 themes from the shared semantic tokens:
//   • trigger idle/hover/open -> hover:bg-accent hover:text-accent-foreground,
//     data-[popup-open]:bg-accent/50 data-[popup-open]:text-accent-foreground
//   • floating surface (was Radix's `bg-popover`, which has no ui-react bridge)
//     -> bg-background (--ui-background-surface-primary) + border-border +
//     text-foreground, matching the Popover port
//   • focus ring -> the standard `--ui-focus-primary` ring
//
// Structural adaptation (Base UI's parts differ from Radix's, but every
// exported name below is preserved so demos resolve unchanged):
//   • Root/List/Item/Trigger/Content/Link map directly to their Base UI
//     namesakes. Trigger's chevron uses Base UI's own `Icon` part (tracks the
//     open state itself) instead of a `group`/`group-data-*` pairing.
//   • Radix's single `Viewport` primitive (an inline, non-portaled node
//     absolutely positioned under the menu bar) has no 1:1 Base UI equivalent
//     — Base UI's floating architecture requires an explicit
//     Portal > Positioner > Popup > Viewport composition instead. This file's
//     `NavigationMenuViewport` wraps that whole composition (and is what
//     `NavigationMenu` auto-renders after `children`, exactly like the Radix
//     version did), so callers keep using it as a single opaque part.
//   • Radix's `data-state="open"/"closed"` + `data-motion="from-start"/…`
//     become Base UI's presence attributes: `data-open`/`data-closed` (popup),
//     `data-popup-open` (trigger), and `data-activation-direction="left"/"right"`
//     (content, replacing `data-motion`).
//   • `NavigationMenuIndicator` maps to Base UI's `Arrow` part. Radix rendered
//     it as a `NavigationMenuList` sibling; Base UI's Arrow must live inside
//     the Positioner subtree, so `NavigationMenuViewport` renders it there
//     automatically — the export is kept for API parity / advanced reuse.
//   • Radix exposed `--radix-navigation-menu-viewport-{width,height}` CSS vars
//     for a smoothly animated viewport resize; Base UI 1.4 has no equivalent,
//     so the popup snaps to each panel's size instead of tweening it.
// Reconcile with `/figma-component NavigationMenu <url> --update` once a
// mockup lands.

const NavigationMenu = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root> & {
    /**
     * Portal container for the floating menu surface. Defaults to the container
     * from `PortalContainerProvider` (or `document.body`); pass a shadow-root
     * mount for isolated-style previews.
     */
    portalContainer?: NavigationMenuPrimitive.Portal.Props['container'];
  }
>(({ className, children, portalContainer, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn(
      'relative z-10 flex max-w-max flex-1 items-center justify-center',
      className
    )}
    {...props}
  >
    {children}
    <NavigationMenuViewport portalContainer={portalContainer} />
  </NavigationMenuPrimitive.Root>
));
NavigationMenu.displayName = 'NavigationMenu';

const NavigationMenuList = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn(
      'group flex flex-1 list-none items-center justify-center space-x-1',
      className
    )}
    {...props}
  />
));
NavigationMenuList.displayName = 'NavigationMenuList';

const NavigationMenuItem = NavigationMenuPrimitive.Item;

const navigationMenuTriggerStyle = cva(
  'group inline-flex h-10 w-max cursor-pointer items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[popup-open]:bg-accent/50 data-[popup-open]:text-accent-foreground data-[popup-open]:hover:bg-accent'
);

const NavigationMenuTrigger = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), className)}
    {...props}
  >
    {children}
    <NavigationMenuPrimitive.Icon className="relative top-px ms-1 transition-transform duration-200 data-[popup-open]:rotate-180">
      <ChevronDownIcon size={12} />
    </NavigationMenuPrimitive.Icon>
  </NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName = 'NavigationMenuTrigger';

const NavigationMenuContent = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      'start-0 top-0 w-full data-[starting-style]:animate-in data-[ending-style]:animate-out data-[starting-style]:fade-in data-[ending-style]:fade-out data-[activation-direction=right]:data-[starting-style]:slide-in-from-right-52 data-[activation-direction=left]:data-[starting-style]:slide-in-from-left-52 data-[activation-direction=right]:data-[ending-style]:slide-out-to-right-52 data-[activation-direction=left]:data-[ending-style]:slide-out-to-left-52 md:absolute md:w-auto',
      className
    )}
    {...props}
  />
));
NavigationMenuContent.displayName = 'NavigationMenuContent';

const NavigationMenuLink = NavigationMenuPrimitive.Link;

const NavigationMenuIndicator = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Arrow>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Arrow>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Arrow
    ref={ref}
    className={cn(
      'z-[1] flex data-[side=bottom]:-top-2 data-[closed]:animate-out data-[closed]:fade-out data-[open]:animate-in data-[open]:fade-in',
      className
    )}
    {...props}
  >
    <div className="h-2 w-2 rotate-45 rounded-ss-sm border-s border-t border-border bg-background shadow-md" />
  </NavigationMenuPrimitive.Arrow>
));
NavigationMenuIndicator.displayName = 'NavigationMenuIndicator';

const NavigationMenuViewport = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport> & {
    /** Portal container — pass a shadow-root mount for isolated-style previews. */
    portalContainer?: NavigationMenuPrimitive.Portal.Props['container'];
  }
>(({ className, portalContainer, ...props }, ref) => {
  const ctxContainer = usePortalContainer();
  const resolvedContainer = portalContainer ?? ctxContainer;

  return (
    <NavigationMenuPrimitive.Portal container={resolvedContainer}>
      <NavigationMenuPrimitive.Positioner className="z-[1]" sideOffset={6}>
        <NavigationMenuIndicator />
        <NavigationMenuPrimitive.Popup
          className={cn(
            'relative w-full origin-top overflow-hidden rounded-md border border-border bg-background text-foreground shadow-lg duration-200 data-[open]:animate-in data-[closed]:animate-out data-[open]:fade-in-0 data-[closed]:fade-out-0 data-[open]:zoom-in-90 data-[closed]:zoom-out-95 md:w-max'
          )}
        >
          <NavigationMenuPrimitive.Viewport
            ref={ref}
            className={cn('relative', className)}
            {...props}
          />
        </NavigationMenuPrimitive.Popup>
      </NavigationMenuPrimitive.Positioner>
    </NavigationMenuPrimitive.Portal>
  );
});
NavigationMenuViewport.displayName = 'NavigationMenuViewport';

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
};
