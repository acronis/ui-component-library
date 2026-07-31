/**
 * story-audit — WCAG contrast over every Storybook story, in every theme state.
 *
 * The check that survives a wrong baseline. See `../screens/audit/story-audit.ts`
 * for why visual regression structurally cannot do this job (its baseline is its
 * own oracle, and its harness cannot reach a docs page at all).
 *
 * Run:
 *   pnpm --filter @constructor-lab/ui-react storybook:build
 *   pnpm --filter @constructor-lab/ui-spec story-audit
 *
 *   --storybook <dir>     static build to serve (default: ../ui-react/storybook-static)
 *   --url <url>           audit an already-running Storybook instead of serving
 *   --profiles a,b        default: every profile in THEME_PROFILES
 *   --views story,docs    default: both
 *   --title <substr>      only titles containing this string
 *   --all                 every story, not one per title
 *   --concurrency <n>     parallel pages (default 4)
 *
 * Exits non-zero on any finding — `accessibility/contrast` is a `must`.
 *
 * ── WHY IT RUNS ON THE HOST, NOT IN THE VR DOCKER IMAGE ──────────────────────
 * The VR suite is Dockerised because *pixels* differ across platforms — font
 * antialiasing makes a macOS baseline useless against Linux CI. Contrast is not a
 * pixel comparison: it reads computed `color` / `background-color` and applies
 * WCAG arithmetic, and both are platform-independent. Requiring Docker would add
 * minutes and a daemon dependency to a check that needs neither.
 */
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AddressInfo } from 'node:net';

import { chromium } from 'playwright';
import type { Browser } from 'playwright';

import { collectScreenSnapshot } from '../screens/audit/probe';
import {
  contrastFindings,
  formatStoryAuditReport,
  selectTargets,
  storyUrl,
  THEME_PROFILES,
} from '../screens/audit/story-audit';
import type {
  IndexEntry,
  StoryAuditResult,
  StoryTarget,
  ThemeProfile,
  ViewMode,
} from '../screens/audit/story-audit';
import type { ScreenSnapshot } from '../screens/audit/types';

const HERE = dirname(fileURLToPath(import.meta.url));
const DEFAULT_STATIC = resolve(HERE, '../../ui-react/storybook-static');

function flag(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? undefined : process.argv[i + 1];
}
const has = (name: string): boolean => process.argv.includes(`--${name}`);

const MIME: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

/**
 * Serve the static build. Deliberately dependency-free `node:http` rather than a
 * package: Storybook fetches `index.json` over HTTP, so `file://` cannot work,
 * but the need is a few dozen lines of static file serving and this script should
 * not pull a server dependency into a spec package to get it.
 */
async function serve(dir: string): Promise<{ url: string; close(): void }> {
  if (!existsSync(join(dir, 'index.json'))) {
    throw new Error(
      `No index.json in ${dir}. Build Storybook first:\n` +
        '  pnpm --filter @constructor-lab/ui-react storybook:build'
    );
  }
  const server = createServer((req, res) => {
    const path = decodeURIComponent((req.url ?? '/').split('?')[0]);
    let file = join(dir, path === '/' ? 'index.html' : path);
    if (existsSync(file) && statSync(file).isDirectory()) {
      file = join(file, 'index.html');
    }
    if (!existsSync(file)) {
      res.writeHead(404).end('not found');
      return;
    }
    res.writeHead(200, {
      'content-type': MIME[extname(file)] ?? 'application/octet-stream',
    });
    createReadStream(file).pipe(res);
  });
  await new Promise<void>((r) => server.listen(0, '127.0.0.1', r));
  const { port } = server.address() as AddressInfo;
  return {
    url: `http://127.0.0.1:${port}`,
    close: () => server.close(),
  };
}

