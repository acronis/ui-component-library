---
title: Icon Button component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# Icon Button

<!--@include: ./iconButton.doc.md-->

## Props

| Prop name | Description             | Type          | Values                                                        | Default   |
| --------- | ----------------------- | ------------- | ------------------------------------------------------------- | --------- |
| size      | Size of the IconButton  | ComponentSize | 'small', 'medium', 'large'                                    | 'medium'  |
| color     | Color of the IconButton | ColorProp     | 'primary', 'secondary', 'success', 'info', 'warning', 'error' | 'primary' |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name    | Description                  | Bindings |
| ------- | ---------------------------- | -------- |
| default | Slot for the IconButton icon |          |
