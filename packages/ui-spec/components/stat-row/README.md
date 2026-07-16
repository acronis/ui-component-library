# StatRow

The config-driven KPI / stat row: **`<StatRow stats={…} />`**. It takes a flat
stat list and renders one `CardFilter` tile per stat — deriving each tile's
variant from the descriptor — laid out as a consistent wrapping row or an
equal-width grid, so a dashboard's stat tiles never drift apart.

> **Opinionated composite (design-pending v1).** Tier-2 candidate of
> `context/opinionated-composites-proposal.md` — it trades flexibility for
> consistency. Built from requirements, not a Figma mockup.

## When to use

- A dashboard header / summary strip of KPIs or counts.
- A row of clickable stat tiles that double as filters (protected / at-risk / …).

## When not to use

- A single stat card — use `CardFilter` directly.
- Rich, non-uniform cards — use `Card` (or compose `CardFilter`).
- Tabular data — use `DataGrid`.

## Stat descriptor

`{ id?, label, value?, icon?, empty?, onClick?, render? }`. `empty` renders a
placeholder (em-dash); `onClick` or `render` makes the tile an interactive filter
(a `<button>`, or a polymorphic element like a router link via `render`); `icon`
is a leading glyph (color it with a `--ui-glyph-on-status-*` token).

## Example (React — implemented)

```tsx
import { StatRow } from '@constructor-lab/ui-react';

<StatRow
  stats={[
    { label: 'Protected', value: '982', onClick: () => filter('protected') },
    { label: 'At risk', value: '17', onClick: () => filter('at-risk') },
    { label: 'Quarantined', value: '3' },
    { label: 'Pending', empty: true },
  ]}
/>;

// Equal-width grid
<StatRow columns={4} stats={stats} />;
```

Vue and Web Component implementations are planned and target the same contract —
see `api.yaml` `adapters`.
