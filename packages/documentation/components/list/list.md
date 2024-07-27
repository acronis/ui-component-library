---
title: ACV List component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# ACV List

<!--@include: ./list.doc.md-->

## Props

| Prop name   | Description                      | Type                    | Values | Default |
| ----------- | -------------------------------- | ----------------------- | ------ | ------- |
| multiselect |                                  | boolean                 | -      |         |
| animate     | Whether the animation is enabled | boolean                 | -      |         |
| card        | Whether to render items as cards | boolean                 | -      |         |
| items       | List of items                    | Array \| Array \| Array | -      |         |
| sortable    | Whether the list is sortable     | boolean                 | -      |         |
| selectable  | Whether the list is selectable   | boolean                 | -      |         |
| modelValue  |                                  | any                     | -      |         |
| color       |                                  | ColorProp               | -      |         |
| variant     |                                  | string                  | -      |         |
| states      |                                  | Array                   | -      |         |

## Events

| Event name        | Properties                                                                                                      | Description                            |
| ----------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| update:modelValue | **eventName** `string` - The name of the event<br/>**value** `string` - The visibility state of the component   | Whether modelValue is updated          |
| itemClick         | **eventName** `string` - The name of the event<br/>**item** `string` - The visibility state of the component    | Whether item is clicked                |
| close             | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the list item is closed |

## Slots

| Name    | Description              | Bindings |
| ------- | ------------------------ | -------- |
| default | Content of the list      |          |
| item    | Content of the list item |          |
