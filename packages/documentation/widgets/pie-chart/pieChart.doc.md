---
title: ACV Pie Chart component
lang: en-US
editLink: true
---

# ACV Pie Chart

Displays values in a pie

## Basic usage

<PieChartBasic />

::: details Source code
<<< @/demos/pie-chart/PieChartBasic.vue
:::

## Dynamic Loading

<PieChartDynamicLoading />

::: details Source code
<<< @/demos/pie-chart/PieChartDynamicLoading.vue
:::

## Example (1)

<PieChartExampleOne />

::: details Source code
<<< @/demos/pie-chart/PieChartExampleOne.vue
:::

## Example (2)

<PieChartExampleTwo />

::: details Source code
<<< @/demos/pie-chart/PieChartExampleTwo.vue
:::

## Example (3)

<PieChartExampleThree />

::: details Source code
<<< @/demos/pie-chart/PieChartExampleThree.vue
:::

## Attributes

| Attribute | Description                                                                                                                                                                                                                                                                            | Type    | Accepted Values | Default |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | --------------- | ------- |
| data      | PieChartItem object <br /> Negative values for points are not accepted. <br />{ dataType: string, <br /> name: string, <br /> labels: array, <br /> points: array of arrays, <br /> isPercentage: boolean, <br /> maximumPoint: number (only applicable if `isPercentage` is `true`) } | object  | —               | {}      |
| legend    | Toggles visibility of legend                                                                                                                                                                                                                                                           | boolean | —               | true    |
| precision | Number of digits to be shown after decimal point                                                                                                                                                                                                                                       | number  | —               | 0       |
| summary   | Toggles visibility of summary                                                                                                                                                                                                                                                          | boolean | —               | true    |

## Events

| Event Name   | Description                          | Parameters     |
| ------------ | ------------------------------------ | -------------- |
| legend-click | triggers when legend item is clicked | (index, event) |
| slice-click  | triggers when pie slice is clicked   | (index, event) |

## Slots

| Name    | Description                                                   |
| ------- | ------------------------------------------------------------- |
| summary | Content of summary (displayed in the center of the pie chart) |

## Props

| Prop name | Description | Type    | Values | Default       |
| --------- | ----------- | ------- | ------ | ------------- |
| colors    |             | array   | -      |               |
| data      |             | object  | -      | () =&gt; null |
| legend    |             | boolean | -      | true          |
| precision |             | number  | -      | 0             |
| summary   |             | boolean | -      | true          |

## Events

| Event name   | Properties                                     | Description |
| ------------ | ---------------------------------------------- | ----------- |
| legend-click |                                                |             |
| slice-click  |                                                |             |
| sliceClick   | **&lt;anonymous1&gt;** `undefined` - undefined |             |
| legendClick  | **&lt;anonymous1&gt;** `undefined` - undefined |             |

## Slots

| Name    | Description | Bindings |
| ------- | ----------- | -------- |
| summary |             |          |
