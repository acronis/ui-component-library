---
title: ACV Form Item component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# ACV Form Item

<!--@include: ./formItem.doc.md-->

## Props

| Prop name      | Description            | Type                | Values      | Default |
| -------------- | ---------------------- | ------------------- | ----------- | ------- |
| title          | Title of the FormItem  | string              | -           |         |
| control        |                        | IconProp            | -           |         |
| titlePlacement | Placement of the title | componentDirections | left, right | right   |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name              | Description              | Bindings |
| ----------------- | ------------------------ | -------- |
| default           | The default slot content |          |
| validationMessage |                          |          |
| helper            |                          |          |
