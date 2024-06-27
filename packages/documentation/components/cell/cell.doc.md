---
title: Cell component
lang: en-US
editLink: true
---

# Cell

Grids are used to layout content in a consistent way
They are made up of columns and rows that can be used to create a variety of layouts.

:::info Figma component anatomy
https://www.figma.com/file/
:::

## Basic usage

Create basic grid layout using columns.

## Related components

- [Row](/components/grid/grid.doc)

## Props

| Prop name | Description                             | Type    | Values | Default |
| --------- | --------------------------------------- | ------- | ------ | ------- |
| tag       | Tag of the cell container               | string  | -      | 'div'   |
| top       | Top position of the cell                | union   | -      | 'auto'  |
| left      | Left position of the cell               | union   | -      | 'auto'  |
| width     | Width of the cell                       | union   | -      | null    |
| height    | Height of the cell                      | number  | -      | 1       |
| right     | Right position of the cell              | union   | -      | ''      |
| bottom    | Bottom position of the cell             | union   | -      | ''      |
| xs        | Cell options for different screen sizes | union   | -      | null    |
| sm        |                                         | union   | -      | null    |
| md        |                                         | union   | -      | null    |
| lg        |                                         | union   | -      | null    |
| xl        |                                         | union   | -      | null    |
| xxl       |                                         | union   | -      | null    |
| useFlex   | Whether to use flex layout for the cell | union   | -      | null    |
| inherit   |                                         | boolean | -      |         |

## Slots

| Name    | Description | Bindings |
| ------- | ----------- | -------- |
| default |             |          |
