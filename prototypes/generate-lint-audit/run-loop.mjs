/**
 * run-loop.mjs — prototype of the generate -> lint -> audit loop on ONE screen.
 *
 * It exercises the two verification modes the repo already ships, on the
 * `protection-dashboard` screen (story `ui-appshell--with-secondary`):
 *
 *   STATIC gate  — a generated app-screen fragment is linted with the repo's
 *                  `acronis-patterns` ESLint plugin (+ ui-spec `kit-lint`,
 *                  which guards the components the screen is built from).
 *   RENDERED gate — the story is rendered in Storybook, measured by the ui-spec
 *                  probe, and run through `screen-audit`.
 *
 * For each gate we run TWO rounds — a "drift" generation and a "clean" one —
 * so you can see the loop CATCH drift and then go green after the fix. This is
 * the honest test of "can rules hold the line without shipping the component".
 *
 * Prereq: Storybook up at http://localhost:6007
 *   pnpm --filter @constructor-lab/ui-react storybook
 *
 * Run:  node prototypes/generate-lint-audit/run-loop.mjs
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '../..');
const OUT = resolve(HERE, 'out');
mkdirSync(OUT, { recursive: true });

const STORY = 'ui-appshell--with-secondary';
const SCREEN = 'protection-dashboard';
// tsx lives in ui-spec; @playwright/test lives in ui-react. The capture script
// must run from ui-react's context to resolve Playwright, using ui-spec's tsx.
const TSX = resolve(ROOT, 'packages/ui-spec/node_modules/.bin/tsx');
const CAPTURE_FILE = resolve(ROOT, 'packages/ui-react/__loop-capture.mts');
// The generated screen fragment must live under apps/** for the ESLint plugin
// (scoped to apps/**/*.{jsx,tsx}) to see it.
const GEN_DIR = resolve(ROOT, 'apps/demo/src/__generated__');
const GEN_FILE = resolve(GEN_DIR, 'detail-panel.tsx');

const bar = (s) => `\n${'━'.repeat(72)}\n${s}\n${'━'.repeat(72)}`;
const run = (cmd, args, opts = {}) =>
  spawnSync(cmd, args, { cwd: ROOT, encoding: 'utf8', ...opts });

const results = [];

// ── the capture script (runs inside ui-react so Playwright resolves) ─────────
const CAPTURE_SRC = `import { writeFileSync } from 'node:fs';
import { chromium } from '@playwright/test';
import { collectScreenSnapshot } from '../ui-spec/screens/audit/probe';

const [storyId, colorModeArg, outPath, variant = 'clean'] = process.argv.slice(2);
const colorMode = colorModeArg === 'dark' ? 'dark' : 'light';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
// tsx/esbuild "keepNames" wraps the probe's inner helpers with __name(); that
// helper doesn't exist once Playwright serializes the fn into the page. Shim it.
await page.addInitScript(() => {
  globalThis.__name = globalThis.__name || ((fn) => fn);
});
await page.goto(\`http://localhost:6007/iframe.html?id=\${storyId}&viewMode=story\`, {
  waitUntil: 'networkidle',
});
await page.evaluate((mode) => {
  document.documentElement.dataset.theme = mode;
  document.documentElement.style.colorScheme = mode;
}, colorMode);
await page.waitForTimeout(300);

if (variant === 'drift') {
  // The kind of inconsistency a from-scratch, rules-only generation tends to
  // produce: an icon-only control with no accessible name, a control whose
  // height breaks the row's parity, and a low-contrast label — invariants a
  // component would guarantee for free but hand-assembled markup can break.
  await page.evaluate(() => {
    const header =
      document.querySelector('header') || document.querySelector('[role="banner"]');
    if (!header) return;
    const iconBtn = document.createElement('button'); // I1 + Z2
    iconBtn.style.height = '52px';
    iconBtn.style.width = '52px';
    iconBtn.style.marginLeft = '8px';
    iconBtn.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 16 16" data-slot="icon"><path d="M2 4h12" stroke="currentColor"/></svg>';
    header.appendChild(iconBtn);
    const label = document.createElement('span'); // I5
    label.textContent = 'Filters';
    label.style.color = 'rgb(200, 200, 200)';
    label.style.fontSize = '14px';
    label.style.marginLeft = '8px';
    header.appendChild(label);
  });
  await page.waitForTimeout(50);
}

const snapshot = await page.evaluate(collectScreenSnapshot, {
  screen: 'protection-dashboard',
  story: storyId,
  colorMode,
});
writeFileSync(outPath, JSON.stringify(snapshot, null, 2));
await browser.close();
process.stdout.write(\`captured \${snapshot.nodes.length} nodes (\${variant}, \${colorMode})\\n\`);
`;

