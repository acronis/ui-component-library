---
title: Row component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# Row

<!--@include: ./row.doc.md-->

## Props

| Prop name  | Description                         | Type               | Values                                                    | Default |
| ---------- | ----------------------------------- | ------------------ | --------------------------------------------------------- | ------- |
| gap        | Grid spacing                        | number \| Array    | -                                                         |         |
| justify    | Horizontal alignment of flex layout | AcvRowGridJustify  | 'start', 'end', 'center', 'space-around', 'space-between' | 'start' |
| align      | Vertical alignment of flex layout   | AcvRowGridAlign    | 'top', 'middle', 'bottom'                                 | 'top'   |
| tag        | Custom tag                          | string             | -                                                         | 'div'   |
| columnFlex |                                     | boolean \| Partial | -                                                         |         |

## Slots

| Name    | Description              | Bindings |
| ------- | ------------------------ | -------- |
| default | The default slot content |          |
