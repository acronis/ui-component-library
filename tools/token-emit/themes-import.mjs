#!/usr/bin/env node
/**
 * themes-import
 *
 * Idempotent — safe to run multiple times. Three passes over the brand-axis
 * token tiers (semantics.json, components.json):
 *
 *  1. RENAME — renames the default brand key from 'acronis' to 'default' in
 *     every values dict.
 *
 *  2. STRIP — removes brand entries whose value is identical to the default
 *     brand's value. The CSS cascade provides the :root (default) value
 *     automatically, so explicit repetition is pure noise.
 *
 *  3. WIRE — adds sparse brand entries for every brand that has a
 *     `palette.branding.<brand>` entry in primitives.json and whose value
 *     would genuinely differ from the default:
 *       • colors.background.brand.{primary,primary-*}  → sidebarprimary palette
 *       • colors.background.brand.{secondary,secondary-*} → buttonprimary palette
 *       • all other "differing" tokens (surface tinting, borders, glyphs,
 *         links) → copy the reference-brand value (deep-sky-itkontoret uses
 *         palette.grayscale.* instead of palette.blue.*)
 *
 * Usage:
 *   node tools/token-emit/themes-import.mjs [--dry-run]
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { brandConfig } from './brand-config.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TIERS_DIR = resolve(__dirname, '../../packages/tokens/tiers');

// Load-bearing brand identifiers — configured in brand-config.mjs so a Figma
// rename is a one-line edit there (and is validated below), never a silent break.
const OLD_DEFAULT = brandConfig.legacyDefaultBrand; // legacy default brand key
const DEFAULT_BRAND = brandConfig.defaultBrand; // canonical default brand key
const REFERENCE_BRAND = brandConfig.referenceBrand; // non-default diff template

const DRY_RUN = process.argv.includes('--dry-run');

// ---------------------------------------------------------------------------
// I/O helpers
// ---------------------------------------------------------------------------

function readTier(name) {
  return JSON.parse(readFileSync(resolve(TIERS_DIR, `${name}.json`), 'utf8'));
}

function writeTier(name, data) {
  if (DRY_RUN) {
    console.log(`[dry-run] would write ${name}.json`);
    return;
  }
  writeFileSync(
    resolve(TIERS_DIR, `${name}.json`),
    JSON.stringify(data, null, 2) + '\n'
  );
}

// ---------------------------------------------------------------------------
// Brand discovery
// ---------------------------------------------------------------------------

function getBrandsFromPrimitives(primitives) {
  const branding = primitives?.palette?.branding;
  if (!branding)
    throw new Error('primitives.json has no palette.branding section');
  return Object.keys(branding);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const isLeaf = (node) =>
  node !== null &&
  typeof node === 'object' &&
  'values' in node &&
  node.values !== null &&
  typeof node.values === 'object' &&
  !Array.isArray(node.values);

const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// True if any brand-keyed leaf in the tree carries `brand` in its `values` map.
const anyLeafHasBrand = (node, brand) => {
  if (!node || typeof node !== 'object') return false;
  if (isLeaf(node)) return brand in node.values;
  return Object.values(node).some((child) => anyLeafHasBrand(child, brand));
};

/**
 * Inspect each brand's primitive palette and return a map of
 * brand → { sidebar: <path-prefix>, button: <path-prefix> }.
 * Brands without a recognisable buttonprimary/sidebarprimary structure
 * are omitted from the map.
 */
function buildBrandPaths(primitiveBranding) {
  const map = {};
  for (const [brand, data] of Object.entries(primitiveBranding)) {
    const sp = data?.sidebarprimary;
    const bp = data?.buttonprimary;
    if (!bp) continue; // non-standard palette (e.g. red-home-pl uses 100/200/…)

    let sidebarBase = null;
    if (sp && 'idle' in sp) {
      sidebarBase = `palette.branding.${brand}.sidebarprimary`; // flat structure
    } else if (sp?.background && 'idle' in sp.background) {
      sidebarBase = `palette.branding.${brand}.sidebarprimary.background`; // nested
    }
    if (sidebarBase) {
      map[brand] = {
        sidebar: sidebarBase,
        button: `palette.branding.${brand}.buttonprimary`,
      };
    }
  }
  return map;
}

