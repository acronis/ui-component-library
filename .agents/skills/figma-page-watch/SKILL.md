---
name: figma-page-watch
description: >
  Cheaply detect which Figma component pages changed since the last check, then
  plan ui-component updates from that drift — instead of deep-checking every
  component one by one. The design file (ui-react, key lrU3ydIyvPYQNE6ixdsKtJ) has
  one canvas page per component family (Button, Input, Tag, Tree, Dialog, Dropdown,
  Loading, …); this skill captures a per-page change signal (a get_metadata
  fingerprint, or a Figma version/date when figma-console is connected), diffs it
  against a committed manifest (packages/ui-spec/figma/page-watch.json), and for
  each drifted page lists the components it governs plus the exact
  /figma-component --update commands to reconcile them. Run it periodically. Invoke
  with /figma-page-watch [check | record | list | sync].
---

# figma-page-watch

Design files and tokens change **suddenly** — a component page gets re-drawn, a
token is re-pointed — but re-auditing every ui-react component against Figma is
too costly to do routinely. This skill makes the check cheap by working at the
**page** level: the Figma file has one root page per component family, so a single
per-page signal answers "did anything under here change?" — and only the drifted
pages trigger a component-update plan.

It is the periodic tripwire; [`/component-readiness`](../component-readiness/SKILL.md)
and [`/figma-component`](../figma-component/SKILL.md) are what you run **on the
components a drift points at**.

---

## Invocation

```
/figma-page-watch [check | record | list | sync]
```

- **`check`** (default) — gather each page's live signal, diff vs the manifest,
  print the drift + the update plan. Read-only; changes nothing.
- **`record`** — advance the manifest baseline to the current signals (after you've
  reconciled the components, or to seed the first baseline).
- **`list`** — show the watched pages, their mapped components, and stored state.
- **`sync`** — reconcile `pages[]` with the live Figma page list (add new pages,
  update renamed ones). Run it on the **first run** and whenever pages are
  added/renamed in Figma, so you never hand-edit ids.

State + config live in **`packages/ui-spec/figma/page-watch.json`**: the file key,
and per page `{ id, name, components[], signal, version, changedAt, checkedAt }`.
`components[]` is a **curated** map of page → the ui-spec/ui-react components it
governs — edit it freely; the skill trusts it.

---

## The signal (how "changed" is decided)

`signal` is any stable string the script compares by equality. Pick the best your
tools can produce, per page:

0. **Easiest — REST `--fetch` (token-based, whole run in one command).** With a
   token available (see step 0 / `.env.local`), `plan --fetch` and `record --fetch`
   fetch the signals themselves: for every page they hash a **shallow slice**
   (`/nodes?ids=…&depth=2`) of the page's node tree. That's small (~KB, not the
   tens-of-MB full subtree — some pages are huge), stable, and covers frames +
   component/variant structure. It's a **coarse structural tripwire**
   (add/remove/rename/move/resize); a deep style-only edit may not flip it —
   `/component-readiness` catches those. This replaces steps 1–2/4 below; skip the
   manual signal-gathering when you use it.
1. **Preferred (no token) — Figma version/date (authoritative).** If the **figma-console**
   MCP is connected, use its history tools (`figma_get_file_versions`,
   `figma_get_changes_since_version`, or `figma_blame_node(pageId)`) to read the
   page's last version id / change timestamp. Put it in `signal` (and mirror it to
   `version` / `changedAt`).
2. **Fallback — metadata fingerprint (always available).** With only the official
   `mcp__figma__*` server, call **`get_metadata({ fileKey, nodeId: <pageId> })`**
   (the page subtree: names, positions, sizes — much lighter than
   `get_design_context`), save it to a file, and hash it:

   ```bash
   # from a saved file…
   node .Codex/skills/figma-page-watch/scripts/page-watch.mjs fingerprint /tmp/<page>.txt
   # …or pipe the metadata straight in (— / omitted arg reads stdin):
   node .Codex/skills/figma-page-watch/scripts/page-watch.mjs fingerprint - < /tmp/<page>.txt
   ```

   Any add / move / resize / rename under the page flips the hash. This is a
   reliable **change flag**; it isn't a human-readable version, so it's fine to
   leave `version`/`changedAt` null when using it.

Do **not** mix signal kinds for one page across runs (a fingerprint won't equal a
version string) — the first run after switching kinds will show a false "changed",
which `record` then re-baselines.

---

## Workflow

> **With a token, the whole loop is two commands:** `… plan --fetch` to see drift,
> then `… record --fetch` to re-baseline (after reconciling). Steps 1–4 below are
> the manual (no-token / figma-console) path.

### 0. Sync the page list (first run / new pages)

Reconcile the manifest with the file's pages — this fills in page **ids**
automatically so you never hand-edit them.

> ⚠ **Enumerate pages via REST, not the MCP.** `get_metadata({ fileKey })` (the
> Dev Mode MCP) lists only the pages currently **loaded in the desktop app** —
> Figma lazy-loads pages, so it **undercounts** (e.g. it returned 9 while the file
> has ~40). Use one of these authoritative sources instead:

