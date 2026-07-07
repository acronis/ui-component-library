# Proposal: Demo console portal — the spec-driven "real app" example (layers Phase 4)

- **Status:** Proposed (not yet adopted)
- **Date:** 2026-07-06
- **Owner:** Leonid Romanov
- **Affects:** `apps/demo` (the build target); reads metadata from
  `packages/ui-spec` (components / patterns / screens) and renders
  `packages/ui-react` + `@spec-lab/ui-kit-demos`. No `ui-react` / `ui-spec`
  source changes beyond an optional spec-index emitter.
- **Builds on:** `context/component-layers-proposal.md` (this is its Phase 4 —
  "templates gallery in apps/demo"), and the existing `ui-spec/screens`,
  `ui-spec/patterns`, and `apps/demos/src/patterns/*` implementations.

---

## 1. Goal

Turn `apps/demo` from a grab-bag of routes (`dashboard`, `data`, `settings`,
`login`, several `cyberchat` demos) into **one cohesive console portal** — a
believable single-product admin console, built entirely from the kit, that
showcases the whole system end-to-end:

- **Screens** — full assembled product screens, from `ui-spec/screens/*`.
- **Patterns** — the approved compositions (`ui-spec/patterns/*`), rendered via
  their `apps/demos/src/patterns/*` implementations.
- **Components / demos** — the primitive & composite component demos.

