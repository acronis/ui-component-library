---
title: Breadcrumb Link component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# Breadcrumb Link

<!--@include: ./breadcrumbLink.doc.md-->

## Props

| Prop name | Description                                      | Type             | Values | Default |
| --------- | ------------------------------------------------ | ---------------- | ------ | ------- |
| to        | Target of the link, same as _`to`_ in Vue Router | string \| Record | -      |         |
| active    | Whether the link is active (current page)        | boolean          | -      |         |

## Events

| Event name | Properties                                                                                                                   | Description                                   |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| click      | **eventName** `string` - The name of the event<br/>**to** `string \| Record&lt;string, unknown&gt;` - The target of the link | Triggered when the breadcrumb link is clicked |

## Slots

| Name    | Description                   | Bindings |
| ------- | ----------------------------- | -------- |
| default | Default slot for link content |          |
