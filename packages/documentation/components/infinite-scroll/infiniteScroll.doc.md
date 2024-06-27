---
title: Infinite Scroll component
lang: en-US
editLink: true
---

# Infinite Scroll

Short description for InfiniteScroll component...

:::info Figma component anatomy
https://www.figma.com/file/
:::

## Basic usage

<InfiniteScrollBasic />

::: details Source code
<<< @/demos/infinite-scroll/InfiniteScrollBasic.vue
:::

## Best practices

A InfiniteScroll should ...

## Related components

- [Button](/components/button/button.doc)

## Props

| Prop name   | Description                       | Type   | Values | Default |
| ----------- | --------------------------------- | ------ | ------ | ------- |
| title       | Title of the InfiniteScroll       | string | -      |         |
| description | Description of the InfiniteScroll | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
