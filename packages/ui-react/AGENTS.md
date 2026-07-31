# AGENTS.md — `packages/ui-react`

`@constructor-lab/ui-react` — the next-generation React UI Components
library: a **Base UI implementation** themed by `@constructor-lab/tokens`
(which is generated from `@constructor-lab/tokens`).

Repo-wide rules (TypeScript, file naming, editing rules, Conventional
Commits, Changesets) live in the repo root's `./context/` and apply on
top of this file.

## Always-loaded workspace context

@context/conventions.md

## Design choices (vs the retired legacy shadcn kit)

- **Base UI first.** Primitives come from `@base-ui/react`, a **direct
  dependency** (legacy treats it as an optional peer and mixes in Radix).
  Don't add Radix here. For element composition use Base UI's `useRender`
  - `mergeProps` (the `render` prop), not Radix `Slot` / `asChild`.
- **Theming via generated tokens.** Color comes from `@constructor-lab/tokens` (`--ui-*`
  CSS custom properties; light/dark via `light-dark()` + `[data-theme]`, brand via
  `[data-brand]`). `src/styles/index.css` imports the whole bundle in one line
  (`@constructor-lab/tokens/css`) plus the **generated** Tailwind bridge
  (`@constructor-lab/tokens/css/tailwind-theme.css`) that maps `--ui-*` onto Tailwind
  color names. Don't hand-author theme values here — change a tier in
  `@constructor-lab/tokens` and rebuild.

## Shared conventions kept from legacy

- React **functional components**; `React.forwardRef` for ref-accepting
  primitives.
- **`class-variance-authority`** for variants; expose them via
  `VariantProps`. Merge classes with `cn()` (`src/lib/utils.ts`).
- **Tailwind CSS v4** utilities. PascalCase component names; kebab-case files.

## The shared demos package

The `@constructor-lab/ui-kit-demos` workspace (consumed by `apps/demo`) now
imports `@constructor-lab/ui-react` **directly** — the legacy package it was named after
is gone, and the old `.storybook`/tsconfig alias that remapped the legacy
specifier to this library's `src` has been removed. This library's Storybook
renders its own `src/components/**/__stories__/*.stories.tsx`; it does not pull
in the shared demos package.

## File layout per component

```
src/components/ui/<component>/
├── <component>.tsx
├── <component>.figma.tsx        (optional — Figma Code Connect)
├── index.ts
├── __tests__/<component>.test.tsx
└── __stories__/<component>.stories.tsx
```

## Figma Code Connect

Components can be linked to their Figma counterparts via co-located
`<component>.figma.tsx` files (excluded from the published build). See
`context/figma-code-connect.md` for the setup, status markers, and the
`figma:connect` / `figma:connect:publish` commands.

## Stack

- React 19, TypeScript, Vite 6 (library build via `vite.lib.config.ts`),
  Vitest 4 + React Testing Library (happy-dom), Storybook 10, Tailwind v4.

## Which command carries which guarantee

Three commands overlap here and it is not obvious which one would catch a given
mistake, so:

| Command           | Runs                                   | Catches                                                                  |
| ----------------- | -------------------------------------- | ------------------------------------------------------------------------ |
| `pnpm test`       | runtime suites only — **no** typecheck | anything a rendered assertion can see. Fast; use it while iterating.     |
| `pnpm typecheck`  | `tsc --noEmit` over the whole package  | **every type error, including every `expectTypeOf` failure.** ~18 s.     |
| `pnpm test:types` | the vitest `typecheck` block, only     | the same failures as above, with per-file and per-test-name attribution. |

**`pnpm test` does not typecheck, and that is deliberate.** The vitest `typecheck`
block matches every test file, so leaving it on made each `vitest run` also run
`tsc` per test file — 5–10× slower, and under concurrent load a ~2 s single-file run
took over four minutes and produced 5000 ms timeouts that read as logic errors. A
check too slow to run is a check that cannot fail.

**Nothing is unguarded by that split.** `tsconfig.json` includes `src`, so the
type-test files are already in the type program, and an `expectTypeOf` failure is an
ordinary type error — verified by injecting a false assertion and watching plain
`tsc` report it as `TS2344`. So **`pnpm typecheck` is the detection gate** and
`test:types` is the nicer report of the same thing.

**If you touch a `*.types.test.ts` or any type assertion, run `pnpm typecheck`** —
`pnpm test` will not tell you. `src/__tests__/typecheck-gate.test.ts` asserts the
coupling this rests on (that the test files stay inside the tsconfig type program),
because excluding `__tests__` to speed `typecheck` up would silently invert the
redundancy and leave `test:types` as the only gate.

**And run it after an `as never` / `as any` on an options object, even though you
touched no type assertion of your own.** A cast applied to an object literal strips
that literal's contextual type, and contextual typing is what gives every callback
_inside the same literal_ its parameter types — so casting a config to test a
JS-caller path silently widens unrelated siblings like `getRowId: (row) => row.id`
to implicit `any`/`unknown`. `pnpm test` stays green because it does not typecheck.
This has caught two operators; the fix is to cast **only the one deliberately
invalid value**, not the object around it.

`test:types` is a deliberate deviation from the repo-wide "every workspace exposes
the same script names" rule (root `AGENTS.md`): this is the only workspace with the
vitest typecheck block, and `pnpm --filter` fails outright on a package that has no
such script, so it is intentionally **not** wired into any `pnpm -r` run.

## Visual regression

Storybook stories double as visual regression cases, run by
`@storybook/test-runner` + `jest-image-snapshot` (config in
`.storybook/test-runner.ts`). Each story is screenshotted and compared to a
committed PNG baseline under `test/__snapshots__/`.

**Baselines are generated in Docker (Linux)** so they match CI — never commit
baselines rendered on macOS/Windows. After adding or changing any story:

```bash
# regenerate + review baselines (Docker must be running)
pnpm --filter @constructor-lab/ui-react storybook:test:visual:docker:update
# check against committed baselines (what CI runs on every PR)
pnpm --filter @constructor-lab/ui-react storybook:test:visual:docker
```

The `storybook:test:visual[:update]` scripts run the same thing without Docker
(host renderer) — useful for a quick local look, but their output must **not**
be committed. See `test/__snapshots__/README.md`. CI:
`.github/workflows/visual-regression.yml`.

**Two further profiles cover the OS `prefers-color-scheme` axis** — the case
where `[data-theme]` and the operating system disagree, which light/dark cannot
reach because they pin the attribute:

```bash
pnpm --filter @constructor-lab/ui-react storybook:test:visual:docker:system-dark
pnpm --filter @constructor-lab/ui-react storybook:test:visual:docker:forced-light
```

They **write no baselines** — they re-render a ~16% story sample under a
different theme input and must reproduce the committed light/dark PNGs exactly;
a diff means styling keyed on `[data-theme]` rather than resolved through a
token. Hence no `:update` variant, and adding a story means running
`…:docker:update:all` _before_ them. Details in
`.storybook/visual-regression.ts` and `scripts/system-theme-subset.mjs`.

## When you add or change anything in `src/`

1. Add a Vitest test under the component's `__tests__/`.
2. Add a Storybook story under the component's `__stories__/` covering
   all variants, checked under light **and** dark mode.
3. Regenerate the visual regression baselines in Docker (see above) and
   review the new/changed PNGs before committing them.
4. Add a Changeset: `pnpm changeset` (from repo root).
5. (Optional) Add/refresh a `<component>.figma.tsx` Code Connect mapping —
   see `context/figma-code-connect.md`.

See `../../context/releasing.md` for the Changesets / publish flow.
