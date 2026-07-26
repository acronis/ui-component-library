---
title: Ribbon component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# Ribbon

<!--@include: ./ribbon.doc.md-->

## Props

| Prop name | Description           | Type    | Values                                                                                                                 | Default |
| --------- | --------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------- | ------- |
| alerts    | List of alerts        | Array   | [{ description: string, type: string, link?: { href: string, target?: string, title: string, click: () =&gt; void } }] | []      |
| hideClose | Hide the close button | boolean | true, false                                                                                                            | false   |

## Events

| Event name | Properties                                | Description                        |
| ---------- | ----------------------------------------- | ---------------------------------- |
| close      | **alertIndex** `number` - The alert index | Triggered when the alert is closed |

## Slots

| Name    | Description              | Bindings |
| ------- | ------------------------ | -------- |
| default | The default slot content |          |
