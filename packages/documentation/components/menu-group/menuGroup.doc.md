---
title: Menu Group component
lang: en-US
editLink: true
---

# Menu Group

Short description for MenuGroup component...

:::info Figma component anatomy
https://www.figma.com/file/
:::

## Basic usage

<MenuGroupBasic />

::: details Source code
<<< @/demos/menu-group/MenuGroupBasic.vue
:::

## Best practices

A MenuGroup should ...

## Related components

- [Button](/components/button/button.doc)

## Props

| Prop name   | Description                  | Type   | Values | Default |
| ----------- | ---------------------------- | ------ | ------ | ------- |
| title       | Title of the MenuGroup       | string | -      |         |
| description | Description of the MenuGroup | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
