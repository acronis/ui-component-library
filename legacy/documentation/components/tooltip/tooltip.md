---
title: ACV Tooltip component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# ACV Tooltip

<!--@include: ./tooltip.doc.md-->

## Props

| Prop name | Description                                       | Type             | Values                                                                                                 | Default |
| --------- | ------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------ | ------- |
| maxWidth  | Defines the behavior for maximum width of tooltip | string \| number | 'auto', 'none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl', '10xl' | 'auto'  |
| size      | Size of the tooltip                               | AcvTooltipSize   | tooltipSize                                                                                            | 'auto'  |
| content   | Content of the tooltip                            | string           | -                                                                                                      |         |
| trigger   |                                                   | -                | -                                                                                                      | 'hover' |
| placement |                                                   | -                | -                                                                                                      | 'top'   |
| arrow     |                                                   | -                | -                                                                                                      | true    |
| offset    |                                                   | -                | -                                                                                                      | 6       |

## Slots

| Name    | Description                     | Bindings |
| ------- | ------------------------------- | -------- |
| default | Default slot content for anchor |          |
| content | Custom content of the tooltip   |          |
