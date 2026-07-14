import * as React from 'react';
import {
  Tour,
  TourActions,
  TourBackButton,
  TourBeacon,
  TourBody,
  TourClose,
  TourContent,
  TourDescription,
  TourFooter,
  TourHeader,
  TourNextButton,
  TourScrim,
  TourSkipButton,
  TourStepCounter,
  TourTitle,
} from '@spec-lab/ui-react';
import { useOnboardingStore } from '@/store/onboarding/onboardingStore';
import {
  demoOnboardingSteps,
  tourAnchorSelector,
  type TourAnchorId,
  type TourStep,
} from './tour-steps';

// The primary/secondary nav the first steps anchor to is hidden below `md`
// (see AppLayout), so the first-visit auto-open is gated to desktop widths.
const DESKTOP_QUERY = '(min-width: 768px)';

function resolveAnchor(id: TourAnchorId): HTMLElement | null {
  if (typeof document === 'undefined') return null;
  return document.querySelector<HTMLElement>(tourAnchorSelector(id));
}

// A fixed-position beacon painted on the edge of the active landmark that faces
// the popover, so the "green light" sits right beside the coach-mark rather than
// on the far corner. The Tour scrim dims everything, so the beacon sits above it
// (z-50). Re-measures on scroll/resize; the shell itself does not scroll, but
// sidebar content can.
function TourBeaconOverlay({
  anchorId,
  side,
  align,
  open,
}: {
  anchorId: TourAnchorId;
  side: TourStep['side'];
  align: TourStep['align'];
  open: boolean;
}) {
  const [rect, setRect] = React.useState<DOMRect | null>(null);

  React.useLayoutEffect(() => {
    if (!open) {
      // eslint-disable-next-line @eslint-react/set-state-in-effect -- clearing measured DOM rect when the beacon closes
      setRect(null);
      return;
    }
    const el = resolveAnchor(anchorId);
    if (!el) {
      // eslint-disable-next-line @eslint-react/set-state-in-effect -- clearing measured DOM rect when no anchor resolves
      setRect(null);
      return;
    }
    // eslint-disable-next-line @eslint-react/set-state-in-effect -- syncing measured DOM geometry into state on layout/scroll/resize
    const measure = () => setRect(el.getBoundingClientRect());
    el.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, [anchorId, open]);

  if (!open || !rect) return null;

  // Place the beacon exactly where the popover attaches to the anchor: on the
  // `side` edge, at the `align` position along that edge — so the "green light"
  // hugs the coach-mark even when the anchor is a tall/wide container.
  const along = (start: number, end: number) =>
    align === 'start'
      ? start + Math.min(20, (end - start) / 2)
      : align === 'end'
        ? end - Math.min(20, (end - start) / 2)
        : (start + end) / 2;
  const vertical =
    side === 'left' ||
    side === 'right' ||
    side === 'inline-start' ||
    side === 'inline-end';
  const point = vertical
    ? {
        left:
          side === 'left' || side === 'inline-start' ? rect.left : rect.right,
        top: along(rect.top, rect.bottom),
      }
    : {
        left: along(rect.left, rect.right),
        top: side === 'top' ? rect.top : rect.bottom,
      };

  return (
    <TourBeacon
      style={{
        position: 'fixed',
        left: point.left,
        top: point.top,
        transform: 'translate(-50%, -50%)',
        zIndex: 50,
        pointerEvents: 'none',
      }}
    />
  );
}

// Drives the `demo-onboarding` guided tour: reads the shared open/seen state from
// the Zustand store, walks the step list, feeds each step's anchor to the kit's
// Tour coach-mark, and marks the tour seen whenever it closes (Done, Skip, Esc,
// close, or outside-press) so it auto-opens only once.
export function DemoOnboardingTour() {
  const isTourOpen = useOnboardingStore((s) => s.isTourOpen);
  const hasSeenTour = useOnboardingStore((s) => s.hasSeenTour);
  const startTour = useOnboardingStore((s) => s.startTour);
  const closeTour = useOnboardingStore((s) => s.closeTour);

  const [activeStep, setActiveStep] = React.useState(0);

  // First-visit auto-open, once, on desktop only.
  const autoStartedRef = React.useRef(false);
  React.useEffect(() => {
    if (autoStartedRef.current) return;
    autoStartedRef.current = true;
    if (hasSeenTour || typeof window === 'undefined') return;
    if (!window.matchMedia(DESKTOP_QUERY).matches) return;
    startTour();
  }, [hasSeenTour, startTour]);

  // Restart from the first step whenever the tour (re-)opens — e.g. the Help
  // button re-triggers it after it was completed or skipped.
  const prevOpenRef = React.useRef(false);
  React.useEffect(() => {
    if (isTourOpen && !prevOpenRef.current) setActiveStep(0);
    prevOpenRef.current = isTourOpen;
  }, [isTourOpen]);

  const step = demoOnboardingSteps[activeStep] ?? demoOnboardingSteps[0];

  // Resolve the current step's anchor into a concrete element and hold it in
  // state. Passing the *element* (whose reference changes per step) — rather than
  // a function — is what makes Base UI's positioner actually re-anchor when the
  // step advances; a memoized function anchor is only read once and left pinned.
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
  React.useLayoutEffect(() => {
    if (!isTourOpen) {
      // eslint-disable-next-line @eslint-react/set-state-in-effect -- clearing the resolved anchor element when the tour closes
      setAnchorEl(null);
      return;
    }
    // eslint-disable-next-line @eslint-react/set-state-in-effect -- resolving the current step's DOM anchor element into state
    setAnchorEl(resolveAnchor(step.anchor));
  }, [step.anchor, isTourOpen]);

  return (
    <Tour
      stepCount={demoOnboardingSteps.length}
      activeStep={activeStep}
      onActiveStepChange={setActiveStep}
      open={isTourOpen}
      onOpenChange={(next) => {
        if (!next) closeTour();
      }}
    >
      <TourScrim />
      <TourContent
        anchor={anchorEl ?? undefined}
        side={step.side}
        align={step.align}
      >
        <TourClose />
        <TourHeader>
          <TourTitle>{step.title}</TourTitle>
        </TourHeader>
        <TourBody>
          <TourDescription>{step.body}</TourDescription>
        </TourBody>
        <TourFooter>
          <TourStepCounter />
          <TourActions>
            <TourSkipButton />
            <TourBackButton />
            <TourNextButton />
          </TourActions>
        </TourFooter>
      </TourContent>
      <TourBeaconOverlay
        anchorId={step.anchor}
        side={step.side}
        align={step.align}
        open={isTourOpen}
      />
    </Tour>
  );
}
