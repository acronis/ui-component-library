---
title: Form Error component
lang: en-US
editLink: true
---

# Form Error

Short description for FormError component...

:::info Figma component anatomy
https://www.figma.com/file/
:::

## Basic usage

<FormErrorBasic />

::: details Source code
<<< @/demos/form-error/FormErrorBasic.vue
:::

## Best practices

A FormError should ...

## Related components

- [Button](/components/button/button.doc)

## Props

| Prop name   | Description                  | Type   | Values | Default |
| ----------- | ---------------------------- | ------ | ------ | ------- |
| title       | Title of the FormError       | string | -      |         |
| description | Description of the FormError | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
