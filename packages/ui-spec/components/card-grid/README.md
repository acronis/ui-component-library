# CardGrid

The config-driven card grid: **`<CardGrid items renderItem />`**. It lays a list
of peer items out as uniform `Card`s in a responsive `Grid` — a fixed responsive
column count (`cols`) or an auto-filling track (`minColumnWidth`) — wrapping each
item's content in a Card shell so a catalog / gallery / picker's tiles always
align and reflow consistently.

> **Opinionated composite (design-pending v1).** Tier-2 candidate of
> `context/opinionated-composites-proposal.md` — it trades flexibility for
> consistency. Built from requirements, not a Figma mockup.

## When to use

- A collection of peer items best shown as uniform cards (catalog, gallery, plan
  picker, integrations, overview tiles).
- Content that should reflow responsively from one column to several.

## When not to use

- Tabular records to sort / filter / paginate — use `DataGrid`.
- A heterogeneous dashboard of differently-sized panels — use the `dashboard`
  pattern.
- A single prominent item — a lone `Card` needs no grid.
- A bespoke, non-uniform layout — compose `Grid` + `Card` directly (the escape
  hatch; flexibility lives one layer down).

## Example (React — implemented)

```tsx
import {
  CardGrid,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  Button,
} from '@constructor-lab/ui-react';

<CardGrid
  items={integrations}
  getKey={(i) => i.id}
  renderItem={(i) => (
    <>
      <CardHeader>
        <CardTitle>{i.name}</CardTitle>
        <CardDescription>{i.summary}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button variant="secondary">Connect</Button>
      </CardFooter>
    </>
  )}
/>;

// Auto-fill columns at least 16rem wide
<CardGrid items={items} minColumnWidth="16rem" renderItem={renderItem} />;
```

Vue and Web Component implementations are planned and target the same contract —
see `api.yaml` `adapters`.
