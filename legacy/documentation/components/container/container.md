---
title: Container component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# Container

<!--@include: ./container.doc.md-->

## Props

| Prop name       | Description                                                         | Type                       | Values                                                                    | Default    |
| --------------- | ------------------------------------------------------------------- | -------------------------- | ------------------------------------------------------------------------- | ---------- |
| textColor       | Layer text color                                                    | ColorProp                  | -                                                                         |            |
| borderColor     | Layer border color                                                  | ColorProp                  | -                                                                         |            |
| backgroundColor | Layer background color                                              | ColorProp                  | -                                                                         |            |
| color           | Background color                                                    | ColorProp                  | transparent, primary, secondary, success, warning, danger, info, inverted | 'white'    |
| fluid           | Set container 100% wide, spanning the entire width of the viewport. | boolean                    | -                                                                         |            |
| xxl             | Set container 100% wide until XX-large breakpoint.                  | boolean                    | -                                                                         |            |
| xl              | Set container 100% wide until X-large breakpoint.                   | boolean                    | -                                                                         |            |
| lg              | Set container 100% wide until large breakpoint.                     | boolean                    | -                                                                         |            |
| md              | Set container 100% wide until medium breakpoint.                    | boolean                    | -                                                                         |            |
| sm              | Set container 100% wide until small breakpoint.                     | boolean                    | -                                                                         |            |
| xs              | Set container 100% wide until extra small breakpoint.               | boolean                    | -                                                                         |            |
| direction       | Direction for child elements                                        | "horizontal" \| "vertical" | horizontal, vertical                                                      | 'vertical' |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
