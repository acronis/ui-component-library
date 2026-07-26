---
title: ACV Dialog component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# ACV Dialog

> Dialog component informs users while preserving the current page state.

<!--@include: ./dialog.doc.md-->

## Props

| Prop name           | Description                                                       | Type                                              | Values | Default |
| ------------------- | ----------------------------------------------------------------- | ------------------------------------------------- | ------ | ------- |
| modelValue          | Dialog visibility state                                           | boolean                                           | -      |         |
| width               | Width of Dialog default to wrap content width                     | "small" \| "medium" \| "large" \| "x-large"       | -      | 'small' |
| height              | Height of Dialog default to wrap content height                   | "auto" \| "fit" \| "small" \| "medium" \| "large" | -      | 'small' |
| title               | Title of the Dialog,<br/>can also be passed with the slot         | string                                            | -      |         |
| closable            | Whether the Dialog is closable,<br/>shows close icon on top right | boolean                                           | -      | true    |
| draggable           | Whether the Dialog is draggable                                   | boolean                                           | -      | false   |
| type                | Type of the Dialog                                                | "default" \| "clean"                              | -      |         |
| backdrop            | Whether modal mask is displayed                                   | boolean                                           | -      | true    |
| lockScroll          | Whether scroll is locked                                          | boolean                                           | -      |         |
| lockFocus           | Whether focus is locked                                           | boolean                                           | -      |         |
| closeOnEscape       | Whether to close the Dialog when escape key is pressed            | boolean                                           | -      | true    |
| closeOnClickOutside | Whether to close the Dialog when the mask is clicked              | boolean                                           | -      | true    |

## Events

| Event name        | Properties                                                                                                      | Description                              |
| ----------------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| close             | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed   |
| open              | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is opened   |
| update:modelValue | **eventName** `string` - The name of the event<br/>**value** `string` - The new value of the model              | Triggered when the modelValue is updated |

## Slots

| Name    | Description           | Bindings |
| ------- | --------------------- | -------- |
| title   | Title of the Dialog   |          |
| default | Content of the Dialog |          |
| footer  | Footer of the Dialog  |          |
