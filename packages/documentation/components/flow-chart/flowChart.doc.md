---
title: Flow Chart component
lang: en-US
editLink: true
---

# Flow Chart

Short description for FlowChart component...

:::info Figma component anatomy
https://www.figma.com/file/
:::

## Basic usage

<FlowChartBasic />

::: details Source code
<<< @/demos/flow-chart/FlowChartBasic.vue
:::

## Best practices

A FlowChart should ...

## Related components

- [Button](/components/button/button.doc)

## Props

| Prop name   | Description                  | Type   | Values | Default |
| ----------- | ---------------------------- | ------ | ------ | ------- |
| title       | Title of the FlowChart       | string | -      |         |
| description | Description of the FlowChart | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
