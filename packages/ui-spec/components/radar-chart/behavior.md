# RadarChart — behavior

`RadarChart` is a typed [recharts](https://recharts.org) composition over the
shared `Chart` primitives — a polar chart. It plots one radar area per `dataKeys`
entry around a categorical `angleKey` web inside a `ChartContainer`.

```gherkin
Scenario: Render radar areas from data and config
  Given data rows and a config mapping each series key to a label and color
  And dataKeys ["alice", "bob"] and angleKey "subject"
  Then one <Radar> area renders per dataKey
  And each fills and strokes from its injected --color-<key> custom property
```

```gherkin
Scenario: Polygon grid (default)
  Given gridType is "polygon"
  Then the polar web renders as straight-edged polygon rings
```

```gherkin
Scenario: Circle grid
  Given gridType is "circle"
  Then the polar web renders as smooth concentric circles
```

```gherkin
Scenario: Dots
  Given showDots is true
  Then a dot renders at each series' value on every spoke
```

```gherkin
Scenario: Grid toggle
  Given showGrid is false
  Then the polar web is not rendered (the areas and spoke labels remain)
```

```gherkin
Scenario: Tooltip on hover
  Given showTooltip is true
  When the user hovers near a spoke
  Then a card shows that spoke's per-series values
```

```gherkin
Scenario: Legend
  Given showLegend is true
  Then a swatch + label renders for each series
```

```gherkin
Scenario: Empty data
  Given data is an empty array
  Then the chart renders the web with no areas and does not throw
```
