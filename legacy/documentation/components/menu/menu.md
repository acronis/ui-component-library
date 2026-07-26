---
title: ACV Menu component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# ACV Menu

> User interface element that provides a set of links or buttons
> to navigate through different sections or pages of a website or application.

<!--@include: ./menu.doc.md-->

## Props

| Prop name        | Description                             | Type                                   | Values                                            | Default    |
| ---------------- | --------------------------------------- | -------------------------------------- | ------------------------------------------------- | ---------- |
| type             | Type of the Menu                        | "primary" \| "secondary" \| "tertiary" | 'primary', 'secondary', 'tertiary'                | 'primary'  |
| modelValue       | Selected menu item                      | string \| number                       | -                                                 |            |
| defaultActive    | Menu items                              | string                                 | -                                                 |            |
| defaultOpened    | Menu items                              | Array                                  | -                                                 |            |
| collapse         | Whether the Menu is collapsible         | boolean                                | -                                                 | false      |
| scrollIntoExpand | Whether the Menu is expandable          | boolean                                | -                                                 | false      |
| uniqueOpened     | Whether unique opened items are enabled | boolean                                | -                                                 | true       |
| router           | Whether the router is enabled           | boolean                                | -                                                 | false      |
| background       | Background color                        | string                                 | 'primary', 'secondary', 'tertiary', 'nav-primary' |            |
| hideBottomBorder | Whether bottom border is hidden         | boolean                                | -                                                 |            |
| hideBorders      | Whether borders are hidden              | boolean                                | -                                                 |            |
| height           | Height of the Menu                      | string                                 | -                                                 |            |
| mode             |                                         | -                                      | -                                                 | 'vertical' |

## Events

| Event name        | Properties                                                                                    | Description                                   |
| ----------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------- |
| update:modelValue | **eventName** `string` - The name of the event<br/>**item** `string` - The selected menu item | Triggered when the selected menu item changes |
| select            |                                                                                               |                                               |
| open              |                                                                                               |                                               |
| close             |                                                                                               |                                               |

## Slots

| Name    | Description | Bindings |
| ------- | ----------- | -------- |
| prepend |             |          |
| default |             |          |
| append  |             |          |
