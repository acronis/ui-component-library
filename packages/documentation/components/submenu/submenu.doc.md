---
title: Submenu component
lang: en-US
editLink: true
---

# Submenu

Short description for Submenu component...

:::info Figma component anatomy
https://www.figma.com/file/
:::

## Basic usage

<SubmenuBasic />

::: details Source code
<<< @/demos/submenu/SubmenuBasic.vue
:::

## Best practices

A Submenu should ...

## Related components

- [Button](/components/button/button.doc)

## Props

| Prop name   | Description                | Type   | Values | Default |
| ----------- | -------------------------- | ------ | ------ | ------- |
| title       | Title of the Submenu       | string | -      |         |
| description | Description of the Submenu | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
