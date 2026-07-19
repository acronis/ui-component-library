import { describe, expect, it } from 'vitest';

import { PaletteMapper } from '../helpers/emit-palette-mapper.mjs';

// Brand slugs under an unmapped palette group (`branding/*`) must canonicalize to
// kebab-case — Figma mode/variable names arrive with underscores (and spaces), and
// the semantics emitter folds `[\s_]` to `-` via `normalizeMode`. The palette
// mapper must match, or primitives.palette.branding keeps underscore keys that
// themes-import then wires into semantics, duplicating brand entries
// (deep-sky-itkontoret + deep_sky_itkontoret). See the discrepancy ledger.
describe('PaletteMapper brand-slug normalization', () => {
  it('folds underscores in the branding group to hyphens', () => {
    expect(
      PaletteMapper.map([
        'branding',
        'deep_sky_itkontoret',
        'sidebarprimary',
        'idle',
      ])
    ).toEqual(['branding', 'deep-sky-itkontoret', 'sidebarprimary', 'idle']);
  });

  it('folds mixed underscores + spaces and lowercases', () => {
    expect(
      PaletteMapper.map(['branding', 'Blue_Yellow USS_Signal', 'x'])
    ).toEqual(['branding', 'blue-yellow-uss-signal', 'x']);
  });

  it('leaves an already-hyphenated brand slug unchanged', () => {
    expect(PaletteMapper.map(['branding', 'deep-sky-itkontoret', 'x'])).toEqual(
      ['branding', 'deep-sky-itkontoret', 'x']
    );
  });
});
