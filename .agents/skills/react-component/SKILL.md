---
name: react-component
description: >
  Scaffold a brand-new ui-react component from a written description — no legacy
  source and no Figma mockup required. Drives the same recipe as
  /figma-component and /legacy-component (implement in packages/ui-react with
  component, tests, stories; write the framework-agnostic 7-file spec in
  packages/ui-spec; add a docs page in apps/docs; add a changeset) but takes its
  variants/parts/props/a11y from the requirements you give it, builds on Base UI
  + `--ui-*` tokens, and DOES NOT create a `.figma.tsx` Code Connect file or a
  `figma:` spec block. Invoke with /react-component <ComponentName> [description].
---

# New ui-react component (from requirements, design-pending v1)

A repeatable recipe for landing a **brand-new** component into
`packages/ui-react` when there is **no legacy counterpart to port and no Figma
mockup to read**. It produces the **same shape of output** the Button and
Breadcrumb components have — component, tests, stories, VR baselines, a ui-spec,
and an `apps/docs` page — with two deliberate differences from
[`/legacy-component`](../legacy-component/SKILL.md) and
[`/figma-component`](../figma-component/SKILL.md):

1. **Source is a written description, not legacy code or a Figma node.**
   Variants, parts, props, states, and a11y come from the requirements the
   invoker provides (or that you clarify up front) — grounded in the repo's
   conventions and reference implementations.
2. **No Figma coupling at all.** No Figma reads, **no `.figma.tsx` Code Connect
   file**, and the spec `index.yaml` ships `status: draft` with **no** `figma:`
   block. When a "ready for dev" mockup lands later, reconcile with
   `/figma-component <Name> <url> --update` (that step adds the Code Connect +
   `figma:` block).

Everything else — Base UI composition, `--ui-*` token discipline, the 7-file
spec, tests, the light+dark VR baseline matrix, the changeset — is **identical**
to `/figma-component`. Where this file is silent, that recipe and the workspace
contracts govern.

Read the workspace contracts first — they override anything here on conflict:

- Root: [AGENTS.md](../../../AGENTS.md), [context/conventions.md](../../../context/conventions.md)
- ui-react: [packages/ui-react/AGENTS.md](../../../packages/ui-react/AGENTS.md),
  [packages/ui-react/context/conventions.md](../../../packages/ui-react/context/conventions.md)
- ui-spec: [packages/ui-spec/AGENTS.md](../../../packages/ui-spec/AGENTS.md)

**Reference implementations to copy patterns from:**
`packages/ui-react/src/components/ui/button/` and
`packages/ui-spec/components/button/` for a single variant component. For a
composable, multi-part component, `…/breadcrumb/` (no Base UI primitive) and
`…/card/` are the worked examples. For a stateful primitive wrapper, read a
component that already wraps `@base-ui/react` (e.g. `…/switch/`, `…/dialog/`).

---

## Invocation

```
/react-component <ComponentName> [description]
```

| Arg             | Meaning                                                                                                      |
| --------------- | ------------------------------------------------------------------------------------------------------------ |
| `ComponentName` | PascalCase React name for the new component (`Stepper`, `Callout`). kebab-case files (`stepper`, `callout`). |
| `description`   | Free-text requirements: what it is, its variants/sizes, parts, props, states, a11y expectations. Optional.   |

If `description` is thin, **clarify before coding** (Phase 1) — do not invent a
scope. If the component already exists in ui-react, stop and point the user at
`/legacy-component <Name> --update` or `/figma-component <Name> <url> --update`
instead (this skill is for **new** components).

---

## Phase 0 — Readiness gate (prerequisite)

Same gate as `/figma-component`. Run the read-only
[`/component-readiness`](../component-readiness/SKILL.md) audit on `all` before
writing anything, to confirm you're not building alongside pre-existing drift
(dead `var(--ui-*)` refs, un-imported token tiers):

```bash
bash .Codex/skills/component-readiness/scripts/audit.sh all
```

There is nothing for the new component to audit yet, so it legitimately won't
appear — that's expected, not a blocker.

