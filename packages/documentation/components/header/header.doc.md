---
title: Header component
lang: en-US
editLink: true
---

# Header

Short description for Header component...

:::info Figma component anatomy
https://www.figma.com/file/
:::

## Basic usage

<HeaderBasic />

::: details Source code
<<< @/demos/header/HeaderBasic.vue
:::

## Best practices

A Header should ...

## Related components

- [Button](/components/button/button.doc)

## Props

| Prop name | Description                    | Type    | Values                                                                       | Default |
| --------- | ------------------------------ | ------- | ---------------------------------------------------------------------------- | ------- |
| bordered  | Bottom border of the Header    | boolean | -                                                                            | true    |
| height    | Height of the Header           | string  | -                                                                            | 64px    |
| color     | Background color of the Header | union   | transparent, primary, secondary, success, warning, danger, info, light, dark | white   |
| title     | Title of the Header            | string  | -                                                                            | ''      |
| align     | Align the title                | string  | left, center, right                                                          | center  |

## Slots

| Name    | Description                         | Bindings |
| ------- | ----------------------------------- | -------- |
| default | The default slot content            |          |
| actions |                                     |          |
| aside   | Used to pass a custom aside content |          |
