---
title: Checkbox Group component
lang: en-US
editLink: true
---

# Checkbox Group

CheckboxGroup component is a wrapper for multiple checkboxes.
It is used to group checkboxes together.

:::info Figma mockups
https://www.figma.com/design/6nFlVmwDwvGloglQHxyElh/Tokens-test?node-id=56-4414
:::

## Basic usage

<CheckboxGroupBasic />

::: details Source code
<<< @/demos/checkbox-group/CheckboxGroupBasic.vue
:::

## Best practices

A CheckboxGroup should ...

## Related components

- [Button](/components/button/button.doc)

## Props

| Prop name   | Description                      | Type   | Values | Default |
| ----------- | -------------------------------- | ------ | ------ | ------- |
| title       | Title of the CheckboxGroup       | string | -      |         |
| description | Description of the CheckboxGroup | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
