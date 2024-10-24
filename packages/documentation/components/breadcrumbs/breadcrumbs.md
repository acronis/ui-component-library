---
title: Breadcrumbs component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# Breadcrumbs

<!--@include: ./breadcrumbs.doc.md-->

## Props

| Prop name     | Description                                           | Type         | Values | Default            |
| ------------- | ----------------------------------------------------- | ------------ | ------ | ------------------ |
| to            | Target of the breadcrumbs, same as `to` in Vue Router | string       | -      |                    |
| maxItems      | Maximum number of items to display                    | number       | -      | Infinity           |
| multiline     | Breadcrumb will be wrapped to multiple lines if true  | boolean      | -      |                    |
| separatorIcon | Separator icon between breadcrumbs                    | component    | -      | IconChevronRight16 |
| separator     | Separator character between breadcrumbs               | string       | -      |                    |
| size          | Size of the breadcrumbs                               | "md" \| "lg" | -      | 'md'               |

## Events

| Event name | Properties                                                                                          | Description                                 |
| ---------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| click      | **eventName** `string` - The name of the event<br/>**path** `string` - The path of the clicked item | Triggered when a breadcrumb item is clicked |

## Slots

| Name    | Description  | Bindings |
| ------- | ------------ | -------- |
| default | Default slot |          |
