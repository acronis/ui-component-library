---
title: Breadcrumbs component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# Breadcrumbs

<!--@include: ./breadcrumbs.doc.md-->

## Props

| Prop name     | Description                                          | Type         | Values | Default            |
| ------------- | ---------------------------------------------------- | ------------ | ------ | ------------------ |
| maxItems      | Maximum number of items to display                   | number       | -      | Infinity           |
| multiline     | Breadcrumb will be wrapped to multiple lines if true | boolean      | -      |                    |
| separatorIcon | Separator icon/character between breadcrumbs         | Component    | -      | IconChevronRight16 |
| separator     |                                                      | string       | -      |                    |
| size          | Size of the breadcrumbs                              | "md" \| "lg" | -      | 'md'               |

## Events

| Event name | Properties                                                                             | Description                                 |
| ---------- | -------------------------------------------------------------------------------------- | ------------------------------------------- |
| click      | **eventName** `mixed` - undefined<br/>**path** `string` - The path of the clicked item | Triggered when a breadcrumb item is clicked |

## Slots

| Name    | Description                       | Bindings |
| ------- | --------------------------------- | -------- |
| default | Default slot for breadcrumb items |          |
