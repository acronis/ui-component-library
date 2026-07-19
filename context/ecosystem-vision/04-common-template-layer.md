# 04 — The Template Layer (the `common-template` idea, generalized)

- **Status:** Draft for discussion — this is the one **new layer** the vision adds
- **Part of:** [Cyber Ecosystem — Vision & Governance](README.md)
- **Motivated by:** `pstorage-ui-hci/src/common/components/common-template`

## 1. The precedent

In `pstorage-ui-hci`, ~50 CRUD pages share **one** component,
`CommonTemplate`, that renders a complete "resource list with search, batch
actions, and a detail flyout" screen. Its anatomy (verified):

- A fixed **layout skeleton** (`DetailsLayout`): header · navigation · toolbar ·
  content panel · detail side-panel (720px flyout) · footer.
- A **config orchestrator** (`CommonTemplate`) that owns cross-cutting behavior
  once: URL/localStorage filter+sort persistence, client search **or** server
  paging, loading/error/empty states, delete-confirm, permission gating, i18n.
- A family of **standardized parts** (`CommonTable`, `CommonToolbar`,
  `CommonRowActions`, `CommonDetailsTable`, `CommonConfirm`, …).
- **~30 named slots**, each with a sensible default, so any region is
  overridable without abandoning the template.
- Variation by **thin subclass** (`CommonTemplatePaging extends CommonTemplate`,
  flipping `withPaging`), not by forking.

A page becomes **declarative configuration**: declare `tableColumns`,
`detailsColumns`, an `actions` map, `*ActionNames` arrays, permissions, a fetch
function — and override 1–4 slots. Every resource page then looks and behaves
identically, for free.

**This is exactly the config-driven-composite idea in
`opinionated-composites-proposal.md`, but at the page/screen altitude.** It is
the missing layer 4.

## 2. Why it deserves its own layer (not "just a big composite")

A **composite** assembles primitives into a region (a toolbar, a stat row, a
sheet). A **template** assembles _patterns_ into a **whole page skeleton** and
owns page-level cross-cutting behavior (routing sync, list/detail master-detail
flow, persistence). The altitude and the job differ:

|          | Composite (layer 2)            | Template (layer 4)                             |
| -------- | ------------------------------ | ---------------------------------------------- |
| Composes | primitives                     | patterns (+ composites)                        |
| Scope    | one region                     | a full page                                    |
| Owns     | local interaction              | page flow: routing, persistence, master-detail |
| Config   | props                          | columns + actions + data-source + slots        |
| Example  | `DataGrid`, `Sheet`, `StatRow` | `ResourceListTemplate`, `DetailFormTemplate`   |

Placing it between Screen and Pattern keeps the downward-only rule intact:
**Screen → Template → Pattern → Composite → Primitive.**

## 3. The artifact: `template.yaml` (proposed schema)

Lives at `packages/ui-spec/templates/<name>/template.yaml`, validated by a new
`template.schema.json`. Sketch (subject to RFC-0002):

```yaml
spec_version: 1
template: ResourceListTemplate        # PascalCase, must exist in ui-react as layer: composite
name: resource-list                   # kebab, == folder
status: draft                         # draft | ready | deprecated
category: page
since: "0.x"
intent: >
  A resource list page with search, filters, batch actions, and a detail flyout.
description: The CRUD master-detail archetype — the common-template generalization.

# The fixed layout skeleton, expressed as regions bound to approved patterns.
skeleton:
  - regionId: header
    pattern: page-header            # must resolve in ui-spec/patterns
  - regionId: toolbar
    pattern: filter-popover
  - regionId: content
    pattern: table-view
  - regionId: detail
    pattern: sheet-detail-panel
    optional: true                  # present only when withDetails config is set
  - regionId: confirm
    pattern: confirm-dialog

# The typed config contract a screen fills in (the "props" of the template).
config:
  dataSource:   { type: "store | dataset", required: true }
  columns:      { type: "ColumnDef[]",     required: true }
  detailColumns:{ type: "ColumnDef[]",     required: false }
  actions:      { type: "ActionMap",       required: false }
  permissions:  { type: "PermissionMap",   required: false }
  paging:       { type: "client | server", default: client }   # the CommonTemplatePaging variant, as config

# Named escape hatches (region → allowed override). Tracked, not silent.
slots:
  - name: toolbar-actions
  - name: row-actions
  - name: detail-content
  - name: empty-state

implementedBy: ResourceListTemplate   # the ui-react composite that realizes it
demo: templates/resource-list         # apps/demo route
```

