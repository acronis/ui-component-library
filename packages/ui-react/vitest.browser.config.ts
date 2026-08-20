import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

/**
 * The runner for `*.browser.test.tsx` — suites that assert things happy-dom
 * cannot produce.
 *
 * **Why a second config rather than a `projects` entry in `vitest.config.ts`.**
 * That file's `test.exclude` deliberately drops `**\/*.browser.test.{ts,tsx}`, so
 * `pnpm test` stays a fast headless run that needs no browser binary. Browser
 * mode has to boot Chromium per file; folding it into the default run would put
 * that cost on every `vitest run` in every agent and pre-push loop. Keeping the
 * two apart means `pnpm test` and `pnpm test:browser` can be gated separately in
 * CI, which is what `.github/workflows/ci.yml` does.
 *
 * **What these suites need that happy-dom cannot give.** They measure real
 * layout — resolved column widths under `table-layout: fixed`, truncation at a
 * given container width, pinned-column dividers, live resize. happy-dom reports
 * every element as 0×0, so the assertions would not merely fail, they would be
 * meaningless. That is also why each suite imports `.storybook/preview.css`:
 * without the real stylesheet a real browser measures an unstyled table.
 *
 * `@vitest/browser-playwright` is pinned to the exact `vitest` version (4.1.10,
 * `catalog:` in `pnpm-workspace.yaml`) — the provider and the runner share
 * internals and a mismatched pair fails at load, not at test time. Bump both
 * together.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    // The mirror of `vitest.config.ts`'s exclude: exactly the files the default
    // run drops, so no suite belongs to both configs and none to neither.
    include: ['src/**/*.browser.test.{ts,tsx}'],
    browser: {
      enabled: true,
      provider: playwright(),
      // Headless everywhere. `--browser.headless=false` still works locally for
      // a look at a failing layout assertion.
      headless: true,
      instances: [{ browser: 'chromium' }],
    },
  },
});
