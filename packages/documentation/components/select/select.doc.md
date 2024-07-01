---
title: Select component
lang: en-US
editLink: true
---

# Select

Used when the values are pre-determined by the system and the user needs to select one or more values from the drop-down list. Select is always marked with an icon that unequivocally tells the user that after the click a list of available values will be expanded.
For select, as well as for Input, two modifications are available: default and small.

:::info Figma mockups
https://www.figma.com/file/AOtI028uCFzAmnADVCz872/Documentation?node-id=2%3A27
:::

## Basic usage

<SelectBasic />

::: details Source code
<<< @/demos/select/SelectBasic.vue
:::

## Best practices

A Select should ...

## Related components

- [Button](/components/button/button.doc)

## Props

| Prop name   | Description               | Type   | Values | Default |
| ----------- | ------------------------- | ------ | ------ | ------- |
| title       | Title of the Select       | string | -      |         |
| description | Description of the Select | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
