---
title: ACV Drawer component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# ACV Drawer

<!--@include: ./drawer.doc.md-->

## Props

| Prop name       | Description                                                     | Type            | Values                                                                    | Default |
| --------------- | --------------------------------------------------------------- | --------------- | ------------------------------------------------------------------------- | ------- |
| loading         | Set loading state                                               | boolean         | -                                                                         |         |
| imgAlt          | `alt` attribute for image rendered via `img` prop               | string          | -                                                                         |         |
| img             | Render image at the top of the card (_above header_)            | string          | -                                                                         |         |
| padding         |                                                                 | boolean         | -                                                                         |         |
| border          |                                                                 | boolean         | -                                                                         |         |
| round           |                                                                 | boolean         | -                                                                         |         |
| shadow          | Whether the card should have a shadow                           | boolean         | -                                                                         |         |
| textColor       | Layer text color                                                | ColorProp       | -                                                                         |         |
| borderColor     | Layer border color                                              | ColorProp       | -                                                                         |         |
| backgroundColor | Layer background color                                          | ColorProp       | -                                                                         |         |
| color           | Background color                                                | ColorProp       | transparent, primary, secondary, success, warning, danger, info, inverted |         |
| variant         | Layer variant                                                   | LayerVariant    | 'solid' \| 'outline' \| 'ghost' \| 'light'                                | 'solid' |
| states          | Interaction states like hover & active                          | boolean         | -                                                                         | false   |
| modelValue      | Drawer visiblity state                                          | boolean         | -                                                                         | false   |
| persistent      | Persistence of drawer when clicked outside of reference element | boolean         | -                                                                         | false   |
| anchor          | Drawer anchor/position                                          | AcvDrawerAnchor | -                                                                         | 'left'  |

## Events

| Event name        | Properties                                                                                                      | Description                            |
| ----------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| update:modelValue | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name | Description | Bindings |
| ---- | ----------- | -------- |
| name |             |          |
