---
title: Switch component
lang: en-US
editLink: true
---

# Switch

Switch is a component used to toggle between two states, such as on and off.
It is a visual representation of a checkbox that allows the user to switch between two states.
Used for actions that occur immediately after the user switches the toggle switch to one of the positions.
The switch has two basic states - On / Off.
Like checkboxes, a swicth also has several states: focused, disabled, hover and active.
:::info Figma mockups
https://www.figma.com/file/AOtI028uCFzAmnADVCz872/Documentation?node-id=2%3A30
:::

## Basic usage

<SwitchBasic />

::: details Source code
<<< @/demos/switch/SwitchBasic.vue
:::

## Disabled

<SwitchDisabled />

## Sizes

<SwitchSizes />

## Props

| Prop name  | Description                    | Type          | Values | Default |
| ---------- | ------------------------------ | ------------- | ------ | ------- |
| modelValue | Binding value of the Switch    | boolean       | -      |         |
| color      | Custom color of the Switch     | ColorProp     | -      | primary |
| size       | Switch size                    | ComponentSize | -      |         |
| disabled   | Whether the Switch is disabled | boolean       | -      |         |

## Events

| Event name        | Properties                                                                                          | Description                            |
| ----------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------- |
| update:modelValue | **eventName** `string` - The name of the event<br/>**value** `string` - Checked state of the Switch | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
