---
title: Icon Button component
lang: en-US
editLink: true
---

# Icon Button

Short description for IconButton component...

:::info Figma component anatomy
https://www.figma.com/file/
:::

## Basic usage

<IconButtonBasic />

::: details Source code
<<< @/demos/icon-button/IconButtonBasic.vue
:::

## Sizes

<IconButtonSizes />

## Colors

<IconButtonColors />

## Props

| Prop name | Description             | Type   | Values                                                        | Default   |
| --------- | ----------------------- | ------ | ------------------------------------------------------------- | --------- |
| size      | Size of the IconButton  | string | 'small', 'medium', 'large'                                    | 'medium'  |
| color     | Color of the IconButton | union  | 'primary', 'secondary', 'success', 'info', 'warning', 'error' | 'primary' |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name    | Description                  | Bindings |
| ------- | ---------------------------- | -------- |
| default | Slot for the IconButton icon |          |
