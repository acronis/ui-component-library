---
title: Loading component
lang: en-US
editLink: true
---

# Loading

Used when the action takes a certain amount of time.
Loading can be global and override the entire interface or local, for example, show the status of an operation in a separate section or button.
Loading informs the user about the current status of the operation, but does not report when the process ends and is applied when the completion time of the operation is not known in advance.
In all other cases, circle progress is used.

:::info Figma mockups
https://www.figma.com/file/AOtI028uCFzAmnADVCz872/Documentation?node-id=2%3A18
:::

## Basic usage

<LoadingBasic />

::: details Source code
<<< @/demos/loading/LoadingBasic.vue
:::

## Sizes

## Spinner color

## Background color

## Fullscreen loading

## Component

## Props

| Prop name   | Description                | Type   | Values | Default |
| ----------- | -------------------------- | ------ | ------ | ------- |
| title       | Title of the Loading       | string | -      |         |
| description | Description of the Loading | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
