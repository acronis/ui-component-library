---
title: Scrollbar component
lang: en-US
editLink: true
---

# Scrollbar

## Basic usage

<ScrollbarBasic />

::: details Source code
<<< @/demos/scrollbar/ScrollbarBasic.vue
:::

## Inverse

<ScrollbarInverse />

## Text

<ScrollbarText />

## Offset

<ScrollbarOffset />

## Display border on top when scrolled

<ScrollbarBorderTop />

## Max height

<ScrollbarOnlyMaxHeight />

## Auto height

<ScrollbarAutoHeight />

## Props

| Prop name   | Description                  | Type   | Values | Default |
| ----------- | ---------------------------- | ------ | ------ | ------- |
| title       | Title of the scrollbar       | string | -      |         |
| description | Description of the scrollbar | string | -      |         |

## Events

| Event name | Properties                                | Description                            |
| ---------- | ----------------------------------------- | -------------------------------------- |
| close      | **payload** `string` - The first argument | Triggered when the component is closed |

## Slots

| Name        | Description | Bindings |
| ----------- | ----------- | -------- |
| default     |             |          |
| description |             |          |
