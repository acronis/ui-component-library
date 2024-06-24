---
title: Map component
lang: en-US
editLink: true
---

# Map

Google map integration

:::info Figma mockups
https://www.figma.com/file/7JglRd1XDBriTX8E8a6SQw/Cyber-Desktop?node-id=229%3A23514
:::

## Basic usage

<MapBasic />

::: details Source code
<<< @/demos/map/MapBasic.vue
:::

## Best practices

A Map should ...

## Related components

- [Button](/components/button/button.doc)

## Props

| Prop name   | Description            | Type   | Values | Default |
| ----------- | ---------------------- | ------ | ------ | ------- |
| title       | Title of the Map       | string | -      |         |
| description | Description of the Map | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