Key design decisions baked in:

- **Slots resolve to patterns**, so a template can't smuggle in an ungoverned
  region — the downward edge is validated (`templates.test.ts`).
- **Variants are config, not subclasses.** `common-template`'s `Paging` subclass
  becomes `config.paging: server`. No forking.
- **`implementedBy`** ties the spec to a real `layer: composite` component in
  `ui-react`, exactly as patterns already do.

## 4. How a screen uses a template

A `screen.yaml` gets a new optional `template` field. When present, the screen
is mostly the template's config; regions it doesn't override come from the
template's skeleton:

```yaml
spec_version: 1
name: devices
title: Devices
route: /devices
story: screens-devices--default
template: resource-list # ← picks the layer-4 template
templateConfig:
  dataSource: { $bind: devices.store }
  columns: { $bind: devices.columns }
  actions: { $bind: devices.actions }
  paging: server
regions: # only the overrides / additions
  - regionId: toolbar
    slot: toolbar-actions
    components:
      - { instanceId: export, component: Button, props: { variant: secondary } }
stateMachine:
  states:
    - { name: loading, category: loading, initial: true }
    - { name: loaded, category: loaded }
    - { name: empty, category: empty }
    - { name: error, category: error }
  transitions:
    - { from: loading, to: loaded, trigger: fetch.success }
    - { from: loading, to: empty, trigger: fetch.empty }
    - { from: loading, to: error, trigger: fetch.error }
```

The PM/AI author "fills the template," the template guarantees the page geometry,
and the state machine carries the logic. This is the `common-template` authoring
experience — declarative config + a few slot overrides — but now **schema-checked
and rule-audited**.

## 5. The demo becomes the template gallery

Per `component-layers-proposal.md` §5 and `demo-console-portal-proposal.md`,
`apps/demo` renders these templates as browsable, copy-paste starters — the
"real app" gallery. The demo is the reviewable reference corpus that proves each
template holds across many configurations.

## 6. Candidate templates (first slate)

Anchored to patterns that already exist, so each has its building blocks ready:

| Template               | Composes patterns                                                                                         | Replaces (legacy)             |
| ---------------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `ResourceListTemplate` | page-header · filter-popover · table-view · sheet-detail-panel · confirm-dialog · data-table-bulk-actions | `common-template` (CRUD list) |
| `DetailFormTemplate`   | page-header · form-layout · form-validation · confirm-dialog                                              | resource create/edit pages    |
| `DashboardTemplate`    | dashboard · card-grid · intelligence-panel · stat-row                                                     | dashboard pages               |
| `WizardTemplate`       | wizard-dialog · form-two-column · form-validation                                                         | multi-step flows              |
| `AuthTemplate`         | auth-screen · form-layout                                                                                 | login/reset pages             |

Graduation follows the same rule as patterns: a template earns `ready` once it's
used in ≥2 real screens with a stable config contract.

## 7. Open questions (→ RFC-0002)

- Is a template a **published `ui-react` composite** (`layer: composite`) or a
  new `layer: template` value? (Leaning: reuse `layer: composite` +
  `category: page` to avoid a schema churn; RFC decides.)
- Slot config format — how much typing lives in `template.yaml` vs. the
  component's TypeScript props?
- Do templates own routing/persistence (like `common-template` did) or delegate
  to the app/screen `stateMachine`? (Leaning: behavior in the state machine,
  layout+slots in the template — keep logic and look orthogonal.)