---

## Phase 1 — Specify the component (instead of reading a source)

This is the phase that differs most from the port/Figma recipes: **you write the
inventory from requirements** rather than extracting it from code or a design.
Capture — and confirm with the user if any is ambiguous — the same artifact the
other recipes derive from their source:

- **Purpose** — one sentence: what it is and when to use it (drives the spec
  `README.md` + docs description).
- **Variants & sizes** — the `cva` keys and their options (`variant: [...]`,
  `size: [...]`). These become the ui-react `cva` keys **and** the spec
  `api.yaml` enums verbatim. Omit `cva` entirely if the component has no visual
  variants.
- **Parts** — for a composable component, every sub-component (`Callout`,
  `CalloutTitle`, `CalloutActions`, …). Each becomes a ui-react part and an
  `anatomy.parts[]` entry.
- **Props** — the prop interface: which HTML attributes it extends, booleans,
  callbacks, content/children, and any `render` polymorphism. Drives `api.yaml`
  and the story `argTypes`.
- **States** — which behaviors are pseudo-states (`hover:`, `active:`,
  `focus-visible:`, `disabled:`, `data-[open]:`) vs. real props vs. internal
  state.
- **Interaction model** — is it a plain styled element, a polymorphic element,
  or a stateful/interactive widget? This decides the primitive in Phase 2.
- **A11y** — roles, keyboard interaction, screen-reader expectations.

Write this inventory down before coding — it is the same thing
`/figma-component` Phase 1 captures from the design and `/legacy-component`
Phase 1 captures from code, just authored from the requirements.

> **Ground it in the kit, don't free-style.** Match existing components' API
> shape and naming (a new overlay should feel like `dialog`/`popover`; a new
> status surface like `alert`; a new segmented control like `button-group`).
> Reuse existing parts/tokens/idioms rather than inventing parallel ones — check
> `packages/ui-react/src/index.ts` for what already exists before adding a new
> primitive.

---

## Phase 2 — Choose tokens & primitive (decide before coding)

### 2a. Tokens

Every color must resolve to a generated `--ui-*` token from `@constructor-lab/tokens`.
**Never** hand-author hex/hsl and **never** reference the retired `--av-*`
prefix. Pick the tier in this order:

1. **Component-specific tier, only if it already exists.** A brand-new component
   almost never has one, but check:

   ```bash
   grep -rn "ui-<name>" packages/tokens/css/components/ 2>/dev/null | head
   ```

   If a `--ui-<name>-*` tier exists, prefer it — reference the tokens directly
   with arbitrary values (`bg-[var(--ui-<name>-...-idle)]`, `hover:…`) exactly
   like Button. The whole kit ships via one `@import '@constructor-lab/tokens/css'` in
   `src/styles/index.css`, so an existing tier is already available — no
   per-component import to add.

2. **Semantic vocabulary (the common case).** With no component tier, theme from
   the shared bridged Tailwind names, which resolve to `--ui-*` via ui-react's
   generated `@theme inline` block. Verify each bridged name actually exists
   before using it:

   ```bash
   grep -oE '\-\-color-[a-z-]+' packages/ui-react/src/styles/index.css | sort -u   # bridged names
   grep -oE '\-\-ui-[a-z-]+' packages/tokens/css/semantics.css | sort -u           # raw semantic tokens
   ```

   Common map: `bg-background`/`text-foreground` (surface + body),
   `bg-primary`/`text-primary-foreground` (brand action),
   `bg-secondary` (secondary action), `bg-muted`/`text-muted-foreground`
   (subdued), `bg-accent` (hover surface), `border-border`, and the status
   families (`--ui-background-status-*`, `--ui-glyph-on-status-*`,
   `--ui-border-on-status-*` — see `alert.tsx`). Pick by **role**, not by look.

   > A bare `border` utility renders transparent in ui-react — always write
   > `border-border` explicitly. A name not in the bridge list yields a silent
   > invalid property (same failure as a dead `--ui-*`); remap it to one that
   > exists, or add it to the generated bridge map in
   > `tools/style-dictionary/src/bridge/tailwind-theme.ts` (then rebuild) if it's
   > genuinely shared.

