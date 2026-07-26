---
title: ACV Alert component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# ACV Alert

> Alert displays a brief, important message without interrupting user's task.

<!--@include: ./alert.doc.md-->

## Props

| Prop name   | Description                                                | Type            | Values | Default |
| ----------- | ---------------------------------------------------------- | --------------- | ------ | ------- |
| description | Descriptive text. Can also be passed with the default slot | string          | -      |         |
| showBorder  | Displays border                                            | boolean         | -      |         |
| showClose   | Is close icon visible                                      | boolean         | -      |         |
| showIcon    | If a variant icon is displayed                             | boolean         | -      |         |
| title       | Title, can also be passed with the slot                    | string          | -      |         |
| subtitle    | Subtitle, can also be passed with the slot                 | string          | -      |         |
| color       | Alert variant                                              | AcvAlertVariant | -      |         |

## Events

| Event name | Properties | Description                               |
| ---------- | ---------- | ----------------------------------------- |
| close      |            | Emitted when the close button is clicked. |

## Slots

| Name        | Description                   | Bindings |
| ----------- | ----------------------------- | -------- |
| icon        | Content for the AcvAlert icon |          |
| title       | Title                         |          |
| description | Subtitle                      |          |
| default     | Custom content                |          |
| actions     | Content for the actions       |          |
| right       | Content for the right block   |          |
