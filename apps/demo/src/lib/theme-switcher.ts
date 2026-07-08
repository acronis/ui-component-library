/**
 * Theme Switcher Utility
 *
 * Provides functions to programmatically switch between brands and color modes.
 * Brand is driven by the shipped `@spec-lab/tokens` `[data-brand]` model
 * (default brand = `:root`, i.e. no attribute); light/dark is a separate axis
 * via `[data-theme]`.
 */

/**
 * The brand identities shipped by `@spec-lab/tokens` as `[data-brand='…']`
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

/**
 * Apply a brand to the document root element and any additional roots.
 *
 * Shipped `@spec-lab/tokens` switch brand via the `[data-brand]` attribute
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
 * Apply a color mode (light/dark/system) to the document root element
 *
 * @param mode - The color mode to apply
 * @param persist - Whether to persist the mode choice to localStorage (default: true)
 *
 * @example
 * ```typescript
 * import { applyColorMode } from '@/lib/theme-switcher'
 *
 * applyColorMode('dark')
 * applyColorMode('system') // Follows system preference
 * ```
 */
export function applyColorMode(mode: ColorMode, persist = true): void {
  const isDark =
    mode === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : mode === 'dark';

  // Shipped @spec-lab/tokens key light/dark off `[data-theme]` (not a legacy
  // `.dark` class); those token blocks also set `color-scheme`, so setting the
  // attribute is all that is needed to flip the whole `--ui-*` palette.
  document.documentElement.setAttribute(
    'data-theme',
    isDark ? 'dark' : 'light'
  );

  if (persist) {
    try {
      localStorage.setItem(COLOR_MODE_STORAGE_KEY, mode);
    } catch (error) {
      console.warn('Failed to persist color mode to localStorage:', error);
    }
  }
}

/**
 * Get the currently applied color mode
 *
 * @returns 'light' or 'dark' based on the current state
 */
export function getCurrentColorMode(): 'light' | 'dark' {
  return document.documentElement.getAttribute('data-theme') === 'dark'
    ? 'dark'
    : 'light';
}

/**
 * Load the persisted color mode from localStorage and apply it
 * Call this on application startup to restore the user's color mode preference
 *
 * @returns The loaded color mode or null if no mode was persisted
 */
export function loadPersistedColorMode(): ColorMode | null {
  try {
    const persistedMode = localStorage.getItem(
      COLOR_MODE_STORAGE_KEY
    ) as ColorMode | null;
    if (persistedMode) {
      applyColorMode(persistedMode, false);
      return persistedMode;
    }
  } catch (error) {
    console.warn(
      'Failed to load persisted color mode from localStorage:',
      error
    );
  }

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
 * Set up a listener for system color scheme changes
 * Only applies changes if the current mode is set to 'system'
 *
 * @returns A cleanup function to remove the listener
 */
export function watchSystemColorScheme(): () => void {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handler = (e: MediaQueryListEvent) => {
    try {
      const persistedMode = localStorage.getItem(COLOR_MODE_STORAGE_KEY);
      if (persistedMode === 'system') {
        document.documentElement.setAttribute(
          'data-theme',
          e.matches ? 'dark' : 'light'
        );
      }
    } catch (error) {
      console.warn('Failed to check persisted color mode:', error);
    }
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
export function initializeThemeSystem(): () => void {
  loadPersistedBrand();
  loadPersistedColorMode();

  const cleanup = watchSystemColorScheme();

  return cleanup;
}
