---
title: ACV Option component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# ACV Option

<!--@include: ./option.doc.md-->

## Props

| Prop name | Description                    | Type             | Values | Default |
| --------- | ------------------------------ | ---------------- | ------ | ------- |
| label     | Title of the Option            | string           | -      |         |
| value     | Value of the Option            | string \| number | -      |         |
| selected  | Whether the option is selected | boolean          | -      |         |
| active    | Whether the option is active   | boolean          | -      |         |
| disabled  | Whether the option is disabled | boolean          | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
