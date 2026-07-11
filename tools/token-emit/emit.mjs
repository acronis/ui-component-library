#!/usr/bin/env node
/**
 * Consolidated token emit pipeline (single entrypoint).
 *
 * Runs, in order, the same steps the former `packages/tokens` `emit` `&&` chain
 * ran — now that the scripts live here in one tools package:
 *   1. figma-snapshot-build.mjs --tmp   pull the Figma variable/style snapshot
 *   2. emit-primitives.mjs              snapshot → tiers/primitives.json
 *   3. emit-semantics.mjs              snapshot → tiers/semantics.json
 *   4. emit-components.mjs             snapshot → tiers/components.json
 *   5. themes-import.mjs               wire sparse per-brand entries into the tiers
 *
 * (Schema validation stays in `@spec-lab/tokens` `validate`, run after this.)
 * Each step runs in its own `node` process, mirroring the previous shell chain
 * exactly — same output.
 */
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

/** @type {[string, string[]][]} */
const steps = [
  ['figma-snapshot-build.mjs', ['--tmp']],
  ['emit-primitives.mjs', []],
  ['emit-semantics.mjs', []],
  ['emit-components.mjs', []],
  ['themes-import.mjs', []],
];

for (const [script, args] of steps) {
  execFileSync('node', [path.join(here, script), ...args], {
    stdio: 'inherit',
  });
}
