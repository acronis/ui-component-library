---
title: Ribbon component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# Ribbon

<!--@include: ./ribbon.doc.md-->

## Props

| Prop name   | Description           | Type                                                      | Values | Default |
| ----------- | --------------------- | --------------------------------------------------------- | ------ | ------- |
| alerts      | List of alerts        | Array                                                     | -      |         |
| variant     |                       | "info" \| "success" \| "warning" \| "critical" \| "error" | -      |         |
| title       | The alert title       | string                                                    | -      |         |
| description | The alert message     | string                                                    | -      |         |
| hideClose   | Hide the close button | boolean                                                   | -      |         |
| closeable   | Show the close button | boolean                                                   | -      |         |

## Events

| Event name | Properties                                                                                   | Description                        |
| ---------- | -------------------------------------------------------------------------------------------- | ---------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**alertIndex** `number` - The alert index | Triggered when the alert is closed |

## Slots

| Name    | Description              | Bindings |
| ------- | ------------------------ | -------- |
| default | The default slot content |          |
