---
title: Radio Button component
lang: en-US
editLink: true
---

# Radio Button

Short description for RadioButton component...

:::info Figma component anatomy
https://www.figma.com/file/
:::

## Basic usage

<RadioButtonBasic />

::: details Source code
<<< @/demos/radio-button/RadioButtonBasic.vue
:::

## Best practices

A RadioButton should ...

## Related components

- [Button](/components/button/button.doc)

## Props

| Prop name   | Description                    | Type   | Values | Default |
| ----------- | ------------------------------ | ------ | ------ | ------- |
| title       | Title of the RadioButton       | string | -      |         |
| description | Description of the RadioButton | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
