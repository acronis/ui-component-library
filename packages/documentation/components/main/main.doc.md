---
title: Main component
lang: en-US
editLink: true
---

# Main

Short description for Main component...

:::info Figma component anatomy
https://www.figma.com/file/
:::

## Basic usage

<MainBasic />

::: details Source code
<<< @/demos/main/MainBasic.vue
:::

## Best practices

A Main should ...

## Related components

- [Button](/components/button/button.doc)

## Props

| Prop name | Description                  | Type   | Values                                                                       | Default |
| --------- | ---------------------------- | ------ | ---------------------------------------------------------------------------- | ------- |
| color     | Background color of the Main | string | transparent, primary, secondary, success, warning, danger, info, light, dark |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name    | Description              | Bindings |
| ------- | ------------------------ | -------- |
| default | The default slot content |          |
