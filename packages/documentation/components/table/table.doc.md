---
title: Table component
lang: en-US
editLink: true
---

# Table

Used to display potentially large amounts of information in a structured manner.
The table has several modes of operation.
The overview mode, when the user is working with the entire table, searches and compares the data; and the actions mode when the user is working with one or more selected table items.
In most cases, for each element of the table, the details mode is available with a detailed display of the properties of the active element.

:::info Figma component anatomy
https://www.figma.com/file/
:::

## Basic usage

<TableBasic />

::: details Source code
<<< @/demos/table/TableBasic.vue
:::

## Empty table

<TableEmpty />

## Skeleton

<TableSkeleton />

## Sizes

<TableSizes />

## Appearance

## Layout

## Slots

## Loading

## Selection

## Sorting

## Grouping rows

## Actions

## Virtual scroll

## Disabled rows

## Expandable rows

## Lazy loading

## Reordering columns

## Table overflow

## Toggle columns

## Accessibility ♿️

Provided `AcvTable` component must adapt to the list of
[WAI-ARIA button accessibility patterns](https://www.w3.org/WAI/ARIA/apg/patterns/table/).

## Props

| Prop name   | Description              | Type   | Values | Default |
| ----------- | ------------------------ | ------ | ------ | ------- |
| title       | Title of the table       | string | -      |         |
| description | Description of the table | string | -      |         |

## Events

| Event name | Properties                                | Description                            |
| ---------- | ----------------------------------------- | -------------------------------------- |
| close      | **payload** `string` - The first argument | Triggered when the component is closed |

## Slots

| Name        | Description | Bindings |
| ----------- | ----------- | -------- |
| default     |             |          |
| description |             |          |
