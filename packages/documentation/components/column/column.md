---
title: Column component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# Column

<!--@include: ./column.doc.md-->

## Props

| Prop name | Description                              | Type   | Values                                | Default |
| --------- | ---------------------------------------- | ------ | ------------------------------------- | ------- |
| span      | Number of columns                        | number | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 | 12      |
| offset    | Number of columns to offset              | number | -                                     | 0       |
| push      | Number of columns to push                | number | -                                     | 0       |
| pull      | Number of columns to pull                | number | -                                     | 0       |
| xs        | Number of columns on extra-small screens | number | -                                     |         |
| sm        | Number of columns on small screens       | number | -                                     |         |
| md        | Number of columns on medium screens      | number | -                                     |         |
| lg        | Number of columns on large screens       | number | -                                     |         |
| xl        | Number of columns on extra-large screens | number | -                                     |         |
| tag       | Custom tag                               | string | -                                     | 'div'   |
| rowIndex  | Row index                                | number | -                                     |         |
| rowSpan   | Row span in grid layout                  | number | -                                     |         |
| colIndex  | Column index                             | number | -                                     |         |
| colSpan   | Column span in grid layout               | number | -                                     |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
