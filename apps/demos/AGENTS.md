# AGENTS.md — `apps/demos`

`@constructor-lab/ui-kit-demos` — a **source-only** workspace
that houses reusable component demos consumed by `apps/demo` and
`apps/docs`. **Private**, not published.

Cross-cutting topics live in `../../context/*.md`. This file documents
only what is specific to this workspace.

## No build, no dev server

This is the workspace's defining characteristic. All scripts are
intentional no-ops:

- `build` → `echo "no build (consumed via source by demo/docs)" && exit 0`
- `clean`, `test`, `test:watch` → `echo … && exit 0`

The package is consumed **via source** through the `exports` map:

```json
"exports": {
  "./*": "./src/*/index.ts",
  "./icons/missing-icons": "./src/icons/missing-icons.tsx"
}
```

Consumers (`apps/demo`, `apps/docs`) compile the TypeScript directly as
part of their own build. There is no `dist/` and no watch mode.

The only scripts that actually run are `lint`, `lint:fix`, and
`typecheck`.

## Stack

- React 19 (peer dep, supplied by the consumer).
- **TanStack Form** + **TanStack zod adapter** alongside **react-hook-form**
  — both are showcased to compare patterns.
- **zod 4** (pinned at `4.4.3`), aligned with `apps/demo` and the UI lib —
  the 3→4 follow-up has landed. Still **not** in the `pnpm-workspace.yaml`
  catalog, so the version is per-workspace; read `package.json` rather
  than assuming.
- **`react-router-dom` 7** for any demos that need routing context.

## Adding a new demo

1. Create `src/<component>/<Demo>.tsx`.
2. Re-export from `src/<component>/index.ts`.
3. In `apps/docs`, add a thin `'use client'` **render-wrapper** under
   `apps/docs/src/components/demos-react/` (pattern demos live in
   `demos-react/patterns/`) — a wrapper that _renders_ the shared demo,
   **never a bare re-export**: Next drops a re-exported client component
   from its client manifest. Then render it from an MDX page inside
   `<DemoReact>` (see `apps/docs/AGENTS.md` for the conventions).
4. In `apps/demo`, the demo can be imported directly without a wrapper.

## What this workspace is NOT for

- **Not** a place for one-off demos that only `apps/demo` uses. Those
  belong in `apps/demo/src/`.
- **Not** a place for shared utility code. Components only.
