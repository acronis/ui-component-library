---
title: ACV Button component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# ACV Button

> Button is used to highlight key actions and clearly inform user of what will happen after the interaction.

<!--@include: ./button.doc.md-->

## Props

| Prop name | Description                           | Type                                                | Values                              | Default |
| --------- | ------------------------------------- | --------------------------------------------------- | ----------------------------------- | ------- |
| variant   | Button variant                        | AcvButtonVariant                                    | primary, secondary, ghost, inverted | primary |
| is        | Button tag                            | "a" \| "span" \| "button" \| "label" \| TSTypeQuery | a, span, button, label, RouterLink  | button  |
| type      | Button type                           | TSIndexedAccessType                                 | button, submit, reset               | button  |
| size      | Button size                           | AcvButtonSize                                       | small, medium, large                | medium  |
| selected  | Whether button appearance as selected | boolean                                             | -                                   |         |
| autofocus | Same as native button's autofocus     | boolean                                             | -                                   |         |
| disabled  | Disable the button                    | boolean                                             | -                                   |         |
| loading   | Determine whether it's loading        | boolean                                             | -                                   |         |

## Slots

| Name    | Description                               | Bindings |
| ------- | ----------------------------------------- | -------- |
| prepend | Left side slot content. Usually for icon  |          |
| default | Default slot content. Usually for text    |          |
| append  | Right side slot content. Usually for icon |          |
