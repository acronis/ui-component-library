import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./vitest.setup.ts'],
    exclude: ['**/node_modules/**', '**/*.browser.test.{ts,tsx}'],
    // `expectTypeOf` / `assertType` assertions are compile-time only: at runtime
    // they are no-ops, so a false one passes and the runtime suite reports green.
    // This block is what runs them — but it is **off by default**, and `pnpm
    // test:types` turns it on. Read the next paragraph before turning it back on
    // here.
    //
    // **Why off: the cost scales with the number of agents, not with the files you
    // touched.** `include` matches every test file (see below), so `enabled: true`
    // made every `vitest run` also run `tsc` per test file — measured at 5–10×,
    // with a ~2 s single-file run taking over four minutes under concurrent load,
    // and 5000 ms timeouts that present as logic errors rather than as saturation.
    // A check too slow to run is a check that cannot fail: it gets skipped, timed
    // out, or misread as a hang.
    //
    // **Why that is safe — measured, not assumed.** `tsconfig.json` has
    // `"include": ["src", …]`, so every test file is already in the type program,
    // and an `expectTypeOf` failure is an **ordinary type error** (vitest's branded
    // mismatch surfaces as a constraint violation, which `tsc` reports). Verified
    // by injecting a false assertion and seeing plain `tsc --noEmit` report it as
    // `TS2344`. So `pnpm typecheck` — 18.5 s for the whole package — already
    // detects everything this block detects. What this block adds is *reporting*:
    // per-file and per-test-name attribution plus `ignoreSourceErrors`.
    //
    // **The coupling that makes it safe is invisible from both ends**, so it is
    // asserted rather than described: `src/__tests__/typecheck-gate.test.ts` fails
    // if the test files ever leave the tsconfig type program. Excluding
    // `__tests__` to speed `typecheck` up would silently invert the redundancy and
    // make this block the only gate.
    typecheck: {
      // Off by default; `pnpm test:types` passes `--typecheck.only`.
      enabled: false,
      // Required, and the reason `enabled: true` alone is not enough: the
      // default is ['**/*.{test,spec}-d.?(c|m)[jt]s?(x)'] and NO file here is
      // named `*.test-d.ts`, so the default matches nothing and reports
      // "Type Errors  no errors" while checking zero files. Matching every test
      // file rather than the type-test naming shapes (`*.types.test.ts`,
      // `*-types.test.ts`) is deliberate: a pattern that must be kept in sync
      // with file names is how this became vacuous in the first place, and type
      // assertions also live inside otherwise-runtime suites.
      include: ['src/**/*.test.{ts,tsx}'],
      // Type errors in non-test sources stay `tsc`'s job (`pnpm typecheck`),
      // which already gates them. Reporting them here too would turn `pnpm test`
      // red for every in-flight source edit anywhere in the workspace and train
      // people to ignore the gate — the failure this block exists to prevent,
      // not to reproduce.
      ignoreSourceErrors: true,
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
