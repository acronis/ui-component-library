import * as React from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';

import { cn } from '@/lib/utils';

// The full-page application scaffold from the Figma layouts (Basic layout
// node 6226-24149, Inner page node 6226-24150): a left sidebar column (holds
// SidebarPrimary, optionally one or two SidebarSecondary panels) beside a body
// column of a sticky header (the page title / breadcrumbs + actions) over the
// scrolling main content, and an optional right-hand panel column (the "Acronis
// AI" chat rail). Layout-only — the rich parts come from SidebarPrimary /
// SidebarSecondary / PageHeader / the chat UI placed inside these slots. Surfaces
// use the shared `--ui-*` tokens (bg-background / border-border; a bare `border`
// is transparent in ui-react, so borders name `border-border`).
//
// The one piece of shared state is the right panel's THREE-way state — `docked`
// (a fixed-width rail), `collapsed` (a ~48px icon rail), and `full` (the panel
// fills the body, which is hidden). Because two siblings coordinate (the panel
// sizes itself; the body hides on `full`), the state lives on the AppShell root
// and is shared via context. AppShellPanel + AppShellBody read it via
// `data-state`; `AppShellPanelTrigger` (and the `useAppShell` hook) write it.

export type AppShellPanelState = 'docked' | 'collapsed' | 'full';

interface AppShellContextValue {
  panelState: AppShellPanelState;
  setPanelState: (state: AppShellPanelState) => void;
}

const AppShellContext = React.createContext<AppShellContextValue | null>(null);

/**
 * Read/write the right-hand panel (AI/chat rail) state. Returns a sensible
 * default (`docked`, no-op setter) outside an `AppShell`, so parts render
 * standalone in isolation tests / stories.
 */
export function useAppShell(): AppShellContextValue {
  return (
    React.use(AppShellContext) ?? {
      panelState: 'docked',
      setPanelState: () => {},
    }
  );
}

/**
 * Controlled + uncontrolled state (the Base UI idiom). When `controlled` is
 * provided it wins and the setter only emits the change callback; otherwise the
 * setter updates internal state. `onChange` is ALWAYS invoked with the next value.
 */
function useControllableState<T>(
  controlled: T | undefined,
  defaultValue: T,
  onChange?: (next: T) => void
): [T, (next: T) => void] {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const isControlled = controlled !== undefined;
  const value = isControlled ? controlled : uncontrolled;
  const setValue = React.useCallback(
    (next: T) => {
      if (!isControlled) setUncontrolled(next);
      onChange?.(next);
    },
    [isControlled, onChange]
  );
  return [value, setValue];
}

export interface AppShellProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Controlled state of the right-hand AI/chat panel. */
  panelState?: AppShellPanelState;
  /** Uncontrolled initial panel state. Defaults to `docked`. */
  defaultPanelState?: AppShellPanelState;
  /** Fires when the panel state changes (e.g. a trigger flips it). */
  onPanelStateChange?: (state: AppShellPanelState) => void;
}

const AppShell = React.forwardRef<HTMLDivElement, AppShellProps>(
  (
    {
      className,
      panelState: panelStateProp,
      defaultPanelState = 'docked',
      onPanelStateChange,
      ...props
    },
    ref
  ) => {
    const [panelState, setPanelState] =
      useControllableState<AppShellPanelState>(
        panelStateProp,
        defaultPanelState,
        onPanelStateChange
      );
    const context = React.useMemo<AppShellContextValue>(
      () => ({ panelState, setPanelState }),
      [panelState, setPanelState]
    );
    return (
      <AppShellContext value={context}>
        <div
          ref={ref}
          data-slot="app-shell"
          data-panel-state={panelState}
          className={cn('flex min-h-screen w-full bg-background', className)}
          {...props}
        />
      </AppShellContext>
    );
  }
);
AppShell.displayName = 'AppShell';

const AppShellSidebar = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <aside
    ref={ref}
    data-slot="app-shell-sidebar"
    className={cn('flex shrink-0', className)}
    {...props}
  />
));
AppShellSidebar.displayName = 'AppShellSidebar';

const AppShellBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  // The body yields the whole content area to the panel when it goes `full` —
  // it is hidden (not unmounted) so its scroll position / form state survive a
  // round-trip back to `docked`.
  const { panelState } = useAppShell();
  return (
    <div
      ref={ref}
      data-slot="app-shell-body"
      className={cn(
        'flex min-w-0 flex-1 flex-col',
        panelState === 'full' && 'hidden',
        className
      )}
      {...props}
    />
  );
});
AppShellBody.displayName = 'AppShellBody';