3. **Don't invent a component tier.** If the design genuinely needs
   per-component tokens, those belong upstream in `@constructor-lab/tokens` → rebuild
   `tokens`. For a design-pending v1, **stay on semantic tokens** and flag to
   the user that a dedicated palette is pending a Figma/token pass — don't
   hand-author it here.

Wire **each interaction state to its own token** (`hover:` → `*-hover`,
`disabled:` → `*-disabled`) — never an opacity modifier on the idle color.

### 2b. Composition (primitive)

Pick by the interaction model from Phase 1:

- **Stateful / interactive** (open/close, selection, roving focus, etc.) → wrap
  the matching **`@base-ui/react`** primitive. Confirm it exists
  (`ls node_modules/@base-ui/react/`) and read its `.d.ts` for the real
  forwarded props. **Never** add `@radix-ui/*`.
- **Polymorphic plain element** (renders as `<a>`/`<button>`/another component)
  → Base UI **`useRender` + `mergeProps`** with a `render` prop (like Button /
  Breadcrumb). **Never** use `asChild`/`Slot`.
- **Static styled element(s)** → semantic HTML + `cva` + `cn()`, no primitive.

### 2c. Icons

Use `@constructor-lab/icons-react/<pack>` (usually `stroke-mono`); confirm the icon
exists before importing
(`ls packages/icons-react/src/packs/stroke-mono/icons | grep -i <name>`). Names
are `PascalCase(asset) + Icon`; pass `size={16}` for 16px icons.

---

## Phase 3 — Implement in packages/ui-react

Create `packages/ui-react/src/components/ui/<name>/` — **note there is no
`.figma.tsx` file**:

```
<name>.tsx
index.ts
__tests__/<name>.test.tsx
__stories__/<name>.stories.tsx
__stories__/<name>.generated.stories.tsx   # produced in Phase 4
```

