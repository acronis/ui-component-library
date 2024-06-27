---
title: Virtual Scroll component
lang: en-US
editLink: true
---

# Virtual Scroll

Allow you to render a large number of items performantly.
They only render the minimum number of DOM nodes necessary to show the items within the container element by using the wrapper element to emulate the container element's full height.

## Basic usage

<VirtualScrollBasic />

::: details Source code
<<< @/demos/virtual-scroll/VirtualScrollBasic.vue
:::

## Usage with table

## Usage with select

## Usage with tree

## Usage with list

## Props

| Prop name   | Description                      | Type   | Values | Default |
| ----------- | -------------------------------- | ------ | ------ | ------- |
| title       | Title of the VirtualScroll       | string | -      |         |
| description | Description of the VirtualScroll | string | -      |         |

## Events

| Event name | Properties                                | Description                            |
| ---------- | ----------------------------------------- | -------------------------------------- |
| close      | **payload** `string` - The first argument | Triggered when the component is closed |

## Slots

| Name        | Description | Bindings |
| ----------- | ----------- | -------- |
| default     |             |          |
| description |             |          |