// ── generation templates (the "AI output") ─────────────────────────────────
const DRIFT_SRC = `// GENERATED (round 1) — a hand-rolled fixed side panel.
export function DetailPanel() {
  return (
    <div className="fixed right-0 top-0 z-50 h-full w-96 bg-white p-6 shadow-lg">
      <h2 className="text-lg font-semibold">Details</h2>
      <p>Selected item details go here.</p>
    </div>
  );
}
`;
const CLEAN_SRC = `// GENERATED (round 2) — after the lint feedback. The canonical fix is the
// kit's <Sheet> (focus trap + scroll lock + ARIA + animation for free); for a
// dependency-free lint demo we drop the ad-hoc fixed/z-index panel and render
// the detail inline in the content flow.
export function DetailPanel() {
  return (
    <aside aria-label="Details" className="w-96 border-l border-border p-6">
      <h2 className="text-lg font-semibold">Details</h2>
      <p>Selected item details go here.</p>
    </aside>
  );
}
`;

function eslintGate(label, src, expectClean) {
  mkdirSync(GEN_DIR, { recursive: true });
  writeFileSync(GEN_FILE, src);
  const r = run('pnpm', ['exec', 'eslint', GEN_FILE]);
  const out = (r.stdout || '') + (r.stderr || '');
  const hitAdhoc = /acronis-patterns\/no-adhoc-sheet/.test(out);
  const pass = expectClean ? !hitAdhoc : hitAdhoc;
  console.log(bar(`STATIC gate · ${label}`));
  console.log(out.trim() || '(no eslint output — clean)');
  console.log(
    `→ no-adhoc-sheet fired: ${hitAdhoc} · expected clean: ${expectClean} · ${pass ? 'AS EXPECTED ✓' : 'UNEXPECTED ✗'}`
  );
  results.push([`static/${label}`, pass]);
}

function kitLintGate() {
  const r = run('pnpm', ['--filter', '@constructor-lab/ui-spec', 'kit-lint']);
  const out = (r.stdout || '') + (r.stderr || '');
  console.log(bar('STATIC gate · kit-lint (component source the screen uses)'));
  console.log(out.trim());
  console.log(
    `→ exit ${r.status} (${r.status === 0 ? 'no must findings ✓' : 'must findings ✗'})`
  );
  results.push(['static/kit-lint', r.status === 0]);
}

function auditGate(label, variant, expectClean) {
  const snap = resolve(OUT, `${SCREEN}.${variant}.json`);
  const cap = run(TSX, [CAPTURE_FILE, STORY, 'light', snap, variant]);
  const capOut = (cap.stdout || '') + (cap.stderr || '');
  if (cap.status !== 0) {
    console.log(bar(`RENDERED gate · ${label} — CAPTURE FAILED`));
    console.log(capOut.trim());
    results.push([`audit/${label}`, false]);
    return;
  }
  const r = run('pnpm', [
    '--filter',
    '@constructor-lab/ui-spec',
    'screen-audit',
    SCREEN,
    snap,
  ]);
  const out = (r.stdout || '') + (r.stderr || '');
  const pass = expectClean ? r.status === 0 : r.status !== 0;
  console.log(bar(`RENDERED gate · ${label}`));
  console.log(capOut.trim());
  console.log(out.trim());
  console.log(
    `→ screen-audit exit ${r.status} · expected clean: ${expectClean} · ${pass ? 'AS EXPECTED ✓' : 'UNEXPECTED ✗'}`
  );
  results.push([`audit/${label}`, pass]);
}

// ── run ─────────────────────────────────────────────────────────────────────
writeFileSync(CAPTURE_FILE, CAPTURE_SRC);
try {
  // Static: generate bad -> lint catches -> regenerate -> lint clean
  eslintGate('round1-drift', DRIFT_SRC, false);
  eslintGate('round2-clean', CLEAN_SRC, true);
  kitLintGate();

  // Rendered: baseline screen, then drift-injected render
  auditGate('baseline', 'clean', true);
  auditGate('drift-injected', 'drift', false);
} finally {
  rmSync(GEN_DIR, { recursive: true, force: true });
  rmSync(CAPTURE_FILE, { force: true });
}

console.log(bar('SUMMARY'));
for (const [name, ok] of results) console.log(`  ${ok ? '✓' : '✗'}  ${name}`);
const allOk = results.every(([, ok]) => ok);
console.log(
  `\n${allOk ? 'loop behaved as expected ✓' : 'some gates did not behave as expected ✗'}`
);
process.exit(0);
