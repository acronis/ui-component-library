# DetailList

The config-driven label/value list: **`<DetailList items={…} />`**. It takes a
flat item list and renders the approved key/value shape over the
`DescriptionList` primitive — label, value, an optional leading icon, a muted
description, and inline actions — in one or two responsive columns, so every
"details of the selected thing" panel reads the same way.

> **Opinionated composite (design-pending v1).** Tier-2 candidate of
> `context/opinionated-composites-proposal.md` — it trades flexibility for
> consistency. Built from requirements, not a Figma mockup.

## When to use

- A read-only properties / details panel (in a drawer, sheet, card, or page) —
  the key/value list in `detail-drawer` / `sheet-detail-panel`.
- Any place that would otherwise hand-roll a label/value grid.

## When not to use

- Editable fields — use `FormLayout`.
- A row/column data set of many records — use `DataGrid`.
- A bespoke row layout the item descriptor can't express — compose the
  `DescriptionList` parts directly (the escape hatch; flexibility lives one layer
  down).

## Item descriptor

`{ id?, label, value, description?, icon?, actions? }`. `icon` is a leading glyph
(sized to 16px; color it with a `--ui-glyph-on-status-*` token), `description` a
muted line under the value, `actions` inline links.

## Example (React — implemented)

```tsx
import { DetailList } from '@constructor-lab/ui-react';
import { CircleCheckIcon } from '@constructor-lab/icons-react/stroke-mono';

<DetailList
  items={[
    { label: 'Status', value: 'Operational', icon: <CircleCheckIcon /> },
    { label: 'Owner', value: 'Ada Lovelace', description: 'ada@example.com' },
    { label: 'Region', value: 'EU (Frankfurt)' },
  ]}
/>;

// Two-column detail grid
<DetailList columns={2} items={items} />;
```

Vue and Web Component implementations are planned and target the same contract —
see `api.yaml` `adapters`.
