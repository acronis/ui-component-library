---
title: Counter component
lang: en-US
editLink: true
---

# Counter

Short description for Counter component...

:::info Figma component anatomy
https://www.figma.com/file/
:::

## Basic usage

<CounterBasic />

::: details Source code
<<< @/demos/counter/CounterBasic.vue
:::

## Best practices

A Counter should ...

## Related components

- [Button](/components/button/button.doc)

## Props

| Prop name | Description | Type             | Values | Default |
| --------- | ----------- | ---------------- | ------ | ------- |
| count     | Count value | string \| number | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name    | Description              | Bindings |
| ------- | ------------------------ | -------- |
| default | The default slot content |          |
