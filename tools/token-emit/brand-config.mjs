// Load-bearing brand identifiers for the theme wiring (themes-import.mjs).
//
// These are the two brands the emit pipeline references by NAME. They must match
// the canonical (hyphen-case) brand slugs the pipeline produces from Figma — the
// emitters fold spaces/underscores/case to kebab-case, so use that form here.
//
// If a brand is RENAMED in Figma, update the matching value below. A mismatch now
// fails the emit LOUDLY (see the guards in themes-import.mjs) instead of silently
// mis-wiring (or skipping) brand overrides.
export const brandConfig = {
  // The canonical default brand. Its values live at :root and every other brand
  // overrides against it. Present in the tier `values` maps, not palette.branding.
  defaultBrand: 'default',

  // The legacy default-brand key, renamed to `defaultBrand` on import (idempotent).
  legacyDefaultBrand: 'acronis',

  // The non-default brand used as the diff template for grayscale-based brands
  // (it uses palette.grayscale.* where the default uses palette.blue.*). Must be a
  // key in primitives.palette.branding.
  referenceBrand: 'deep-sky-itkontoret',
};