const AppShellHeader = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <header
    ref={ref}
    data-slot="app-shell-header"
    className={cn(
      'sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b border-border bg-background px-6',
      className
    )}
    {...props}
  />
));
AppShellHeader.displayName = 'AppShellHeader';

const AppShellMain = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <main
    ref={ref}
    data-slot="app-shell-main"
    className={cn('flex-1 overflow-auto', className)}
    {...props}
  />
));
AppShellMain.displayName = 'AppShellMain';

const AppShellFooter = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <footer
    ref={ref}
    data-slot="app-shell-footer"
    className={cn(
      'shrink-0 border-t border-border bg-background px-6 py-4',
      className
    )}
    {...props}
  />
));
AppShellFooter.displayName = 'AppShellFooter';

// The right-hand rail column — the "Acronis AI" / chat panel that sits beside the
// body (Figma right column). Layout-only, like AppShellSidebar, but its width is
// driven by the shared panel state via `data-state`: `collapsed` → a ~48px icon
// rail, `docked` → a fixed rail (`w-80`, override with `className`), `full` → it
// grows to fill the body (which AppShellBody hides). Its content — a slotted
// header + AppShellPanelContent (docked/full) + AppShellPanelCollapsed (the rail)
// — is toggled by the same `data-state` selectors, so it is SSR-present.
const AppShellPanel = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => {
  const { panelState } = useAppShell();
  return (
    <aside
      ref={ref}
      data-slot="app-shell-panel"
      data-state={panelState}
      className={cn(
        'group/panel flex shrink-0 flex-col border-l border-border bg-background transition-[width]',
        'w-12 data-[state=docked]:w-80 data-[state=full]:w-auto data-[state=full]:grow',
        className
      )}
      {...props}
    />
  );
});
AppShellPanel.displayName = 'AppShellPanel';

// The panel's full-size content (header / transcript / composer). Shown when the
// panel is `docked` or `full`; hidden in the collapsed rail.
const AppShellPanelContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="app-shell-panel-content"
    className={cn(
      'flex min-h-0 flex-1 flex-col group-data-[state=collapsed]/panel:hidden',
      className
    )}
    {...props}
  />
));
AppShellPanelContent.displayName = 'AppShellPanelContent';

// The collapsed icon rail (e.g. a single "open Acronis AI" button). Shown only
// when the panel is `collapsed`.
const AppShellPanelCollapsed = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="app-shell-panel-collapsed"
    className={cn(
      'hidden flex-col items-center gap-2 py-3 group-data-[state=collapsed]/panel:flex',
      className
    )}
    {...props}
  />
));
AppShellPanelCollapsed.displayName = 'AppShellPanelCollapsed';

export interface AppShellPanelTriggerProps extends React.ComponentPropsWithoutRef<'button'> {
  /** The panel state to switch to when the trigger is activated. */
  to: AppShellPanelState;
  /**
   * Replace the rendered `<button>` with another element or component (e.g. a
   * `ButtonIcon`) via Base UI composition.
   */
  render?: useRender.RenderProp;
}

// A declarative control that flips the panel to `to` on click — compose it with
// a `ButtonIcon`/`Button` via `render`, or use it as a plain button. Consumers
// who prefer imperative wiring can call `useAppShell().setPanelState` instead.
const AppShellPanelTrigger = React.forwardRef<
  HTMLButtonElement,
  AppShellPanelTriggerProps
>(({ to, onClick, type = 'button', render, ...props }, ref) => {
  const { setPanelState } = useAppShell();
  return useRender({
    render,
    ref,
    defaultTagName: 'button',
    props: mergeProps<'button'>(
      {
        type,
        onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
          onClick?.(event);
          if (!event.defaultPrevented) setPanelState(to);
        },
      },
      props
    ),
  });
});
AppShellPanelTrigger.displayName = 'AppShellPanelTrigger';

export {
  AppShell,
  AppShellSidebar,
  AppShellBody,
  AppShellHeader,
  AppShellMain,
  AppShellFooter,
  AppShellPanel,
  AppShellPanelContent,
  AppShellPanelCollapsed,
  AppShellPanelTrigger,
};
