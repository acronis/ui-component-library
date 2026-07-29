# FunnelChart — behavior

`FunnelChart` is a typed [recharts](https://recharts.org) composition over the
shared `Chart` primitives. It plots a `data` list of stages (each sized by
`dataKey`, named by `nameKey`) as a narrowing funnel inside a `ChartContainer`.

```gherkin
Scenario: Render stages from data and config
  Given data rows and a config mapping each stage name to a label and color
  And dataKey "value" and nameKey "stage"
  Then one funnel segment renders per row, sized by its dataKey value
  And each segment fills from its injected --color-<name> custom property
```

```gherkin
Scenario: Triangle last shape (default)
  Given lastShape is "triangle"
  Then the final segment narrows to a point
```

```gherkin
Scenario: Rectangle last shape
  Given lastShape is "rectangle"
  Then the final segment ends flat (stacked trapezoids)
```

```gherkin
Scenario: Reversed
  Given reversed is true
  Then the funnel widens toward the bottom instead of narrowing
```

```gherkin
Scenario: On-chart labels
  Given showLabels is true
  Then each stage's nameKey label renders beside its segment
  But when showLabels is false no stage labels render
```

```gherkin
Scenario: Tooltip on hover
  Given showTooltip is true
  When the user hovers a segment
  Then a card shows that stage's name and value
```

```gherkin
Scenario: Empty data
  Given data is an empty array
  Then the chart renders with no segments and does not throw
```
