---
title: Notification component
lang: en-US
editLink: true
---

# Notification

Used as feedback to the user's actions inside the interface.
Notification can contain general information, inform the user of the successful completion of the operation, display warnings, report errors or display the progress of an operation performed earlier.

:::info Figma mockups
https://www.figma.com/file/AOtI028uCFzAmnADVCz872/Documentation?node-id=2%3A20
:::

## Basic usage

<NotificationBasic />

::: details Source code
<<< @/demos/notification/NotificationBasic.vue
:::

## Types

We provide six types: success, warning, error, info and progress.

## Custom position

Notification can emerge from any corner you like.

## Use component

`message` supports component.

## Global method

Acronis UI Component Library has added a global method `$notify` for Vue.prototype. So in a vue instance you can call `Notification` like what we did in this page.

## Props

| Prop name   | Description                     | Type   | Values | Default |
| ----------- | ------------------------------- | ------ | ------ | ------- |
| title       | Title of the Notification       | string | -      |         |
| description | Description of the Notification | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
