#!/usr/bin/env node
// tools/token-emit/emit-components.mjs
// Entry point for Step 6c: emit tiers/components.json from the current snapshot.
//
// Prerequisites:
//   - snapshot/figma-snapshot.json must exist
//   - tiers/primitives.json and tiers/semantics.json must be current
//
// Usage:
//   node tools/token-emit/emit-components.mjs                   # all allowlisted components
//   node tools/token-emit/emit-components.mjs --component Button # single component

import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { ComponentsEmitter } from './helpers/emit-components-builder.mjs';

const SNAPSHOT_PATH = fileURLToPath(
  new URL('./snapshot/figma-snapshot.json', import.meta.url)
);

if (!fs.existsSync(SNAPSHOT_PATH)) {
  console.error(`Missing snapshot: ${SNAPSHOT_PATH}`);
  console.error('Run figma-snapshot-build.mjs (Phase 2) first.');
  process.exit(1);
}

const args = process.argv.slice(2);
const compIdx = args.indexOf('--component');
const componentArg = compIdx !== -1 ? args[compIdx + 1] : null;

const snapshot = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf8'));
const opts = componentArg ? { components: [componentArg] } : {};
const emitter = new ComponentsEmitter(snapshot, opts);
emitter.emit();
console.log(`Wrote ${emitter.outputPath}`);

// Source-data problems, reported at the pull rather than three stages later in a
// stylesheet that fails to parse. These are Figma fixes (rename or delete the
// variable), not repo fixes, so they warn instead of failing the emit.
if (emitter.warnings.length > 0) {
  console.warn(
    `\n⚠ ${emitter.warnings.length} source problem(s) in the Figma variables — fix upstream:`
  );
  for (const warning of emitter.warnings) console.warn(`  ${warning}`);
}
