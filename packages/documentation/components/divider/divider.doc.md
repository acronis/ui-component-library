---
title: Divider component
lang: en-US
editLink: true
---

# Divider

Used to group content in horizontal or vertical lists, and also serves as a visual separator between logical blocks within the interface.

:::info Figma mockups
https://www.figma.com/file/AOtI028uCFzAmnADVCz872/Documentation?node-id=13%3A11478
:::

## Basic usage

<DividerBasic />

::: details Source code
<<< @/demos/divider/DividerBasic.vue
:::

## Variants

<DividerVariants />

## On backgrounds

<DividerBackground />

## Props

| Prop name    | Description                         | Type                | Values                                                               | Default |
| ------------ | ----------------------------------- | ------------------- | -------------------------------------------------------------------- | ------- |
| vertical     | Orientation of the Divider          | boolean             | -                                                                    |         |
| textPosition | Position of the text in the Divider | DividerTextPosition | -                                                                    |         |
| margin       | Margin of the Divider               | union               | -                                                                    |         |
| color        | Color of the Divider                | union               | 'brand', 'accent', 'neutral', 'success', 'warning', 'danger', 'info' | 'brand' |

## Slots

| Name    | Description | Bindings |
| ------- | ----------- | -------- |
| default |             |          |
