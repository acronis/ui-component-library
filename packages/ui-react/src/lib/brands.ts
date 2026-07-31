// The brands `@constructor-lab/tokens` ships, in one place.
//
// Internal (not exported from the package index): it exists so the Storybook
// toolbar and the brand-matrix stories cannot disagree about which brands exist.
// `.storybook/globals.ts` re-exports it, and `.storybook/globals.test.ts` checks
// it against the `[data-brand]` blocks the token CSS actually emits.

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
