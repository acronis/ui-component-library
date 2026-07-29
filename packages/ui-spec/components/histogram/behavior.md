# Histogram — behavior

`Histogram` is a typed [recharts](https://recharts.org) composition over the
shared `Chart` primitives. It buckets a flat numeric `data` distribution into
`bins` equal-width buckets and plots the count per bucket as touching bars inside
a `ChartContainer`.

```gherkin
Scenario: Bucket a distribution and count each bin
  Given a numeric distribution and bins = 10
  Then the value range is split into 10 equal-width buckets
  And one bar renders per bucket, its height the count of values in that bucket
  And the counts across buckets sum to the number of input values
```

```gherkin
Scenario: The maximum value lands in the final bucket
  Given the largest value equals the distribution maximum
  Then it is counted in the last bucket (which is closed on the right)
```

```gherkin
Scenario: Degenerate spread
  Given every value in the distribution is equal
  Then a single bucket renders holding all of them
```

```gherkin
Scenario: Coarser binning
  Given bins = 5
  Then the same distribution is split into 5 wider buckets
```

```gherkin
Scenario: Grid toggle
  Given showGrid is false
  Then the horizontal grid rules are not rendered
```

```gherkin
Scenario: Tooltip on hover
  Given showTooltip is true
  When the user hovers a bar
  Then a card shows that bucket's range and count
```

```gherkin
Scenario: Empty data
  Given data is an empty array
  Then the chart renders with no bars and does not throw
```
