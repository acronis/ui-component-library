#!/usr/bin/env node
// token-gap-check — given the `get_variable_defs` output for a Figma node,
// map each COLOR variable the node references to its expected `--ui-*` token and
// report which are missing from @spec-lab/tokens (the generated css/).
//
// Usage:
//   node check.mjs <figma-vars.json> [--json]
//
// <figma-vars.json> is the raw MCP `get_variable_defs` result — a flat map of
//   "collection/group/.../name": "<resolved value>"
// (e.g. "semantics/colors/border/onStatus/ai": "#e4cced").
//
// Exit code: 1 if any actionable gap (a color var with no matching --ui-* token),
// else 0. Non-color vars (sizes, fonts) and primitive/legacy collections are not
// checked — the tier gaps that bite components are semantic + component colors.

import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const asJson = args.includes('--json');
const jsonPath = args.find((a) => !a.startsWith('--'));
if (!jsonPath) {
  console.error('usage: check.mjs <figma-vars.json> [--json]');
  process.exit(2);
}

// Repo root: this file is at .claude/skills/token-gap-check/scripts/check.mjs
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');
const CSS_DIR = resolve(ROOT, 'packages/tokens/css');

// ── collect every defined --ui-* token name from the generated css ──
function collectCss(dir) {
  let out = '';
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out += collectCss(p);
    else if (e.name.endsWith('.css')) out += readFileSync(p, 'utf8');
  }
  return out;
}
const css = collectCss(CSS_DIR);
const defined = new Set(
  [...css.matchAll(/(--ui-[a-z0-9-]+)\s*:/g)].map((m) => m[1])
);
const definedList = [...defined];

// camelCase / underscores / slashes → kebab segment
const kebab = (s) =>
  s
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .toLowerCase()
    .replace(/^-+|-+$/g, '');

// Map a Figma variable name → expected --ui-* token, or null if not a tier we
// map to --ui-* (primitives/palette, typography, componentLegacy, units…).
function toToken(name) {
  const parts = name.split('/');
  let path;
  if (parts[0] === 'semantics' && parts[1] === 'colors') path = parts.slice(2);
  else if (parts[0] === 'components') path = parts.slice(1);
  else return null;
  const seg = path.map(kebab).filter(Boolean).join('-');
  return seg ? `--ui-${seg}` : null;
}

const isColor = (v) =>
  typeof v === 'string' && /^(#|rgb|hsl|oklch|linear-gradient|radial-gradient)/i.test(v.trim());

const vars = JSON.parse(readFileSync(jsonPath, 'utf8'));

const rows = [];
for (const [name, value] of Object.entries(vars)) {
  if (!isColor(value)) continue; // only colours are the gap source
  const token = toToken(name);
  if (!token) {
    rows.push({ name, value, token: null, status: 'untracked' });
    continue;
  }
  if (defined.has(token)) {
    rows.push({ name, value, token, status: 'ok' });
  } else {
    // fuzzy: any defined token sharing the last two segments (e.g. -ai-strong)
    const tail = token.replace(/^--ui-/, '').split('-').slice(-2).join('-');
    const near = definedList.filter((t) => t.includes(tail));
    rows.push({ name, value, token, status: 'missing', near });
  }
}

const missing = rows.filter((r) => r.status === 'missing');
const ok = rows.filter((r) => r.status === 'ok');
const untracked = rows.filter((r) => r.status === 'untracked');

if (asJson) {
  console.log(JSON.stringify({ missing, ok, untracked }, null, 2));
  process.exit(missing.length ? 1 : 0);
}

const pad = (s, n) => String(s).padEnd(n);
console.log(
  `\ntoken-gap-check — ${rows.length} colour variable(s): ${ok.length} ok, ${missing.length} MISSING, ${untracked.length} untracked (primitive/legacy)\n`
);
if (missing.length) {
  console.log('MISSING — Figma colour variable with no matching --ui-* token:');
  for (const r of missing) {
    console.log(`  ✗ ${pad(r.name, 42)} → ${pad(r.token, 34)} (${r.value})`);
    if (r.near.length) console.log(`      closest defined: ${r.near.join(', ')}`);
  }
  console.log(
    '\nFix: add the missing token to packages/tokens/tiers/*.json + rebuild\n' +
      '(targeted), or run /figma-to-design-tokens for a full snapshot sync.'
  );
} else {
  console.log('✓ every referenced colour variable maps to a defined --ui-* token.');
}
if (untracked.length) {
  console.log(
    `\n(${untracked.length} untracked colour var(s) — palette/legacy collections not mapped to --ui-*; usually fine.)`
  );
}
process.exit(missing.length ? 1 : 0);
