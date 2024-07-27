---
title: ACV Dropdown component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# ACV Dropdown

<!--@include: ./dropdown.doc.md-->

## Props

| Prop name    | Description                      | Type            | Values | Default |
| ------------ | -------------------------------- | --------------- | ------ | ------- |
| disabled     | Whether the dropdown is disabled | boolean         | -      |         |
| search       |                                  | boolean         | -      |         |
| placeholder  |                                  | PopperPlacement | -      |         |
| hideOnClick  |                                  | boolean         | -      |         |
| hideOnScroll |                                  | boolean         | -      |         |
| value        |                                  | boolean         | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                               |
| ---------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed    |
| command    | **eventName** `mixed` - undefined<br/>**command** `mixed` - undefined                                           | Triggered when a dropdown item is clicked |

## Slots

| Name     | Description                                                                                              | Bindings |
| -------- | -------------------------------------------------------------------------------------------------------- | -------- |
| default  | Default slot for rendering trigger or anchor element<br/>Usually you will use `AcvButton` component here |          |
| dropdown | Slot for rendering dropdown content<br/>Usually you will use `AcvList` component here                    |          |
