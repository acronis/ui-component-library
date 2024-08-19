---
description: ''
sidebar: 'docs'
prev: '/docs/components/toggle/'
next: '/docs/utils/variables/'
---

# Tooltip

<ComponentWrapper>
<Tooltip position="l" width="100">Lorem Ipsum</Tooltip>
<Tooltip position="tl" width="100">Lorem Ipsum</Tooltip>
<Tooltip position="tc" width="100">Lorem Ipsum</Tooltip>
<Tooltip position="tr" width="100">Lorem Ipsum</Tooltip>
<Tooltip position="r" width="100">Lorem Ipsum</Tooltip>
<Tooltip position="br" width="100">Lorem Ipsum</Tooltip>
<Tooltip position="bc" width="100">Lorem Ipsum</Tooltip>
<Tooltip position="bl" width="100">Lorem Ipsum</Tooltip>
</ComponentWrapper>

::: warning Tooltip overflow

The Figma plugin modal behaves like it has a `overflow: hidden` CSS property,
which means that every tooltip content that extends beyond the modal window, gets cut off.
Set the `position` prop of the tooltip to accommodate for that.

:::

### Props

| Prop       | Type      | Default/Notes                                                                                                                                                                                                     |
| :--------- | :-------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `position` | `String`  | Default: `bottom-center`; Position of the tooltip. Accepts `l`, `left`, `tl`, `top``-left`, `tc`, `top-center`, `tr`, `top-right`, `r`, `right`, `br`, `bottom-right`, `bc`, `bottom-center`, `bl`, `bottom-left` |
| `width`    | `Number`  | Default: `undefined`; Width of tooltip box                                                                                                                                                                        |
| `inverse`  | `Boolean` | Default: `false` ; Inverses the color of the tooltip _icon_ (tooltip content box stays the same)                                                                                                                  |

### Example usage

```html
<template>
  <Tooltip position="bottom-left" width="200">Lorem Ipsum</Tooltip>
</template>

<script>
  import { Tooltip } from '@acronis-platform/figma-ds-vue-plugin'

  export default {
    components: {
      Tooltip,
    },
  }
</script>
```
