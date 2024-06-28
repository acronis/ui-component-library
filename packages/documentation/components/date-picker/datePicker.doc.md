---
title: Date Picker component
lang: en-US
editLink: true
---

# Date Picker

Allows you to set a date or a range of dates, switch years, months or weeks, select days without a calendar reference.

:::info Figma mockups
https://www.figma.com/file/AOtI028uCFzAmnADVCz872/Documentation?node-id=2%3A8
:::

## Basic usage

<DatePickerBasic />

::: details Source code
<<< @/demos/date-picker/DatePickerBasic.vue
:::

## Best practices

A DatePicker should ...

## Related components

- [Button](/components/button/button.doc)

## Props

| Prop name   | Description                   | Type   | Values | Default |
| ----------- | ----------------------------- | ------ | ------ | ------- |
| title       | Title of the DatePicker       | string | -      |         |
| description | Description of the DatePicker | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
