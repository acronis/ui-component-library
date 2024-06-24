---
title: Pagination component
lang: en-US
editLink: true
---

# Pagination

Used in tables to divide a large amount of data into several pages and serves as an alternative to lazy loading.
Pagination inherits style and behavior from the checkbox button group. In addition to pagination, you can display the range of displayed elements on the page, the total number of elements and the split button, with the ability to quickly jump to any of the pages using the dropdown list.

:::info Figma mockups
https://www.figma.com/file/AOtI028uCFzAmnADVCz872/Documentation?node-id=2%3A22
:::

## Basic usage

<PaginationBasic />

::: details Source code
<<< @/demos/pagination/PaginationBasic.vue
:::

## Best practices

A Pagination should ...

## Related components

- [Button](/components/button/button.doc)

## Props

| Prop name   | Description                   | Type   | Values | Default |
| ----------- | ----------------------------- | ------ | ------ | ------- |
| title       | Title of the Pagination       | string | -      |         |
| description | Description of the Pagination | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
