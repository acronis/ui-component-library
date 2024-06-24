---
title: Highlight
lang: en-US
---

# Highlight

Used to safe highlighting keyword inside passed text.

:::info Figma mockups
https://www.figma.com/file/AOtI028uCFzAmnADVCz872/Documentation?node-id=2%3A26
:::

## Basic usage

<HighlightBasic />

::: details Source code
<<< @/demos/directives/HighlightBasic.vue
:::

:::tip
Please pass pure text node into the slot without any tags.
:::

## Attributes
| Attribute | Description                                   | Type   | Accepted Values | Default |
|-----------|-----------------------------------------------|--------|-----------------|---------|
| keyword   | String for search in inner text, can be empty | string | —               | —       |
