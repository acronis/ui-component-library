// Behavioural browser check: does toggling a group actually TERMINATE?
//
// ── WHY THIS IS NOT A VITEST TEST ────────────────────────────────────────────────
//
// Because a Vitest test cannot see the defect it exists for. `data-grid-grouping.test.tsx`
// already asserts "collapses and re-expands from the disclosure", and it stayed green
// through a freeze that locked a real browser: `user.click()` under happy-dom dispatches
// a PROGRAMMATIC click, and the render loop only closed on React's discrete-event flush
// path, which only a *trusted* click or keypress takes. A synthetic click returned
// cleanly and even collapsed correctly.
//
// Measured on the defect (`autoResetExpanded` unset + a `requestChange` that allocated a
// new state object for an unchanged value): 11,293 controller state writes in 8 seconds,
// DOM stable at 8 rows, heap flat at 81.4 MB — a render loop, not the leak it resembled.
//
// This is the residue of gap #78: CI has no behavioural browser check, so this is run by
// hand. It is committed rather than left in a scratch directory precisely because the
// defect it guards is invisible to everything that does run in CI.
//
// ── USAGE ───────────────────────────────────────────────────────────────────────
//
//   pnpm --filter @constructor-lab/ui-react storybook      # or serve storybook-static
//   node test/behavioural/group-toggle-terminates.mjs [baseUrl]
//
// Exits 0 when every toggle returns, 1 when any wedges, 2 when it could not run.
// It prints the DENOMINATOR — stories visited and clicks performed — because a sweep
// reporting "ok" having performed zero clicks is indistinguishable from a pass.

import { createRequire } from 'node:module';

const BASE = process.argv[2] ?? 'http://localhost:6007';
const CLICK_BUDGET_MS = 4000;

const require = createRequire(import.meta.url);
let chromium;
try {
  // `playwright`, not `@playwright/test`: the latter exports the test RUNNER, not the
  // browser API, and destructuring `chromium` from it yields `undefined`.
  //
  // Resolved through `@playwright/test`'s own location because `playwright` is its
  // transitive dependency and pnpm does not link it into this package — a bare
  // `require('playwright')` from here fails.
  const fromRunner = createRequire(require.resolve('@playwright/test'));
  ({ chromium } = fromRunner('playwright'));
} catch (error) {
  console.error(`Cannot load playwright: ${String(error.message).split('\n')[0]}`);
  console.error('Run from packages/ui-react with dependencies installed.');
  process.exit(2);
}

let index;
try {
  index = await (await fetch(`${BASE}/index.json`)).json();
} catch {
  console.error(`No Storybook at ${BASE}. Start it, or pass a base URL.`);
  process.exit(2);
}

// Every story whose id suggests a collapsible group. Narrow deliberately: the check is
// about group disclosures, and a story with no disclosure would report a vacuous pass.
const ids = Object.keys(index.entries).filter(
  (id) => /grouping/.test(id) && !/docs$/.test(id)
);

if (ids.length === 0) {
  console.error('No grouping stories found in index.json — nothing to check.');
  process.exit(2);
}

const browser = await chromium.launch();
let visited = 0;
let clicks = 0;
const wedged = [];
const unmatched = [];

for (const id of ids) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  try {
    await page.goto(`${BASE}/iframe.html?id=${id}&viewMode=story`, {
      waitUntil: 'load',
      timeout: 20000,
    });
    // Scope to #storybook-root. The docs-preparing wrapper holds a SECOND copy of the
    // tables, and matching those measures the wrong element.
    const root = page.locator('#storybook-root');
    await root.waitFor({ timeout: 10000 });
    await page.waitForTimeout(400);
    visited++;

    // Three renderings, all of which must be reached:
    //   - the DataGrid chrome        -> aria-label "Collapse/Expand group X"
    //   - a caller's `renderGroup`   -> any button inside the group row ("Show"/"Hide")
    // Matching only the first silently skipped `CustomGroupRenderer` and reported it as
    // a pass with zero clicks.
    const toggles = root.locator(
      'button[aria-label^="Collapse group"], button[aria-label^="Expand group"], ' +
        '[data-slot="group-row"] button'
    );
    const total = await toggles.count();

    // "Zero toggles" has TWO causes that look identical in the output, and only one is
    // a problem:
    //   - `collapsible: false` renders a same-size SPACER instead of a disclosure, so
    //     zero controls is correct.
    //   - anything else means this selector failed to match, and the story was not
    //     exercised at all — a vacuous pass.
    // `data-slot="group-static"` is the spacer's contract, so it discriminates them.
    // (Written after the first version flagged `NonCollapsibleGroups`, where zero
    // controls is the feature.)
    const groupRows = await root.locator('[data-slot="group-row"]').count();
    const spacers = await root.locator('[data-slot="group-static"]').count();
    if (total === 0 && groupRows > 0 && spacers === 0) {
      unmatched.push(`${id} (${groupRows} group rows, no spacer, 0 controls matched)`);
    }
    if (total === 0 && spacers > 0) {
      console.log(`  ${id}: no disclosure by design (collapsible: false, ${spacers} spacers)`);
    }

    for (let i = 0; i < total; i++) {
      const target = toggles.nth(i);
      if (!(await target.isVisible().catch(() => false))) continue;
      // A REAL trusted click. This is the whole point of the file — a synthetic
      // `el.click()` does not reproduce the defect.
      const outcome = await Promise.race([
        target.click({ timeout: CLICK_BUDGET_MS }).then(() => 'returned'),
        new Promise((r) => setTimeout(() => r('wedged'), CLICK_BUDGET_MS + 500)),
      ]).catch(() => 'wedged');
      if (outcome === 'wedged') {
        wedged.push(`${id} (toggle ${i})`);
        break;
      }
      clicks++;
      await page.waitForTimeout(200);
    }
    console.log(`  ${id}: ${total} toggles, ${clicks} clicked so far`);
  } catch (error) {
    wedged.push(`${id} (${String(error.message).split('\n')[0]})`);
  }
  await page.close().catch(() => {});
}

await browser.close();

console.log(`\nstories visited: ${visited}/${ids.length}   toggles clicked: ${clicks}`);
if (clicks === 0) {
  console.error('NO TOGGLE WAS CLICKED — this run proves nothing. Check the selectors.');
  process.exit(2);
}
if (unmatched.length) {
  // A story that HAS group rows and matched no control was not exercised. Reporting
  // this as a pass is the failure shape this whole file exists to avoid.
  console.error(`SELECTOR MISSED (${unmatched.length}) — these stories were NOT exercised:`);
  for (const u of unmatched) console.error(`  ${u}`);
  process.exit(2);
}
if (wedged.length) {
  console.error(`WEDGED (${wedged.length}):`);
  for (const w of wedged) console.error(`  ${w}`);
  process.exit(1);
}
console.log('All toggles terminated.');
