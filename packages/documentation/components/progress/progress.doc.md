---
title: Progress component
lang: en-US
editLink: true
---

# Progress

Used to inform the user about the progress of a particular process.
Can act as an indicator of the amount of information on the device or in the cloud storage, display the remaining number of actions before the completion of the process, or show the ratio of the two quantities relative to each other. The progress bar can be used in the table, in notification, as a list item or as a stand-alone interface element.

:::info Figma mockups
https://www.figma.com/file/AOtI028uCFzAmnADVCz872/Documentation?node-id=2%3A25
:::

## Basic usage

<ProgressBasic />

::: details Source code
<<< @/demos/progress/ProgressBasic.vue
:::

## Types

<ProgressTypes />

## Sizes

<ProgressSizes />

## Colors

<ProgressColors />

## Props

| Prop name   | Description                 | Type   | Values | Default |
| ----------- | --------------------------- | ------ | ------ | ------- |
| title       | Title of the Progress       | string | -      |         |
| description | Description of the Progress | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
