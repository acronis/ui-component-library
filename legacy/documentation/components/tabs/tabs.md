---
title: ACV Tabs component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# ACV Tabs

> Tabs are the set of content sections(tab panels), that display one panel at the time.
> Each tab panel associated with tab element, when activated, displays the panel.
> List of tab elements, arranged along one edge of a tab panel container.

<!--@include: ./tabs.doc.md-->

## Props

| Prop name   | Description                      | Type             | Values | Default |
| ----------- | -------------------------------- | ---------------- | ------ | ------- |
| modelValue  | Active tab                       | number \| string | -      |         |
| large       | Whether tab is large             | boolean          | -      | false   |
| showDivider | Show divider under navigation    | boolean          | -      | true    |
| spacing     | Disable margins navigation panel | boolean          | -      | true    |
| size        | Size of the tabs                 | ComponentSize    | -      |         |
| transition  | Tab transition                   | TransitionProp   | -      |         |

## Events

| Event name        | Properties                                                                                                      | Description                            |
| ----------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| update:modelValue | **eventName** `string` - The name of the event<br/>**value** `string` - The name of the active tab              | Triggered when the component is closed |
| click             | **eventName** `string` - The name of the event<br/>**tabName** `string` - Clicked tab                           | Triggered when the tab is clicked      |
| tabClick          | **eventName** `string` - The name of the event<br/>**tabName** `string` - Clicked tab                           | Triggered when the tab is clicked      |
| close             | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name    | Description | Bindings |
| ------- | ----------- | -------- |
| default |             |          |
