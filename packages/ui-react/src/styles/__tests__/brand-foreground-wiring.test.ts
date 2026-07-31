import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * When a brand ships its own sidebar foreground, the component tier must use it.
 *
 * ── THE BUG THIS GUARDS ─────────────────────────────────────────────────────
 * `SidebarPrimary`'s unselected menu items took their label and icon colour from
 * `--ui-text-on-brand-{primary,secondary}`, which is white for all 21 brands,
 * while their container took `--ui-background-brand-primary`, which is each
 * brand's own colour. On a dark brand that is fine. On `telstra`, whose sidebar
 * fill is white, it rendered **white text on white** — three of four nav items
 * were invisible, at 1.00:1.
 *
 * The striking part is that the token bundle already shipped the right answer:
 * `--ui-palette-branding-telstra-sidebarprimary-label-idle` is a magenta that
 * measures 7.09:1 on that fill. Design had solved it; the semantic wiring simply
 * never referenced it. Exactly three brands ship these entries — `telstra`,
 * `light-gray`, `yellow-1c` — and they are precisely the three with light
 * sidebar fills.
 *
 * ── WHY THE WIRING, NOT THE RATIO ───────────────────────────────────────────
 * The obvious test — "every brand's sidebar label clears 4.5:1" — cannot pass
 * today: the other brands ship no foreground entry at all, so there is nothing
 * to wire and their white label genuinely fails. Encoding those as expected
 * failures would be a baseline of known-bad, which is the pattern this whole
 * audit exists to escape.
 *
 * Asserting the wiring instead is both stricter and more useful. It fails if a
 * Figma re-emit reverts the alias (the sync is one-way, so that will be
 * proposed), and it **automatically extends**: the day design adds
 * `sidebarprimary-label-*` for `pinky`, this test starts requiring it to be
 * used, rather than letting a shipped fix sit unwired for another release.
 */

const require = createRequire(import.meta.url);
const CSS_DIR = dirname(require.resolve('@constructor-lab/tokens/css'));

const PRIMITIVES = readFileSync(join(CSS_DIR, 'primitives.css'), 'utf8');
const SIDEBAR = readFileSync(
  join(CSS_DIR, 'components/SidebarPrimary.css'),
  'utf8'
);

/** Brands that ship a per-brand sidebar foreground in the palette. */
function brandsWithSidebarForeground(part: 'label' | 'icon'): string[] {
  const re = new RegExp(
    `--ui-palette-branding-([a-z0-9-]+)-sidebarprimary-${part}-idle\\s*:`,
    'g'
  );
  return [...new Set([...PRIMITIVES.matchAll(re)].map((m) => m[1]))].sort();
}

/** The declarations inside one `[data-brand='…']` block of the sidebar tier. */
function brandBlock(brand: string): string {
  const m = SIDEBAR.match(
    new RegExp(`\\[data-brand='${brand}'\\][^{]*\\{(.*?)\\n\\}`, 's')
  );
  return m?.[1] ?? '';
}

const LABEL_BRANDS = brandsWithSidebarForeground('label');
const ICON_BRANDS = brandsWithSidebarForeground('icon');

describe('per-brand sidebar foregrounds are actually wired', () => {
  it('finds the brands that ship one', () => {
    // Guards the guard: if the palette naming changes, every case below would
    // silently become vacuous instead of failing.
    expect(LABEL_BRANDS.length).toBeGreaterThan(0);
    expect(ICON_BRANDS).toEqual(LABEL_BRANDS);
  });

  // BOTH variants, and the split matters. `unselected` sits on the brand's
  // `background-idle`/`-hover`; `selected` sits on `background-active`. Those are
  // different fills, so they take different foregrounds — `-idle` and `-active`
  // respectively.
  //
  // The first version of this fix covered `unselected` only, on the reasoning
  // that a selected item sits on the brand's *dark accent* where white is right.
  // That was true of telstra and false of the other two: `light-gray`'s accent is
  // `rgb(195 231 249)` and `yellow-1c`'s is `rgb(236 193 9)`, giving white 1.30:1
  // and 1.72:1. Both ship a dark `label-active` that measures 13.19 and 9.98.
  // Generalising from one brand is exactly the mistake this matrix exists to
  // prevent.
  describe.each(LABEL_BRANDS)('%s', (brand) => {
    const block = brandBlock(brand);

    it('overrides the sidebar tier at all', () => {
      expect(
        block,
        `no [data-brand='${brand}'] block in SidebarPrimary.css`
      ).not.toBe('');
    });

    const CASES = (['selected', 'unselected'] as const).flatMap((variant) =>
      (['idle', 'hover', 'active'] as const).map((state) => ({
        variant,
        state,
      }))
    );

    it.each(CASES)(
      '$variant label + icon use it in $state',
      ({ variant, state }) => {
        for (const part of ['label', 'icon'] as const) {
          const decl = block.match(
            new RegExp(
              `--ui-sidebar-primary-menu-item-${variant}-${part}-color-${state}:\\s*([^;]+);`
            )
          )?.[1];

          expect(
            decl,
            `${brand} ships --ui-palette-branding-${brand}-sidebarprimary-${part}-* ` +
              `but the sidebar tier does not override ${variant}-${part}-color-${state}`
          ).toBeDefined();

          expect(
            decl,
            `${brand} ${variant}-${part}-color-${state} is "${decl}" — it must reference ` +
              `the brand's own foreground, not the shared white on-brand token, or a ` +
              `light brand fill renders invisible text`
          ).toContain(`branding-${brand}-sidebarprimary-${part}`);
        }
      }
    );
  });
});
