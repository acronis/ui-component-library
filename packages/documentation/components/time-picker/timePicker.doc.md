---
title: Time Picker component
lang: en-US
editLink: true
---

# Time Picker

Used to enter time or choose from dropdown list.
Inherits the style and behavior logic from the combobox component.

:::info Figma mockups
https://www.figma.com/file/AOtI028uCFzAmnADVCz872/Documentation?node-id=2%3A34
:::

## Basic usage

<TimePickerBasic />

::: details Source code
<<< @/demos/time-picker/TimePickerBasic.vue
:::

## Best practices

A TimePicker should ...

## Related components

- [Button](/components/button/button.doc)

## Props

| Prop name   | Description                   | Type   | Values | Default |
| ----------- | ----------------------------- | ------ | ------ | ------- |
| title       | Title of the TimePicker       | string | -      |         |
| description | Description of the TimePicker | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
