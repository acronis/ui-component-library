---
'@spec-lab/ui-react': patch
---

Bump low-risk shared dependencies via the catalog. The only change to ui-react's
shipped surface is `recharts` 3.8.1 → 3.9.2 (a runtime dependency); the rest are
dev/tooling bumps shared through the catalog: `vitest` 4.1.10,
`@tanstack/react-virtual` 3.14.5, `date-fns` 4.4.0, `tailwindcss` /
`@tailwindcss/postcss` 4.3.2, `ajv` 8.20.0, `style-dictionary` 5.5.0.

This is the safe subset of Dependabot's grouped PR. The risky majors —
TypeScript 7 (breaks the `unplugin-dts` declaration build), Vite 8 (rolldown CJS
interop; already held by a catalog note), ESLint 10, `@types/node` 26 — and the
React ecosystem (react/react-dom/@types-react/react-hook-form, whose bump
regresses `apps/demo` form typing) are intentionally held for separate,
individually-verified PRs.
