---
title: Breadcrumb Item component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# Breadcrumb Item

<!--@include: ./breadcrumbItem.doc.md-->

## Props

| Prop name | Description                                      | Type    | Values | Default |
| --------- | ------------------------------------------------ | ------- | ------ | ------- |
| to        | Target of the link, same as _`to`_ in Vue Router | string  | -      |         |
| active    | Whether the item is active (current page)        | boolean | -      |         |

## Events

| Event name | Properties                                                                                                                   | Description                                   |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| click      | **eventName** `string` - The name of the event<br/>**to** `string \| Record&lt;string, unknown&gt;` - The target of the link | Triggered when the breadcrumb link is clicked |

## Slots

| Name    | Description                   | Bindings |
| ------- | ----------------------------- | -------- |
| icon    | Slot for custom icon          |          |
| default | Default slot for item content |          |