/** Render one story in one theme state and score its text contrast. */
async function auditOne(
  browser: Browser,
  base: string,
  target: StoryTarget,
  profile: ThemeProfile
): Promise<StoryAuditResult> {
  const view = target.view;
  const page = await browser.newPage();
  try {
    // `collectScreenSnapshot` is self-contained AS WRITTEN, but Playwright
    // serializes it with `Function.prototype.toString()` and what it stringifies
    // is the TRANSPILED body — and tsx/esbuild wrap every function declaration in
    // a `__name(fn, "fn")` call to preserve names. That helper is a module-scope
    // local in the Node bundle and does not exist in the page, so the probe threw
    // `ReferenceError: __name is not defined` on its first call.
    //
    // Defining it as identity satisfies the wrapper. Deliberately NOT worked
    // around by pasting the probe's source into this file: that would fork the
    // one measurement implementation the screen audit also depends on.
    await page.addInitScript(() => {
      (globalThis as unknown as { __name?: unknown }).__name ??= <T>(
        fn: T
      ): T => fn;
    });
    await page.emulateMedia({ colorScheme: profile.emulate });
    await page.goto(storyUrl(base, target.id, view), {
      waitUntil: 'networkidle',
      timeout: 30_000,
    });

    // ── TRANSITIONS OFF BEFORE THE THEME FLIPS ───────────────────────────────
    // Components in this library animate `color` (the DataTable header carries
    // `transition: all`), so switching `[data-theme]` starts a colour animation
    // and any measurement taken during it reads an intermediate value that
    // belongs to NEITHER theme.
    //
    // That is not hypothetical: it invented a whole finding. The audit reported
    // `rgb(44,45,47)`/`rgb(45,46,48)`/`rgb(47,48,50)` — three near-identical
    // greys that match no palette entry — on DataTable/DataGrid headers at
    // ~1.4:1. Settled, the same element measures 17.15:1 in dark and 17.59:1 in
    // light. The tell was that the colours were not token values; a real finding
    // names a colour the palette actually contains.
    //
    // Killing transitions is better than waiting longer: a wait is a guess that
    // gets shorter than some future animation, and this failure mode is silent —
    // it produces a plausible number, not an error.
    await page.addStyleTag({
      content:
        '*, *::before, *::after { transition: none !important; ' +
        'animation: none !important; }',
    });

    // Storybook's preview decorator has already set BOTH `[data-theme]` and an
    // inline `color-scheme` from its default global, so every profile must state
    // both — "don't set it" means "inherit the decorator's".
    //
    // The inline property is always REMOVED, never set: `color-scheme` is then
    // whatever the stylesheet says (`[data-theme='…']`, or `:root`'s
    // `light dark`), which is what a real consumer gets. Leaving the decorator's
    // inline `light` in place under `data-theme="dark"` produced exactly the
    // mixed state this audit hunts — `light-dark()` resolving light while
    // attribute-keyed CSS went dark — so `dark` and `system-dark` disagreed about
    // the same story by 0.6:1 until this was fixed.
    await page.evaluate((dataTheme: 'light' | 'dark' | null) => {
      const html = document.documentElement;
      html.style.removeProperty('color-scheme');
      if (dataTheme === null) {
        delete html.dataset.theme;
      } else {
        html.dataset.theme = dataTheme;
      }
    }, profile.dataTheme);

    // Docs pages render several stories lazily; give layout a beat to settle so
    // a node is not measured mid-mount with no background resolved yet.
    await page.waitForTimeout(view === 'docs' ? 400 : 120);

    // `collectScreenSnapshot` is serialized into the page — it is written to be
    // fully self-contained precisely so this works (see probe.ts).
    const snapshot = (await page.evaluate(collectScreenSnapshot, {
      screen: target.title,
      story: target.id,
      colorMode: profile.emulate,
      // Docs pages render outside #storybook-root, but measuring `body` audits
      // STORYBOOK'S OWN CHROME too — its headings, args tables and syntax-
      // highlighted code blocks. Measured: that added 224 findings of
      // `rgb(255, 68, 0)` on white at 3.45:1 across 18 docs pages, every one of
      // them Storybook's code-block palette. We cannot fix those without forking
      // Storybook's docs theme, and they are not this library's components — so
      // gating on them would mean a permanently red check nobody can clear.
      //
      // `.docs-story` is the innermost wrapper around a rendered story, inside
      // the preview box but outside the zoom/toolbar chrome. It keeps exactly what
      // this audit is for — our components rendered on the docs surface, which is
      // where the Accordion white-on-white lived — and excludes what it is not.
      rootSelector: view === 'docs' ? '.docs-story' : undefined,
    })) as ScreenSnapshot;

    return {
      storyId: target.id,
      title: target.title,
      profile: profile.name,
      view,
      findings: contrastFindings(snapshot),
    };
  } finally {
    await page.close();
  }
}

/** Run `tasks` with at most `limit` in flight. */
async function pool<T>(
  tasks: (() => Promise<T>)[],
  limit: number
): Promise<T[]> {
  const out: T[] = new Array(tasks.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, tasks.length) }, () =>
    (async () => {
      for (;;) {
        const i = next++;
        if (i >= tasks.length) return;
        out[i] = await tasks[i]();
      }
    })()
  );
  await Promise.all(workers);
  return out;
}

async function main(): Promise<void> {
  const views = (flag('views') ?? 'story,docs').split(',') as ViewMode[];
  const profileNames = flag('profiles')?.split(',');
  const profiles = profileNames
    ? THEME_PROFILES.filter((p) => profileNames.includes(p.name))
    : THEME_PROFILES;

  if (profiles.length === 0) {
    throw new Error(
      `No profile matched --profiles "${flag('profiles')}". Known: ` +
        THEME_PROFILES.map((p) => p.name).join(', ')
    );
  }

  const externalUrl = flag('url');
  const staticDir = resolve(flag('storybook') ?? DEFAULT_STATIC);
  const server = externalUrl ? null : await serve(staticDir);
  const base = externalUrl ?? server!.url;

  const index = JSON.parse(
    externalUrl
      ? await fetch(`${base}/index.json`).then((r) => r.text())
      : readFileSync(join(staticDir, 'index.json'), 'utf8')
  ) as { entries: Record<string, IndexEntry> };

  const targets = selectTargets(Object.values(index.entries), {
    all: has('all'),
    titleFilter: flag('title'),
    views,
  });
  if (targets.length === 0) {
    throw new Error(
      `No stories matched --title "${flag('title')}". Refusing to report a ` +
        'clean sweep over nothing.'
    );
  }

  const browser = await chromium.launch();
  let results: StoryAuditResult[];
  try {
    const tasks = targets.flatMap((t) =>
      profiles.map((p) => () => auditOne(browser, base, t, p))
    );
    process.stderr.write(
      `story-audit: ${tasks.length} renders (${targets.length} pages × ` +
        `${profiles.length} profiles)…\n`
    );
    results = await pool(tasks, Number(flag('concurrency') ?? 4));
  } finally {
    await browser.close();
    server?.close();
  }

  process.stdout.write(
    `${formatStoryAuditReport(results, {
      targets: targets.length,
      profiles: profiles.map((p) => p.name),
      views,
    })}\n`
  );

  const total = results.reduce((n, r) => n + r.findings.length, 0);
  process.exit(total > 0 ? 1 : 0);
}

main().catch((error: unknown) => {
  process.stderr.write(`${(error as Error).message}\n`);
  process.exit(2);
});
