---
title: Slider component
lang: en-US
editLink: true
---

# Slider

Short description for Slider component...

:::info Figma component anatomy
https://www.figma.com/file/
:::

## Basic usage

<SliderBasic />

::: details Source code
<<< @/demos/slider/SliderBasic.vue
:::

## Best practices

A Slider should ...

## Related components

- [Button](/components/button/button.doc)

## Props

| Prop name   | Description               | Type   | Values | Default |
| ----------- | ------------------------- | ------ | ------ | ------- |
| title       | Title of the Slider       | string | -      |         |
| description | Description of the Slider | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
