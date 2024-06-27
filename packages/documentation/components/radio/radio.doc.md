---
title: Radio component
lang: en-US
editLink: true
---

# Radio

Used in cases where a list of two or more parameters is mutually exclusive, that is, the user can select only one parameter.

:::info Figma mockups
https://www.figma.com/file/AOtI028uCFzAmnADVCz872/Documentation?node-id=2%3A5
:::

## Basic usage

<RadioBasic />

::: details Source code
<<< @/demos/radio/RadioBasic.vue
:::

## Disabled

<RadioDisabled />

## Props

| Prop name   | Description              | Type   | Values | Default |
| ----------- | ------------------------ | ------ | ------ | ------- |
| title       | Title of the Radio       | string | -      |         |
| description | Description of the Radio | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
