---
title: Input Number component
lang: en-US
editLink: true
---

# Input Number

Short description for InputNumber component...

:::info Figma component anatomy
https://www.figma.com/file/
:::

## Basic usage

<InputNumberBasic />

::: details Source code
<<< @/demos/input-number/InputNumberBasic.vue
:::

## Best practices

A InputNumber should ...

## Related components

- [Button](/components/button/button.doc)

## Props

| Prop name   | Description                    | Type   | Values | Default |
| ----------- | ------------------------------ | ------ | ------ | ------- |
| title       | Title of the InputNumber       | string | -      |         |
| description | Description of the InputNumber | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
