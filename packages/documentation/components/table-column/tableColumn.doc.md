---
title: Table Column component
lang: en-US
editLink: true
---

# Table Column

Short description for TableColumn component...

:::info Figma component anatomy
https://www.figma.com/file/
:::

## Basic usage

<TableColumnBasic />

::: details Source code
<<< @/demos/table-column/TableColumnBasic.vue
:::

## Best practices

A TableColumn should ...

## Related components

- [Button](/components/button/button.doc)

## Props

| Prop name   | Description                    | Type   | Values | Default |
| ----------- | ------------------------------ | ------ | ------ | ------- |
| title       | Title of the TableColumn       | string | -      |         |
| description | Description of the TableColumn | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
