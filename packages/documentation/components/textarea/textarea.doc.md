---
title: Textarea component
lang: en-US
editLink: true
---

# Textarea

Short description for Textarea component...

:::info Figma component anatomy
https://www.figma.com/file/
:::

## Basic usage

<TextareaBasic />

::: details Source code
<<< @/demos/textarea/TextareaBasic.vue
:::

## Disabled

<TextareaDisabled />

## Auto resize

<TextareaAutoResize />

## Related components

- [Input](/components/input/input.doc)

## Props

| Prop name   | Description                 | Type   | Values | Default |
| ----------- | --------------------------- | ------ | ------ | ------- |
| title       | Title of the Textarea       | string | -      |         |
| description | Description of the Textarea | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
