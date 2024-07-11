---
title: Input Base component
lang: en-US
editLink: true
---

# Input Base

Short description for InputBase component...

:::info Figma component anatomy
https://www.figma.com/file/
:::

## Basic usage

<InputBaseBasic />

::: details Source code
<<< @/demos/input-base/InputBaseBasic.vue
:::

## Best practices

A InputBase should ...

## Related components

- [Button](/components/button/button.doc)

## Props

| Prop name  | Description                     | Type                                           | Values | Default |
| ---------- | ------------------------------- | ---------------------------------------------- | ------ | ------- |
| modelValue | The value of the InputBase      | string \| number \| boolean \| object \| Array | -      |         |
| type       | Type of the InputBase           | string                                         | -      |         |
| hidden     | Whether the InputBase is hidden | boolean                                        | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |
