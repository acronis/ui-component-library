---
title: Spinner component
lang: en-US
editLink: true
---

# Spinner

Short description for Spinner component...

:::info Figma component anatomy
https://www.figma.com/file/
:::

## Basic usage

<SpinnerBasic />

::: details Source code
<<< @/demos/spinner/SpinnerBasic.vue
:::

## Best practices

A Spinner should ...

## Related components

- [Button](/components/button/button.doc)

## Props

| Prop name   | Description                | Type   | Values | Default |
| ----------- | -------------------------- | ------ | ------ | ------- |
| title       | Title of the Spinner       | string | -      |         |
| description | Description of the Spinner | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
