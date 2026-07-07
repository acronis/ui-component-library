import * as React from 'react';
import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import { TimesIcon } from '@spec-lab/icons-react/stroke-mono';

import { cn } from '@/lib/utils';
import { Button, type ButtonProps } from '../button';

// A guided-onboarding "coach-mark": a stepped Popover anchored to a target that
// gets a pulsing beacon ("green light") and an optional dimming scrim. Built on
// the Base UI Popover primitive (positioning, focus management, outside-press /
// Esc dismissal, ARIA come from Base UI) — the root also owns the step index and
// open state so the parts can drive Next / Back / Skip navigation and render a
// step counter. Anchoring the popover to a specific DOM target, scroll-into-view,
// and "seen once" persistence are left to the consumer (pass an `anchor` to
// `TourContent`); this component stays focused on presentation + navigation.
//
// No `--ui-tour-*` token tier exists, so this design-pending v1 themes from the
// shared semantic tokens:
//   • surface -> bg-background (--ui-background-surface-primary)
//   • text    -> text-foreground (--ui-text-on-surface-primary)
//   • border  -> border-primary  (--ui-background-brand-primary — the brand-blue
//     coach-mark outline; follows the active [data-brand])
//   • divider -> --ui-border-on-brand-divider
//   • scrim   -> --ui-background-backdrop-screen (same as Dialog's overlay)
//   • beacon  -> --ui-background-status-strong-success (the "green light")
// KNOWN GAPS (flag for a Figma/token pass, do NOT hand-roll): there is no
// spotlight cut-out mask token (the scrim dims uniformly, it does not punch a
// hole around the target), and the beacon reuses the strong-success status green
// rather than a dedicated coach-mark/beacon token. Reconcile with
// `/figma-component Tour <url> --update` once a mockup lands.

interface TourContextValue {
  activeStep: number;
  stepCount: number;
  isFirst: boolean;
  isLast: boolean;
  next: () => void;
  back: () => void;
  skip: () => void;
  goTo: (step: number) => void;
  setOpen: (open: boolean) => void;
}

const TourContext = React.createContext<TourContextValue | null>(null);

function useTour(): TourContextValue {
  const context = React.useContext(TourContext);
  if (!context) {
    throw new Error('Tour parts must be used within a <Tour> root.');
  }
  return context;
}

/**
 * Controlled + uncontrolled state (the Base UI idiom). When `controlled` is
 * provided it wins and the setter only emits the change callback; otherwise the
 * setter updates internal state. `onChange` is ALWAYS invoked with the next value
 * so a consumer can react in either mode.
 */
function useControllable<T>(
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

export interface TourProps {
  /**
   * Total number of steps — drives the step counter and the "last step" logic.
   * Defaults to `1` (a single-step coach-mark).
   */
  stepCount?: number;
  /** Controlled active step index (0-based). */
  activeStep?: number;
  /** Uncontrolled initial active step index (0-based). Defaults to `0`. */
  defaultActiveStep?: number;
  /** Fires with the next 0-based index whenever the active step changes. */
  onActiveStepChange?: (step: number) => void;
  /** Controlled open state of the coach-mark popover. */
  open?: boolean;
  /** Uncontrolled initial open state. Defaults to `false`. */
  defaultOpen?: boolean;
  /** Fires with the next open state whenever the popover opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Fires when the user advances past the last step (Next on the final step). */
  onComplete?: () => void;
  /** Fires when the user skips the tour (Skip / close). */
  onSkip?: () => void;
  children?: React.ReactNode;
}

const Tour = ({
  stepCount = 1,
  activeStep: activeStepProp,
  defaultActiveStep = 0,
  onActiveStepChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onComplete,
  onSkip,
  children,
}: TourProps) => {
  const [activeStep, setActiveStep] = useControllable(
    activeStepProp,
    defaultActiveStep,
    onActiveStepChange
  );
  const [open, setOpen] = useControllable(openProp, defaultOpen, onOpenChange);

  const isFirst = activeStep <= 0;
  const isLast = activeStep >= stepCount - 1;

  const goTo = React.useCallback(
    (step: number) => {
      setActiveStep(Math.max(0, Math.min(step, stepCount - 1)));
    },
    [setActiveStep, stepCount]
  );

  const next = React.useCallback(() => {
    if (isLast) {
      onComplete?.();
      setOpen(false);
      return;
    }
    setActiveStep(activeStep + 1);
  }, [activeStep, isLast, onComplete, setActiveStep, setOpen]);

  const back = React.useCallback(() => {
    if (!isFirst) setActiveStep(activeStep - 1);
  }, [activeStep, isFirst, setActiveStep]);

  const skip = React.useCallback(() => {
    onSkip?.();
    setOpen(false);
  }, [onSkip, setOpen]);

  const value = React.useMemo<TourContextValue>(
    () => ({ activeStep, stepCount, isFirst, isLast, next, back, skip, goTo, setOpen }),
    [activeStep, stepCount, isFirst, isLast, next, back, skip, goTo, setOpen]
  );

  return (
    <TourContext.Provider value={value}>
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        {children}
      </PopoverPrimitive.Root>
    </TourContext.Provider>
  );
};
Tour.displayName = 'Tour';

/** Opens the tour when clicked (Base UI `Popover.Trigger`). */
const TourTrigger = PopoverPrimitive.Trigger;

/** Portal escape hatch for advanced composition (Base UI `Popover.Portal`). */
const TourPortal = PopoverPrimitive.Portal;

export interface TourBeaconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Whether the beacon should animate its pulsing ring. Defaults to `true`.
   * Set `false` to render a static dot (e.g. inside a visual-regression story).
   */
  pulse?: boolean;
}

