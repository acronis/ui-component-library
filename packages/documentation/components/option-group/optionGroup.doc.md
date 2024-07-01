---
title: Option Group component
lang: en-US
editLink: true
---

# Option Group

Short description for OptionGroup component...

:::info Figma component anatomy
https://www.figma.com/file/
:::

## Basic usage

<OptionGroupBasic />

::: details Source code
<<< @/demos/option-group/OptionGroupBasic.vue
:::

## Best practices

A OptionGroup should ...

## Related components

- [Button](/components/button/button.doc)

## Props

| Prop name   | Description                    | Type   | Values | Default |
| ----------- | ------------------------------ | ------ | ------ | ------- |
| title       | Title of the OptionGroup       | string | -      |         |
| description | Description of the OptionGroup | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
