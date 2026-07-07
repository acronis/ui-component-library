import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OnboardingState {
  /** Persisted flag — the guided console tour has been completed or dismissed. */
  hasSeenTour: boolean;
  /** Transient — whether the coach-mark overlay is currently open. */
  isTourOpen: boolean;
}

interface OnboardingStore extends OnboardingState {
  /** Open the tour from the first step (first visit + the Help re-trigger). */
  startTour: () => void;
  /** Close the tour and mark it seen so it does not auto-open again. */
  closeTour: () => void;
}

// Only `hasSeenTour` is persisted to localStorage; `isTourOpen` is session UI
// state so a reload never leaves the coach-mark stuck open. Completing, skipping,
// or otherwise dismissing the tour flips `hasSeenTour`, which suppresses the
// first-visit auto-open on the next mount.
export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      hasSeenTour: false,
      isTourOpen: false,
      startTour: () => set({ isTourOpen: true }),
      closeTour: () => set({ isTourOpen: false, hasSeenTour: true }),
    }),
    {
      name: 'demo-onboarding-storage',
      partialize: (state) => ({ hasSeenTour: state.hasSeenTour }),
    }
  )
);
