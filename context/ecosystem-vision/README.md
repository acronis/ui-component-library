# Cyber Ecosystem — Vision & Governance

- **Status:** Draft for discussion (nothing here is adopted)
- **Date:** 2026-07-19
- **Owner:** Leonid Romanov
- **Audience:** PMs, developers, designers building Cyber Console and its
  microfrontends on the Acronis UI kit.

> **This is the north-star document set.** It describes the _target_ Cyber
> ecosystem: one strict, schema-validated chain from a design in Figma all the
> way down to a shipped product screen, with every layer owning a contract that
> is machine-checked. It unifies the proposals already living in `context/`
> into a single picture and adds the two missing pieces the ecosystem needs:
> an explicit **template/layout layer** and an **App-level spec**.

## The one-sentence vision

**Every Cyber interface is assembled top-down from a small, governed catalog —
`App → Screen → Layout(template) → Pattern → Composite → Primitive → Token`,
sourced from Icons and Figma — where each layer is a validated artifact, so
consistency is guaranteed by construction rather than by discipline.**

## Read this in order

| #   | Document                                                     | For                   | What it answers                                                          |
| --- | ------------------------------------------------------------ | --------------------- | ------------------------------------------------------------------------ |
| 0   | [`00-plain.md`](00-plain.md)                                 | everyone (start here) | The whole idea in plain language, no jargon. "Build screens like LEGO."  |
| 1   | [`01-vision.md`](01-vision.md)                               | everyone              | Why this ecosystem, what "done" looks like, the guiding principles.      |
| 2   | [`02-layer-model.md`](02-layer-model.md)                     | everyone              | The layers, the strict downward-only dependency rule, the full diagram.  |
| 3   | [`03-layer-contracts.md`](03-layer-contracts.md)             | devs, designers       | Per-layer: the artifact, its schema, its validator, its owner, its gate. |
| 4   | [`04-common-template-layer.md`](04-common-template-layer.md) | devs, designers       | The repeatable page **template** layer (the `common-template` idea).     |
| 5   | [`05-roles-and-authoring.md`](05-roles-and-authoring.md)     | PMs, designers, devs  | Who authors what, and the end-to-end authoring workflow.                 |
| 6   | [`rfcs/README.md`](rfcs/README.md)                           | everyone              | **The discussion board** — how we decide, and the open questions.        |
| —   | [`announce.md`](announce.md)                                 | whoever kicks it off  | Copy-paste chat messages to hook PMs/designers/devs into the discussion. |

## How this relates to what already exists

This vision is **not a reset**. It stitches together decisions and machinery
already proposed or built in this repo, and names the gaps:

- **Layer model** — extends `context/component-layers-proposal.md`
  (Primitive/Composite) with the higher layers.
- **Pattern-as-unit** — adopts `context/pattern-first-screens-proposal.md`
  (screens are composed from patterns, never hand-wired primitives).
- **Screens & app spec** — adopts `context/demo-console-portal-proposal.md`
  (`screen.yaml`, `app.yaml`, `spec-index.json`).
- **Enforcement** — reuses the grammar / `kit-lint` / `screen-audit` / ledger
  machinery from `context/kit-consistency-audit-proposal.md` and the
  `acronis-patterns` ESLint plugin.
- **Config-driven composites** — adopts
  `context/opinionated-composites-proposal.md`.
- **The rules-over-components thesis** — adopts
  `context/uikitless-workflow-proposal.md` (the generate → lint → audit loop).

The **new** contributions of this document set:

1. A single top-to-bottom **layer contract** table (every layer has a schema,
   a validator, an owner, and a merge gate).
2. An explicit **Template/Layout layer** between Screen and Pattern — the
   generalization of the `common-template` idea.
3. An **App layer** (`app.yaml`) that ties routes → screens → shared shell for
   a microfrontend.
4. A **cross-repo governance model** so the same rules bind in Cyber Console and
   every MFE, not just inside this kit.

## The discussion board

Decisions are made in the open via **RFCs** (see [`rfcs/`](rfcs/)). Each open
question is one numbered RFC. PMs and designers who don't live in git track the
same RFCs on the mirrored **Confluence space CYB**:

- Vision: <https://adn.acronis.work/pages/viewpage.action?pageId=301062259>
- Discussion board: <https://adn.acronis.work/pages/viewpage.action?pageId=301062260>

The rule: _no layer contract tightens to blocking (`must`) without a ratified
RFC._
