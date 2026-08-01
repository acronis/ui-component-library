---
name: figma-demo
description: >
  Build a new demo in apps/demos/src from a Figma mockup, composed ONLY from
  components the library already ships. Drives the recipe: read the Figma node,
  gate every component/icon name against the real ui-react + icons-react
  inventory, write a zero-props self-contained demo file, re-export it, and
  verify it in apps/demo (auto-discovered) plus optional apps/docs wiring. It
  never creates or hand-rolls a component — missing pieces are reported as gaps
  for /figma-component. Invoke with /figma-demo <component> <figma-url>.
argument-hint: '<component> <figma-url> [--name <DemoName>] [--docs]'
---

# Figma → apps/demos demo

A repeatable recipe for turning one Figma mockup into a demo file in
`apps/demos/src/<component>/`. The output is a **composition**, not a component:
it may only use what `@constructor-lab/ui-react` and
`@constructor-lab/icons-react` already export. If the mockup needs something the
library lacks, that's a **gap to report** — not something to build here.

Sibling skills: [`/figma-component`](../figma-component/SKILL.md) brings a
_component_ in from Figma; this skill assembles _shipped_ components into a demo.

Read the contracts first — they override anything here on conflict:

- Root: [AGENTS.md](../../../AGENTS.md),
  [context/conventions.md](../../../context/conventions.md)
- Demos: [apps/demos/AGENTS.md](../../../apps/demos/AGENTS.md)
- Docs (only if wiring `--docs`): [apps/docs/AGENTS.md](../../../apps/docs/AGENTS.md)

**Reference demos to copy patterns from:**
`apps/demos/src/sidebar/SidebarWithBadges.tsx` (simple),
`apps/demos/src/patterns/SidebarNavigationDemo.tsx` (composed screen).

---

## Invocation

```
/figma-demo <component> <figma-url> [--name <DemoName>] [--docs]
```

| Arg             | Meaning                                                                         |
| --------------- | ------------------------------------------------------------------------------- |
| `component`     | kebab-case folder under `apps/demos/src/` (`sidebar`, `data-grid`, `patterns`). |
| `figma-url`     | A **node-specific** Figma URL (`…?node-id=5357-26413`).                         |
| `--name <Name>` | PascalCase demo/file name. Default: derive from the Figma frame name.           |
| `--docs`        | Also add the `apps/docs` render-wrapper (Phase 4). Off by default.              |

Parse the URL: `figma.com/design/:fileKey/…?node-id=5357-26413` →
`fileKey=lrU3ydIyvPYQNE6ixdsKtJ`, `nodeId=5357:26413` (convert `-` to `:`).

---

## Phase 0 — Resolve the target file

```bash
ls apps/demos/src/                       # existing folders
ls apps/demos/src/<component>/           # siblings + their naming prefix
cat apps/demos/src/<component>/index.ts  # re-export style to match
```

