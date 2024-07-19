---
title: Line Chart
lang: en-US
---

# Line Chart

#### Displays values in a line

## Basic usage

<LineChartBasic />

::: details Source code
<<< @/demos/line-chart/Basic.vue
:::

## Anomalies

<LineChartAnomalies />

::: details Source code
<<< @/demos/line-chart/Anomalies.vue
:::

## Corner Cases

<LineChartCornerCases />

## Chart update data

<LineChartUpdateData />

## Float values

<LineChartFloatValue />

## Line Chart Attributes

| Attribute                | Description                                                                                     | Type    | Accepted Values                             | Default                                            |
| ------------------------ | ----------------------------------------------------------------------------------------------- | ------- | ------------------------------------------- | -------------------------------------------------- |
| colors                   | Array of colors. Colors will be repeated in sequence if there are more data points than colors. | array   | -                                           | ['#000000', '#555555', '#aaaaaa', 'fixed-primary'] |
| data                     | Data object                                                                                     | object  | —                                           | {}                                                 |
| data-point-on-hover      | Show data points on hover                                                                       | boolean | —                                           | false                                              |
| height                   | Height of chart                                                                                 | string  | —                                           | 200px                                              |
| legend                   | Toggles visibility of legend                                                                    | boolean | —                                           | true                                               |
| precision                | Number of digits to be shown after decimal point                                                | number  | —                                           | 0                                                  |
| show-data-type-unit      | show data type unit with time unit                                                              | boolean | —                                           | false                                              |
| stepped                  | Toggles stepped nature of line                                                                  | boolean | —                                           | false                                              |
| time-unit                | Unit of time to be used in X axis                                                               | string  | second / minute / hour / day / month / year | hour                                               |
| tooltip                  | Toggles visibility of tooltip                                                                   | boolean | —                                           | true                                               |
| tooltip-time-format      | Format of time displayed in tooltip                                                             | string  | Follow UI Kit standards                     | dd MMM, yyyy, hh:mm:ss                             |
| variable-threshold       | Toggles if variable threshold values are passed                                                 | boolean | —                                           | false                                              |
| width                    | Width of chart. When not defined, chart will take width of parent container.                    | string  | —                                           | —                                                  |
| x-axis                   | Toggles visibility of X axis                                                                    | boolean | —                                           | true                                               |
| x-grid                   | Toggles visibility of vertical grid lines                                                       | boolean | —                                           | true                                               |
| y-axis                   | Toggles visibility of Y axis                                                                    | boolean | —                                           | true                                               |
| y-axis-ticks-upper-limit | Upper limit for the number of ticks displayed on the Y axis                                     | number  | —                                           | 5                                                  |
| y-grid                   | Toggles visibility of horizontal grid lines                                                     | boolean | —                                           | true                                               |
| y-percent                | Toggles if values are to be rendered as percentages                                             | boolean | —                                           | false                                              |
| show-data-type-unit      | show data type unit with time unit                                                              | boolean | —                                           | false                                              |

## Line Chart Events

| Event Name     | Description                          | Parameters     |
| -------------- | ------------------------------------ | -------------- |
| legend-click   | triggers when legend item is clicked | (index, event) |
| timeline-click | triggers when timeline is clicked    | (date, event)  |

:::tip
note that legend slot content should match with generated legend elements.

| Element | Name   | Class                         |
| ------- | ------ | ----------------------------- |
| span    | item   | el-line-chart**legend**item   |
| span    | bullet | el-line-chart**legend**bullet |
| span    | label  | el-line-chart**legend**label  |
| span    | value  | el-line-chart**legend**value  |

:::

## Slots

| Name        | Description             |
| ----------- | ----------------------- |
| legend      | content of the legend   |
| tooltipbody | Content of tooltip body |
