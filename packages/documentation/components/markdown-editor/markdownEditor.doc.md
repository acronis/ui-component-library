---
title: ACV Markdown Editor component
lang: en-US
editLink: true
---

# ACV Markdown Editor

Markdown editor component allows you to edit and preview markdown content.
We use `v-model` binding variable to bind the markdown content.

Under the hood, it uses [md-editor-v3](https://github.com/imzbf/md-editor-v3) component.

## Basic usage

<MarkdownEditorBasic />

::: details Source code
<<< @/demos/markdown-editor/MarkdownEditorBasic.vue
:::

## Props

| Prop name  | Description                  | Type             | Values | Default |
| ---------- | ---------------------------- | ---------------- | ------ | ------- |
| modelValue |                              | string           | -      |         |
| height     | Height of the MarkdownEditor | number \| string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
