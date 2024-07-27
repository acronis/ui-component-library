---
title: Cell component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# Cell

<!--@include: ./cell.doc.md-->

## Props

| Prop name | Description                             | Type                             | Values | Default |
| --------- | --------------------------------------- | -------------------------------- | ------ | ------- |
| tag       | Tag of the cell container               | string                           | -      | 'div'   |
| top       | Top position of the cell                | number \| string                 | -      | 'auto'  |
| left      | Left position of the cell               | number \| string                 | -      | 'auto'  |
| width     | Width of the cell                       | number \| null                   | -      | null    |
| height    | Height of the cell                      | number                           | -      | 1       |
| right     | Right position of the cell              | number \| string                 | -      | ''      |
| bottom    | Bottom position of the cell             | number \| string                 | -      | ''      |
| xs        | Cell options for different screen sizes | AcvCellOptions \| number \| null | -      | null    |
| sm        |                                         | AcvCellOptions \| number \| null | -      | null    |
| md        |                                         | AcvCellOptions \| number \| null | -      | null    |
| lg        |                                         | AcvCellOptions \| number \| null | -      | null    |
| xl        |                                         | AcvCellOptions \| number \| null | -      | null    |
| xxl       |                                         | AcvCellOptions \| number \| null | -      | null    |
| useFlex   | Whether to use flex layout for the cell | boolean \| Partial \| null       | -      | null    |
| inherit   |                                         | boolean                          | -      |         |

## Slots

| Name    | Description | Bindings |
| ------- | ----------- | -------- |
| default |             |          |
