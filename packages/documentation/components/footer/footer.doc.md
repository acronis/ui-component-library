---
title: Footer component
lang: en-US
editLink: true
---

# Footer

Short description for Footer component...

:::info Figma component anatomy
https://www.figma.com/file/
:::

## Basic usage

<FooterBasic />

::: details Source code
<<< @/demos/footer/FooterBasic.vue
:::

## Colors

<el-footer color="brand-lightest">Lightest Footer</el-footer>
<el-footer color="fixed-white">White Footer</el-footer>

## Height

<el-footer color="brand-lightest" height="96px">Footer</el-footer>

## Related components

- [Button](/components/button/button.doc)

## Props

| Prop name | Description                    | Type   | Values                                                                       | Default |
| --------- | ------------------------------ | ------ | ---------------------------------------------------------------------------- | ------- |
| height    | Height of the Footer           | string | -                                                                            | 64px    |
| color     | Background color of the Footer | string | transparent, primary, secondary, success, warning, danger, info, light, dark | 'white' |

## Slots

| Name    | Description                         | Bindings |
| ------- | ----------------------------------- | -------- |
| default | The default slot content            |          |
| aside   | Used to pass a custom aside content |          |
