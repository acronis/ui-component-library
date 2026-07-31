/**
 * Storybook global state for the ui-react preview: brand, light/dark, text
 * direction, and locale. The apply* helpers implement the canonical switching
 * model for the `@constructor-lab/tokens` delivery model:
 *
 * - Light/dark is NOT a `.dark` class. The tokens use `light-dark()` resolved by
 *   `color-scheme`; ui-react's `dark:` variant keys off `[data-theme]`. So we set
 *   both `color-scheme` and `[data-theme]` on the root element.
 * - Brand is NOT a class toggle or an injected stylesheet. Every brand ships in
 *   the one imported bundle under a `[data-brand]` selector (acronis is the
 *   `:root` base; other brands are override blocks), so switching brand is just
 *   setting `[data-brand]` on the root element.
 */

/**
 * Every brand the token bundle ships, plus `'acronis'` for the `:root` default.
 *
 * **This list is the shipped `[data-brand='…']` blocks in
 * `@constructor-lab/tokens`, not a curated subset.** It used to read
 * `'acronis' | 'deep-sky'`, which was wrong twice over: it named two of the
 * twenty-one available, and `'deep-sky'` matches no block at all — the shipped
 * brand is `deep-sky-itkontoret`. Because `applyBrand` is called through a cast
 * from the toolbar value, neither error could surface as a type error; selecting
 * it just set an attribute nothing matched and silently rendered the default.
 *
 * `BRANDS` below drives the toolbar, so this cannot drift from what is offered.
 * It CAN still drift from what the tokens ship — regenerate from
 * `grep -ohE "\[data-brand='[^']+'\]" packages/tokens/css/*.css` after a token
 * pull.
 */
export const BRANDS = [
  // The default brand: `:root`, no `[data-brand]` attribute.
  'acronis',
  'blue-yellow-uss-signal',
  'brown',
  'dark-gray',
  'deep-purple',
  'deep-sky-itkontoret',
  'green-also-choise-df',
  'ingram-micro',
  'light-blue-hp',
  'light-gray',
  'orange-tsukaeru-helpox',
  'pinky',
  'purple',
  'purple-fusion-media',
  'red-fire-brick',
  'red-home-pl',
  'sand',
  'telstra',
  'virtual-one',
  'virtuozzo',
  'yellow-1c',
] as const;

export type Brand = (typeof BRANDS)[number];

/**
 * Labels that a slug cannot produce: acronyms, embedded company names, and the
 * default. Everything else is title-cased from its slug by `BRAND_ITEMS`, so a
 * brand added to `BRANDS` shows up in the toolbar whether or not it is listed
 * here — imperfectly cased at worst, never missing.
 */
const BRAND_LABELS: Partial<Record<Brand, string>> = {
  acronis: 'Default (Acronis)',
  'blue-yellow-uss-signal': 'Blue-Yellow USS Signal',
  'deep-sky-itkontoret': 'Deep Sky (ITKontoret)',
  'green-also-choise-df': 'Green (Also Choise DF)',
  'light-blue-hp': 'Light Blue (HP)',
  'orange-tsukaeru-helpox': 'Orange (Tsukaeru Helpox)',
  'purple-fusion-media': 'Purple (Fusion Media)',
  'red-home-pl': 'Red (Home.pl)',
  'yellow-1c': 'Yellow 1C',
};

/** Toolbar items for the brand picker, one per shipped brand. */
export const BRAND_ITEMS = BRANDS.map((brand) => ({
  value: brand,
  title:
    BRAND_LABELS[brand] ??
    brand
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
}));
export type ColorMode = 'light' | 'dark' | 'system';
export type Direction = 'auto' | 'ltr' | 'rtl';
export type Locale = 'en' | 'de' | 'fr' | 'ja' | 'ar' | 'he';

// Locales that read right-to-left, used when `direction` is left on 'auto'.
const RTL_LOCALES = new Set<Locale>(['ar', 'he']);

/**
 * Select the brand via `[data-brand]`; the bundle carries every brand's tokens.
 *
 * The default brand is `:root` with NO attribute — the token bundle emits no
 * `[data-brand='acronis']` block — so it is removed rather than set. Setting it
 * happened to work (an attribute matching no block falls through to `:root`), but
 * only by accident, and it left the DOM claiming a brand the stylesheet has never
 * heard of.
 */
export function applyBrand(brand: Brand): void {
  const html = document.documentElement;
  if (brand === 'acronis') {
    delete html.dataset.brand;
    return;
  }
  html.dataset.brand = brand;
}

/**
 * Flip light/dark: `color-scheme` drives `light-dark()`; `[data-theme]` drives `dark:`.
 *
 * `'system'` is a THIRD state, not a synonym for whichever the OS currently
 * prefers. It **removes** both, which hands the decision to
 * `packages/tokens/css/primitives.css`'s `:root { color-scheme: light dark }` —
 * the CSS-native path a consumer gets when they ship the token bundle and set
 * nothing. That path is unreachable while the attribute is present, so resolving
 * `'system'` to a literal `'dark'` here (as `apps/demo`'s theme-switcher does)
 * would look right and test nothing: it is the attribute path wearing a
 * different label.
 */
export function applyColorMode(mode: ColorMode): void {
  const html = document.documentElement;
  if (mode === 'system') {
    delete html.dataset.theme;
    html.style.removeProperty('color-scheme');
    return;
  }
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
