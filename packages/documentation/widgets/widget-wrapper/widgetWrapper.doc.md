---
title: ACV Widget Wrapper component
lang: en-US
editLink: true
---

# ACV Widget Wrapper

Provides a consistent look for widgets

## Basic usage

<WidgetWrapperBasic />

::: details Source code
<<< @/demos/widget-wrapper/WidgetWrapperBasic.vue
:::

## Dynamic Positioning

<WidgetWrapperDynamicPositioning />

::: details Source code
<<< @/demos/widget-wrapper/WidgetWrapperDynamicPositioning.vue
:::

## Basic usage

<WidgetWrapperSimple />

## With header and footer

<WidgetWrapperWithHeaderAndFooter />

## Widget Wrapper Attributes

| Attribute  | Description                                 | Type    | Accepted Values | Default |
| ---------- | ------------------------------------------- | ------- | --------------- | ------- |
| min-height | Minimum height of widget wrapper            | string  | —               | '264px' |
| no-padding | Toggle if spacing is present around content | boolean | —               | false   |
| title      | Title of widget                             | string  | —               | —       |
| subtitle   | Subitle of widget                           | string  | —               | —       |

## Slots

| Name         | Description                    |
| ------------ | ------------------------------ |
| header-aside | Content to the right of header |
| footer       | Content of footer              |
| footer-aside | Content to the right of footer |

## Props

| Prop name | Description | Type    | Values | Default |
| --------- | ----------- | ------- | ------ | ------- |
| title     |             | string  | -      | ''      |
| subtitle  |             | string  | -      | ''      |
| minHeight |             | string  | -      | '264px' |
| noPadding |             | boolean | -      | false   |

## Slots

| Name         | Description | Bindings |
| ------------ | ----------- | -------- |
| header-aside |             |          |
| default      |             |          |
| footer       |             |          |
| footer-aside |             |          |