/**
 * The "green light" — a pulsing dot that marks the target a tour step points at.
 * Purely decorative by default (`aria-hidden`); place it over/next to the anchor.
 */
const TourBeacon = React.forwardRef<HTMLSpanElement, TourBeaconProps>(
  ({ className, pulse = true, ...props }, ref) => (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn('relative inline-flex size-3', className)}
      {...props}
    >
      {pulse && (
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--ui-background-status-strong-success)] opacity-75" />
      )}
      <span className="relative inline-flex size-3 rounded-full bg-[var(--ui-background-status-strong-success)]" />
    </span>
  )
);
TourBeacon.displayName = 'TourBeacon';

/**
 * Optional dimming scrim behind the coach-mark (Base UI `Popover.Backdrop`).
 * NOTE: v1 dims uniformly — there is no spotlight cut-out around the target yet.
 */
const TourScrim = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Backdrop>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Backdrop>
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Backdrop
    ref={ref}
    className={cn(
      'fixed inset-0 z-40 bg-[var(--ui-background-backdrop-screen)] duration-200 data-[open]:animate-in data-[open]:fade-in-0 data-[closed]:animate-out data-[closed]:fade-out-0',
      className
    )}
    {...props}
  />
));
TourScrim.displayName = 'TourScrim';

export interface TourContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Popup> {
  /** Which side of the anchor to render on. Defaults to `bottom`. */
  side?: PopoverPrimitive.Positioner.Props['side'];
  /** Alignment along the chosen side. Defaults to `center`. */
  align?: PopoverPrimitive.Positioner.Props['align'];
  /** Distance in px from the anchor. Defaults to `8`. */
  sideOffset?: number;
  /**
   * Element (or ref) the popover is positioned against. When omitted, Base UI
   * anchors to the `TourTrigger`. Pass the step's target for a tour that walks
   * across landmarks.
   */
  anchor?: PopoverPrimitive.Positioner.Props['anchor'];
  /** Render inside a portal (default `true`). */
  portal?: boolean;
  /**
   * Portal container. Pass a shadow-root mount for isolated-style previews
   * (the docs demos do this via `useShadowMount`).
   */
  portalContainer?: PopoverPrimitive.Portal.Props['container'];
  /** Keep the content mounted while closed (Base UI `Portal` prop). */
  keepMounted?: PopoverPrimitive.Portal.Props['keepMounted'];
}

const TourContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Popup>,
  TourContentProps
>(
  (
    {
      className,
      side = 'bottom',
      align = 'center',
      sideOffset = 8,
      anchor,
      portal = true,
      portalContainer,
      keepMounted,
      ...props
    },
    ref
  ) => {
    const positioner = (
      <PopoverPrimitive.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        anchor={anchor}
        className="z-50"
      >
        <PopoverPrimitive.Popup
          ref={ref}
          className={cn(
            'flex w-80 flex-col overflow-hidden rounded border border-primary bg-background text-foreground shadow-lg outline-none',
            'duration-200 data-[open]:animate-in data-[closed]:animate-out data-[open]:fade-in-0 data-[closed]:fade-out-0 data-[open]:zoom-in-95 data-[closed]:zoom-out-95',
            'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2',
            className
          )}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    );

    return portal ? (
      <PopoverPrimitive.Portal container={portalContainer} keepMounted={keepMounted}>
        {positioner}
      </PopoverPrimitive.Portal>
    ) : (
      positioner
    );
  }
);
TourContent.displayName = 'TourContent';

const TourHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col gap-1 px-6 pb-2 pt-4', className)}
    {...props}
  />
));
TourHeader.displayName = 'TourHeader';

const TourTitle = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Title>
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Title
    ref={ref}
    className={cn('text-sm font-semibold leading-6 text-foreground', className)}
    {...props}
  />
));
TourTitle.displayName = 'TourTitle';

const TourDescription = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Description>
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Description
    ref={ref}
    className={cn('text-sm leading-6 text-foreground', className)}
    {...props}
  />
));
TourDescription.displayName = 'TourDescription';

const TourBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('px-6 pb-4', className)} {...props} />
));
TourBody.displayName = 'TourBody';

const TourFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center justify-between gap-2 border-t border-[var(--ui-border-on-brand-divider)] px-6 py-3',
      className
    )}
    {...props}
  />
));
TourFooter.displayName = 'TourFooter';

export interface TourStepCounterProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  /**
   * Customize the counter text. Receives the 1-based current step and the total.
   * Defaults to `"{current} of {total}"`.
   */
  format?: (current: number, total: number) => React.ReactNode;
}

/** Renders the current position in the tour, e.g. "2 of 5", from the root state. */
const TourStepCounter = React.forwardRef<HTMLSpanElement, TourStepCounterProps>(
  ({ className, format, ...props }, ref) => {
    const { activeStep, stepCount } = useTour();
    const current = activeStep + 1;
    return (
      <span
        ref={ref}
        className={cn('text-sm leading-6 text-muted-foreground', className)}
        {...props}
      >
        {format ? format(current, stepCount) : `${current} of ${stepCount}`}
      </span>
    );
  }
);
TourStepCounter.displayName = 'TourStepCounter';

const TourActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center gap-2', className)} {...props} />
));
TourActions.displayName = 'TourActions';

function composeHandler<E extends React.SyntheticEvent>(
  action: () => void,
  handler?: React.EventHandler<E>
): React.EventHandler<E> {
  return (event) => {
    handler?.(event);
    if (!event.defaultPrevented) action();
  };
}

/** Advances to the next step (or completes the tour on the last step). */
const TourNextButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, onClick, ...props }, ref) => {
    const { next, isLast } = useTour();
    return (
      <Button ref={ref} onClick={composeHandler(next, onClick)} {...props}>
        {children ?? (isLast ? 'Done' : 'Next')}
      </Button>
    );
  }
);
TourNextButton.displayName = 'TourNextButton';

/** Returns to the previous step; disabled on the first step. */
const TourBackButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, onClick, variant = 'secondary', disabled, ...props }, ref) => {
    const { back, isFirst } = useTour();
    return (
      <Button
        ref={ref}
        variant={variant}
        disabled={disabled ?? isFirst}
        onClick={composeHandler(back, onClick)}
        {...props}
      >
        {children ?? 'Back'}
      </Button>
    );
  }
);
TourBackButton.displayName = 'TourBackButton';

/** Dismisses the tour without completing it. */
const TourSkipButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, onClick, variant = 'ghost', ...props }, ref) => {
    const { skip } = useTour();
    return (
      <Button ref={ref} variant={variant} onClick={composeHandler(skip, onClick)} {...props}>
        {children ?? 'Skip'}
      </Button>
    );
  }
);
TourSkipButton.displayName = 'TourSkipButton';

/** Close (X) control in the coach-mark header (Base UI `Popover.Close`). */
const TourClose = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Close>
>(({ className, children, ...props }, ref) => (
  <PopoverPrimitive.Close
    ref={ref}
    className={cn(
      'absolute right-4 top-4 rounded p-1 text-[var(--ui-text-on-brand-link-idle)] transition-colors hover:text-[var(--ui-text-on-brand-link-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-primary)] disabled:pointer-events-none',
      className
    )}
    {...props}
  >
    {children ?? (
      <>
        <TimesIcon size={16} />
        <span className="sr-only">Close</span>
      </>
    )}
  </PopoverPrimitive.Close>
));
TourClose.displayName = 'TourClose';

export {
  Tour,
  TourTrigger,
  TourPortal,
  TourBeacon,
  TourScrim,
  TourContent,
  TourHeader,
  TourTitle,
  TourDescription,
  TourBody,
  TourFooter,
  TourStepCounter,
  TourActions,
  TourNextButton,
  TourBackButton,
  TourSkipButton,
  TourClose,
  useTour,
};
