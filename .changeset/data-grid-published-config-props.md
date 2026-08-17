---
'@constructor-lab/ui-react': patch
---

**DataGrid**: every grouped config prop (`selection`, `pagination`, `toolbar`,
`dataState`, `filters`, …) is back on the published `DataGridProps`, and the
library build no longer fails on the ported data-grid files.

Two separate defects, both invisible to this package's own `typecheck`:

- Five ported files imported from `@constructor-lab/ui-react` — their own
  package. Rolldown cannot resolve that during the library build (there is no
  `dist` yet), so the build failed outright.
- `scripts/inline-dts-augmentations.mjs` unwrapped each
  `declare module './registry'` block out of the emitted `.d.ts`. That was
  correct under tsup, which flattened every declaration into one file — the
  augmentation and its target ended up in the same module, so bare `interface`
  declarations merged. The build now uses Vite + `unplugin-dts`, which emits one
  `.d.ts` per module: `'./registry'` resolves again, and unwrapping instead
  stranded each block as a _local_ interface that merged with nothing. The
  registry maps shipped empty, so `DataGridProps` carried only `columns`/`rows`
  and a consumer passing any config prop got an unknown-prop error against a
  runtime that reads all of them. The script is gone; the blocks ship as
  authored.

The guard test that was supposed to catch this compared interface members
textually, merged across all of `dist` — which is not what the type checker does,
so an augmentation stranded in the wrong module still counted. It now compiles
probe modules against the built declarations and asks the checker, with a
deliberately-wrong probe alongside so a check that can no longer fail is itself a
failure.
