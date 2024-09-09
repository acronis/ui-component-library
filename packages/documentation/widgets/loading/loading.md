---
title: ACV Loading component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# ACV Loading

> Loading is a widget that indicates a loading state.

<!--@include: ./loading.doc.md-->

## Props

| Prop name   | Description                         | Type                 | Values | Default   |
| ----------- | ----------------------------------- | -------------------- | ------ | --------- |
| modelValue  | Loading visibility state            | boolean              | -      | false     |
| fullscreen  | Whether the Loading is fullscreen   | boolean              | -      | false     |
| background  | Backdrop background color           | ColorProp \| boolean | -      | 'primary' |
| opacity     | Opacity of the backdrop background  | number               | -      | 0.5       |
| color       | Color of the spinner                | ColorProp            | -      | 'primary' |
| size        | Size of the spinner                 | ComponentSize        | -      | 'medium'  |
| title       | Title of the loading                | string               | -      |           |
| description | Description of the loading          | string               | -      |           |
| textColor   | Loading title and description color | string               | -      |           |

## Events

| Event name | Properties                        | Description                                                      |
| ---------- | --------------------------------- | ---------------------------------------------------------------- |
| afterLeave | **eventName** `mixed` - undefined | Triggered when the transition wrapper emits a 'afterLeave' event |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| title       | Title slot content           |          |
| description | The description slot content |          |
