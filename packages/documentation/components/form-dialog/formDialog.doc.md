---
title: Form Dialog component
lang: en-US
editLink: true
---

# Form Dialog

Short description for FormDialog component...

:::info Figma component anatomy
https://www.figma.com/file/
:::

## Basic usage

<FormDialogBasic />

::: details Source code
<<< @/demos/form-dialog/FormDialogBasic.vue
:::

## Best practices

A FormDialog should ...

## Related components

- [Button](/components/button/button.doc)

## Props

| Prop name   | Description                   | Type   | Values | Default |
| ----------- | ----------------------------- | ------ | ------ | ------- |
| title       | Title of the FormDialog       | string | -      |         |
| description | Description of the FormDialog | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
