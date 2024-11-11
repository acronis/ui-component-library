Chart component is a visual to convey complex images to users.

## Basic usage

<ChartBasic />

::: details Source code
<<< ../../../examples/demos/chart/ChartBasic.vue
:::

## Bubble chart

<ChartBubble />

## Donut chart

<ChartDonut />

## Area chart

<ChartArea />

## Line chart

<ChartLine />

## Mixed chart

<ChartMixed />

## Stacked area chart

<StackedAreaChartBasic />

## Pie chart

<ChartPie />

## Polar chart

<ChartPolar />

## Radar chart

<ChartRadar />

## Scatter chart

<ChartScatter />

## Accessibility

    - Use the `aria-label` attribute to provide a label for the chart.
    - Use the `aria-describedby` attribute to provide a description for the chart.
    - Use the `aria-labelledby` attribute to provide a title for the chart.
    - If the data in a chart, graph or map is crucial to the content of a Web page, then you must provide a text description of the image.
    - In some cases, a numeric table replicating the chart data could provide additional accessibility.
    - If the chart is interactive, ensure that it can be operated with a keyboard.
    - Supplement color-coding of charts with texture, text in graphs or different shades of color to improve accessibility for colorblind users.
    - Charts should be readable in black and white.
    - Don’t convert tables of data into images—use an actual data table instead.
    - Check the contrast of the text color against the background with a color contrast checker
    - Use clear labels and descriptions for the chart.

### Keyboard support

    - Use the `Tab` key to navigate through the chart.
    - Use the `Arrow` keys to navigate through the chart.
    - Use the `Space` key to select a point on the chart.
    - Use the `Enter` key to select a point on the chart.

### Best practices

    - [Creating complex images](https://www.w3.org/WAI/tutorials/images/complex/)
    - [Accessible charts](https://accessibility.huit.harvard.edu/data-viz-charts-graphs)

## Related components

- [Bar Chart](/widgets/bar-chart/barChart.doc)
- [Pie Chart](/widgets/pie-chart/pieChart.doc.md)
- [Line Chart](/widgets/line-chart/lineChart.doc.md)
- [Stacked Area Chart](/widgets/stacked-area-chart/stackedAreaChart.doc.md)
- [Widget wrapper](/widgets/widget-wrapper/widgetWrapper.doc.md)
