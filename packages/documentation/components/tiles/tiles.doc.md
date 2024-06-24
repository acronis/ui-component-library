---
title: Tiles component
lang: en-US
editLink: true
---

# Tiles

Used to display potentially large amounts of information in a cards' manner.

:::info Figma component anatomy
https://www.figma.com/file/
:::

## Basic usage

<TilesBasic />

::: details Source code
<<< @/demos/tiles/TilesBasic.vue
:::

## Best practices

A Tiles should ...

## Related components

- [Button](/components/button/button.doc)

## Props

| Prop name   | Description              | Type   | Values | Default |
| ----------- | ------------------------ | ------ | ------ | ------- |
| title       | Title of the Tiles       | string | -      |         |
| description | Description of the Tiles | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
