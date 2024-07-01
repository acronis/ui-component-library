---
title: Switch component
lang: en-US
editLink: true
---

# Switch

Used for actions that occur immediately after the user switches the toggle switch to one of the positions.
The switch has two basic states - On / Off.

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

| Prop name   | Description               | Type   | Values | Default |
| ----------- | ------------------------- | ------ | ------ | ------- |
| title       | Title of the Switch       | string | -      |         |
| description | Description of the Switch | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
