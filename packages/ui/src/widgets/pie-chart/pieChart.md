---
title: Pie Chart
lang: en-US
---

# Pie Chart

Displays values in a pie

## Basic usage

<PieChartBasic />

::: details Source code
<<< @/demos/pie-chart/Basic.vue
:::

## Dynamic Loading

<PieChartDynamicLoading />

::: details Source code
<<< @/demos/pie-chart/DynamicLoading.vue
:::

## Example (1)

<PieChartExampleOne />

::: details Source code
<<< @/demos/pie-chart/ExampleOne.vue
:::

## Example (2)

<PieChartExampleTwo />

::: details Source code
<<< @/demos/pie-chart/ExampleTwo.vue
:::

## Example (3)

<PieChartExampleThree />

::: details Source code
<<< @/demos/pie-chart/ExampleThree.vue
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
