---
title: Checkbox Button component
lang: en-US
editLink: true
---

# Checkbox Button

Short description for CheckboxButton component...

:::info Figma component anatomy
https://www.figma.com/file/
:::

## Basic usage

<CheckboxButtonBasic />

::: details Source code
<<< @/demos/checkbox-button/CheckboxButtonBasic.vue
:::

## Best practices

A CheckboxButton should ...

## Related components

- [Button](/components/button/button.doc)

## Props

| Prop name   | Description                       | Type   | Values | Default |
| ----------- | --------------------------------- | ------ | ------ | ------- |
| title       | Title of the CheckboxButton       | string | -      |         |
| description | Description of the CheckboxButton | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
