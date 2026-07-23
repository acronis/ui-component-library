#!/usr/bin/env node
// figma-page-watch — track a per-page change signal for the Figma component pages
// and plan ui-component updates when a page drifts. The agent can pipe signals in
// (a get_metadata fingerprint / a figma-console version), OR the `--fetch` modes
// call the Figma REST API directly with a token (see figmaToken) — no MCP needed.
// Either way the script diffs signals against the committed manifest and records
// the new state.
//
// Manifest: packages/ui-spec/figma/page-watch.json (pages ↔ components + last-seen
// signal). "signal" is any stable string — a `fingerprint` of get_metadata output
// or a Figma version id — the script only compares equality.
//
// Usage:
//   node page-watch.mjs sync [--fetch | <pages.txt>|-]      # reconcile pages[]; --fetch = ALL pages via Figma REST (needs a token)
//   node page-watch.mjs fingerprint [<page-metadata.txt>|-]  # sha for a page's get_metadata dump (reads stdin if - / omitted)
//   node page-watch.mjs plan  <current.json>|--fetch        # diff vs manifest → plan (--fetch = REST signals)
//   node page-watch.mjs record <current.json>|--fetch [--all]  # write signals into the manifest (--fetch = REST)
//   node page-watch.mjs list                              # show watched pages + stored state
//
// <current.json>: { "<pageId>": { "signal": "<sha|version>", "version"?: "...", "changedAt"?: "..." }, ... }
// Keys may be page ids ("2862:13287") or page names ("Button").
//
// Exit codes: `plan` → 1 if any page CHANGED (drift) or a mapped component is
// missing; else 0. Other subcommands → 0 on success, 2 on usage/IO error.

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');
const SKILL_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST = join(ROOT, 'packages/ui-spec/figma/page-watch.json');
const COMPONENTS_DIR = join(ROOT, 'packages/ui-spec/components');

// Minimal KEY=VALUE parser for a gitignored .env.local placed next to the skill
// (or at the repo root) — no dotenv dependency. First file wins.
function loadEnvLocal() {
  const env = {};
  for (const file of [join(SKILL_DIR, '.env.local'), join(ROOT, '.env.local')]) {
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, 'utf8').split('\n')) {
      const mm = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (!mm || line.trim().startsWith('#')) continue;
      let v = mm[2];
      if (/^(".*"|'.*')$/.test(v)) v = v.slice(1, -1);
      if (!(mm[1] in env)) env[mm[1]] = v;
    }
  }
  return env;
}

// Resolve a Figma token from the env or .env.local — accepts several names,
// including the icons fetcher's FIGMA_FETCHER_FIGMA_TOKEN so it isn't duplicated.
function figmaToken() {
  const local = loadEnvLocal();
  const pick = (k) => process.env[k] || local[k];
  return (
    pick('FIGMA_TOKEN') ||
    pick('FIGMA_PAT') ||
    pick('FIGMA_ACCESS_TOKEN') ||
    pick('FIGMA_FETCHER_FIGMA_TOKEN')
  );
}

// Compute a per-page signal from the Figma REST API: hash a SHALLOW slice of each
// page's node tree (`/v1/files/:key/nodes?ids=…&depth=2`, batched). depth=2 keeps
// it small (~KB, not the tens-of-MB full subtree) and stable/batchable while still
// covering the page's frames + component/variant structure — a coarse "did this
// page change" tripwire (add/remove/rename/move/resize). A deep style-only edit
// may not flip it; /component-readiness catches those. Token-based signal used by
// `plan --fetch` / `record --fetch`; don't mix with get_metadata fingerprints.
const FETCH_DEPTH = 2;
async function fetchSignals(m, tok) {
  const ids = m.pages.map((p) => p.id);
  const out = {};
  const BATCH = 12;
  for (let i = 0; i < ids.length; i += BATCH) {
    const chunk = ids.slice(i, i + BATCH);
    const res = await fetch(
      `https://api.figma.com/v1/files/${m.fileKey}/nodes?ids=${encodeURIComponent(chunk.join(','))}&depth=${FETCH_DEPTH}`,
      { headers: { 'X-Figma-Token': tok } }
    );
    if (!res.ok) die(`Figma REST ${res.status}: ${(await res.text()).slice(0, 200)}`);
    const j = await res.json();
    for (const id of chunk) {
      const node = j.nodes?.[id]?.document;
      if (!node) {
        console.error(`  (no node returned for ${id})`);
        continue;
      }
      out[id] = {
        signal: createHash('sha256')
          .update(JSON.stringify(node))
          .digest('hex')
          .slice(0, 16),
        version: m.lastModified ?? null,
      };
    }
  }
  return out;
}

function die(msg, code = 2) {
  console.error(msg);
  process.exit(code);
}

function loadManifest() {
  if (!existsSync(MANIFEST)) die(`manifest not found: ${MANIFEST}`);
  return JSON.parse(readFileSync(MANIFEST, 'utf8'));
}

