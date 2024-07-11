---
title: Ribbon component
lang: en-US
editLink: true
---

# Ribbon

Ribbons are used to highlight important information or actions in a page.
It can be used to highlight a new feature, a promotion, a warning, or a call to action.

:::info Figma component anatomy
https://www.figma.com/file/
:::

## Basic usage

<RibbonBasic />

::: details Source code
<<< @/demos/ribbon/RibbonBasic.vue
:::

## Ribbon types

There are 4 types of ribbons: `info`, `warning`, `critical`, and `error`.

<RibbonTypes />

## Without close

Set `hide-close` to hide the close button

<RibbonWithoutClose />

## Related components

- [Alert](/components/alert/alert.doc)

## Props

| Prop name   | Description           | Type                                                      | Values | Default |
| ----------- | --------------------- | --------------------------------------------------------- | ------ | ------- |
| alerts      | List of alerts        | Array                                                     | -      |         |
| variant     |                       | "info" \| "success" \| "warning" \| "critical" \| "error" | -      |         |
| title       | The alert title       | string                                                    | -      |         |
| description | The alert message     | string                                                    | -      |         |
| hideClose   | Hide the close button | boolean                                                   | -      |         |
| closeable   | Show the close button | boolean                                                   | -      |         |

## Events

| Event name | Properties                                                                                   | Description                        |
| ---------- | -------------------------------------------------------------------------------------------- | ---------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**alertIndex** `number` - The alert index | Triggered when the alert is closed |

## Slots

| Name    | Description              | Bindings |
| ------- | ------------------------ | -------- |
| default | The default slot content |          |
