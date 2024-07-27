---
title: Chart component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# Chart

<!--@include: ./chart.doc.md-->

## Props

| Prop name    | Description                                               | Type         | Values                                                         | Default   |
| ------------ | --------------------------------------------------------- | ------------ | -------------------------------------------------------------- | --------- |
| type         | Type of the Chart.Js chart                                | ChartType    | -                                                              | 'bar'     |
| data         | The data object that is passed into the Chart.js chart    | ChartData    | -                                                              |           |
| options      | The options object that is passed into the Chart.js chart | ChartOptions | -                                                              | {}        |
| plugins      | Plugins for the chart                                     | Array        | -                                                              | []        |
| updateMode   | Update mode for the chart                                 | UpdateMode   | 'resize', 'reset', 'none', 'hide', 'show', 'default', 'active' | undefined |
| datasetIdKey | Key name to identify dataset                              | string       | -                                                              | 'label'   |

## Events

| Event name | Properties                                | Description                            |
| ---------- | ----------------------------------------- | -------------------------------------- |
| close      | **payload** `string` - The first argument | Triggered when the component is closed |

## Slots

| Name    | Description | Bindings |
| ------- | ----------- | -------- |
| default |             |          |
