---
title: Header component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# Header

<!--@include: ./header.doc.md-->

## Props

| Prop name | Description                    | Type                                                                                                                                                 | Values                                                                       | Default |
| --------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------- |
| bordered  | Bottom border of the Header    | boolean                                                                                                                                              | -                                                                            | true    |
| height    | Height of the Header           | string                                                                                                                                               | -                                                                            | 64px    |
| color     | Background color of the Header | "brand" \| "white" \| "primary" \| "secondary" \| "tertiary" \| "disabled" \| "accent" \| "danger" \| "critical" \| "warning" \| "success" \| "info" | transparent, primary, secondary, success, warning, danger, info, light, dark | white   |
| title     | Title of the Header            | string                                                                                                                                               | -                                                                            |         |
| align     | Align the title                | string                                                                                                                                               | left, center, right                                                          | center  |

## Slots

| Name    | Description                         | Bindings |
| ------- | ----------------------------------- | -------- |
| default | The default slot content            |          |
| actions |                                     |          |
| aside   | Used to pass a custom aside content |          |
