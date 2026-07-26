---
title: Stepper Item component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# Stepper Item

<!--@include: ./stepperItem.doc.md-->

## Props

| Prop name | Description                           | Type                                                | Values                             | Default |
| --------- | ------------------------------------- | --------------------------------------------------- | ---------------------------------- | ------- |
| to        | Target of the link                    | RouteLocationRaw                                    | -                                  |         |
| selected  | Whether button appearance as selected | boolean                                             | -                                  |         |
| disabled  | Disable the StepperItem               | boolean                                             | -                                  |         |
| is        | StepperItem tag                       | "a" \| "span" \| "button" \| "label" \| TSTypeQuery | a, span, button, label, RouterLink | button  |

## Events

| Event name | Properties                                     | Description                                    |
| ---------- | ---------------------------------------------- | ---------------------------------------------- |
| select     | **eventName** `string` - The name of the event | Triggered when the component is being selected |

## Slots

| Name    | Description              | Bindings |
| ------- | ------------------------ | -------- |
| default | The default slot content |          |
