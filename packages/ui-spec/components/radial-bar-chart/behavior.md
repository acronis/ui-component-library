# RadialBarChart — behavior

`RadialBarChart` is a typed [recharts](https://recharts.org) composition over the
shared `Chart` primitives. It plots a `data` list (each sized by `dataKey`, named
by `nameKey`) as concentric arcs inside a `ChartContainer`.

```gherkin
Scenario: Render arcs from data and config
  Given data rows and a config mapping each name to a label and color
  And dataKey "value" and nameKey "browser"
  Then one concentric arc renders per row, sized by its dataKey value
  And each arc fills from its injected --color-<name> custom property
```

```gherkin
Scenario: Full-circle ring (default)
  Given startAngle 90 and endAngle -270
  Then the arcs sweep a full 360° ring
```

```gherkin
Scenario: Half-circle gauge
  Given startAngle 180 and endAngle 0
  Then the arcs sweep a half-circle gauge
```

```gherkin
Scenario: Background track
  Given showBackground is true
  Then a muted track renders behind each arc
  But when showBackground is false only the value arcs render
```

```gherkin
Scenario: Tooltip on hover
  Given showTooltip is true
  When the user hovers an arc
  Then a card shows that arc's name and value
```

```gherkin
Scenario: Legend
  Given showLegend is true
  Then a legend lists each arc's name with its color swatch
```

```gherkin
Scenario: Empty data
  Given data is an empty array
  Then the chart renders with no arcs and does not throw
```
