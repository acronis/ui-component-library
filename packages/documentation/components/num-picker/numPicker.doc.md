---
title: Num Picker component
lang: en-US
editLink: true
---

# Num Picker

Behaves like Inout, but has controls to increase or decrease the value entered.
The user has two options for use, entering the value through the keyboard or changing the value using the buttons.

:::info Figma mockups
https://www.figma.com/file/AOtI028uCFzAmnADVCz872/Documentation?node-id=2%3A21
:::

## Basic usage

:::tip
Bind a variable to `v-model` in `<el-num-picker>` element and you are set.
:::

<NumPickerBasic />

::: details Source code
<<< @/demos/num-picker/NumPickerBasic.vue
:::

## Integer only

## Step strictly

## Disabled

## Infinity

## Props

| Prop name   | Description                  | Type   | Values | Default |
| ----------- | ---------------------------- | ------ | ------ | ------- |
| title       | Title of the NumPicker       | string | -      |         |
| description | Description of the NumPicker | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
