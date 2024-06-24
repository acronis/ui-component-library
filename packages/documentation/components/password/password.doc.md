---
title: Password component
lang: en-US
editLink: true
---

# Password

The password entry field can be used in several versions: Basic Input with a value input (by default, the characters are replaced with dots).
Input with the ability to show / hide the entered characters (the action occurs after the icon is clicked).
Input with password strength scale (the scale works depending on the required conditions and shows the status of the password, depending on the number of characters or complexity of the entered password).

:::info Figma mockups
https://www.figma.com/file/AOtI028uCFzAmnADVCz872/Documentation?node-id=2%3A23
:::

## Basic usage

<PasswordBasic />

::: details Source code
<<< @/demos/password/PasswordBasic.vue
:::

## With score

## Responsive score

## Password keychain

## Props

| Prop name   | Description                 | Type   | Values | Default |
| ----------- | --------------------------- | ------ | ------ | ------- |
| title       | Title of the Password       | string | -      |         |
| description | Description of the Password | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