Conventions (mirror Button): `React.forwardRef` + `displayName`; prop interface
extends the right HTML attrs (or the Base UI primitive's props) + `VariantProps`
when using `cva`; `cva` for `variant`/`size` merged with `cn()`; polymorphism via
`useRender({ render, ref, defaultTagName, props: mergeProps<'tag'>({…}, props) })`.
Export everything from `index.ts`, then add an **alphabetical** line to
`src/index.ts`. For a composable component, export the full set of parts.

Do **not** create a Code Connect file. This skill produces no Figma artifacts.

---

## Phase 4 — Spec in packages/ui-spec (7-file format)

Identical to `/figma-component` Phase 4, with the draft-status adjustments.
Create `packages/ui-spec/components/<name>/`:

| File               | Notes                                                                                                                                                |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.yaml`       | `component` PascalCase, `name` kebab, **`status: draft`**, `category`, `since`. **Omit the `figma:` block** (no node — it's optional in the schema). |
| `anatomy.yaml`     | `root` (element/role), `parts` (each id used in the `schematic`!), `layout`, `states`.                                                               |
| `api.yaml`         | `contract` (properties/events/content/methods) + `adapters` (react `implemented`; vue/web-components `planned`).                                     |
| `tokens.yaml`      | **Names only**, `^--ui-…$`. The semantic `--ui-*` tokens you mapped in Phase 2 (and any existing component tier). No values/defaults.                |
| `behavior.md`      | Given/When/Then scenarios derived from the requirements.                                                                                             |
| `accessibility.md` | ARIA, keyboard, screen reader, contrast.                                                                                                             |
| `README.md`        | When to use / not use, examples, parts table. Note it's a design-pending v1.                                                                         |

Hard rules enforced by `packages/ui-spec` `__tests__/specs.test.ts`:

- Every `parts[].id` must appear as a substring in `anatomy.schematic`.
- A `states[]` entry with `kind: prop` must reference a real `api.yaml` property;
  `kind: pseudo` needs a `pseudo` selector; `kind: internal` needs an
  `internal_state[]` entry. Structural distinctions are **parts, not states**.
- For `cva` components, `api.yaml` `variant`/`size` enums must equal the actual
  `cva` keys in the ui-react source (conformance test).

Validate continuously: `pnpm --filter @constructor-lab/ui-spec test`.

**Generate the states story** (don't hand-write `.generated`):
`pnpm --filter @constructor-lab/ui-spec generate:stories`. A **composable / multi-part
component renders empty** unless you give it a `RENDER` hint in
`packages/ui-spec/scripts/generate-stories.ts` (an `extraImports` line + a
`sample` composing the parts) — a deliberate edit to the spec tooling, done
before generating (worked examples: `breadcrumb`, `card`).

> `generate:stories` rewrites **every** component's `.generated.stories.tsx` in
> raw JSX. After running: `prettier --write` your new generated file (or let the
> pre-commit hook format it), and `git checkout --` the unrelated siblings the
> run touched — don't sweep their whitespace churn into your change.

Hand-write `<name>.stories.tsx` for the rich demos, mirroring `button.stories.tsx`.
**Wide `argTypes` (required):** expose a control for **every meaningful prop**
(`cva` keys → `select` w/ exact options; booleans; content → `text`; callbacks/
`render` → `control: false`), each with a `description` + `table: { type, category }`.
Add a `Localized` story only when an RTL/locale demo is worth a baseline. **VR
safety:** don't change what an existing story renders.

---

## Phase 5 — Document in apps/docs (components section)

Add a docs page so the component shows up in the **Components** section like every
other ui-react page. Three pieces: a live demo, an MDX page, a nav entry.

**1. Live demo** — `apps/docs/src/components/demos-react/<name>.tsx`:

- `'use client'` at the top.
- Import the component(s) from `@constructor-lab/ui-react` (icons from
  `@constructor-lab/icons-react/<pack>`); `export function <Name>Demo()` rendering a
  representative composition — mirror the hand-written story.
- **Network-free**: no remote images; data-URI/local only.
- If the component has **portaled overlays**, read `useShadowMount()` and pass it
  as the primitive's `portalContainer` so the popup inherits the shadow root's
  styles (see `demos-react/input-select.tsx`).

**2. MDX page** — `apps/docs/content/docs/components/<name>.mdx` (mirror
`breadcrumb.mdx` for a compound component, `card-filter.mdx` for a single one):

````mdx
---
title: <Name>
description: <one line — reuse the spec index.yaml description>
---

import { DemoReact } from "@/components/DemoReact";
import { <Name>Demo } from "@/components/demos-react/<name>";

## Usage

\`\`\`tsx
import { <Name> } from '@constructor-lab/ui-react';
\`\`\`

<prose: what it is, the parts, polymorphism via `render`, which tokens theme it —
note it's a design-pending v1 if useful>

## Examples

<DemoReact>
  <<Name>Demo />
</DemoReact>

<one fenced ```tsx``` block per meaningful example>

## API Reference

<AutoTypeTable
  path="../../packages/ui-react/src/components/ui/<name>/<name>.tsx"
  name="<Name>Props"
/>
````

- `<AutoTypeTable>` is a **global** MDX component — do **not** import it. Its
  `path` is **relative to `apps/docs/`**; `name` is an **exported** prop
  interface. Compound component → one table per distinct exported interface (see
  `breadcrumb.mdx`). If a type can't resolve (re-exported Base UI props, complex
  generics, a part with no own interface), add a `.docs.ts` companion next to the
  component source and point `path` at that.

**3. Nav entry** — add `"<name>"` to the `pages` array in
`apps/docs/content/docs/components/meta.json`, under the right `---Section---`
divider (`Buttons & Actions`, `Inputs & Forms`, `Data Display`,
`Navigation & Layout`, `Overlays`).

**Verify the docs build** (build-verified, no test suite):

```bash
pnpm --filter @constructor-lab/uikit-docs typecheck   # demo .tsx compiles
pnpm --filter @constructor-lab/uikit-docs build       # MDX + AutoTypeTable resolve, page renders
```

> Live demos mount in a shadow root that adopts ui-react's **compiled**
> `dist/ui-react.css` (served by `/api/ui-react-css`, a gitignored artifact
> rebuilt by the docs `predev`/`prebuild` hooks). The shadow root adopts only
> that sheet, Tailwind-built from ui-react's own source — so a demo may only use
> utility classes ui-react itself ships; a class used solely in the demo is
> tree-shaken out and silently no-ops. Prefer inline `style={{…}}` for one-off
> demo layout.

---

## Phase 6 — Verify & changeset

```bash
pnpm --filter @constructor-lab/ui-react test
pnpm --filter @constructor-lab/ui-react typecheck
pnpm --filter @constructor-lab/ui-react lint
pnpm --filter @constructor-lab/ui-react build      # confirms exports bundle
pnpm --filter @constructor-lab/ui-spec test
pnpm -r typecheck                           # what the pre-commit hook runs
```

Add a changeset for the **published** package only (`ui-react`), `minor` for a
new component. `ui-spec` is private (0.0.0); no changeset:

```
.changeset/<name>-component.md
---
'@constructor-lab/ui-react': minor
---
Add `<Name>` — <one-line summary>. Initial version; design reconciliation pending.
```

**Visual regression.** Stories are VR cases; CI runs **light and dark**, so every
story has two baselines (`<id>.png` and `<id>--dark.png`). Regenerate both in
Docker and review the PNGs before committing:

```bash
pnpm --filter @constructor-lab/ui-react storybook:test:visual:docker:update:all
pnpm --filter @constructor-lab/ui-react storybook:test:visual:docker:all
```

Never commit baselines rendered on macOS/Windows — they won't match CI's Linux
renderer. When you remove/rename a story, delete both its baselines.

---

## Output checklist (done = all green)

- [ ] `src/components/ui/<name>/<name>.tsx` — Base UI + `--ui-*` tokens
      (semantic/primitive, or an existing component tier), **no `--av-*`, no hex**.
- [ ] `index.ts` + alphabetical export line in `src/index.ts`.
- [ ] **No `<name>.figma.tsx`** and **no `figma:` block in the spec** — this skill
      creates no Figma artifacts.
- [ ] `__tests__/<name>.test.tsx` — render, variants/states, a11y roles, ref,
      `render`-prop composition.
- [ ] `__stories__/<name>.stories.tsx` (hand) + `<name>.generated.stories.tsx`.
- [ ] VR baselines regenerated in Docker for **both** light and dark and reviewed;
      both `<id>.png` and `<id>--dark.png` committed (orphans deleted).
- [ ] `packages/ui-spec/components/<name>/` — 7 files, **`status: draft`**, no
      `figma:` block, `ui-spec test` green.
- [ ] `apps/docs`: `src/components/demos-react/<name>.tsx` (live demo) +
      `content/docs/components/<name>.mdx` + `meta.json` nav entry; `uikit-docs build` passes.
- [ ] Changeset for `@constructor-lab/ui-react`.
- [ ] test / typecheck / lint / build all pass; `pnpm -r typecheck` clean.
- [ ] User told this is a design-pending v1 — reconcile with `/figma-component
<Name> <url> --update` once a mockup exists (that adds the Code Connect + `figma:` block).

---

## What this skill deliberately does NOT do

- **No Figma reads.** No `get_design_context` / `get_variable_defs` /
  `get_context_for_code_connect`. The source of truth is the requirements.
- **No `.figma.tsx` Code Connect file and no `figma:` block in the spec.** Those
  require a real node; they're added by `/figma-component <Name> <url> --update`
  later.
- **No legacy source read.** This is for components with no `packages/ui-legacy`
  counterpart (that package has been removed); use `/legacy-component` history
  only via git if a prior implementation is needed.
- **No hand-authored component token palette.** When semantic tokens don't cover
  a need, flag it for an upstream `tokens` pass — don't guess per-component hex
  values.
