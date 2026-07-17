/**
 * settings-spike.mjs — second screen-audit spike, on a FORM-HEAVY screen.
 *
 * Captures the FormLayout composite (story `components-formlayout--default`, an
 * assembled <form> of 8 mixed controls + a save/cancel row) and runs it through
 * `screen-audit` against the `settings-form` descriptor. Goal: see what the
 * presentational/layout detectors catch on a form, and — via an injected drift
 * pass — what they MISS (the coverage gaps worth new detectors).
 *
 * Prereq: Storybook up at http://localhost:6007.
 * Run:    node prototypes/generate-lint-audit/settings-spike.mjs
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '../..');
const OUT = resolve(HERE, 'out');
mkdirSync(OUT, { recursive: true });

const SCREEN = 'settings-form';
const TSX = resolve(ROOT, 'packages/ui-spec/node_modules/.bin/tsx');
const CAPTURE_FILE = resolve(ROOT, 'packages/ui-react/__spike-capture.mts');

const bar = (s) => `\n${'━'.repeat(72)}\n${s}\n${'━'.repeat(72)}`;
const run = (cmd, args) =>
  spawnSync(cmd, args, { cwd: ROOT, encoding: 'utf8' });

const CAPTURE_SRC = `import { writeFileSync } from 'node:fs';
import { chromium } from '@playwright/test';
import { collectScreenSnapshot } from '../ui-spec/screens/audit/probe';

const [storyId, outPath, variant = 'clean'] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.addInitScript(() => {
  globalThis.__name = globalThis.__name || ((fn) => fn);
});
await page.goto(\`http://localhost:6007/iframe.html?id=\${storyId}&viewMode=story\`, {
  waitUntil: 'networkidle',
});
await page.waitForTimeout(300);

if (variant === 'drift') {
  // Form-specific drift, to probe detector coverage:
  //  (a) a control-height mismatch in the save/cancel row   -> SHOULD be caught (Z2)
  //  (b) one field far narrower than its peers               -> width parity (no detector)
  //  (c) an off-grid gap above a field                        -> vertical rhythm (needs a landmark)
  await page.evaluate(() => {
    const form = document.querySelector('form') || document.querySelector('#storybook-root');
    if (!form) return;
    const btns = form.querySelectorAll('button');
    if (btns.length) btns[btns.length - 1].style.height = '52px';       // (a)
    const inputs = form.querySelectorAll('input:not([type="checkbox"]):not([type="radio"])');
    if (inputs.length) inputs[0].style.width = '120px';                  // (b)
    if (inputs.length > 2 && inputs[2].parentElement)
      inputs[2].parentElement.style.marginTop = '13px';                 // (c)
  });
  await page.waitForTimeout(50);
}

const snapshot = await page.evaluate(collectScreenSnapshot, {
  screen: 'settings-form',
  story: storyId,
  colorMode: 'light',
});
writeFileSync(outPath, JSON.stringify(snapshot, null, 2));
await browser.close();
process.stdout.write(\`captured \${snapshot.nodes.length} nodes (\${storyId}, \${variant})\\n\`);
`;

function capture(storyId, variant, tag) {
  const snap = resolve(OUT, `${SCREEN}.${tag}.json`);
  const cap = run(TSX, [CAPTURE_FILE, storyId, snap, variant]);
  process.stdout.write((cap.stdout || '') + (cap.stderr || ''));
  return cap.status === 0 ? snap : null;
}

function audit(snap, title) {
  const r = run('pnpm', [
    '--filter',
    '@constructor-lab/ui-spec',
    'screen-audit',
    SCREEN,
    snap,
  ]);
  console.log(bar(title));
  console.log(
    ((r.stdout || '') + (r.stderr || ''))
      .split('\n')
      .filter((l) => !/^>|ERR_PNPM|Exit status|pnpm/.test(l))
      .join('\n')
      .trim()
  );
}

// ── analysis: expose form-specific coverage gaps numerically ──────────────────
function analyze(snapPath) {
  const s = JSON.parse(readFileSync(snapPath, 'utf8'));
  const fields = s.nodes.filter((n) =>
    ['input', 'select', 'textarea'].includes(n.tag)
  );
  const widths = fields
    .filter((n) => n.tag !== 'textarea')
    .map((n) => n.rect.width);
  const distinctW = [...new Set(widths.map((w) => Math.round(w / 4) * 4))].sort(
    (a, b) => a - b
  );
  // vertical gaps between successive labelled rows (proxy: label nodes)
  const labels = s.nodes
    .filter((n) => n.tag === 'label' && n.ownText)
    .sort((a, b) => a.rect.y - b.rect.y);
  const gaps = [];
  for (let i = 1; i < labels.length; i++)
    gaps.push(labels[i].rect.y - labels[i - 1].rect.y);
  console.log(
    bar('ANALYSIS · form-shape invariants the detectors do not model')
  );
  console.log(
    `fields measured: ${fields.length} (inputs/selects ${widths.length}, +textarea)`
  );
  console.log(
    `control widths (px, 4px-bucketed): ${distinctW.join(', ')}  → ${distinctW.length} distinct`
  );
  console.log(`label-row pitches (px): ${gaps.join(', ')}`);
  console.log(
    `off-grid pitches (not %4): ${gaps.filter((g) => g % 4 !== 0).join(', ') || 'none'}`
  );
}

// ── run ───────────────────────────────────────────────────────────────────────
writeFileSync(CAPTURE_FILE, CAPTURE_SRC);
try {
  const clean = capture('components-formlayout--default', 'clean', 'default');
  const drift = capture(
    'components-formlayout--default',
    'drift',
    'default-drift'
  );
  const disabled = capture(
    'components-formlayout--disabled',
    'clean',
    'disabled'
  );

  if (clean) audit(clean, 'FormLayout · Default (clean)');
  if (drift)
    audit(
      drift,
      'FormLayout · Default (drift: height-mismatch + narrow field + off-grid gap)'
    );
  if (disabled) audit(disabled, 'FormLayout · Disabled (A2 disabled-parity)');
  if (clean) analyze(clean);
} finally {
  rmSync(CAPTURE_FILE, { force: true });
}
