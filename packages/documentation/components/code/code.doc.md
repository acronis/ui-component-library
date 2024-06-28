---
title: Code component
lang: en-US
editLink: true
---

# Code

Short description for Code component...

:::info Figma component anatomy
https://www.figma.com/file/
:::

## Basic usage

<CodeBasic />

::: details Source code
<<< @/demos/code/CodeBasic.vue
:::

## Related components

- [Button](/components/button/button.doc)

## Props

| Prop name | Description                  | Type   | Values | Default |
| --------- | ---------------------------- | ------ | ------ | ------- |
| code      | Source code to display       | string | -      |         |
| extension | Extension of the source code | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |
