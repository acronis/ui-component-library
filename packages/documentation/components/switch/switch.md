---
title: ACV Switch component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# ACV Switch

<!--@include: ./switch.doc.md-->

## Props

| Prop name  | Description                    | Type          | Values | Default |
| ---------- | ------------------------------ | ------------- | ------ | ------- |
| modelValue | Binding value of the Switch    | boolean       | -      |         |
| color      | Custom color of the Switch     | ColorProp     | -      | primary |
| label      | Switch description             | string        | -      |         |
| size       | Switch size                    | ComponentSize | -      |         |
| disabled   | Whether the Switch is disabled | boolean       | -      |         |

## Events

| Event name        | Properties                                                                                          | Description                              |
| ----------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| update:modelValue | **eventName** `string` - The name of the event<br/>**value** `string` - Checked state of the Switch | Triggered when the modelValue is updated |

## Slots

| Name    | Description              | Bindings |
| ------- | ------------------------ | -------- |
| default | The default slot content |          |
