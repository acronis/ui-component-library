/**
 * Storybook global state for the ui-react preview: brand, light/dark, text
 * direction, and locale. The apply* helpers implement the canonical switching
 * model for the `@spec-lab/tokens` delivery model:
 *
 * - Light/dark is NOT a `.dark` class. The tokens use `light-dark()` resolved by
 *   `color-scheme`; ui-react's `dark:` variant keys off `[data-theme]`. So we set
 *   both `color-scheme` and `[data-theme]` on the root element.
 * - Brand is NOT a class toggle or an injected stylesheet. Every brand ships in
 *   the one imported bundle under a `[data-brand]` selector (acronis is the
 *   `:root` base; other brands are override blocks), so switching brand is just
 *   setting `[data-brand]` on the root element.
 */

export type Brand = 'acronis' | 'deep-sky';
export type ColorMode = 'light' | 'dark';
export type Direction = 'auto' | 'ltr' | 'rtl';
export type Locale = 'en' | 'de' | 'fr' | 'ja' | 'ar' | 'he';

// Locales that read right-to-left, used when `direction` is left on 'auto'.
const RTL_LOCALES = new Set<Locale>(['ar', 'he']);

/** Select the brand via `[data-brand]`; the bundle carries every brand's tokens. */
export function applyBrand(brand: Brand): void {
  document.documentElement.dataset.brand = brand;
}

/** Flip light/dark: `color-scheme` drives `light-dark()`; `[data-theme]` drives `dark:`. */
export function applyColorMode(mode: ColorMode): void {
  const html = document.documentElement;
  html.dataset.theme = mode;
  html.style.colorScheme = mode;
}

/** Set `lang` + `dir`. With direction 'auto', RTL locales flip to rtl. */
export function applyLocaleAndDirection(
  locale: Locale,
  direction: Direction
): void {
  const html = document.documentElement;
  html.lang = locale;
  html.dir =
    direction === 'auto'
      ? RTL_LOCALES.has(locale)
        ? 'rtl'
        : 'ltr'
      : direction;
}
