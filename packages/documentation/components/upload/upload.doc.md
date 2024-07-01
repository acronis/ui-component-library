---
title: Upload component
lang: en-US
editLink: true
---

# Upload

It is most often used as a modal dialog and allows the user to upload one or more files in two ways: by dragging & dropping a file into the designated area or in a classic way, by using the Browse button. After the first files are added, the window changes its appearance and looks like a table with a list of files.

:::info Figma mockups
https://www.figma.com/file/AOtI028uCFzAmnADVCz872/Documentation?node-id=2%3A12
:::

## Basic usage

<UploadBasic />

::: details Source code
<<< @/demos/upload/UploadBasic.vue
:::

## Props

| Prop name   | Description               | Type   | Values | Default |
| ----------- | ------------------------- | ------ | ------ | ------- |
| title       | Title of the Upload       | string | -      |         |
| description | Description of the Upload | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
