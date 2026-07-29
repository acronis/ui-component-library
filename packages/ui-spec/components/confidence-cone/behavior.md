# ConfidenceCone — behavior

`ConfidenceCone` is a typed [recharts](https://recharts.org) composition over the
shared `Chart` primitives. It plots a central estimate (`valueKey`) as a line
inside a shaded band between `lowerKey` and `upperKey`, over an `xKey` axis,
inside a `ChartContainer`.

```gherkin
Scenario: Render the estimate inside its band
  Given data rows with an estimate and a lower/upper bound
  And valueKey "estimate", lowerKey "lower", upperKey "upper"
  Then a shaded band renders between the lower and upper bounds
  And the estimate line renders on top of the band
  And both take their color from their config --color-<name> custom property
```

```gherkin
Scenario: A widening cone
  Given the bounds spread further apart at later points
  Then the band widens into a cone toward those points
```

```gherkin
Scenario: Missing bounds
  Given a row omits its lower or upper bound
  Then no band segment renders at that point
  But the estimate line still draws through it
```

```gherkin
Scenario: Forecast divider
  Given forecastStart is set to an x value
  Then a dashed vertical divider renders at that x value
  And when forecastLabel is set its caption renders alongside the divider
```

```gherkin
Scenario: Grid toggle
  Given showGrid is false
  Then the horizontal grid rules are not rendered
```

```gherkin
Scenario: Tooltip on hover
  Given showTooltip is true
  When the user hovers a point
  Then a card shows that point's estimate and band
```

```gherkin
Scenario: Empty data
  Given data is an empty array
  Then the chart renders with no band or line and does not throw
```
