# Figma → repo token sync (one-way)

This is the canonical runbook for syncing token changes from Figma into this
repo.

## Scope

- Direction is **one-way**: **Figma → repo**.
- The only manual operation is exporting a fresh snapshot from Figma using
  `tools/figma-token-exporter`.
- Repo-side sync is one command from the monorepo root.

## Steps

1. Export a fresh snapshot to `packages/tokens/.tmp/figma-tokens/`
   with the local exporter plugin:

   ```bash
   pnpm --filter @constructor-lab/figma-token-exporter receive
   ```

   Then in Figma Desktop run **Constructor Lab Token Exporter** and click
   **Send snapshot to repo**.

2. Run the post-export sync pipeline:

   ```bash
   pnpm tokens:sync
   ```

   This executes:
   - `pnpm --filter @constructor-lab/tokens emit`
   - `pnpm --filter @constructor-lab/tokens build`

3. Review the diff before committing:
   - `packages/tokens/tiers/*.json`
   - `packages/tokens/**` outputs

## Extension point

As additional downstream token packages are introduced (for example
`tokens-web`), extend the root `tokens:sync` script so this runbook remains
single-command.
