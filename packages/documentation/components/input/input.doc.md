---
title: Input component
lang: en-US
editLink: true
---

# Input

Used to enter values by the user.
The label in the Input default should clearly and briefly describe the information that you need to enter.
In the case of the text area Input default can be multi-line and the height of the input field may depend on the number of text entered.

:::info Figma mockups
https://www.figma.com/file/AOtI028uCFzAmnADVCz872/Documentation?node-id=2%3A16
:::

## Basic usage

<InputBasic />

::: details Source code
<<< @/demos/input/InputBasic.vue
:::

## Disabled

<InputDisabled />

## With icon

<InputWithIcon />

## With prefix

<InputWithPrefix />

## With mask

<InputWithMask />

## Clearable

<InputClearable />

- A related component.
- Another related component.

## Props

| Prop name  | Description                               | Type             | Values | Default |
| ---------- | ----------------------------------------- | ---------------- | ------ | ------- |
| type       | Description of the Input                  | string           | -      |         |
| trueValue  | Value of the Checkbox if it's checked     | string \| number | -      |         |
| falseValue | Value of the Checkbox if it's not checked | string \| number | -      |         |

## Events

| Event name | Properties                                | Description                            |
| ---------- | ----------------------------------------- | -------------------------------------- |
| close      | **payload** `string` - The first argument | Triggered when the component is closed |
