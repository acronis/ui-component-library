---
'@constructor-lab/tokens': patch
---

chore(tokens): sync brand tokens from Figma (normalized slugs)

Re-syncs the primitives/semantics/components tiers from the latest Figma export
and re-emits the generated css/scss/js/dtcg. Brand value updates only — no brands
added or removed. The raw export arrived with underscore brand slugs
(`deep_sky_itkontoret`) and a duplicated deep-sky entry; both are normalized to
the canonical hyphen slugs here (and prevented at the source by the token-emit
palette-mapper fix).
