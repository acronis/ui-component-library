---
title: Markup Table component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# Markup Table

<!--@include: ./markupTable.doc.md-->

## Props

| Prop name | Description               | Type    | Values      | Default |
| --------- | ------------------------- | ------- | ----------- | ------- |
| columns   | Table columns             | Array   | -           |         |
| data      | Table data                | Array   | -           |         |
| bordered  | Whether table is bordered | boolean | true, false | true    |
| dense     | Whether table is compact  | boolean | -           |         |
| height    |                           | number  | -           |         |

## Slots

| Name                   | Description | Bindings |
| ---------------------- | ----------- | -------- |
| default                |             |          |
| caption                |             |          |
| `header_${column.key}` |             |          |
| `column_${column.key}` |             | <br/>    |