- **Folder**: reuse an existing one when the mockup belongs to it. A new folder is
  fine (it becomes a new group in `apps/demo`'s Examples catalog); keep it
  kebab-case and named after the primary component family.
- **File name**: PascalCase, unique **within the folder** (the registry uses the
  file base name as the example id) and prefixed like its siblings
  (`Sidebar*`, `ButtonGroup*`).
- **Wrong workspace check** (`apps/demos/AGENTS.md`): this package is for demos
  **shared** by `apps/demo` and `apps/docs`. A one-off only `apps/demo` needs
  belongs in `apps/demo/src/`. No utility/helper modules here — components only.

---

## Phase 1 — Read the design (Figma MCP)

1. `get_metadata({ nodeId, fileKey })` — cheap structure/hierarchy first.
2. `get_design_context({ nodeId, fileKey })` — reference markup; identify regions,
   repeated rows, which layers are component instances vs. raw shapes. The tool
   **requires** the `/figma-design-to-code` skill to be loaded first (it says so in
   its own description) — invoke that skill, then pass
   `skillNames: 'figma-design-to-code'`. Its output is a _reference_: it returns raw
   hex + `components/…` Figma variables and hand-drawn `<img>`/`<svg>` markup, none
   of which belongs in a demo.
3. `get_screenshot({ nodeId, fileKey })` — returns a short-lived URL; `curl` it into
   a gitignored scratch dir (`.ai/figma-demo/<Name>-figma.png`) for the Phase 5
   parity check. Chrome-DevTools screenshots can only be written **inside the repo**,
   so keep both images there rather than `/tmp`.

> **The node the URL points at is often not a single frame.** A canvas/page id
> returns the whole page (many instances + the variant set). Read `get_metadata`
> first and pick the concrete variant symbol (e.g. `section=Intelligence`) before
> calling `get_design_context`; ids nested inside an instance (`0:749`-style, from
> the metadata dump) are frequently **not addressable** and error with "node ID was
> not found".

> **The Figma MCP is selection-bound in this setup.** Reads can fail with
> "You currently have nothing selected" even with a valid `nodeId`/`fileKey`. Ask
> the user to open the node URL in **Figma Desktop** and click the layer, then
> retry. Don't work around it by guessing the design.

> **A layer hidden in the mockup carries no text.** Figma returns nothing for a
> collapsed/hidden list, so any row you show there is invented — label it as
> representative in a code comment and flag it in the final report.

Write down before coding: the layout skeleton, every distinct component instance,
every icon, the **real text content** (use the mockup's strings, never lorem), and
which states are shown (selected row, error field, empty list).

Do **not** transcribe Figma's variable values. A demo references no `--ui-*`
tokens directly — the components carry their own theming (see Phase 3 styling
rules). Token work belongs to `/figma-component` / `/token-gap-check`.

---

## Phase 2 — Inventory gate (the hard rule)

List every component and icon name the demo would import, then resolve them all:

```bash
node .claude/skills/figma-demo/scripts/check-inventory.mjs \
  SidebarPrimary SidebarPrimaryMenuItem Tag FolderHouseIcon
# search the inventory instead:
node .claude/skills/figma-demo/scripts/check-inventory.mjs --list sidebar
```

Exit 1 = at least one `MISSING`. It reads the real barrels
(`packages/ui-react/src/components/ui/*/index.ts` + `src/index.ts`, and each
`packages/icons-react/src/packs/*/index.ts`), so a name that resolves here is a
real import.

**On `MISSING`, never do any of these:** define a local component in the demo,
inline an SVG for a missing icon, extend
`apps/demos/src/icons/missing-icons.tsx` (a legacy lucide fallback from the
shadcn era — frozen), or approximate the design with hand-authored CSS.

Instead, in this order:

1. Use the closest **existing** component/icon and say so in the final report.
2. Drop that element from the demo and report it.
3. Escalate the gap: a missing component is a
   [`/figma-component`](../figma-component/SKILL.md) job; a missing icon is a
   [`/migrate-icons`](../migrate-icons/SKILL.md) / `icons-svg` pull.

Always list the gaps you hit in the final answer — that list is the useful
by-product of building a demo from a mockup.

**Prefer an approved pattern over a hand-composition.** If the mockup is a
screen shape that `packages/ui-spec/patterns/` already covers (app-shell,
table-view, form-layout, filter-popover, detail-drawer, …), compose that
pattern's components. Root ESLint runs the `acronis-patterns` plugin over
`apps/**/*.tsx` (`no-adhoc-sheet` is an **error**; `prefer-confirm-dialog`,
`prefer-stat-row` warn), so a hand-rolled fixed side panel fails lint.

---

## Phase 3 — Write the demo

Create `apps/demos/src/<component>/<Name>.tsx`, then re-export from
`apps/demos/src/<component>/index.ts` (alphabetical, matching sibling style).

Hard constraints — each one is a real failure mode of `apps/demo`'s registry
(`apps/demo/src/app/routes/examples/example-registry.ts`):

- **Exactly one value export per file, named like the file.** The registry
  renders **every exported function** in the module as its own standalone demo —
  an exported helper shows up in the catalog as a broken example. Keep helpers
  unexported, or put shared code in `apps/demos/src/lib/`. `export type` is fine.
- **Zero required props.** It is rendered bare: `<Component />`. Props are allowed
  only if every one is optional with a sensible default (see
  `patterns/ConfirmDialogDemo.tsx`).
- **Self-contained.** No `fetch`, no network, no app-level provider assumption.
  If the demo needs router context, provide it inside the demo
  (`react-router-dom` is a dependency of this workspace).
- **Interactivity via local `useState`.** Anchors use `href="#"`.
- **One folder level.** The registry globs `apps/demos/src/*/*.tsx` — a demo in a
  nested subfolder is invisible. `icons` and `lib` are excluded folders.

Styling rules:

- Layout utilities only (`flex`, `grid`, `gap-*`, `h-[400px]`, `p-4`,
  `rounded-lg`, `border`, `overflow-hidden`) plus the semantic class vocabulary
  already used by sibling demos (`bg-background`, `text-muted-foreground`,
  `text-sm`). Colour and typography come from the components.
- **No hex values, no `style={{ color }}`, no `var(--ui-*)` in a demo.** If the
  design needs a colour a component doesn't expose, that's a gap (Phase 2).
- **A utility class used _only_ in a demo no-ops in the docs preview.**
  `apps/docs` serves ui-react's **compiled** stylesheet into a shadow root, so
  Tailwind classes absent from ui-react's own source are tree-shaken out. Stick to
  the vocabulary sibling demos already use.
- Give scrollable/full-height mockups an explicit height on the wrapper
  (`h-[400px] overflow-hidden`) so the catalog card is bounded.

If the demo needs `zod` or a form library, read `apps/demos/package.json` for the
actual pinned version — `zod` is deliberately **not** in the `pnpm-workspace.yaml`
catalog, so each workspace pins its own.

---

## Phase 4 — Wire the consumers

- **`apps/demo` — nothing to do.** `import.meta.glob` auto-discovers the file;
  it appears at **`/catalog/examples/<component>`** (the examples routes are nested
  under `catalog` in `apps/demo/src/app/App.tsx`) with source in the "View Code"
  panel.
- **`apps/docs` — only with `--docs`** (or when the user names a page). Add a thin
  `'use client'` **render-wrapper** in `apps/docs/src/components/demos-react/`
  (patterns live in `.../demos-react/patterns/`) — a wrapper, **never a bare
  re-export**: Next drops a re-exported client component from its client manifest
  and renders `undefined`. Copy
  `apps/docs/src/components/demos-react/patterns/sidebar-navigation.tsx`, then
  render it from MDX inside `<DemoReact>` per
  [apps/docs/AGENTS.md](../../../apps/docs/AGENTS.md).

No changeset: `apps/demos`, `apps/demo` and `apps/docs` are all private.

---

## Phase 5 — Verify

```bash
pnpm --filter @constructor-lab/ui-kit-demos typecheck
pnpm --filter @constructor-lab/ui-kit-demos lint
pnpm -r typecheck                 # what the pre-commit hook does NOT run
```

Then look at it — a demo that typechecks can still be wrong:

```bash
pnpm --filter @constructor-lab/ui-kit-demo dev    # apps/demo, port 3000
# open http://localhost:3000/catalog/examples/<component>
```

Check **light and dark** via the app's theme toggle (`aria-label="Toggle theme"` in
the header — use the real toggle, not a JS `data-theme` write), and confirm the demo
appears as its own card with the expected title (`humanizeFileName` of the file
name).

> **Get the path right or you'll debug a phantom.** Any URL that misses the route
> table falls through to `<Route path="*" element={<Navigate to="dashboard" />}>`,
> whose **relative** target appends `/dashboard` on every pass — the tab spins in an
> endless redirect and browser tooling times out. That is an `apps/demo` routing bug,
> not a fault in your demo.

Confirm the rail/panel isn't silently scroll-clipped: bound the wrapper to the
**design's own** container height (`get_metadata` reports it) rather than a guess, or
rows below the fold never render into view. Enumerate the rendered rows from the DOM
(`[...nav.querySelectorAll('a,button')].map(e => e.textContent)`) and compare them to
the mockup's list — a screenshot alone won't show what the overflow ate.

**Visual parity vs the mockup.** Screenshot the rendered demo (Chrome DevTools
MCP `take_screenshot`, or the docs/demo page in a browser) and diff it against the
Phase 1 Figma capture:

```bash
node .claude/skills/component-readiness/scripts/parity-image.mjs \
  .ai/figma-demo/<Name>-figma.png .ai/figma-demo/<Name>-render.png \
  --out .ai/figma-demo/<Name>-parity.png
```

The two aren't pixel-aligned — read the diff as a signal, and check structure
explicitly: region order, row counts, icon presence, text strings, spacing scale.

If `--docs` was used, also build docs once (`pnpm --filter
@constructor-lab/uikit-docs build`) — the wrapper is where the RSC
client-manifest failure shows up.

---

## Output checklist (done = all green)

- [ ] Every component/icon name resolved by `check-inventory.mjs` (exit 0), or the
      `MISSING` ones handled per Phase 2 **and reported**.
- [ ] `apps/demos/src/<component>/<Name>.tsx` — one value export named like the
      file, zero required props, self-contained, real mockup text.
- [ ] Re-exported from `apps/demos/src/<component>/index.ts`.
- [ ] No hex / inline `style` colour / `var(--ui-*)` / local component definition /
      inline SVG icon in the demo.
- [ ] Visible at `/catalog/examples/<component>` in `apps/demo`, checked in light
      **and** dark, with every mockup row actually rendered (not scroll-clipped).
- [ ] Visual + structural parity against the Figma node checked.
- [ ] `typecheck` + `lint` clean for `ui-kit-demos`; `pnpm -r typecheck` clean.
- [ ] `--docs` only: render-wrapper added (not a re-export) and docs build passes.
- [ ] Final report lists the library gaps the mockup exposed.

---

## Worked example

```
/figma-demo sidebar https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=5357-26413&m=dev
```

Produced `apps/demos/src/sidebar/SidebarGroupIntelligence.tsx`.

- `fileKey=lrU3ydIyvPYQNE6ixdsKtJ`, `nodeId=5357:26413` — which turned out to be a
  **canvas**, not a frame: `get_metadata` showed loose `SidebarPrimary` instances
  plus a `SidebarGroup` variant set (`5357:36721`) with one `section=` variant per
  product area. `get_design_context` ran on the concrete variant `5357:36714`
  (`section=Intelligence`).
- Folder `apps/demos/src/sidebar/` already held `SidebarFull`, `SidebarIconsOnly`,
  `SidebarWithBadges`, `SidebarWithSections` → `SidebarGroupIntelligence`.
  `SidebarFull` is a generic app nav, so the product-console nav is a real addition,
  not a duplicate — check that before writing.
- Gate: 43 names (both sidebar barrels + 19 icons + `ButtonIcon`) resolved on the
  first run; a plain `Sidebar` would come back MISSING with `SidebarPrimary`
  suggested.
- Composition: `SidebarPrimarySection` ×3 (search / 11 products / personal),
  `SidebarPrimaryMenuItemExtras variant="shortcut"` for `⌘/`,
  `SidebarSecondarySection expandable` with `SidebarSecondarySectionLabel
actions={<ButtonIcon>}` for the `+`, and both `…CollapseTrigger`s in the footers.
- Wrapper height `h-[800px]` — the design's own `SidebarPrimary` height. At 560px
  the rail scroll-clipped five rows.
- Verified at `http://localhost:3000/catalog/examples/sidebar`, light + dark.
- Gaps the mockup exposed: no brand-logo component/asset (substituted an icon +
  text lockup), and `SidebarPrimaryCollapseTrigger` has no `shortcut` prop although
  `SidebarSecondaryCollapseTrigger` does — so the primary rail's `⌘H` hint can't be
  rendered.
