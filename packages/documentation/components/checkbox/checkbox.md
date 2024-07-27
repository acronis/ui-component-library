---
title: ACV Checkbox component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# ACV Checkbox

<!--@include: ./checkbox.doc.md-->

## Props

| Prop name           | Description                                          | Type               | Values                                                        | Default   |
| ------------------- | ---------------------------------------------------- | ------------------ | ------------------------------------------------------------- | --------- |
| cycleIndeterminate  | Enable cycling indeterminate state                   | boolean            | -                                                             |           |
| indeterminateValue  | Custom value for indeterminate state of the Checkbox | CheckboxModelValue | -                                                             | null      |
| uncheckedValue      | Value of the Checkbox if it's not checked            | CheckboxModelValue | -                                                             | false     |
| checkedValue        | Value of the Checkbox if it's checked                | CheckboxModelValue | -                                                             | true      |
| modelValue          | Bind v-model value                                   | CheckboxModelValue | -                                                             |           |
| id                  | Title of the Checkbox                                | string             | -                                                             |           |
| label               | Label text inside default slot                       | string             | -                                                             |           |
| disabled            | Whether the Checkbox is disabled                     | boolean            | -                                                             | false     |
| name                | Native `name` attribute                              | string             | -                                                             |           |
| showHint            | Show browser's default title hint                    | boolean            | -                                                             | false     |
| multilineLabel      | Enables multiline label                              | boolean            | -                                                             | false     |
| multilineLabelLimit | Limit the number of lines of the label               | number             | -                                                             |           |
| size                | Size of the Checkbox                                 | ComponentSize      | 'small', 'medium', 'large'                                    | 'medium'  |
| color               | Color of the Checkbox                                | ColorProp          | 'primary', 'secondary', 'success', 'info', 'warning', 'error' | 'primary' |
| invalid             |                                                      | boolean            | -                                                             |           |
| required            |                                                      | boolean            | -                                                             |           |
| iconClass           | Classes for the icon element                         | string             | -                                                             |           |

## Events

| Event name           | Properties                                                                                         | Description                                |
| -------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| update:modelValue    | **eventName** `string` - The name of the event<br/>**value** `any` - The updated value             | Triggered when binding value changes       |
| update:indeterminate | **eventName** `string` - The name of the event<br/>**value** `boolean` - Indeterminate state value | Triggered when indeterminate state changes |

## Slots

| Name    | Description                               | Bindings |
| ------- | ----------------------------------------- | -------- |
| icon    | Slot for checkbox icon                    |          |
| default | Default slot for rendering checkbox label |          |
