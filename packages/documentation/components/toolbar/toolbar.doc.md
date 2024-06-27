---
title: Toolbar component
lang: en-US
editLink: true
---

# Toolbar

Short description for toolbar component...

:::info Figma component anatomy
https://www.figma.com/file/
:::

## Basic usage

<ToolbarBasic />

::: details Source code
<<< @/demos/toolbar/ToolbarBasic.vue
:::

## Variants

<ToolbarVariants />

## Best practices

A toolbar should ...

## Related components

- A related component.
- Another related component.

## Props

| Prop name   | Description                | Type   | Values | Default |
| ----------- | -------------------------- | ------ | ------ | ------- |
| title       | Title of the toolbar       | string | -      |         |
| description | Description of the toolbar | string | -      |         |

## Events

| Event name | Properties                                | Description                            |
| ---------- | ----------------------------------------- | -------------------------------------- |
| close      | **payload** `string` - The first argument | Triggered when the component is closed |

## Slots

| Name        | Description | Bindings |
| ----------- | ----------- | -------- |
| default     |             |          |
| description |             |          |
