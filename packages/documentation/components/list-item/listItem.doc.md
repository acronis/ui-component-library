---
title: ACV List Item component
lang: en-US
editLink: true
---

# ACV List Item

Short description for ListItem component...

:::info Figma component anatomy
https://www.figma.com/file/
:::

## Basic usage

<ListItemBasic />

::: details Source code
<<< @/demos/list-item/ListItemBasic.vue
:::

## Best practices

A ListItem should ...

## Related components

- [Button](/components/button/button.doc)

## Props

| Prop name | Description                        | Type      | Values | Default |
| --------- | ---------------------------------- | --------- | ------ | ------- |
| data      | List item data                     | object    | -      |         |
| draggable | Whether the list item is draggable | boolean   | -      |         |
| closable  | Whether the list item is closable  | boolean   | -      |         |
| title     | List item title                    | string    | -      |         |
| subtitle  | List item subtitle                 | string    | -      |         |
| color     |                                    | ColorProp | -      |         |
| disabled  |                                    | boolean   | -      |         |
| icon      |                                    | IconProp  | -      |         |

## Events

| Event name   | Properties                                                                                                      | Description                            |
| ------------ | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| change-order | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Fires when order of item is changed    |
| close        | **eventName** `string` - 'close'                                                                                | Triggered when the list item is closed |

## Slots

| Name    | Description                            | Bindings |
| ------- | -------------------------------------- | -------- |
| default | Content of the list item               |          |
| right   | Content of the right side of list item |          |
| left    | Content of the left side of list item  |          |
