---
title: Select component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# Select

<!--@include: ./select.doc.md-->

## Props

| Prop name        | Description      | Type                 | Values | Default            |
| ---------------- | ---------------- | -------------------- | ------ | ------------------ |
| modelValue       |                  | string               | -      | ''                 |
| placeholder      | Placeholder text | string               | -      | 'Select option...' |
| disabled         |                  | boolean              | -      | false              |
| size             |                  | ComponentSize        | -      | 'medium'           |
| options          |                  | Array                | -      | () =&gt; []        |
| validationStatus |                  | "success" \| "error" | -      | undefined          |

## Events

| Event name        | Properties                                                                                                      | Description                            |
| ----------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| update:modelValue | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |
| change            |                                                                                                                 |                                        |
| input             |                                                                                                                 |                                        |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
