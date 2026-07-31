import { readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

import { applyBrand, BRAND_ITEMS, BRANDS } from './globals';

/**
 * Pins the Storybook brand picker to the brands `@constructor-lab/tokens`
 * actually ships.
 *
 * ── WHY: THIS LIST HAS ALREADY DRIFTED, SILENTLY AND TWICE ──────────────────
 * The toolbar was hand-written and offered 9 of 21 brands, so the same component
 * appeared to support a different brand set depending on whether you opened
 * Storybook or `apps/demo` (which lists all of them). And the `Brand` type read
 * `'acronis' | 'deep-sky'` — two names, one of which matches no shipped block at
 * all; the shipped brand is `deep-sky-itkontoret`.
 *
 * Neither could fail. A brand missing from the toolbar is invisible by
 * definition, and a brand whose `[data-brand]` matches nothing renders as the
 * `:root` default — which looks like a working theme, not a broken selector. The
 * only way this drift becomes noticeable is a test that reads the CSS.
 */

const require = createRequire(import.meta.url);

/** Brands the token bundle emits as `[data-brand='…']` blocks. */
function shippedBrands(): Set<string> {
  const cssDir = dirname(require.resolve('@constructor-lab/tokens/css'));
  const found = new Set<string>();

  for (const file of readdirSync(cssDir).filter((f) => f.endsWith('.css'))) {
    const css = readFileSync(join(cssDir, file), 'utf8');
    for (const match of css.matchAll(/\[data-brand='([^']+)'\]/g)) {
      found.add(match[1]);
    }
  }

  if (found.size === 0) {
    // Guards the guard: a resolver or layout change that finds no brands would
    // make every assertion below vacuously true.
    throw new Error(
      `No [data-brand] blocks found in ${cssDir}. The token CSS moved or was ` +
        'not built — this test cannot pass honestly without it.'
    );
  }
  return found;
}

describe('BRANDS', () => {
  it('offers every brand the token bundle ships', () => {
    const missing = [...shippedBrands()].filter(
      (brand) => !BRANDS.includes(brand as (typeof BRANDS)[number])
    );
    expect(
      missing,
      `not selectable in Storybook: ${missing.join(', ')}`
    ).toEqual([]);
  });

  it('offers no brand the token bundle does not ship', () => {
    // `acronis` is the exception: it IS the `:root` default, so it deliberately
    // has no `[data-brand]` block. Every other entry must match one, or selecting
    // it silently renders the default — the `'deep-sky'` failure.
    const shipped = shippedBrands();
    const phantom = BRANDS.filter(
      (brand) => brand !== 'acronis' && !shipped.has(brand)
    );
    expect(
      phantom,
      `these match no [data-brand] block and would render as the default: ${phantom.join(', ')}`
    ).toEqual([]);
  });

  it('has no duplicates', () => {
    expect(new Set(BRANDS).size).toBe(BRANDS.length);
  });
});

describe('BRAND_ITEMS', () => {
  it('has one toolbar item per brand, so the picker cannot offer fewer', () => {
    expect(BRAND_ITEMS.map((item) => item.value)).toEqual([...BRANDS]);
  });

  it('gives every item a non-empty label', () => {
    for (const item of BRAND_ITEMS) {
      expect(item.title, item.value).toBeTruthy();
    }
  });

  it('title-cases a slug that has no hand-written label', () => {
    expect(BRAND_ITEMS.find((i) => i.value === 'dark-gray')?.title).toBe(
      'Dark Gray'
    );
  });
});

describe('applyBrand', () => {
  afterEach(() => {
    delete document.documentElement.dataset.brand;
  });

  it('REMOVES the attribute for the default brand', () => {
    // The token bundle emits no `[data-brand='acronis']` block, so setting one
    // leaves the DOM claiming a brand the stylesheet has never heard of. It
    // rendered correctly only because an unmatched attribute falls through to
    // `:root`.
    document.documentElement.dataset.brand = 'virtuozzo';
    applyBrand('acronis');
    expect(document.documentElement.dataset.brand).toBeUndefined();
  });

  it('sets the attribute for every other brand', () => {
    applyBrand('virtuozzo');
    expect(document.documentElement.dataset.brand).toBe('virtuozzo');
  });
});
