---
title: ACV Switch component
lang: en-US
editLink: true
---

# ACV Switch

Switch is a component used to toggle between two states, such as on and off.
It is a visual representation of a checkbox that allows the user to switch between two states.

- It used for actions that occur immediately after the user switches the toggle switch to one of the positions.
- Switch has two basic states - On / Off.
- Like checkboxes, a switch also has several states: focused, disabled, hover and active.

:::info Figma mockups
https://www.figma.com/design/6nFlVmwDwvGloglQHxyElh/Tokens-test?node-id=592-168382
:::

## Basic usage

Bind `v-model` to a `Boolean` typed variable.

<SwitchBasic />

::: details Source code
<<< @/demos/switch/SwitchBasic.vue
:::

## Label

You can add a label to the switch component using the `label` prop.

<SwitchLabel />

:::tip
You can also use default slot to render the label.
:::

## Array

You can use an array to bind multiple switches to a single variable.

<SwitchArray />

::: details Source code
<<< @/demos/switch/SwitchArray.vue
:::

## Sizes

You can switch between different sizes using the `size` prop.

<SwitchSizes />

## See also

- [Checkbox](/components/checkbox/checkbox.doc)
- [Radio](/components/radio/radio.doc)
- [Open UI Switch](https://open-ui.org/components/switch/)
- [WAI-ARIA Switch pattern](https://www.w3.org/WAI/ARIA/apg/patterns/switch/)

## Props

| Prop name  | Description                    | Type          | Values | Default |
| ---------- | ------------------------------ | ------------- | ------ | ------- |
| modelValue | Binding value of the Switch    | boolean       | -      |         |
| color      | Custom color of the Switch     | ColorProp     | -      | primary |
| label      | Switch description             | string        | -      |         |
| size       | Switch size                    | ComponentSize | -      |         |
| disabled   | Whether the Switch is disabled | boolean       | -      |         |

## Events

| Event name        | Properties                                                                                          | Description                              |
| ----------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| update:modelValue | **eventName** `string` - The name of the event<br/>**value** `string` - Checked state of the Switch | Triggered when the modelValue is updated |

## Slots

| Name    | Description              | Bindings |
| ------- | ------------------------ | -------- |
| default | The default slot content |          |
