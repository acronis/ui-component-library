---
title: Confirm Dialog component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# Confirm Dialog

<!--@include: ./confirmDialog.doc.md-->

## Props

| Prop name   | Description                      | Type   | Values | Default |
| ----------- | -------------------------------- | ------ | ------ | ------- |
| title       | Title of the ConfirmDialog       | string | -      |         |
| description | Description of the ConfirmDialog | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                                  |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed       |
| confirm    | **eventName** `mixed` - undefined                                                                               | Triggered when the confirm button is clicked |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
