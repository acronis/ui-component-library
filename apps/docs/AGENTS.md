# AGENTS.md — `apps/docs`

`@spec-lab/uikit-docs` — the documentation site.
**Private**, not published.

Cross-cutting topics live in `../../context/*.md`. This file documents
only what is specific to this workspace.

## Stack

- **Next.js 15** (`next@15.5.18`) — App Router.
- **[Fumadocs](https://www.fumadocs.dev/)** — `fumadocs-core`,
  `fumadocs-ui`, `fumadocs-mdx`, `fumadocs-typescript`.
- **Base UI** (`@base-ui/react`) and a Radix Dialog for overlays.
- **`next-themes`** for theme toggling.

## Running

```bash
pnpm --filter @spec-lab/uikit-docs dev
```

## What this site documents

The site is **focused on `@spec-lab/ui-react`** (the next-gen Base UI
library) and its ecosystem packages. The legacy `@spec-lab/shadcn-uikit`
library is documented under a deprecated **Legacy** section
(`content/docs/legacy/`).

## Content structure

- `content/docs/` — MDX pages + `meta.json` files controlling sidebar order.
  Top-level order: `index`, `getting-started`, `theming`, `components`, `icons`,
  `packages`, `guides`, `legacy`.
- `content/docs/components/` — one MDX file per **ui-react** component. Each
  pairs usage + code-snippet examples + `<AutoTypeTable>` with a **live
  `<DemoReact>`** preview (shadow-root isolated) — see "ui-react live demos"
  below. (They do **not** use the legacy `<DemoPreview>`.)
- `content/docs/packages/` — the ecosystem section (`tokens-pd`, `icons-react`,
  `design-tokens`, `design-assets`).
- `content/docs/legacy/` — the deprecated legacy library: a deprecation
  notice (`index.mdx`), the relocated legacy component pages
  (`legacy/components/`, ~50 files), and the legacy forms guide
  (`legacy/forms.mdx`). These pages **keep their live `<DemoPreview>`** widgets.
- `src/components/DemoPreview.tsx` — async RSC for live preview + source toggle
  (used by the legacy pages only).
- `src/components/demos/` — client-wrapper files that re-export from
  `@spec-lab/shadcn-uikit-demos` and add `'use client'`. Demo
  components use hooks and browser APIs, so they need that directive;
  the shared demos package doesn't add it, so the wrappers do. **These pull
  from the legacy library** (`shadcn-uikit-demos` → `shadcn-uikit/react`) and
  back the **legacy** pages only.
- `src/components/demos-react/` — `'use client'` demos for the **ui-react**
  pages, importing straight from `@spec-lab/ui-react`. One
  `<Name>Demo` per component, rendered through `<DemoReact>` (see below).
- `src/components/DemoReact.tsx` + `src/components/ShadowDemo.tsx` — the
  ui-react live-preview wrapper: `ShadowDemo` mounts the demo in a **shadow
  root** that adopts ui-react's stylesheet (fetched from `/api/ui-react-css`),
  isolating it from the legacy + Fumadocs CSS on the global document.
- `src/components/IconCatalog.tsx` — searchable catalog rendering the
  `@spec-lab/icons-react` packs (`/docs/icons`).

## ui-react live demos (shadow-root isolated)

ui-react component pages render **live `<DemoReact>` previews**, not just static
code blocks. This took a workaround: the shared
`@spec-lab/shadcn-uikit-demos` package imports the **legacy** specifier,
and the alias trick that lets ui-react's Storybook swap the library at build time
**does not work in the Next/RSC docs build** — bundler-aliasing a `"use client"`
component drops it from Next's client manifest, so it renders as `undefined`
(see `packages/ui-react/AGENTS.md`). So ui-react demos **don't** go through the
shared demos package at all. Instead:

- write a `'use client'` demo in `src/components/demos-react/<name>.tsx` that
  imports directly from `@spec-lab/ui-react`, and
- render it via `<DemoReact>`, which mounts it inside a **shadow root**
  (`ShadowDemo`) that adopts ui-react's stylesheet from `/api/ui-react-css`.

The shadow boundary keeps ui-react's Tailwind preflight from colliding with the
legacy + Fumadocs CSS loaded globally on the docs document. For components with
portaled overlays (Select/Tooltip popups), the demo reads `useShadowMount()` and
passes it as the primitive's `portalContainer` so the popup inherits the shadow's
styles. See `card-filter.tsx` / `input-select.tsx` for the pattern.

> **The demos need ui-react's compiled CSS — `predev`/`prebuild` build it.** The
> `/api/ui-react-css` route serves ui-react's **compiled** `dist/ui-react.css`
> (`node_modules/@spec-lab/ui-react/dist/ui-react.css`), a **gitignored**
> build artifact. If it's missing, the shadow root adopts no stylesheet and every
> preview shows raw unstyled markup. To prevent that, this workspace's `dev` and
> `build` scripts have `predev`/`prebuild` hooks that run
> `pnpm --filter @spec-lab/ui-react build` first (pnpm runs `pre*` hooks by
> default), so a fresh `pnpm --filter @spec-lab/uikit-docs dev` just works.
> The cost is a ~1.5s ui-react rebuild on every dev/build start. (CI is also fine
> independently — `pnpm -r build` builds ui-react topologically.) Because the
> served sheet is Tailwind-compiled from ui-react's own source, a demo may only
> use utility classes that ui-react itself ships — a class used solely in a demo is
> tree-shaken out and no-ops in the preview.

## Critical path conventions

These are easy to get wrong because the conventions differ by component:

### `<DemoPreview sourcePath="...">`

`sourcePath` is **relative to the monorepo root**, not the docs app:

```
sourcePath="apps/demos/src/button/ButtonVariants.tsx"
```

`DemoPreview` resolves this via `resolve(process.cwd(), '..', '..', sourcePath)`
because `process.cwd()` is `apps/docs/` at build time.

### `<AutoTypeTable path="...">`

`AutoTypeTable` paths are **relative to `apps/docs/`**:

```
<AutoTypeTable path="../../packages/ui-react/src/components/ui/button/button.tsx" name="ButtonProps" />
```

(Legacy pages still point at `../../packages/ui-legacy/src/components/ui/<x>.tsx`.)

For compound components or types that `AutoTypeTable` cannot resolve
(re-exported Base UI types, complex CVA generics, parts with no exported prop
interface), use a `.docs.ts` companion file alongside the component source:

```
<AutoTypeTable path="../../packages/ui-react/src/components/ui/<component>/<component>.docs.ts" name="..." />
```

Several `.docs.ts` companions exist in `ui-legacy`. Only create a new one when
`AutoTypeTable` fails to produce a useful table from the original source — many
ui-react compound parts (e.g. the `InputSelect*` family) extend Base UI props
without their own interface, so they need a companion or should be documented
with usage examples instead.

### `AutoTypeTable` global registration

`AutoTypeTable` is registered as a global MDX component in
`src/app/[...slug]/page.tsx`. MDX files do **not** need to
import it.

### Routing

Docs content is served at the app **root** (`/<slug>`), not under `/docs` —
Fumadocs `source` uses `baseUrl: '/'` and the catch-all lives at
`src/app/[...slug]/`. The marketing landing is `src/app/page.tsx` at `/`. This
keeps URLs single-segment under the deploy basePath (`/uikit/docs/<page>`, not
`/uikit/docs/docs/<page>`). Internal links therefore point at `/<page>` (e.g.
`/components/button`), never `/docs/<page>`.

## Search

The search API at `src/app/api/search/route.ts` uses Fumadocs
`createFromSource` for server-side search over the content index.
**No external search provider** (Algolia, etc.) is configured.

## No tests here

This workspace has no automated test suite (and no `test` / `test:watch` scripts). Documentation is verified by building and visually inspecting at `pnpm dev`.
