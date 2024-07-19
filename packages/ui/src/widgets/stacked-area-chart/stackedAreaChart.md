---
title: Stacked area chart
lang: en-US
---

# Stacked area chart

Display values in areas stacked one on top another.

## Basic usage

<StackedAreaChartBasic />

## Stacked Area Chart Attributes

| Attribute | Description                                                                                                                                                                      | Type    | Accepted Values | Default |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | --------------- | ------- |
| data      | StackedAreaChartItem object <br /> Negative values for points are not accepted. <br /> { dataType: string, <br /> name: string, <br /> sets: object[], <br /> labels: string[] } | object  | —               | {}      |
| height    | Height of chart                                                                                                                                                                  | string  | —               | 200px   |
| legend    | Toggles visibility of legend                                                                                                                                                     | boolean | —               | true    |
| precision | Number of digits to be shown after decimal point                                                                                                                                 | number  | —               | 0       |
| width     | Width of chart                                                                                                                                                                   | string  | —               | 400px   |

## Stacked Area Chart Events

| Event Name   | Description                          | Parameters                    |
| ------------ | ------------------------------------ | ----------------------------- |
| legend-click | triggers when legend item is clicked | (seriesIndex, event)          |
| point-click  | triggers when point is clicked       | (seriesIndices, index, event) |