/**
 * For the 8 direct brand-CTA tokens under colors.background.brand.*, returns:
 *   string    — a valid palette.branding alias for this brand
 *   undefined — this IS a sidebar/button token but the brand has no palette → skip
 *   null      — NOT a sidebar/button token (caller may copy reference-brand value)
 */
function brandingRef(brand, path, brandPaths) {
  if (path[0] !== 'colors' || path[1] !== 'background' || path[2] !== 'brand') {
    return null;
  }
  const token = path[3];
  const sidebar = {
    primary: 'idle',
    'primary-hover': 'hover',
    'primary-active': 'active',
    'primary-disabled': 'disabled',
  };
  const button = {
    secondary: 'idle',
    'secondary-hover': 'hover',
    'secondary-active': 'active',
    'secondary-disabled': 'disabled',
  };

  const isSidebar = Object.hasOwn(sidebar, token);
  const isButton = Object.hasOwn(button, token);
  if (!isSidebar && !isButton) return null; // e.g. brand.inverse.*, brand.status.*

  const paths = brandPaths[brand];
  if (!paths) return undefined; // sidebar/button token but brand has no standard palette

  if (isSidebar) return `{${paths.sidebar}.${sidebar[token]}}`;
  return `{${paths.button}.${button[token]}}`;
}

// ---------------------------------------------------------------------------
// Pass 1 — rename 'acronis' → 'default'
// ---------------------------------------------------------------------------

function rename(node) {
  if (!node || typeof node !== 'object') return;
  if (isLeaf(node)) {
    if (OLD_DEFAULT in node.values && !(DEFAULT_BRAND in node.values)) {
      node.values[DEFAULT_BRAND] = node.values[OLD_DEFAULT];
      delete node.values[OLD_DEFAULT];
    }
    return;
  }
  for (const key of Object.keys(node)) {
    if (key.startsWith('$')) continue;
    rename(node[key]);
  }
}

// ---------------------------------------------------------------------------
// Pass 2 — strip redundant brand entries (value == default value)
// ---------------------------------------------------------------------------

function strip(node, stripRefCopies = false) {
  if (!node || typeof node !== 'object') return 0;
  if (isLeaf(node)) {
    if (!(DEFAULT_BRAND in node.values)) return 0;
    const def = node.values[DEFAULT_BRAND];
    const ref = node.values[REFERENCE_BRAND]; // may be undefined
    let removed = 0;
    for (const brand of Object.keys(node.values)) {
      if (brand === DEFAULT_BRAND) continue;
      if (eq(node.values[brand], def)) {
        delete node.values[brand];
        removed++;
        continue;
      }
      // For the components tier: also strip entries copied from the reference
      // brand (wrongly propagated by a previous script run). Keep the reference
      // brand itself; only strip OTHER brands whose value matches it.
      if (
        stripRefCopies &&
        brand !== REFERENCE_BRAND &&
        ref !== undefined &&
        eq(node.values[brand], ref)
      ) {
        delete node.values[brand];
        removed++;
      }
    }
    return removed;
  }
  let total = 0;
  for (const key of Object.keys(node)) {
    if (key.startsWith('$')) continue;
    total += strip(node[key], stripRefCopies);
  }
  return total;
}

// ---------------------------------------------------------------------------
// Pass 3 — remove palette.branding.* aliases that don't resolve in primitives
// ---------------------------------------------------------------------------

function getIn(obj, dotPath) {
  return dotPath.split('.').reduce((o, k) => o?.[k], obj);
}

function fixInvalidRefs(node, primitiveSrc) {
  if (!node || typeof node !== 'object') return 0;
  if (isLeaf(node)) {
    let removed = 0;
    for (const brand of Object.keys(node.values)) {
      if (brand === DEFAULT_BRAND) continue;
      const val = node.values[brand];
      if (typeof val !== 'string') continue;
      const m = val.match(/^\{(palette\.branding\.[^}]+)\}$/);
      if (!m) continue;
      const target = getIn(primitiveSrc, m[1]);
      // Valid target must be a token leaf (has a values dict with light/dark keys)
      const valid = target && typeof target === 'object' && 'values' in target;
      if (!valid) {
        delete node.values[brand];
        removed++;
      }
    }
    return removed;
  }
  let total = 0;
  for (const key of Object.keys(node)) {
    if (key.startsWith('$')) continue;
    total += fixInvalidRefs(node[key], primitiveSrc);
  }
  return total;
}

