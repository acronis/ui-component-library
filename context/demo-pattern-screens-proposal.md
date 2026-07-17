# Proposal: Pattern-composed demo screens (the pattern-first pilot in `apps/demo`)

- **Status:** Proposed (not yet adopted)
- **Date:** 2026-07-17
- **Owner:** Leonid Romanov
- **Affects:** `apps/demo` (routes rebuilt as pattern compositions),
  `packages/ui-spec/screens/*` (a `screen.yaml` per demo screen),
  `packages/ui-spec` (`spec-index.json`). **No change to primitives/composites'
  public surface;** this only _consumes_ patterns.
- **Builds on:** `context/pattern-first-screens-proposal.md` (the pattern-as-unit
  model + decisions **D1–D5**), `context/demo-console-portal-proposal.md`
  (`apps/demo` as an AppShell console portal, `screen.yaml` renderer, templates
  gallery), `context/uikitless-workflow-proposal.md` (the generate→lint→audit
  loop), and the shipped `ui-spec/patterns` catalog + `ui-react` composites.

---

## 1. Goal

Make `apps/demo` the **living, reviewable corpus** of pattern-first screens. Today
the demo hand-builds its routes (`dashboard/`, `data/`, `settings/`, `login/`) by
wiring primitives — the very thing `pattern-first-screens-proposal.md` argues
against. This proposal rebuilds them (and adds a few) as **screens composed only
from approved patterns**, each with a committed `screen.yaml`, so a human can:

- **review** a real rendered screen against its spec, and
- **correct** the spec and regenerate — no primitive surgery.

This is the concrete **pilot** the pattern-first proposal asks for (§8.5): prove
the model on real screens, exercise most of the 19-pattern catalog, and turn the
demo into the templates gallery from `demo-console-portal-proposal.md`.

## 2. The screen slate

Every screen sits inside the **`app-shell`** frame (sidebar + header) except the
unauthenticated ones. Each `main` region is a **nested pattern tree** (D1).

| Demo screen                        | Route                 | Patterns (primary → nested)                                                                                                         | Composites it renders                                                                                                                      | What it proves                                                             |
| ---------------------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| **Dashboard**                      | `/`                   | `app-shell` › `dashboard` › `card-grid`                                                                                             | `stat-row`, `widget-protection-summary`, `widget-protection-status`, `widget-progress-tiers`, `chart`, `widget-table-data`, `widget-alert` | widgets + graphs, KPI grid, data-states                                    |
| **Data table**                     | `/data`               | `app-shell` › `table-view` + `data-table-bulk-actions` + `filter-popover` + `sheet-detail-panel` + `form-dialog` + `confirm-dialog` | `data-table`, `card-filter`/`filter`, `sheet`, `detail-list`/`description-list`, `form-layout`                                             | table + row-detail sheet, filters, new-item, bulk ops — the richest screen |
| **Settings**                       | `/settings`           | `app-shell` › `form-layout` + `form-two-column` + `field-group` + `form-validation`                                                 | `form-layout`, `field-group`, `section`, `page-header`                                                                                     | multi-section forms, validation, save flow                                 |
| **Login**                          | `/login`              | `auth-screen` › `form-layout` + `form-validation`                                                                                   | `auth-layout`, `form-layout`                                                                                                               | unauthenticated frame (no app-shell)                                       |
| **Empty / error states**           | (states of the above) | `empty-screen`                                                                                                                      | `empty`                                                                                                                                    | data-state parity across screens                                           |
| **Intelligence panel** _(stretch)_ | `/data` variant       | `intelligence-panel`                                                                                                                | contextual side panel                                                                                                                      | a second overlay pattern beside the sheet                                  |

Between them these screens exercise **~15 of the 19 patterns** — a real coverage
test for the catalog and the `screen-audit` gate.

## 3. Screen detail

Each screen ships three artifacts: a **`screen.yaml`** (the contract), a **demo
route** that renders it from patterns/composites only, and a **state machine**
whose per-state **acceptance criteria (D3)** are the audit/test oracles.

### 3.1 Dashboard — widgets & graphs

- **Region tree.** `main` → `page-header` (title + range picker action) · `card-grid`
  of KPI tiles (`stat-row` / `widget-protection-summary` / `widget-progress-tiers`)
  · a charts row (`chart`: time-series + category + distribution) · a recent-activity
  block (`widget-table-data`) · optional `widget-alert`.
- **States.** `idle → loading` (skeleton tiles/charts) `→ loaded | empty | error`.
  _Acceptance:_ loading shows skeletons for every tile; empty shows the
  `empty-screen` pattern; error shows a retry.
- **Replaces.** `routes/dashboard/{DashboardPage,MetricsCards,ChartsSection,RecentActivity}.tsx`.

### 3.2 Data table — table + detail sheet + filters + actions

The showcase screen. **Region tree** for `main`:

- `page-header` with **actions**: **New item** → `form-dialog` (or `wizard-dialog`
  for multi-step); a **bulk-actions** toolbar that appears on selection.
