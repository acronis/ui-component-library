# AGENTS.md — `packages/ui-react`

`@spec-lab/ui-react` — the next-generation Constructor Lab React component
library: a **Base UI implementation** themed by `@spec-lab/tokens`
(which is generated from `@spec-lab/tokens`).

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
- **Theming via generated tokens.** Color comes from `@spec-lab/tokens` (`--ui-*`
  CSS custom properties; light/dark via `light-dark()` + `[data-theme]`, brand via
  `[data-brand]`). `src/styles/index.css` imports the whole bundle in one line
  (`@spec-lab/tokens/css`) plus the **generated** Tailwind bridge
  (`@spec-lab/tokens/css/tailwind-theme.css`) that maps `--ui-*` onto Tailwind
  color names. Don't hand-author theme values here — change a tier in
  `@spec-lab/tokens` and rebuild.

## Shared conventions kept from legacy

- React **functional components**; `React.forwardRef` for ref-accepting
  primitives.
- **`class-variance-authority`** for variants; expose them via
  `VariantProps`. Merge classes with `cn()` (`src/lib/utils.ts`).
- **Tailwind CSS v4** utilities. PascalCase component names; kebab-case files.

## The shared demos package

The `@spec-lab/ui-kit-demos` workspace (consumed by `apps/demo`) now
imports `@spec-lab/ui-react` **directly** — the legacy package it was named after
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

## Visual regression

Storybook stories double as visual regression cases, run by
`@storybook/test-runner` + `jest-image-snapshot` (config in
`.storybook/test-runner.ts`). Each story is screenshotted and compared to a
committed PNG baseline under `test/__snapshots__/`.

**Baselines are generated in Docker (Linux)** so they match CI — never commit
baselines rendered on macOS/Windows. After adding or changing any story:

```bash
# regenerate + review baselines (Docker must be running)
pnpm --filter @spec-lab/ui-react storybook:test:visual:docker:update
# check against committed baselines (what CI runs on every PR)
pnpm --filter @spec-lab/ui-react storybook:test:visual:docker
```

The `storybook:test:visual[:update]` scripts run the same thing without Docker
(host renderer) — useful for a quick local look, but their output must **not**
be committed. See `test/__snapshots__/README.md`. CI:
`.github/workflows/visual-regression.yml` (matrix over `ui-react`, light + dark).

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
