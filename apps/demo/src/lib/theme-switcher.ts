/**
 * Theme Switcher Utility
 *
 * Provides functions to programmatically switch between brands and color modes.
 * Brand is driven by the shipped `@constructor-lab/tokens` `[data-brand]` model
 * (default brand = `:root`, i.e. no attribute); light/dark is a separate axis
 * via `[data-theme]`.
 */

/**
 * The brand identities shipped by `@constructor-lab/tokens` as `[data-brand='…']`
 * blocks, plus `'default'` meaning the `:root` brand (no `data-brand`).
 */
export type BrandName =
  | 'default'
  | 'blue-yellow-uss-signal'
  | 'brown'
  | 'dark-gray'
  | 'deep-purple'
  | 'deep-sky-itkontoret'
  | 'green-also-choise-df'
  | 'ingram-micro'
  | 'light-blue-hp'
  | 'light-gray'
  | 'orange-tsukaeru-helpox'
  | 'pinky'
  | 'purple'
  | 'purple-fusion-media'
  | 'red-fire-brick'
  | 'red-home-pl'
  | 'sand'
  | 'telstra'
  | 'virtual-one'
  | 'virtuozzo'
  | 'yellow-1c';
export type ColorMode = 'light' | 'dark' | 'system';

const THEME_STORAGE_KEY = 'av-theme';
const COLOR_MODE_STORAGE_KEY = 'av-color-mode';

/** Does the OS currently ask for dark? */
const prefersDark = (): boolean =>
  window.matchMedia('(prefers-color-scheme: dark)').matches;

/** The persisted choice, or `null` when the user has never chosen. */
function readPersistedColorMode(): ColorMode | null {
  try {
    return localStorage.getItem(COLOR_MODE_STORAGE_KEY) as ColorMode | null;
  } catch (error) {
    console.warn('Failed to read persisted color mode:', error);
    return null;
  }
}

/**
 * Is the document currently letting the OS decide?
 *
 * Both `'system'` and "never chose" are the same DOM state — no `[data-theme]` —
 * and both must follow the OS, so they are one predicate rather than two.
 */
const isFollowingSystem = (): boolean => {
  const persisted = readPersistedColorMode();
  return persisted === null || persisted === 'system';
};

/**
 * Apply a brand to the document root element and any additional roots.
 *
 * Shipped `@constructor-lab/tokens` switch brand via the `[data-brand]` attribute
 * (default brand = `:root`, no attribute). `'default'` therefore removes the
 * attribute; any other brand sets `data-brand="<brand>"`.
 *
 * @param brand - The brand name to apply
 * @param persist - Whether to persist the brand choice to localStorage (default: true)
 * @param extraRoots - Additional elements to apply the brand to (e.g. shadow DOM inner containers)
 *
 * @example
 * ```typescript
 * import { applyBrand } from '@/lib/theme-switcher'
 *
 * applyBrand('purple')
 *
 * // Shadow DOM usage:
 * applyBrand('purple', true, [shadowContainer])
 * ```
 */
export function applyBrand(
  brand: BrandName,
  persist = true,
  extraRoots: HTMLElement[] = []
): void {
  const allRoots = [document.documentElement, ...extraRoots];

  allRoots.forEach((root) => {
    if (brand === 'default') {
      root.removeAttribute('data-brand');
    } else {
      root.setAttribute('data-brand', brand);
    }
  });

  if (persist) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, brand);
    } catch (error) {
      console.warn('Failed to persist brand to localStorage:', error);
    }
  }
}

/**
 * Get the currently applied brand
 *
 * @returns The current brand name, or `'default'` when no `data-brand` is set
 */
export function getCurrentBrand(): BrandName {
  return (
    (document.documentElement.getAttribute('data-brand') as BrandName | null) ??
    'default'
  );
}

/**
 * Load the persisted brand from localStorage and apply it
 * Call this on application startup to restore the user's brand preference
 *
 * @returns The loaded brand name or null if no brand was persisted
 */
export function loadPersistedBrand(): BrandName | null {
  try {
    const persistedBrand = localStorage.getItem(
      THEME_STORAGE_KEY
    ) as BrandName | null;
    if (persistedBrand) {
      applyBrand(persistedBrand, false);
      return persistedBrand;
    }
  } catch (error) {
    console.warn('Failed to load persisted brand from localStorage:', error);
  }

  return null;
}

/**
 * Apply a color mode (light/dark/system) to the document root element.
 *
 * ── `'system'` REMOVES THE ATTRIBUTE; IT DOES NOT RESOLVE IT ─────────────────
 * This used to read `matchMedia` and write `data-theme="dark"` or `"light"` —
 * a literal snapshot of the OS at the moment of the click. It looked right and
 * then **froze**: nothing re-ran it, so a user who picked "System" kept whatever
 * appearance their machine happened to have at that instant, forever.
 * (`watchSystemColorScheme` was written to patch that up, but nothing in the app
 * calls it.)
 *
 * Removing the attribute is not a workaround for that — it is the supported
 * mechanism. `@constructor-lab/tokens` puts `color-scheme: light dark` on
 * `:root` and resolves every colour through `light-dark()`, so with no
 * `[data-theme]` the whole `--ui-*` palette tracks the OS live, in CSS, with no
 * JavaScript and no listener. Writing a literal value is what *disables* that.
 *
 * @param mode - The color mode to apply
 * @param persist - Whether to persist the mode choice to localStorage (default: true)
 *
 * @example
 * ```typescript
 * import { applyColorMode } from '@/lib/theme-switcher'
 *
 * applyColorMode('dark')
 * applyColorMode('system') // Hands the decision back to the OS, live
 * ```
 */
