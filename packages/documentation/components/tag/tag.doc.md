---
title: Tag component
lang: en-US
editLink: true
---

# Tag

Used for those interface elements that need to be labeled, classified, or organized using keywords.

:::info Figma component anatomy
https://www.figma.com/file/
:::

## Basic usage

<TagBasic />

::: details Source code
<<< @/demos/tag/TagBasic.vue
:::

## Props

| Prop name   | Description            | Type   | Values | Default |
| ----------- | ---------------------- | ------ | ------ | ------- |
| title       | Title of the Tag       | string | -      |         |
| description | Description of the Tag | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
