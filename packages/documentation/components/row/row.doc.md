---
title: Row component
lang: en-US
editLink: true
---

# Row

## Basic usage

<RowBasic />

::: details Source code
<<< @/demos/row/RowBasic.vue
:::

## Variants

<RowVariants />

## Best practices

A Row should ...

## Related components

- A related component.
- Another related component.

## Props

| Prop name  | Description                         | Type               | Values                                                    | Default |
| ---------- | ----------------------------------- | ------------------ | --------------------------------------------------------- | ------- |
| gap        | Grid spacing                        | number \| Array    | -                                                         | 0       |
| justify    | Horizontal alignment of flex layout | AcvRowGridJustify  | 'start', 'end', 'center', 'space-around', 'space-between' | 'start' |
| align      | Vertical alignment of flex layout   | AcvRowGridAlign    | 'top', 'middle', 'bottom'                                 | 'top'   |
| tag        | Custom tag                          | string             | -                                                         | 'div'   |
| columnFlex |                                     | boolean \| Partial | -                                                         | false   |

## Slots

| Name    | Description              | Bindings |
| ------- | ------------------------ | -------- |
| default | The default slot content |          |