// ---------------------------------------------------------------------------
// Pass 4 — wire brand entries where values genuinely differ
// ---------------------------------------------------------------------------

function wire(node, brands, brandPaths, path = [], copyRefValues = true) {
  if (!node || typeof node !== 'object') return 0;
  if (isLeaf(node)) {
    if (!(DEFAULT_BRAND in node.values)) return 0;
    let count = 0;
    for (const brand of brands) {
      if (brand in node.values) continue;

      const ref = brandingRef(brand, path, brandPaths);

      if (ref === undefined) {
        // Sidebar/button token but brand has no standard palette → skip;
        // the default value applies via CSS cascade.
        continue;
      }

      if (ref !== null) {
        // Explicit palette alias for sidebar/button CTA tokens
        node.values[brand] = ref;
        count++;
        continue;
      }

      // null → not a sidebar/button token.
      // Only copy reference-brand value for semantics (grayscale tinting).
      // Component overrides are brand-specific decisions; don't propagate.
      if (copyRefValues && REFERENCE_BRAND in node.values) {
        node.values[brand] = node.values[REFERENCE_BRAND];
        count++;
      }
    }
    return count;
  }
  let total = 0;
  for (const key of Object.keys(node)) {
    if (key.startsWith('$')) continue;
    total += wire(node[key], brands, brandPaths, [...path, key], copyRefValues);
  }
  return total;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

if (DRY_RUN) console.log('--- DRY RUN (no files written) ---\n');

const primitives = readTier('primitives');
const allBrands = getBrandsFromPrimitives(primitives);

// Fail loudly if the configured reference brand no longer exists — e.g. renamed
// in Figma without updating brand-config.mjs. Without this, the grayscale diff
// template would silently be `undefined` and brand overrides would be mis-wired.
if (!allBrands.includes(REFERENCE_BRAND)) {
  throw new Error(
    `themes-import: referenceBrand "${REFERENCE_BRAND}" is not in ` +
      `primitives.palette.branding [${allBrands.join(', ')}]. If it was renamed ` +
      `in Figma, update referenceBrand in tools/token-emit/brand-config.mjs.`
  );
}

const brandPaths = buildBrandPaths(primitives.palette.branding);

// All non-default brands that may need entries
const otherBrands = allBrands.filter(
  (b) => b !== OLD_DEFAULT && b !== DEFAULT_BRAND && b !== REFERENCE_BRAND
);
// Brands needing entries = reference + all others (reference is the grayscale template)
const brandsToWire = [REFERENCE_BRAND, ...otherBrands];

const skipped = allBrands.filter(
  (b) => b !== OLD_DEFAULT && b !== DEFAULT_BRAND && !brandPaths[b]
);
if (skipped.length) {
  console.log(
    `Brands with non-standard palette (sidebar/button tokens will use default): ${skipped.join(', ')}`
  );
}

for (const tierName of ['semantics', 'components']) {
  const tier = readTier(tierName);

  rename(tier);
  // After the rename pass every brand-keyed tier must expose the default brand;
  // if it doesn't, the default was renamed in Figma out of sync with the config,
  // and the strip/wire passes would silently no-op against a phantom default.
  if (!anyLeafHasBrand(tier, DEFAULT_BRAND)) {
    throw new Error(
      `themes-import: no "${DEFAULT_BRAND}" brand entries in ${tierName}.json ` +
        `after rename (legacy key "${OLD_DEFAULT}"). If the default brand was ` +
        `renamed in Figma, update defaultBrand/legacyDefaultBrand in ` +
        `tools/token-emit/brand-config.mjs.`
    );
  }
  const fixed = fixInvalidRefs(tier, primitives);
  const stripped = strip(tier, tierName === 'components');
  const wired = wire(
    tier,
    brandsToWire,
    brandPaths,
    [],
    tierName !== 'components'
  );

  writeTier(tierName, tier);
  console.log(
    `${tierName}.json  fixed ${fixed}, stripped ${stripped}, wired ${wired} value entries`
  );
}

console.log('\nNext:');
console.log('  pnpm --filter @constructor-lab/tokens validate');
console.log('  pnpm --filter @constructor-lab/tokens build');
