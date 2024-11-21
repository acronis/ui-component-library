---
title: Menu Item component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# Menu Item

<!--@include: ./menuItem.doc.md-->

## Props

| Prop name     | Description                   | Type              | Values                 | Default |
| ------------- | ----------------------------- | ----------------- | ---------------------- | ------- |
| index         | Unique identifier             | string            | -                      |         |
| title         | Title of the item             | string            | -                      |         |
| icon          | Icon component to display     | IconProp          | -                      |         |
| iconSize      | Icon size                     | string            | 'sm', 'md', 'lg', 'xl' | 'md'    |
| clamp         | Whether the item is multiline | boolean \| number | true, false, 2, 3      | false   |
| route         | Whether route is active       | string \| object  | -                      |         |
| disabled      | Whether the item is disabled  | boolean           | -                      |         |
| exact         | Whether route is exact        | boolean           | -                      |         |
| showHoverHint | Whether to show hover hint    | boolean           | -                      |         |

## Events

| Event name | Properties                                     | Description                             |
| ---------- | ---------------------------------------------- | --------------------------------------- |
| click      | **eventName** `string` - The name of the event | Triggered when the component is clicked |
| mousedown  | **eventName** `string` - The name of the event | Triggered when the component is hovered |
| mouseup    | **eventName** `string` - The name of the event | Triggered when the component is blurred |

## Slots

| Name     | Description               | Bindings |
| -------- | ------------------------- | -------- |
| title    | Title                     |          |
| default  | The default slot content  |          |
| icon     | Icon slot                 |          |
| subtitle | The subtitle slot content |          |
| append   |                           |          |
