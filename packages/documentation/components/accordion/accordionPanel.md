---
title: ACV Accordion Panel component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# ACV Accordion Panel

> Composable component that represents a panel in the accordion.

<!--@include: ./accordionPanel.doc.md-->

## Props

| Prop name       | Description                                 | Type    | Values          | Default |
| --------------- | ------------------------------------------- | ------- | --------------- | ------- |
| id              | ID of the accordion item                    | string  | -               |         |
| triggerPosition | Position of the trigger                     | string  | 'left', 'right' | 'left'  |
| titleBackground | Set the background color of the title       | string  | -               |         |
| background      | Set the background color of the panel       | string  | -               |         |
| title           | Title of the accordion item                 | string  | -               |         |
| noTrigger       | Show/hide accordion trigger                 | boolean | -               |         |
| noBorder        | No display border between title and content | boolean | -               |         |
| noPadding       | No padding for the accordion item           | boolean | -               |         |
| disabled        | Whether the accordion item is disabled      | boolean | -               |         |

## Slots

| Name    | Description                          | Bindings |
| ------- | ------------------------------------ | -------- |
| label   | Custom label of the accordion item   |          |
| default | Content of the accordion panel       |          |
| trigger | Custom trigger of the accordion item |          |
