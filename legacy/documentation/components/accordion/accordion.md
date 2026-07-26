---
title: ACV Accordion component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# ACV Accordion

> Vertical stacked interactive headers that reveal associated sections of content.

<!--@include: ./accordion.doc.md-->

## Props

| Prop name  | Description                                                 | Type           | Values                     | Default |
| ---------- | ----------------------------------------------------------- | -------------- | -------------------------- | ------- |
| modelValue | Active panel id                                             | Array \| Array | -                          |         |
| size       | Height of the accordion                                     | ComponentSize  | 'small', 'medium', 'large' |         |
| multiple   | Whether the multiple Accordion can be open at the same time | boolean        | -                          |         |
| expanded   | Expand all accordion items                                  | boolean        | -                          |         |

## Events

| Event name        | Properties                                                                             | Description                          |
| ----------------- | -------------------------------------------------------------------------------------- | ------------------------------------ |
| update:modelValue | **eventName** `string` - The name of the event<br/>**value** `any` - The updated value | Triggered when binding value changes |

## Slots

| Name    | Description                       | Bindings |
| ------- | --------------------------------- | -------- |
| default | Default slot for accordion panels |          |
