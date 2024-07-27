---
title: Breadcrumbs component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# Breadcrumbs

<!--@include: ./breadcrumbs.doc.md-->

## Props

| Prop name     | Description                                           | Type         | Values | Default |
| ------------- | ----------------------------------------------------- | ------------ | ------ | ------- |
| to            | Target of the breadcrumbs, same as `to` in Vue Router | string       | -      |         |
| maxItems      | Maximum number of items to display                    | number       | -      |         |
| multiline     | Breadcrumb will be wrapped to multiple lines if true  | boolean      | -      |         |
| separatorIcon | Separator between breadcrumbs                         | string       | -      |         |
| size          | Size of the breadcrumbs                               | "md" \| "lg" | -      | 'md'    |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name      | Description            | Bindings |
| --------- | ---------------------- | -------- |
| default   | Default slot           |          |
| separator | Slot for the separator |          |
