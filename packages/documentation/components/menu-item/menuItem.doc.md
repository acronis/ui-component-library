---
title: Menu Item component
lang: en-US
editLink: true
---

# Menu Item

Short description for MenuItem component...

:::info Figma component anatomy
https://www.figma.com/file/
:::

## Basic usage

<MenuItemBasic />

::: details Source code
<<< @/demos/menu-item/MenuItemBasic.vue
:::

## Best practices

A MenuItem should ...

## Related components

- [Button](/components/button/button.doc)

## Props

| Prop name   | Description                 | Type   | Values | Default |
| ----------- | --------------------------- | ------ | ------ | ------- |
| title       | Title of the MenuItem       | string | -      |         |
| description | Description of the MenuItem | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
