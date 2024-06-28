---
title: File Picker component
lang: en-US
editLink: true
---

# File Picker

FilePicker is based on Input. It allows to select file in system.

:::info Figma mockups
https://www.figma.com/file/AOtI028uCFzAmnADVCz872/Documentation?node-id=2%3A11
:::

## Basic usage

<FilePickerBasic />

::: details Source code
<<< @/demos/file-picker/FilePickerBasic.vue
:::

## Best practices

A FilePicker should ...

## Related components

- [Button](/components/button/button.doc)

## Props

| Prop name   | Description                   | Type   | Values | Default |
| ----------- | ----------------------------- | ------ | ------ | ------- |
| title       | Title of the FilePicker       | string | -      |         |
| description | Description of the FilePicker | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