export function applyColorMode(mode: ColorMode, persist = true): void {
  const root = document.documentElement;

  if (mode === 'system') {
    root.removeAttribute('data-theme');
  } else {
    root.setAttribute('data-theme', mode);
  }

  if (persist) {
    try {
      localStorage.setItem(COLOR_MODE_STORAGE_KEY, mode);
    } catch (error) {
      console.warn('Failed to persist color mode to localStorage:', error);
    }
  }
}

/**
 * Get the color mode currently being **painted** — the resolved one, never the
 * preference.
 *
 * Absence of `[data-theme]` means "the OS decides", so it must be answered by
 * asking the OS. Returning `'light'` for it — as this did — was wrong for every
 * visitor whose system is set to dark: the page rendered dark (the tokens follow
 * `prefers-color-scheme`) while this reported light. `ConsoleHeader` seeds its
 * toggle icon from this and `toggleColorMode` derives the next mode from it, so
 * the icon showed a sun on a dark page and the first click appeared to do
 * nothing — it "switched" to the mode already on screen.
 *
 * @returns 'light' or 'dark' — what the user is actually looking at
 */
export function getCurrentColorMode(): 'light' | 'dark' {
  const attribute = document.documentElement.getAttribute('data-theme');
  if (attribute === 'dark' || attribute === 'light') return attribute;
  return prefersDark() ? 'dark' : 'light';
}

/**
 * Get the stored *preference*, which is not the same question as
 * `getCurrentColorMode`: this can return `'system'`, that one cannot.
 *
 * Use this to render which option is selected in a theme menu; use
 * `getCurrentColorMode` to render what is on screen.
 */
export function getColorModePreference(): ColorMode {
  return readPersistedColorMode() ?? 'system';
}

/**
 * Load the persisted color mode from localStorage and apply it
 * Call this on application startup to restore the user's color mode preference
 *
 * @returns The loaded color mode or null if no mode was persisted
 */
export function loadPersistedColorMode(): ColorMode | null {
  const persistedMode = readPersistedColorMode();
  if (persistedMode) {
    applyColorMode(persistedMode, false);
    return persistedMode;
  }

  // Nothing persisted: deliberately leave `[data-theme]` unset rather than
  // defaulting to light. That absence IS the system-following state — the tokens
  // resolve it through `color-scheme: light dark` — so a first-time visitor on a
  // dark machine gets a dark app with no JavaScript involved.
  return null;
}

/**
 * Toggle between light and dark mode
 *
 * @param persist - Whether to persist the mode choice to localStorage (default: true)
 * @returns The new color mode after toggling
 */
export function toggleColorMode(persist = true): 'light' | 'dark' {
  const currentMode = getCurrentColorMode();
  const newMode = currentMode === 'light' ? 'dark' : 'light';
  applyColorMode(newMode, persist);
  return newMode;
}

/**
 * Notify when the OS appearance changes while the app is following it.
 *
 * ── THIS NO LONGER TOUCHES THE DOM, AND MUST NOT ─────────────────────────────
 * It used to set `data-theme` on every OS change. That is now actively harmful:
 * writing the attribute is exactly what *stops* the tokens following the OS, so
 * the listener would convert a live system-following document into a frozen
 * literal one on the first change event — undoing `applyColorMode('system')`.
 *
 * Repainting is no longer JavaScript's job at all. `light-dark()` re-resolves on
 * its own. What JavaScript still cannot know without being told is that the
 * *rendered* mode changed, which is why this now reports instead of acting —
 * React state seeded from `getCurrentColorMode()` (see `ConsoleHeader`) would
 * otherwise go stale against a page that repainted underneath it.
 *
 * @param onChange - Called with the newly resolved mode. Fires only while the
 *   app is following the OS — with an explicit light/dark choice the render does
 *   not change, so there is nothing to report.
 * @returns A cleanup function to remove the listener
 */
export function watchSystemColorScheme(
  onChange?: (mode: 'light' | 'dark') => void
): () => void {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handler = (e: MediaQueryListEvent) => {
    if (!isFollowingSystem()) return;
    onChange?.(e.matches ? 'dark' : 'light');
  };

  mediaQuery.addEventListener('change', handler);

  return () => {
    mediaQuery.removeEventListener('change', handler);
  };
}

/**
 * Initialize the theme system on application startup
 * Loads persisted theme and color mode preferences
 * Sets up system color scheme watcher if mode is 'system'
 *
 * @returns A cleanup function to remove event listeners
 *
 * @example
 * ```typescript
 * import { initializeThemeSystem } from '@/lib/theme-switcher'
 *
 * // In your app initialization
 * const cleanup = initializeThemeSystem()
 *
 * // Call cleanup when unmounting (e.g., in React useEffect)
 * return cleanup
 * ```
 */
export function initializeThemeSystem(
  onColorModeChange?: (mode: 'light' | 'dark') => void
): () => void {
  loadPersistedBrand();
  loadPersistedColorMode();

  return watchSystemColorScheme(onColorModeChange);
}
