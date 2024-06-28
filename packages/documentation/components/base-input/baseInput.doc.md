---
title: Base Input component
lang: en-US
editLink: true
---

# Base Input

Short description for BaseInput component...

:::info Figma component anatomy
https://www.figma.com/file/
:::

## Basic usage

<BaseInputBasic />

::: details Source code
<<< @/demos/base-input/BaseInputBasic.vue
:::

## Best practices

A BaseInput should ...

## Related components

- [Button](/components/button/button.doc)

## Props

| Prop name   | Description                  | Type   | Values | Default |
| ----------- | ---------------------------- | ------ | ------ | ------- |
| title       | Title of the BaseInput       | string | -      |         |
| description | Description of the BaseInput | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
