---
title: Icon component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# Icon

<!--@include: ./icon.doc.md-->

## Props

| Prop name      | Description                                          | Type                                                   | Values                                           | Default   |
| -------------- | ---------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------ | --------- |
| name           | Name of icon (e.g. `check` or `check--16`)           | string                                                 | -                                                |           |
| collection     | Name of collection (e.g. `acronis` or `constructor`) | string                                                 | -                                                | 'acronis' |
| state          | Name of state icon (e.g. `i-state-upload-d--16`)     | string                                                 | -                                                |           |
| title          | Title of the icon                                    | string                                                 | -                                                |           |
| fill           | Fill of the icon                                     | string                                                 | -                                                |           |
| scale          | Scale of the icon                                    | number                                                 | -                                                | 1         |
| animation      | Animation of the icon                                | string                                                 | 'spin', 'pulse', 'bounce', 'flash', 'rubberBand' | ''        |
| animateOnHover | Animate of the icon                                  | boolean                                                | -                                                |           |
| animationSpeed | Animation speed of the icon                          | "fast" \| "slow" \| "slower" \| "fastest" \| "slowest" | -                                                | 1         |
| size           | Size of the icon                                     | string \| number                                       | 16, 24, 32, 48, 64, 72, 96                       | 16        |
| flip           | Flip of the icon                                     | "horizontal" \| "vertical" \| "both"                   | -                                                |           |
| color          | Color of the icon                                    | Color \| Array                                         | -                                                |           |
| stateColor     | Color of the state icon                              | Color                                                  | -                                                |           |
| disabled       | Icon is disabled                                     | boolean                                                | -                                                | false     |
| inverse        | Icon is inverted                                     | boolean                                                | -                                                | false     |
| icon           |                                                      | IconProp                                               | -                                                |           |
| stateIcon      |                                                      | IconProp                                               | -                                                |           |

## Slots

| Name    | Description | Bindings |
| ------- | ----------- | -------- |
| default |             |          |
