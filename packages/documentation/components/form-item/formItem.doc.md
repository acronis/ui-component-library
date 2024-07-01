---
title: Form Item component
lang: en-US
editLink: true
---

# Form Item

Short description for FormItem component...

:::info Figma component anatomy
https://www.figma.com/file/
:::

## Basic usage

<FormItemBasic />

::: details Source code
<<< @/demos/form-item/FormItemBasic.vue
:::

## Best practices

A FormItem should ...

## Related components

- [Button](/components/button/button.doc)

## Props

| Prop name   | Description                 | Type   | Values | Default |
| ----------- | --------------------------- | ------ | ------ | ------- |
| title       | Title of the FormItem       | string | -      |         |
| description | Description of the FormItem | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
