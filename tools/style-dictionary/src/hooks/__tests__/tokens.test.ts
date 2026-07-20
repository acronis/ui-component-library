// Token-domain unit tests: the two pure pieces stage 1 (dtcg) and stage 2 (css)
// are built from — the DTCG normalization preprocessor and the `light-dark()`
// zipping CSS format. These run without Style Dictionary or disk I/O, against a
// small in-memory fixture token tree, so the normalization rules and the
// light/dark zip stay pinned independently of a full `build`.

import type { TransformedToken } from 'style-dictionary/types';
import { describe, expect, it } from 'vitest';

import {
  aliasTarget,
  collectDecls,
  serializeSlice,
} from '../formats/css-light-dark';
import { normalizeTree } from '../preprocessors/acronis-dtcg';

// ── normalizeTree (stage 1) ──────────────────────────────────────────────────

// A fixture in the UI Components library source shape: per-mode `values`, a native DTCG
// dimension `$value` { value, unit }, plain fontWeight/fontFamily scalar
// `$value`s, a `$value` composite, and a token scoped to a different platform.
const SOURCE = {
  $type: 'color',
  colors: {
    background: {
      base: {
        platforms: ['PD', 'WEB'],
        values: { light: { h: 0, s: 0, l: 100 }, dark: { h: 0, s: 0, l: 0 } },
      },
      'web-only': {
        platforms: ['WEB'],
        values: { light: { h: 1, s: 1, l: 1 }, dark: { h: 2, s: 2, l: 2 } },
      },
    },
  },
  spacing: {
    sm: {
      $type: 'dimension',
      platforms: ['PD'],
      $value: { value: 8, unit: 'px' },
    },
  },
  font: {
    weight: {
      bold: {
        $type: 'fontWeight',
        platforms: ['PD'],
        $value: 700,
      },
    },
    family: {
      default: {
        $type: 'fontFamily',
        platforms: ['PD'],
        $value: 'Inter',
      },
    },
  },
  typography: {
    body: {
      $type: 'typography',
      platforms: ['PD'],
      $value: { fontFamily: 'Inter', fontSize: '14px' },
    },
  },
};

// Walk into a normalized tree by key path, keeping each level typed as a node
// (avoids `any` while still reaching `$value`/`$type` on the leaf).
type DtcgNode = Record<string, unknown>;
const at = (tree: unknown, ...keys: string[]): DtcgNode => {
  let node = tree as DtcgNode;
  for (const key of keys) node = node[key] as DtcgNode;
  return node;
};

describe('normalizeTree', () => {
  it('picks the requested mode out of each token `values` dict', () => {
    expect(
      at(normalizeTree(SOURCE, 'light', 'PD'), 'colors', 'background', 'base')
        .$value
    ).toEqual({
      h: 0,
      s: 0,
      l: 100,
    });
    expect(
      at(normalizeTree(SOURCE, 'dark', 'PD'), 'colors', 'background', 'base')
        .$value
    ).toEqual({
      h: 0,
      s: 0,
      l: 0,
    });
  });

  it('drops tokens not scoped to the requested platform, pruning empty groups', () => {
    const background = at(
      normalizeTree(SOURCE, 'light', 'PD'),
      'colors',
      'background'
    );
    // `web-only` is WEB-scoped; `base` is the only PD child of `background`.
    expect(background['web-only']).toBeUndefined();
    expect(Object.keys(background)).toEqual(['base']);
  });

  it('passes a native dimension `$value` { value, unit } through untouched', () => {
    const sm = at(normalizeTree(SOURCE, 'light', 'PD'), 'spacing', 'sm');
    expect(sm.$type).toBe('dimension');
    expect(sm.$value).toEqual({ value: 8, unit: 'px' });
  });

  it('passes plain fontWeight (number) and fontFamily (string) scalars through untouched', () => {
    const tree = normalizeTree(SOURCE, 'light', 'PD');
    expect(at(tree, 'font', 'weight', 'bold').$value).toBe(700);
    expect(at(tree, 'font', 'family', 'default').$value).toBe('Inter');
  });

  it('keeps a mode-invariant `$value` composite untouched', () => {
    expect(
      at(normalizeTree(SOURCE, 'light', 'PD'), 'typography', 'body').$value
    ).toEqual({
      fontFamily: 'Inter',
      fontSize: '14px',
    });
  });

  it('strips the non-DTCG `platforms` array off normalized tokens', () => {
    expect(
      'platforms' in
        at(normalizeTree(SOURCE, 'light', 'PD'), 'colors', 'background', 'base')
    ).toBe(false);
  });

  it('returns an empty tree when no token matches the platform', () => {
    expect(normalizeTree(SOURCE, 'light', 'OTHER')).toEqual({});
  });
});

// ── aliasTarget + collectDecls + serializeSlice (stage 2) ─────────────────────

const token = (over: Partial<TransformedToken>): TransformedToken =>
  ({ name: 'x', path: ['x'], original: {}, ...over }) as TransformedToken;

type Opts = Parameters<typeof collectDecls>[1];
const collect = (tokens: TransformedToken[], opts: Partial<Opts> = {}) =>
  collectDecls(tokens, {
    pathToName: new Map(),
    darkColors: new Map(),
    themeLayer: false,
    ...opts,
  });

describe('aliasTarget', () => {
  it('extracts the path from a single full alias', () => {
    expect(aliasTarget('{palette.blue.13}')).toBe('palette.blue.13');
  });
  it('returns null for a literal or a non-string value', () => {
    expect(aliasTarget('rgb(0 0 0)')).toBeNull();
    expect(aliasTarget({ colorSpace: 'hsl' })).toBeNull();
    expect(aliasTarget('{a} {b}')).toBeNull();
  });
});

