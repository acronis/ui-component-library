---
title: ACV Drawer component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# ACV Drawer

<!--@include: ./drawer.doc.md-->

## Props

| Prop name   | Description                                                     | Type            | Values | Default |
| ----------- | --------------------------------------------------------------- | --------------- | ------ | ------- |
| withPadding |                                                                 | boolean         | -      |         |
| border      |                                                                 | BorderVariant   | -      |         |
| shadow      | Whether the card should have a shadow                           | ShadowVariant   | -      |         |
| modelValue  | Drawer visibility state                                         | boolean         | -      | false   |
| persistent  | Persistence of drawer when clicked outside of reference element | boolean         | -      | false   |
| anchor      | Drawer anchor/position                                          | AcvDrawerAnchor | -      | 'left'  |

## Events

| Event name        | Properties                                                                                                      | Description                            |
| ----------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| update:modelValue | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name | Description | Bindings |
| ---- | ----------- | -------- |
| name |             |          |
