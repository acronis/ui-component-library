---
title: ACV Notification component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# ACV Notification

<!--@include: ./notification.doc.md-->

## Props

| Prop name     | Description | Type                 | Values | Default     |
| ------------- | ----------- | -------------------- | ------ | ----------- |
| visible       |             | boolean              | -      |             |
| message       |             | string\|object\|func | -      |             |
| title         |             | string               | -      |             |
| type          |             | string               | -      | 'info'      |
| iconClass     |             | string               | -      |             |
| customClass   |             | string               | -      |             |
| showClose     |             | boolean              | -      | true        |
| onClose       |             | func                 | -      | () =&gt; {} |
| duration      |             | number               | -      | 4500        |
| showHoverHint |             | boolean              | -      | false       |

## Events

| Event name     | Properties | Description |
| -------------- | ---------- | ----------- |
| update:visible |            |             |
| close          |            |             |

## Slots

| Name    | Description | Bindings |
| ------- | ----------- | -------- |
| content |             |          |
| default |             |          |
