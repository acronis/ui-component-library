---
title: Cascader component
lang: en-US
editLink: true
---

# Cascader

Cascader presents menu options in a hierarchical fashion with the ability to load them dynamically.

:::info Figma component anatomy
https://www.figma.com/file/
:::

## Basic usage

<CascaderBasic />

::: details Source code
<<< @/demos/cascader/CascaderBasic.vue
:::

## Related components

- [Button](/components/button/button.doc)

## Props

| Prop name   | Description                 | Type   | Values | Default |
| ----------- | --------------------------- | ------ | ------ | ------- |
| title       | Title of the Cascader       | string | -      |         |
| description | Description of the Cascader | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
