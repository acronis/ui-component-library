---
title: Split Button component
lang: en-US
editLink: true
---

# Split Button

Split button is used when there is a list of main or secondary actions.
The split button consists of two sections.
Section with a default action and a section with a drop-down list of actions.
Split button can be either primary or secondary.

:::info Figma mockups
https://www.figma.com/file/AOtI028uCFzAmnADVCz872/Documentation?node-id=2%3A28
:::

## Basic usage

<SplitButtonBasic />

::: details Source code
<<< @/demos/split-button/SplitButtonBasic.vue
:::

## Best practices

A SplitButton should ...

## Related components

- [Button](/components/button/button.doc)

## Props

| Prop name   | Description                    | Type   | Values | Default |
| ----------- | ------------------------------ | ------ | ------ | ------- |
| title       | Title of the SplitButton       | string | -      |         |
| description | Description of the SplitButton | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