- **REST (preferred, gets every page):** provide a Figma token and let the script
  fetch `GET /v1/files/:key?depth=1`:

  ```bash
  node .Codex/skills/figma-page-watch/scripts/page-watch.mjs sync --fetch
  ```

  The token comes from the env (`FIGMA_TOKEN` / `FIGMA_PAT` / `FIGMA_ACCESS_TOKEN`)
  **or** a gitignored `.env.local` next to the skill — copy
  `.Codex/skills/figma-page-watch/.env.local.example` → `.env.local` and paste a
  [personal access token](https://www.figma.com/developers/api#access-tokens). It
  also accepts `FIGMA_FETCHER_FIGMA_TOKEN`, so the token already in
  `packages/icons-svg/.env.local` works without duplicating it.

- **figma-console MCP:** if connected, `figma.loadAllPagesAsync()` then
  `figma.root.children` gives all pages — pass them as JSON `[{id,name},…]`.
- **Manual / MCP fallback:** pipe a page list in (accepts JSON or the
  `- <id>: <name>` lines from `get_metadata`), knowing the MCP list may be partial:

  ```bash
  node .Codex/skills/figma-page-watch/scripts/page-watch.mjs sync - <<'EOF'
  - 419:1493: Index
  - 5181:6800: Accordion
  …
  EOF
  ```

`sync` **adds** pages new in Figma (with empty `components[]` — curate them),
**renames** ones whose title changed, and **preserves** every existing page's
curated components + stored signal. It never deletes; pages in the manifest but
absent from the supplied list are kept and flagged for review (so a _partial_ MCP
list won't wipe curated pages). On a brand-new / empty manifest it populates
`pages[]` from scratch. Skip this step when the page set is unchanged.

### 1. Gather live signals

For each page in the manifest (`… list` to see them), produce its current signal
by the best method above, and assemble a `current.json`:

```json
{
  "2862:13287": { "signal": "9f1c…", "version": null, "changedAt": null },
  "1072:1963": { "signal": "a4e0…" }
}
```

Keys may be page **ids** (`2862:13287`) or **names** (`Button`). You only need the
pages you're checking — omit ones you're skipping this run. (New pages in Figma?
Run step 0's `sync --fetch` first to add them.)

### 2. Plan

```bash
node .Codex/skills/figma-page-watch/scripts/page-watch.mjs plan /tmp/current.json
```

- Prints **CHANGED** pages (signal differs from the manifest) with their components
  and the exact reconcile commands, e.g.
  `/figma-component button https://…?node-id=2862-13287 --update`.
- Prints pages with **no baseline** (first run) → seed them with `record`.
- Flags mapped components that have no ui-spec (a manifest typo).
- Exit **1** on any drift (or a bad mapping), else **0** — so it can gate a cron/CI.

### 3. Act (only on the drifted components)

For each component under a CHANGED page, reconcile it — cheapest first:

- [`/component-readiness <C>`](../component-readiness/SKILL.md) — read-only: does
  the code still match tokens/spec? Often enough to confirm "no real change."
- [`/figma-component <C> <url> --update`](../figma-component/SKILL.md) — when the
  design genuinely moved: re-map tokens, refresh component/tests/stories/Code
  Connect. For token-tier changes, [`/sync-tokens`](../sync-tokens/SKILL.md).

A page can drift for a change that doesn't affect the shipped component (a comment,
an example frame). Confirm with `/component-readiness` before doing real work.

### 4. Record the new baseline

Once the drift is triaged/reconciled, advance the manifest so the next run only
sees **new** changes:

```bash
node .Codex/skills/figma-page-watch/scripts/page-watch.mjs record /tmp/current.json
# --all to re-stamp every supplied page (e.g. after editing the component mapping)
```

By default `record` only advances pages that changed or lacked a baseline, and
stamps `checkedAt`. Commit `page-watch.json` so the baseline is shared.

> **First run:** every page reports "no baseline" — gather signals and `record`
> once to establish it; no component work is implied by the baseline itself.

---

## Optional: stamp the version into component specs

The `figma:` block in `packages/ui-spec/components/<name>/index.yaml` currently
allows only `node` + `codeConnect` (`additionalProperties: false`), so writing a
per-component "design reviewed at" there **would fail `ui-spec test`**. The
manifest is the source of truth instead. If the team wants the marker in each
spec, first extend `packages/ui-spec/schema/index.schema.json` (and the `IndexSpec`
type) to allow e.g. `figma.designReviewed: { page, signal, at }`, then have the
`/figma-component --update` flow write it when it reconciles a component.

---

## Periodic use

This is meant to run on a schedule (a cron, a weekly chore, or `/loop`). Because
`plan` exits non-zero on drift, a wrapper can open an issue / ping when a page
moves. Keep the run cheap: prefer the figma-console version tools (one call per
page) over fingerprinting large pages; only fingerprint pages you actually watch.

## Maintaining the manifest

- **Add/rename pages:** run `page-watch.mjs sync --fetch` (REST — the authoritative
  full page list; Workflow step 0) to fill ids automatically. Don't rely on
  `get_metadata({ fileKey })` — it only lists loaded pages and undercounts. Remove a
  stale page by hand after `sync` flags it.
- **Seed status:** the committed manifest is a **partial seed** (the pages that
  were loaded when it was created); run `sync --fetch` once to add the rest, then
  curate each new page's `components[]`.
- **Curate `components[]`:** map each page to the real ui-spec component dir names
  (`ls packages/ui-spec/components`); the script warns on names that don't exist.
- Pages with no shipped component (Index, Footer) keep `components: []` — they're
  watched for awareness but plan nothing.
