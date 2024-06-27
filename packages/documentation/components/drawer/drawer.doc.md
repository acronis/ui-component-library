---
title: Drawer component
lang: en-US
editLink: true
---

# Drawer

Short description for Drawer component...

:::info Figma component anatomy
https://www.figma.com/file/
:::

## Basic usage

<DrawerBasic />

::: details Source code
<<< @/demos/drawer/DrawerBasic.vue
:::

## Best practices

A Drawer should ...

## Related components

- [Button](/components/button/button.doc)

## Props

| Prop name   | Description               | Type   | Values | Default |
| ----------- | ------------------------- | ------ | ------ | ------- |
| title       | Title of the Drawer       | string | -      |         |
| description | Description of the Drawer | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
