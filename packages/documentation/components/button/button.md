---
title: ACV Button component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# ACV Button

<!--@include: ./button.doc.md-->

## Props

| Prop name  | Description                                                                | Type                                 | Values                                                                                | Default  |
| ---------- | -------------------------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------- | -------- |
| type       | Button type                                                                | AcvButtonType                        | primary, secondary, ghost, danger, inverted                                           |          |
| variant    | Button variant                                                             | AcvButtonVariant                     | solid, outline, ghost, light                                                          | solid    |
| color      | Color of the button                                                        | ButtonColor                          | primary, secondary, inverted, neutral, info, warning, success, critical, danger, info | primary  |
| tag        | Button tag                                                                 | "a" \| "span" \| "button" \| "label" | a, span, button, label                                                                | 'button' |
| buttonType | Button type                                                                | "button" \| "submit" \| "reset"      | button, submit, reset                                                                 | button   |
| icon       | Button icon, accepts an icon name of Icon component                        | IconProp                             | -                                                                                     |          |
| size       | Button size                                                                | AcvButtonSize                        | small, medium, large                                                                  | medium   |
| autofocus  | Same as native button's autofocus                                          | boolean                              | -                                                                                     |          |
| disabled   | Disable the button                                                         | boolean                              | -                                                                                     |          |
| loading    | Determine whether it's loading                                             | boolean                              | -                                                                                     |          |
| rightIcon  | Button icon on the right side,<br/> accepts an icon name of Icon component | IconProp                             | -                                                                                     |          |
| block      | Whether the button is block styled or not                                  | boolean                              | -                                                                                     | false    |
| pill       | Whether the button is rounded or not                                       | boolean                              | -                                                                                     | false    |
| squared    | Whether the button is squared or not                                       | boolean                              | -                                                                                     | false    |
| to         | Button router-link path                                                    | string \| object                     | -                                                                                     |          |

## Slots

| Name      | Description                         | Bindings |
| --------- | ----------------------------------- | -------- |
| icon      | Icon slot content                   |          |
| default   | The default slot content            |          |
| iconRight | Icon on the right side slot content |          |
