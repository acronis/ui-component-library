---
title: ACV Line Chart component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# ACV Line Chart

<!--@include: ./lineChart.doc.md-->

## Props

| Prop name            | Description | Type    | Values                                             | Default                |
| -------------------- | ----------- | ------- | -------------------------------------------------- | ---------------------- |
| colors               |             | array   | -                                                  |                        |
| data                 |             | object  | -                                                  | null                   |
| dataPointOnHover     |             | boolean | -                                                  | false                  |
| height               |             | string  | -                                                  | '200px'                |
| legend               |             | boolean | -                                                  | true                   |
| precision            |             | number  | -                                                  | 0                      |
| stepped              |             | boolean | -                                                  | false                  |
| timeUnit             |             | string  | `second`, `minute`, `hour`, `day`, `month`, `year` | 'hour'                 |
| tooltip              |             | boolean | -                                                  | true                   |
| tooltipTimeFormat    |             | string  | -                                                  | 'dd MMM yyyy hh:mm:ss' |
| variableThreshold    |             | boolean | -                                                  | false                  |
| width                |             | string  | -                                                  | ''                     |
| xAxis                |             | boolean | -                                                  | true                   |
| xGrid                |             | boolean | -                                                  | true                   |
| yAxis                |             | boolean | -                                                  | true                   |
| yAxisTicksUpperLimit |             | number  | -                                                  | 5                      |
| yGrid                |             | boolean | -                                                  | true                   |
| yPercent             |             | boolean | -                                                  | false                  |
| showDataTypeUnit     |             | boolean | -                                                  | false                  |

## Events

| Event name    | Properties                                     | Description |
| ------------- | ---------------------------------------------- | ----------- |
| timelineClick | **&lt;anonymous1&gt;** `undefined` - undefined |             |

## Slots

| Name        | Description | Bindings |
| ----------- | ----------- | -------- |
| legend      |             |          |
| tooltipbody |             |          |
