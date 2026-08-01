#!/usr/bin/env node
/**
 * check-inventory — the "only existing components" gate for /figma-demo.
 *
 * A demo in `apps/demos/src` may only compose what the library already ships.
 * This script resolves every name you plan to import against the real
 * inventory:
 *
 *   - components: the barrels under `packages/ui-react/src/components/ui/<x>/index.ts`
 *     plus the cross-cutting exports in `packages/ui-react/src/index.ts`
 *   - icons: the generated `export { … }` block of each
 *     `packages/icons-react/src/packs/<pack>/index.ts`
 *
 * Usage:
 *   node .claude/skills/figma-demo/scripts/check-inventory.mjs Button SidebarPrimary ChevronRightIcon
 *   node .claude/skills/figma-demo/scripts/check-inventory.mjs --list sidebar
 *
 * Exit code 1 when any name is MISSING (or when --list finds nothing), so it
 * can be used as a hard gate before writing the demo.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '../../../..');
const UI_DIR = resolve(REPO, 'packages/ui-react/src/components/ui');
const UI_ROOT_INDEX = resolve(REPO, 'packages/ui-react/src/index.ts');
const PACKS_DIR = resolve(REPO, 'packages/icons-react/src/packs');

/** Value exports of a barrel: `export { A, B as C }`, `export const/function X`. */
function exportedNames(file) {
  const src = readFileSync(file, 'utf-8');
  const names = new Set();

  // `export { A, type B, C as D } from '…'` / `export { … }`
  for (const match of src.matchAll(/export\s+(type\s+)?\{([^}]*)\}/g)) {
    if (match[1]) continue; // `export type { … }` — not a runtime value
    for (const raw of match[2].split(',')) {
      const entry = raw.trim();
      if (!entry || entry.startsWith('type ')) continue;
      const name = (entry.split(/\s+as\s+/).pop() ?? '').trim();
      if (/^[A-Za-z_$][\w$]*$/.test(name)) names.add(name);
    }
  }

  // `export const X` / `export function X` / `export class X`
  for (const match of src.matchAll(
    /export\s+(?:declare\s+)?(?:const|function|class)\s+([A-Za-z_$][\w$]*)/g
  )) {
    names.add(match[1]);
  }

  return names;
}

function collectComponents() {
  const inventory = new Map();
  if (existsSync(UI_ROOT_INDEX)) {
    for (const name of exportedNames(UI_ROOT_INDEX))
      inventory.set(name, '@constructor-lab/ui-react');
  }
  for (const entry of readdirSync(UI_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const barrel = join(UI_DIR, entry.name, 'index.ts');
    if (!existsSync(barrel)) continue;
    for (const name of exportedNames(barrel))
      inventory.set(name, `@constructor-lab/ui-react (${entry.name})`);
  }
  return inventory;
}

function collectIcons() {
  const inventory = new Map();
  if (!existsSync(PACKS_DIR)) return inventory;
  for (const entry of readdirSync(PACKS_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const barrel = join(PACKS_DIR, entry.name, 'index.ts');
    if (!existsSync(barrel)) continue;
    for (const name of exportedNames(barrel)) {
      // First pack wins the "where" label; note extra packs after it.
      const seen = inventory.get(name);
      inventory.set(
        name,
        seen
          ? `${seen}, ${entry.name}`
          : `@constructor-lab/icons-react/${entry.name}`
      );
    }
  }
  return inventory;
}

/** Names sharing a >=4-char substring with the query, for MISSING hints. */
function suggest(query, inventories) {
  const needle = query.toLowerCase().replace(/icon$/, '');
  if (needle.length < 4) return [];
  const hits = [];
  for (const inventory of inventories) {
    for (const name of inventory.keys()) {
      const hay = name.toLowerCase();
      if (hay.includes(needle) || needle.includes(hay.replace(/icon$/, '')))
        hits.push(name);
    }
  }
  return hits.slice(0, 6);
}

const args = process.argv.slice(2);
const components = collectComponents();
const icons = collectIcons();

if (args[0] === '--list') {
  const needle = (args[1] ?? '').toLowerCase();
  const rows = [...components, ...icons].filter(([name]) =>
    name.toLowerCase().includes(needle)
  );
  for (const [name, where] of rows.sort(([a], [b]) => a.localeCompare(b))) {
    console.log(`${name}\t${where}`);
  }
  console.log(
    `\n${rows.length} match(es) · inventory: ${components.size} components, ${icons.size} icons`
  );
  process.exit(rows.length > 0 ? 0 : 1);
}

if (args.length === 0) {
  console.error(
    'usage: check-inventory.mjs <Name…>   |   check-inventory.mjs --list <substring>'
  );
  process.exit(2);
}

let missing = 0;
for (const name of args) {
  const where = components.get(name) ?? icons.get(name);
  if (where) {
    console.log(`OK       ${name}\t${where}`);
    continue;
  }
  missing += 1;
  const hints = suggest(name, [components, icons]);
  console.log(
    `MISSING  ${name}${hints.length ? `\tdid you mean: ${hints.join(', ')}` : ''}`
  );
}

console.log(
  `\n${args.length - missing}/${args.length} resolved · inventory: ${components.size} components, ${icons.size} icons`
);
if (missing > 0) {
  console.log(
    'MISSING names must NOT be hand-rolled in a demo — see the skill Phase 2 gate.'
  );
  process.exit(1);
}
