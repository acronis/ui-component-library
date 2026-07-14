import type { TourContentProps } from '@constructor-lab/ui-react';

// Stable `data-tour-id` values shared by the console landmarks (which set them)
// and the tour step list (which anchors to them). Keeping them here means the
// layout and the tour cannot drift apart.
export const TOUR_ANCHORS = {
  primaryNav: 'primary-nav',
  secondaryNav: 'secondary-nav',
  globalSearch: 'global-search',
  catalog: 'catalog-group',
  account: 'account-controls',
} as const;

export type TourAnchorId = (typeof TOUR_ANCHORS)[keyof typeof TOUR_ANCHORS];

/** CSS selector that resolves a landmark tagged with `data-tour-id`. */
export function tourAnchorSelector(id: TourAnchorId): string {
  return `[data-tour-id="${id}"]`;
}

export interface TourStep {
  /** The `data-tour-id` of the console landmark this step points at. */
  anchor: TourAnchorId;
  title: string;
  body: string;
  /** Which side of the anchor the coach-mark renders on. */
  side: NonNullable<TourContentProps['side']>;
  /** Alignment along the chosen side. */
  align: NonNullable<TourContentProps['align']>;
}

// The `demo-onboarding` tour: five steps walking across the real console
// landmarks in reading order — the primary rail, the section nav, global search,
// the Catalog group, and the account/theme controls.
export const demoOnboardingSteps: TourStep[] = [
  {
    anchor: TOUR_ANCHORS.primaryNav,
    title: 'Primary navigation',
    body: 'Switch between the top-level areas of the console from this icon rail. It stays collapsed to keep the workspace roomy.',
    side: 'right',
    align: 'start',
  },
  {
    anchor: TOUR_ANCHORS.secondaryNav,
    title: 'Section navigation',
    body: 'The expanded panel shows the sections within the current area, grouped by Overview, Workspace, Catalog, and Foundations.',
    side: 'right',
    align: 'start',
  },
  {
    anchor: TOUR_ANCHORS.globalSearch,
    title: 'Global search',
    body: 'Jump to any screen, component, or setting from one place — search is always available in the header.',
    side: 'bottom',
    align: 'center',
  },
  {
    anchor: TOUR_ANCHORS.catalog,
    title: 'Explore the catalog',
    body: 'Browse the kit’s Components, Patterns, and Screens here — each entry links to its live demo and spec.',
    side: 'right',
    align: 'center',
  },
  {
    anchor: TOUR_ANCHORS.account,
    title: 'Theme & account',
    body: 'Toggle light or dark mode, switch language, and manage your account from the trailing edge of the header.',
    side: 'bottom',
    align: 'end',
  },
];
