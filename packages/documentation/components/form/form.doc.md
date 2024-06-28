---
title: Form component
lang: en-US
editLink: true
---

# Form

Note that the width of the fields in the form depends on the grid layout and obeys strict logic.
Using magic numbers when choosing the width of the fields, is not recommended without the urgent need.

:::info Figma mockups
https://www.figma.com/file/AOtI028uCFzAmnADVCz872/Documentation?node-id=23%3A744
:::

## Basic usage

It includes all kinds of input items, such as `input`, `select`, `radio` and `checkbox`.
These examples demonstrate 4 types of forms with modal `dialog`.

<FormBasic />

::: details Source code
<<< @/demos/form/FormBasic.vue
:::

## Form with validation

## Validation triggers

## Custom validation

## Validation with custom error messages

## Multiple errors

## Manual validation

## Nested forms validation

## Dynamic form items

## Form validation status

## Visible errors

## Hints

## Related components

- [Button](/components/button/button.doc)

## Props

| Prop name   | Description             | Type   | Values | Default |
| ----------- | ----------------------- | ------ | ------ | ------- |
| title       | Title of the Form       | string | -      |         |
| description | Description of the Form | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