…all navigable inside the portal itself, **driven by the specs** (the catalog is
generated from the ui-spec files, so it can't drift), with a **guided
onboarding tour** on first visit. It doubles as the "copy-paste starter" the kit
lacked and the flagship consistency exemplar.

## 2. The portal

Realize the **`protection-dashboard` screen spec** + the **`app-shell` pattern**
as the frame: `AppShell` with `SidebarPrimary` (collapsed rail) + `SidebarSecondary`
(section nav), a centered `SearchGlobal` header, and a routed main area. The demo
already uses `AppShell`/`Sidebar*` (`layouts/Layout.tsx`, `pages/Home.tsx`), so
this consolidates existing usage rather than inventing it.

Main-area sections (secondary-nav entries):

- **Overview** — a real dashboard screen (the `protection-dashboard` realization;
  reuses `apps/demos/src/patterns/DashboardPattern`).
- **Screens** — a gallery listing every `ui-spec/screens/*` with title/status/
  Figma link, each opening its assembled screen (hand-built to match the spec).
- **Patterns** — every `ui-spec/patterns/*` recipe with its intent/when-to-use,
  each rendering its `apps/demos/src/patterns/*` live implementation + the
  copy-paste `example`. Shows `implementedBy` when a pattern has graduated.
- **Components** — the component demos, grouped by the `layer` field
  (Primitives vs Composites, per Phase 1/2) and `category`.

## 3. "By specs" — the decision (recommended)

Two ends of a spectrum (the open fork from the kickoff):

- **A. Hand-built portal + spec-driven catalog (recommended for Phase 4a).**
  The screens are hand-assembled from the kit (mirroring each `screen.yaml`); the
  **catalog** (the Screens/Patterns/Components indexes, counts, layer grouping,
  status badges, links) is generated from the ui-spec files so it stays in sync.
  Concretely: a small **spec-index emitter** in `ui-spec` writes a
  `spec-index.json` (every component's `name`/`layer`/`category`/`status`, every
  pattern's `intent`/`components`/`implementedBy`/`demo`, every screen's
  `title`/`route`/`story`/`pattern`), and `apps/demo` imports it to build the
  navigation + catalog. Low risk, ships the example, and the spec stays the
  source of truth for _what exists_.
- **B. Generic screen renderer (possible Phase 4b, deferred).** A runtime engine
  that reads `screen.yaml`'s `regions → components → props` and instantiates
  ui-react components from a registry, resolving `$bind`/`$token`. Powerful (add a
  screen spec → it renders) but a real subsystem (component registry, prop/binding
  resolution, slot mapping, error handling) that risks becoming its own product.

**Recommendation:** ship **A** as Phase 4a. Reassess **B** afterward — the
`spec-index.json` from A is also the foundation a renderer would need, so A is a
strict prerequisite, not throwaway.

## 4. Onboarding tour (guided, multi-step — decided)

A first-visit **guided product tour** built on the kit's `Popover`:

- Sequenced steps, each a `Popover` anchored to a portal landmark: primary nav →
  secondary nav → global search → a key action → the catalog. Each step has a
  title, body, and **Next / Back / Skip**; a step counter ("2 of 5").
- A small tour controller (local, in `apps/demo`) drives the active step, opens
  the right `Popover`, and scrolls/focuses the anchor. Completion/skip is
  **persisted** (Zustand + `localStorage`) so it shows **once**; re-triggerable
  from a Help ("Take the tour") menu item.
- Kit-only surface: `Popover` (+ `Button` for the step controls). No new
  dependency. If gaps appear (arrow, spotlight/scrim), note them as follow-ups —
  don't hand-roll tokens.

## 5. Spec access from `apps/demo`

`apps/demo` doesn't currently depend on `ui-spec`. Add `@spec-lab/ui-spec` as a
dev dependency and consume a **generated `spec-index.json`** (emitted by a new
`ui-spec` script that reads the yaml) — not raw YAML at runtime. This keeps the
demo build simple (import JSON), keeps ui-spec the source of truth, and gives a
CI check that the index is regenerated when specs change (mirrors the tokens
drift-gate pattern).

## 6. Rollout

- **Phase 4a.1 — Portal frame.** The `AppShell` console (primary/secondary nav +
  global search), routed sections, consolidating existing `apps/demo` usage.
- **Phase 4a.2 — Spec-index + catalog.** The `spec-index.json` emitter + the
  Screens/Patterns/Components catalog pages driven by it (layer grouping, status,
  links to demos/patterns implementations).
- **Phase 4a.3 — Screens & patterns.** Wire `protection-dashboard` (Overview) and
  the `apps/demos/src/patterns/*` implementations into the Patterns section.
- **Phase 4a.4 — Onboarding tour.** The guided multi-step `Popover` tour + persist +
  Help re-trigger.
- **Phase 4b (deferred) — Generic screen renderer** over `spec-index` +
  `screen.yaml`.

## 7. Impact & non-goals

- **`apps/demo`** (private) is the main change; **no `ui-react` behavior change**;
  `ui-spec` gains only a spec-index emitter script (+ its schema stays as-is).
- **Not** a new package, and **not** (in 4a) a generic renderer.
- Existing `cyberchat*` demo routes stay; the console portal is the new default
  landing, they remain reachable.

## 8. Decisions (kickoff review)

- **Spec-index lives in `ui-spec`** — a committed, drift-gated `spec-index.json`
  (source of truth), consumed by `apps/demo`.
- **Routes from root.** The portal _is_ the app — no `/console` nesting. Today's
  `dashboard`/`data`/`settings` become sections at root paths; `cyberchat*` stay
  reachable.
- **Tour uses a spotlight + beacon** ("green light"), not plain popovers — see §9.

## 9. Evolution: the demo as a spec-generated app

The bigger intent: the console portal is not just _illustrated by_ specs — it is
**generated/updated from an app-level spec**, making it the live test of an
"app/screen spec → app" solution. Editing the app spec (e.g. changing the app
description, adding a screen) should update the demo app.

- **App spec (new ui-spec type).** Above `screens/`, an `apps/<slug>/app.yaml`
  describing a whole app: kind (`spa` | `single-screen` | `microfrontend`),
  metadata/description, its `screens[]` (→ `ui-spec/screens`), routes, primary/
  secondary nav, the patterns/composites it uses, and its onboarding tour(s).
  Validated like the other specs. The demo portal is the first `app.yaml`.
- **Generation skill (new).** A `/generate-app` (working name) skill that
  generates or updates an app from its `app.yaml` + the referenced screen/pattern
  specs, assembling **only approved patterns and composites**. Targets a SPA, a
  single screen, or a microfrontend. This is the natural successor to
  `/react-component` / `/figma-component` at the app altitude, and the reason 4a
  is hand-built first: we build the reference portal, extract the `app.yaml`
  format from it, then the skill regenerates it (build → formalize → generate,
  same graduation philosophy as pattern→composite).
- **Sequencing.** 4a builds the reference portal by hand and defines `app.yaml`
  descriptively; the generator (and the generic `screen.yaml` renderer, 4b) come
  after the format is proven against the real portal.

## 10. Tour component ("green light" coach-mark)

The guided tour needs more than a bare `Popover`; per the referenced Figma
(Main-menu-improvements, node `1608-126436`) it's a **coach-mark**: a stepped
popover with a title/body, **Next / Back / Skip** + step counter, anchored to a
target that gets a **beacon ("green light")** pulse and a **spotlight/scrim**
dimming the rest. Proposed as a **dedicated component** (working name
`Tour` / `Coachmark` / `StepPopover`) rather than ad-hoc popovers:

- Likely a new `ui-react` primitive/composite built on `Popover` + a scrim +
  a beacon indicator, themed from tokens (flag any token/primitive gap — e.g. a
  spotlight cut-out or the beacon color — as a follow-up; don't hand-roll hex).
- **Tours are defined in the app spec / `apps/demo`** (the step list + anchors),
  and driven by the component. Persist "seen" once; re-trigger from Help.
- Its own `/react-component`-style spec + stories when built. Scoped to **Phase
  4a.4**; 4a.1–4a.3 don't depend on it.
