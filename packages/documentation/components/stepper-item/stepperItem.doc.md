---
title: Stepper Item component
lang: en-US
editLink: true
---

# Stepper Item

Short description for StepperItem component...

:::info Figma component anatomy
https://www.figma.com/file/
:::

## Basic usage

<StepperItemBasic />

::: details Source code
<<< @/demos/stepper-item/StepperItemBasic.vue
:::

## Best practices

A StepperItem should ...

## Related components

- [Button](/components/button/button.doc)

## Props

| Prop name   | Description                    | Type   | Values | Default |
| ----------- | ------------------------------ | ------ | ------ | ------- |
| title       | Title of the StepperItem       | string | -      |         |
| description | Description of the StepperItem | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
