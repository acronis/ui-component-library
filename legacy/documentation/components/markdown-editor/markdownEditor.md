---
title: ACV Markdown Editor component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# ACV Markdown Editor

<!--@include: ./markdownEditor.doc.md-->

## Props

| Prop name  | Description                  | Type             | Values | Default |
| ---------- | ---------------------------- | ---------------- | ------ | ------- |
| modelValue |                              | string           | -      |         |
| height     | Height of the MarkdownEditor | number \| string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
