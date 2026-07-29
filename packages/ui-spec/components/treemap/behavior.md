# Treemap — behavior

`Treemap` is a typed [recharts](https://recharts.org) composition over the shared
`Chart` primitives. It packs a `data` hierarchy (each node sized by `dataKey`,
named by `nameKey`) into nested rectangles inside a `ChartContainer`.

```gherkin
Scenario: Render tiles from a hierarchy
  Given data with top-level categories, each holding children
  And dataKey "size" and nameKey "name"
  Then one tile renders per leaf, sized by its dataKey value
  And each tile fills from its top-level category's --color-<name> custom property
```

```gherkin
Scenario: Category color inheritance
  Given a leaf under the "Frontend" category
  Then the leaf tile fills with the Frontend category color
  And a surface-colored gutter separates it from its siblings
```

```gherkin
Scenario: Aspect ratio
  Given aspectRatio 1
  Then the tiling favors squarer tiles
```

```gherkin
Scenario: Labels
  Given showLabels is true
  Then each leaf tile large enough to hold text shows its name
  But when showLabels is false no tile labels render
```

```gherkin
Scenario: Tooltip on hover
  Given showTooltip is true
  When the user hovers a tile
  Then a card shows that tile's name and value
```

```gherkin
Scenario: Empty data
  Given data is an empty array
  Then the chart renders with no tiles and does not throw
```
