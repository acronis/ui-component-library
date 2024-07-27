---
title: Script Editor component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# Script Editor

<!--@include: ./scriptEditor.doc.md-->

## Props

| Prop name   | Description                     | Type   | Values | Default |
| ----------- | ------------------------------- | ------ | ------ | ------- |
| title       | Title of the ScriptEditor       | string | -      |         |
| description | Description of the ScriptEditor | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
