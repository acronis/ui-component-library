---
title: Stepper component
lang: en-US
editLink: true
---

# Stepper

The component is used in various wizards and shows the entire path that the user needs to go through in order to complete the installation or configuration of certain modules within the interface.

:::info Figma mockups
https://www.figma.com/file/AOtI028uCFzAmnADVCz872/Documentation?node-id=2%3A29
:::

## Basic usage

Default usage allows user to switch between steps only by external efforts. Flag `interactive` let the user switch to any fulfilled step

:::info
Set `v-model` attribute with `Number` type, which indicates the index of steps and starts from 0. Also, you can set `:value` and handle all changes by `@input`. Use `title` attribute to set name of the step, or override the attribute by using a default `slot` into `<acv-stepper-item>` tag
:::

<StepperBasic />

::: details Source code
<<< @/demos/stepper/StepperBasic.vue
:::

## Types

The component is allowed to use in `horizontal` and `vertical` form. In the `horizontal` view, the component is used for full-screen wizards, and in the `vertical` - for wizards in modal windows

<StepperTypes />

## Hooks

Let you do any changes before we switch to the selected step

<StepperHooks />

## Related components

- A related component.
- Another related component.

## Props

| Prop name   | Description                | Type   | Values | Default |
| ----------- | -------------------------- | ------ | ------ | ------- |
| title       | Title of the stepper       | string | -      |         |
| description | Description of the stepper | string | -      |         |

## Events

| Event name | Properties                                | Description                            |
| ---------- | ----------------------------------------- | -------------------------------------- |
| close      | **payload** `string` - The first argument | Triggered when the component is closed |

## Slots

| Name        | Description | Bindings |
| ----------- | ----------- | -------- |
| default     |             |          |
| description |             |          |