function saveManifest(m) {
  writeFileSync(MANIFEST, `${JSON.stringify(m, null, 2)}\n`);
}

// Look up a live-signal entry by page id or (case-insensitive) name.
function pickCurrent(current, page) {
  if (current[page.id]) return current[page.id];
  const byName = Object.keys(current).find(
    (k) => k.toLowerCase() === page.name.toLowerCase()
  );
  return byName ? current[byName] : undefined;
}

const componentExists = (name) =>
  existsSync(join(COMPONENTS_DIR, name, 'index.yaml'));

// Parse a page list into [{ id, name }]. Accepts the raw get_metadata(fileKey)
// dump ("- 419:1493: Index" lines) or JSON ([{id,name}] / {id:name}). Ids are
// normalized to the ":" form.
function parsePages(text) {
  const t = text.trim();
  if (t.startsWith('[') || t.startsWith('{')) {
    const j = JSON.parse(t);
    const arr = Array.isArray(j)
      ? j.map((p) => ({ id: p.id, name: p.name }))
      : Object.entries(j).map(([id, name]) => ({ id, name }));
    return arr.map((p) => ({ id: String(p.id).replace('-', ':'), name: String(p.name) }));
  }
  const out = [];
  for (const line of text.split('\n')) {
    const mm = line.match(/^\s*-?\s*(\d+[:-]\d+)\s*:\s*(.+?)\s*$/);
    if (mm) out.push({ id: mm[1].replace('-', ':'), name: mm[2] });
  }
  return out;
}

const [, , cmd, arg, ...rest] = process.argv;

if (cmd === 'fingerprint') {
  // Read the page metadata from a file, or from stdin when the arg is "-" or
  // omitted (fd 0) — so the agent can pipe get_metadata output straight in
  // without a temp file.
  const text =
    !arg || arg === '-' ? readFileSync(0, 'utf8') : readFileSync(arg, 'utf8');
  // Full-content hash — any add / move / resize / rename in the page flips it.
  console.log(createHash('sha256').update(text).digest('hex').slice(0, 16));
  process.exit(0);
}

if (cmd === 'list') {
  const m = loadManifest();
  console.log(`file ${m.fileKey} — ${m.pages.length} watched pages\n`);
  for (const p of m.pages) {
    const state = p.signal ? `signal ${p.signal}` : 'NO BASELINE';
    console.log(
      `  ${p.name.padEnd(12)} ${p.id.padEnd(13)} ${state}` +
        `${p.checkedAt ? `  (checked ${p.checkedAt})` : ''}` +
        `\n      components: ${p.components.length ? p.components.join(', ') : '—'}`
    );
  }
  process.exit(0);
}

