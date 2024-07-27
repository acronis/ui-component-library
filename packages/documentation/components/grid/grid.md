---
title: Grid component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# Grid

<!--@include: ./grid.doc.md-->

## Props

| Prop name   | Description                             | Type               | Values | Default   |
| ----------- | --------------------------------------- | ------------------ | ------ | --------- |
| tag         | Tag of the grid container               | string             | -      | 'div'     |
| gap         | Gap between the grid items              | number \| Array    | -      | 0         |
| rows        | Number of rows in the grid              | AcvLayoutProp      | -      | 'none'    |
| columns     | Number of columns in the grid           | AcvLayoutProp      | -      | 24        |
| autoRows    | Number of columns in the grid           | AcvLayoutProp      | -      | 'auto'    |
| autoColumns | Number of columns in the grid           | AcvLayoutProp      | -      | 'auto'    |
| dense       | Whether to use dense layout             | boolean            | -      | false     |
| justify     | Justify content of the grid             | AcvGridJustify     | -      | 'start'   |
| align       | Align content of the grid               | AcvGridAlign       | -      | 'stretch' |
| cellFlex    | Whether to use flex layout for the cell | boolean \| Partial | -      | false     |

## Slots

| Name    | Description | Bindings |
| ------- | ----------- | -------- |
| default |             |          |
