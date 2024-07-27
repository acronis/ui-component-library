---
title: Tag component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# Tag

<!--@include: ./tag.doc.md-->

## Props

| Prop name   | Description              | Type    | Values | Default |
| ----------- | ------------------------ | ------- | ------ | ------- |
| title       | Title of the Tag         | string  | -      |         |
| description | Description of the Tag   | string  | -      |         |
| small       | Whether the Tag is small | boolean | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
