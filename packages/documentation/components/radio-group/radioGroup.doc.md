---
title: Radio Group component
lang: en-US
editLink: true
---

# Radio Group

Short description for RadioGroup component...

:::info Figma component anatomy
https://www.figma.com/file/
:::

## Basic usage

<RadioGroupBasic />

::: details Source code
<<< @/demos/radio-group/RadioGroupBasic.vue
:::

## Best practices

A RadioGroup should ...

## Related components

- [Button](/components/button/button.doc)

## Props

| Prop name   | Description                   | Type   | Values | Default |
| ----------- | ----------------------------- | ------ | ------ | ------- |
| title       | Title of the RadioGroup       | string | -      |         |
| description | Description of the RadioGroup | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