describe('collectDecls', () => {
  it('emits a var() reference for a single-alias token (preserving the chain)', () => {
    const { vars } = collect(
      [
        token({
          name: 'ui-background-brand-primary',
          path: ['colors', 'background', 'brand', 'primary'],
          $type: 'color',
          $value: 'rgb(0 32 77)',
          original: { $value: '{palette.blue.13}' },
        }),
      ],
      { pathToName: new Map([['palette.blue.13', 'ui-palette-blue-13']]) }
    );
    expect(vars.get('ui-background-brand-primary')).toBe(
      'var(--ui-palette-blue-13)'
    );
  });

  it('zips a primitive color into light-dark() in the theme layer', () => {
    const { vars } = collect(
      [
        token({
          name: 'ui-palette-blue-13',
          path: ['palette', 'blue', '13'],
          $type: 'color',
          $value: 'rgb(0 32 77)',
          original: {
            $value: { colorSpace: 'hsl', components: [213, 100, 15] },
          },
        }),
      ],
      {
        themeLayer: true,
        darkColors: new Map([['palette.blue.13', 'rgb(12 12 14)']]),
      }
    );
    expect(vars.get('ui-palette-blue-13')).toBe(
      'light-dark(rgb(0 32 77), rgb(12 12 14))'
    );
  });

  it('emits a non-aliased brand color as a plain (theme-invariant) value', () => {
    const { vars } = collect([
      token({
        name: 'ui-x',
        path: ['colors', 'x'],
        $type: 'color',
        $value: 'rgb(1 2 3)',
        original: { $value: { colorSpace: 'hsl', components: [1, 2, 3] } },
      }),
    ]);
    expect(vars.get('ui-x')).toBe('rgb(1 2 3)');
  });

  it('emits a dimension literal as a plain custom property', () => {
    const { vars } = collect([
      token({
        name: 'ui-spacing-sm',
        $type: 'dimension',
        $value: '8px',
        original: { $value: { value: 8, unit: 'px' } },
      }),
    ]);
    expect(vars.get('ui-spacing-sm')).toBe('8px');
  });

  it('prefers a var() reference for a dimension alias', () => {
    const { vars } = collect(
      [
        token({
          name: 'ui-button-global-radius',
          path: ['button', '_global', 'radius'],
          $type: 'dimension',
          $value: '4px',
          original: { $value: '{units.radius.4}' },
        }),
      ],
      { pathToName: new Map([['units.radius.4', 'ui-units-radius-4']]) }
    );
    expect(vars.get('ui-button-global-radius')).toBe(
      'var(--ui-units-radius-4)'
    );
  });

  it('wraps a typography composite in a utility class selector', () => {
    const { classes } = collect([
      token({
        name: 'ui-typography-body',
        $type: 'typography',
        $value: 'font-family: Inter;\nfont-size: 14px;',
      }),
    ]);
    expect(classes.get('.ui-typography-body')).toContain('font-family: Inter;');
  });

  it('collects unrepresentable tokens into the skipped list', () => {
    const { skipped } = collect([
      token({
        name: 'grad',
        $type: 'gradient',
        $value: { stops: [] } as unknown as string,
      }),
    ]);
    expect(skipped).toContain('grad (gradient)');
  });
});

describe('serializeSlice', () => {
  it('includes the light/dark shell only in the primitive theme layer', () => {
    const css = serializeSlice({
      tier: 'primitives',
      themeLayer: true,
      base: {
        vars: new Map([['ui-palette-x', 'light-dark(red, black)']]),
        classes: new Map(),
      },
      overrides: [],
    });
    expect(css).toContain('color-scheme: light dark;');
    expect(css).toContain("[data-theme='dark']");
    expect(css).toContain(':root, :host {');
    expect(css).toContain(":host([data-theme='light'])");
  });

  it('omits the shell from non-theme slices and emits var() refs', () => {
    const css = serializeSlice({
      tier: 'semantics',
      themeLayer: false,
      base: {
        vars: new Map([['ui-x', 'var(--ui-palette-x)']]),
        classes: new Map(),
      },
      overrides: [],
    });
    expect(css).not.toContain('color-scheme');
    expect(css).toContain('--ui-x: var(--ui-palette-x);');
  });

  it('renders non-default brands under [data-brand] selectors', () => {
    const css = serializeSlice({
      tier: 'semantics',
      themeLayer: false,
      base: { vars: new Map([['ui-x', 'var(--a)']]), classes: new Map() },
      overrides: [
        {
          brand: 'deep-sky',
          vars: new Map([['ui-x', 'var(--b)']]),
          classes: new Map(),
        },
      ],
    });
    expect(css).toContain(
      "[data-brand='deep-sky'], :host([data-brand='deep-sky']) {"
    );
    expect(css).toContain('--ui-x: var(--b);');
  });

  it('omits an empty brand override block', () => {
    const css = serializeSlice({
      tier: 'semantics',
      themeLayer: false,
      base: { vars: new Map([['ui-x', 'red']]), classes: new Map() },
      overrides: [{ brand: 'deep-sky', vars: new Map(), classes: new Map() }],
    });
    expect(css).not.toContain('data-brand');
  });

  it('sorts custom properties by name for stable output', () => {
    const css = serializeSlice({
      tier: 'semantics',
      themeLayer: false,
      base: {
        vars: new Map([
          ['b-token', '2px'],
          ['a-token', '1px'],
        ]),
        classes: new Map(),
      },
      overrides: [],
    });
    expect(css.indexOf('--a-token')).toBeLessThan(css.indexOf('--b-token'));
  });
});