- **Filters** → `filter-popover` (backed by `card-filter`/`filter`), bound to the
  table query.
- **`table-view` + `data-table-bulk-actions`** → `data-table` composite with row
  selection, pagination, and bulk operations; **bulk delete** routes through
  `confirm-dialog`.
- **Row click → `sheet-detail-panel`** → `Sheet` + `detail-list`/`description-list`
  rendering the row's data (the `no-adhoc-sheet` rule already steers here).
- **States.** `idle → loading → loaded | empty | error`; orthogonal UI state for
  `selection`, `sheet(open|closed)`, `newItem(dialog)`, `bulkConfirm`.
  _Acceptance:_ selecting rows reveals bulk actions; a destructive bulk op always
  confirms; the sheet shows the clicked row and restores focus on close.
- **Replaces.** `routes/data/{DataTablePage,DataTable,DetailView,NewRowDialog,RowActions}.tsx`.

### 3.3 Settings — forms

- **Region tree.** `main` → `page-header` · stacked sections, each a `form-layout`
  (or `form-two-column`) built from `field-group`, with `form-validation` and a save
  action per section. (Reuses the `settings-form` screen from the second audit spike.)
- **States.** `ready → editing(dirty) → saving → saved | error`; field-level
  validation. _Acceptance:_ save is disabled until dirty & valid; errors bind to
  fields; success confirms.
- **Replaces.** `routes/settings/{SettingsPage,AccountSection,PreferencesSection,ProfileSection}.tsx`.

### 3.4 Login & states (and so on)

- **Login** → `auth-screen` (no app-shell frame) + `form-layout` + `form-validation`.
- **Empty/error** → `empty-screen` used consistently as the empty state of the
  dashboard and table (proves cross-screen state parity, grammar A5/A6).
- **Intelligence panel** _(stretch)_ → `intelligence-panel` as a contextual panel on
  the data screen — a second overlay pattern to contrast with the detail sheet.

## 4. How each screen is built & kept honest

Per screen, the pattern-first loop:

1. **Spec** — author `ui-spec/screens/<slug>/screen.yaml`: region tree (D1), each
   region a `pattern`; data via `$bind`; the state machine + acceptance criteria (D3).
2. **Build** — a demo route renders the spec using **only patterns/composites**
   (hand-guided first; the `screen.yaml` renderer from `demo-console-portal` §4b
   later). `require-pattern` **errors** on these new screens (D2).
3. **Gate** — `screen-audit` (rendered) + `pattern-conformance` verify each region
   matches its declared pattern and the grammar holds; VR baselines derive from the
   spec.
4. **Review & correct** — a reviewer compares the rendered screen to the spec,
   edits the **spec** (not the markup), regenerates. This is the "easily reviewed
   and corrected" loop the demo is for.

The old hand-built routes are the **grandfathered** versions (D2); they're removed
as each pattern-composed replacement lands.

## 5. Why the demo is the right home

- **Reviewable & correctable** — real screens a human can click through; corrections
  happen in the spec.
- **Pattern discovery** — building real screens surfaces missing patterns → the
  graduation pipeline (a `patternless` escape becomes a candidate; designer proposes,
  kit ratifies — D4).
- **Audit corpus** — each screen is a fixture for `screen-audit`, growing coverage
  beyond `protection-dashboard` + `settings-form`.
- **Templates gallery** — this _is_ the gallery `demo-console-portal-proposal.md`
  envisions; screens become copy-paste starters.

## 6. Phasing

1. **Data table screen first.** It uses the most patterns (`table-view`,
   `data-table-bulk-actions`, `filter-popover`, `sheet-detail-panel`, `form-dialog`,
   `confirm-dialog`), so it's the strongest single test of the model and the catalog.
2. **Dashboard** (widgets + charts + `card-grid`), then **Settings** (reuse
   `settings-form`), then **Login** + shared **empty/error** states.
3. **Intelligence panel** and the `screen.yaml` renderer are stretch.

Each screen is an independent, reviewable PR: spec + route + audit fixture.

## 7. Risks & open items

- **Pattern gaps.** A demo screen may need a pattern that doesn't exist yet →
  `patternless` escape + a graduation candidate, not a hand-wired workaround.
- **Data/mock layer.** These screens need mock data + async; keep it in the demo's
  existing mock generators so the spec stays about structure, not data plumbing.
- **Charts.** `chart` is a composite but graphs carry the most bespoke config; decide
  whether a `dashboard`-level `widget-*` wraps them so the screen stays pattern-pure.
- **Open:** do we keep tabs in Settings (current) or flatten to stacked `form-layout`
  sections? (Tabs add a navigation pattern; flattening keeps it a pure form screen.)

---

**In one line:** rebuild the demo's Dashboard, Data-table (+ detail sheet, filters,
new-item, bulk ops), Settings, and Login as **pattern-composed screens with a
`screen.yaml` each**, so `apps/demo` becomes the reviewable, correctable reference
corpus that pilots pattern-first development and exercises most of the catalog.
