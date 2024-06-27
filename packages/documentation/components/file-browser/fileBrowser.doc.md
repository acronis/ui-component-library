---
title: File Browser component
lang: en-US
editLink: true
---

# File Browser

Used to browse files

:::info Figma mockups
https://www.figma.com/file/AOtI028uCFzAmnADVCz872/Documentation?node-id=2%3A11
:::

## Basic usage

<FileBrowserBasic />

::: details Source code
<<< @/demos/file-browser/FileBrowserBasic.vue
:::

## Related components

- [Button](/components/button/button.doc)

## Props

| Prop name   | Description                    | Type   | Values | Default |
| ----------- | ------------------------------ | ------ | ------ | ------- |
| title       | Title of the FileBrowser       | string | -      |         |
| description | Description of the FileBrowser | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
