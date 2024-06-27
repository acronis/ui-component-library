---
title: Modal component
lang: en-US
editLink: true
---

# Modal

Short description for Modal component...

:::info Figma component anatomy
https://www.figma.com/file/
:::

## Basic usage

<ModalBasic />

::: details Source code
<<< @/demos/modal/ModalBasic.vue
:::

## Best practices

A Modal should ...

## Related components

- [Button](/components/button/button.doc)

## Props

| Prop name   | Description              | Type   | Values | Default |
| ----------- | ------------------------ | ------ | ------ | ------- |
| title       | Title of the Modal       | string | -      |         |
| description | Description of the Modal | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
