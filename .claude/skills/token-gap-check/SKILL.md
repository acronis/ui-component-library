# token-gap-check

Detect **token gaps** for a component: Figma colour variables its node references
that have **no matching generated `--ui-*` token** in `@constructor-lab/tokens`. It's the
proactive version of the fix in the Alert reconcile — where the Figma
`border/onStatus/ai` variable existed but `--ui-border-on-status-ai` was never
emitted, so the component silently fell back to a wrong value.

Run it before/while building or updating a component from Figma (a companion to
[`/component-readiness`](../component-readiness/SKILL.md) and
[`/figma-component`](../figma-component/SKILL.md) Phase 2). `/component-readiness`
checks that the tokens the **code** references exist; this checks that the tokens
the **design** references exist — the other side of the same coin.

---

## Invocation

```
/token-gap-check <ComponentName> <figma-url>
```

- `figma-url` — a node-specific URL (`…/design/:fileKey/…?node-id=4313-4953`).
  Parse it: `fileKey` from the path, `nodeId` = the `node-id` with `-`→`:`.

---

## What it is (and is NOT)

- It uses the Figma **`get_variable_defs`** MCP tool, which returns the variables
  **this node references**, as **resolved** `name → value` pairs.
- It is a **per-node colour-token audit** — perfect for "does everything this
  component paints have a token?" It is **NOT** a variable sync: `get_variable_defs`
  is node-scoped, single-mode, and returns resolved values (no alias chains, no
  brand/mode matrix, no `variableId`/scopes), so it cannot rebuild the DTCG tiers.
  A full variable sync stays the **figma-token-exporter plugin** path
  ([`/figma-to-design-tokens`](../figma-to-design-tokens/SKILL.md)).

---

## Steps

1. **Read the node's variables** (no skill prerequisite):

   ```
   get_variable_defs({ nodeId, fileKey })
   ```

   > **Selection-bound caveat** (same as `/figma-component`): the Figma MCP is
   > selection-bound here — if it errors with "You currently have nothing
   > selected", ask the user to open the node URL in Figma desktop and click the
   > layer, then retry.

2. **Save the result** verbatim to a temp file, e.g. `/tmp/<name>-vars.json`. The
   shape is a flat map: `{ "semantics/colors/border/onStatus/ai": "#e4cced", … }`.

3. **Run the analyzer:**

   ```bash
   node .claude/skills/token-gap-check/scripts/check.mjs /tmp/<name>-vars.json
   ```

   (add `--json` for machine-readable output). It maps each **colour** variable to
   its expected `--ui-*` token (`semantics/colors/<g>/<s>` → `--ui-<g>-<s>`,
   camelCase→kebab; `components/<C>/…` → `--ui-<c>-…`) and greps
   `packages/tokens/css/` for it. Exit code **1** if any gap.

---

## Interpreting the output

| Row         | Meaning                                                                                                                                                   | Action                                                      |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `ok`        | The colour variable maps to a defined `--ui-*` token.                                                                                                     | Reference that token in the component.                      |
| `MISSING`   | A colour variable with **no** matching token (a real gap). The `closest defined` line flags a near-miss (e.g. an `-strong` gradient variant, as with ai). | Fill it (below).                                            |
| `untracked` | Primitive/`componentLegacy`/typography collections not mapped to `--ui-*`.                                                                                | Usually fine — ignore unless you expected a semantic token. |

**Filling a `MISSING` gap** (decision — see the Alert case for a worked example):

- **Targeted tier edit** (fast, when the value is known + in Figma): add the token
  to `packages/tokens/tiers/*.json` (an alias to the palette the design uses, e.g.
  `border.onStatus.ai → {palette.violet.4}`), `pnpm --filter @constructor-lab/tokens build`,
  then reference `--ui-…` in the component. Add a `@constructor-lab/tokens` changeset. The
  next full sync backfills the `com.figma.variableId`.
- **Full sync** (when broader drift is suspected): run
  [`/figma-to-design-tokens`](../figma-to-design-tokens/SKILL.md) — the exporter
  snapshots all variables and re-emits the tiers.

Never hand-author a hex in the component, and never edit the generated
`packages/tokens/css/**` — change a **tier** and rebuild.

---

## Limitations

- Colour variables only (sizes/fonts are skipped — they're not the usual gap
  source and add noise).
- Node-scoped: only variables **this node** references; variables no node uses
  won't surface (that's what the full exporter sync is for).
- The name transform mirrors the emitter's semantic/component naming; primitive
  (`palette.*`) and `componentLegacy.*` collections are intentionally reported as
  `untracked`, not gaps.

## Worked example: Alert ai border (node 4313-4953)

`get_variable_defs` returned `semantics/colors/border/onStatus/ai: #e4cced`;
the check flagged it `MISSING` with `closest defined: --ui-border-on-status-ai-strong`
(the ai _gradient_). Resolution: added `colors/border/onStatus/ai = {palette.violet.4}`
to `semantics.json`, rebuilt (`--ui-border-on-status-ai` now emits), and repointed
the Alert border to it.