if (cmd === 'sync') {
  // Reconcile the manifest's pages[] with the live Figma page list — add new
  // pages, update renamed ones, preserving each existing page's curated
  // components[] + signal. New pages come in with empty components (curate them).
  const m = loadManifest();
  let src;
  if (arg === '--fetch' || rest.includes('--fetch')) {
    // Authoritative full page list from the Figma REST API. The MCP's
    // get_metadata(fileKey) only returns pages currently LOADED in the desktop
    // app (Figma lazy-loads pages), so it undercounts — REST returns every page.
    const tok = figmaToken();
    if (!tok)
      die(
        'sync --fetch needs a Figma token. Set FIGMA_TOKEN in the env, or add\n' +
          '.claude/skills/figma-page-watch/.env.local (gitignored — see .env.local.example).'
      );
    const res = await fetch(
      `https://api.figma.com/v1/files/${m.fileKey}?depth=1`,
      { headers: { 'X-Figma-Token': tok } }
    );
    if (!res.ok) die(`Figma REST ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const doc = await res.json();
    src = JSON.stringify(
      (doc.document?.children ?? []).map((p) => ({ id: p.id, name: p.name }))
    );
  } else {
    src = !arg || arg === '-' ? readFileSync(0, 'utf8') : readFileSync(arg, 'utf8');
  }
  const live = parsePages(src);
  if (!live.length)
    die(
      'no pages parsed — use `sync --fetch` (REST, needs a token) or pipe a full page list ' +
        '(JSON [{id,name}] or "- <id>: <name>" lines). NOTE: get_metadata(fileKey) lists only ' +
        'loaded pages and undercounts — prefer --fetch.'
    );
  const had = new Set(m.pages.map((p) => p.id));
  const liveIds = new Set(live.map((p) => p.id));
  let added = 0;
  let renamed = 0;
  for (const { id, name } of live) {
    const existing = m.pages.find((p) => p.id === id);
    if (existing) {
      if (existing.name !== name) {
        existing.name = name;
        renamed += 1;
      }
    } else {
      m.pages.push({
        id,
        name,
        components: [],
        signal: null,
        version: null,
        changedAt: null,
        checkedAt: null,
      });
      added += 1;
    }
  }
  const orphans = m.pages.filter((p) => !liveIds.has(p.id));
  saveManifest(m);
  console.log(
    `synced: +${added} new, ${renamed} renamed, ${live.length - added - renamed} unchanged`
  );
  if (added)
    console.log(
      '  new pages (curate their components[]):\n' +
        live
          .filter((l) => !had.has(l.id))
          .map((l) => `    ${l.name} (${l.id})`)
          .join('\n')
    );
  if (orphans.length)
    console.log(
      `  ⚠ ${orphans.length} manifest page(s) not in the live list (kept — review/remove):\n` +
        orphans.map((p) => `    ${p.name} (${p.id})`).join('\n')
    );
  process.exit(0);
}

if (cmd === 'plan' || cmd === 'record') {
  const m = loadManifest();
  const useFetch = arg === '--fetch' || rest.includes('--fetch');
  let current;
  if (useFetch) {
    const tok = figmaToken();
    if (!tok)
      die(
        `${cmd} --fetch needs a Figma token (env FIGMA_TOKEN or the gitignored .env.local)`
      );
    current = await fetchSignals(m, tok);
  } else {
    if (!arg)
      die(`usage: page-watch.mjs ${cmd} <current.json> | --fetch  [--all]`);
    current = JSON.parse(readFileSync(arg, 'utf8'));
  }
  const recordAll = rest.includes('--all') || arg === '--all';
  const changed = [];
  const baseline = [];
  const unchanged = [];
  const missingComponents = [];

  for (const page of m.pages) {
    const cur = pickCurrent(current, page);
    if (!cur || !cur.signal) continue; // no live signal supplied for this page
    if (page.signal == null) baseline.push(page);
    else if (cur.signal !== page.signal) changed.push(page);
    else unchanged.push(page);
    for (const c of page.components)
      if (!componentExists(c)) missingComponents.push(`${page.name} → ${c}`);
  }

  if (cmd === 'plan') {
    const line = (p) =>
      `  ${p.name} (${p.id}) → ${p.components.length ? p.components.join(', ') : 'no components mapped'}`;
    if (changed.length) {
      console.log(`\n⚠  ${changed.length} page(s) CHANGED since last check:`);
      changed.forEach((p) => console.log(line(p)));
      console.log('\n  Plan — reconcile each mapped component against its page:');
      for (const p of changed)
        for (const c of p.components)
          console.log(
            `    /figma-component ${c} ${m.fileUrl}?node-id=${p.id.replace(':', '-')} --update`
          );
      console.log(
        '    (or /component-readiness <C> for a read-only drift check first)'
      );
    }
    if (baseline.length)
      console.log(
        `\nℹ  ${baseline.length} page(s) have NO baseline yet — run \`record\` to set it:\n` +
          baseline.map((p) => `  ${p.name} (${p.id})`).join('\n')
      );
    if (unchanged.length)
      console.log(`\n✓  ${unchanged.length} page(s) unchanged.`);
    if (missingComponents.length)
      console.log(
        `\n✗  mapped components with no ui-spec (fix the manifest):\n` +
          missingComponents.map((x) => `  ${x}`).join('\n')
      );
    if (!changed.length && !baseline.length && !unchanged.length)
      console.log(
        'No live signals matched the manifest pages — check <current.json> keys (page id or name).'
      );
    process.exit(changed.length || missingComponents.length ? 1 : 0);
  }

  // record — write the supplied signals into the manifest.
  const now = new Date().toISOString();
  let wrote = 0;
  for (const page of m.pages) {
    const cur = pickCurrent(current, page);
    if (!cur || !cur.signal) continue;
    // By default only advance pages that actually changed or lack a baseline;
    // --all re-stamps every supplied page (e.g. after a mapping edit).
    const isNew = page.signal == null;
    const isChanged = page.signal !== cur.signal;
    if (!recordAll && !isNew && !isChanged) continue;
    page.signal = cur.signal;
    if (cur.version !== undefined) page.version = cur.version;
    if (cur.changedAt !== undefined) page.changedAt = cur.changedAt;
    page.checkedAt = now;
    wrote += 1;
  }
  saveManifest(m);
  console.log(`recorded ${wrote} page signal(s) → ${MANIFEST.replace(ROOT + '/', '')}`);
  process.exit(0);
}

die(
  'usage: page-watch.mjs <sync|fingerprint|plan|record|list> …\n' +
    '  sync [--fetch | <pages.txt>|-]        (--fetch = ALL pages via REST; get_metadata undercounts)\n' +
    '  fingerprint [<page-metadata.txt>|-]   (reads stdin if - / omitted)\n' +
    '  plan <current.json> | --fetch          (--fetch = REST signals)\n' +
    '  record <current.json> | --fetch [--all]\n' +
    '  list'
);
