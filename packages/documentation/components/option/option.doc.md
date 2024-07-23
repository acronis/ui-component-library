---
title: ACV Option component
lang: en-US
editLink: true
---

# ACV Option

Short description for Option component...

:::info Figma component anatomy
https://www.figma.com/file/
:::

## Basic usage

<OptionBasic />

::: details Source code
<<< @/demos/option/OptionBasic.vue
:::

## Best practices

A Option should ...

## Related components

- [Button](/components/button/button.doc)

## Props

| Prop name | Description                    | Type             | Values | Default |
| --------- | ------------------------------ | ---------------- | ------ | ------- |
| label     | Title of the Option            | string           | -      |         |
| value     | Value of the Option            | string \| number | -      |         |
| selected  | Whether the option is selected | boolean          | -      |         |
| active    | Whether the option is active   | boolean          | -      |         |
| disabled  | Whether the option is disabled | boolean          | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
