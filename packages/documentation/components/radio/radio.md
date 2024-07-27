---
title: ACV Radio component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# ACV Radio

<!--@include: ./radio.doc.md-->

## Props

| Prop name  | Description                  | Type                        | Values | Default |
| ---------- | ---------------------------- | --------------------------- | ------ | ------- |
| modelValue | Binding value of the Radio   | string \| number \| boolean | -      |         |
| size       | Radio size                   | ComponentSize               | -      | medium  |
| color      | Custom color of the Radio    | ColorProp                   | -      | primary |
| label      | Label text                   | string                      | -      |         |
| disabled   | Disable radio                | boolean                     | -      |         |
| invalid    | Whether the Radio is invalid | boolean                     | -      |         |

## Events

| Event name        | Properties                                                                                | Description                          |
| ----------------- | ----------------------------------------------------------------------------------------- | ------------------------------------ |
| update:modelValue | **eventName** `string` - The name of the event<br/>**value** `string` - The updated value | Triggered when binding value changes |

## Slots

| Name    | Description              | Bindings |
| ------- | ------------------------ | -------- |
| default | The default slot content |          |
