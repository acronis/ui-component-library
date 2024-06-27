---
title: Aside component
lang: en-US
editLink: true
---

# Aside

Aside is a container component that is used to display content that is not the main focus of the page.
It is often used to display additional information or actions that are related to the main content.

:::info Figma component anatomy
https://www.figma.com/file/
:::

## Basic usage

<AsideBasic />

::: details Source code
<<< @/demos/aside/AsideBasic.vue
:::

## Props

| Prop name | Description                   | Type   | Values                                                                       | Default |
| --------- | ----------------------------- | ------ | ---------------------------------------------------------------------------- | ------- |
| width     | Width of the Aside            | string | -                                                                            |         |
| color     | Background color of the Aside | string | transparent, primary, secondary, success, warning, danger, info, light, dark |         |

## Slots

| Name    | Description | Bindings |
| ------- | ----------- | -------- |
| default |             |          |
