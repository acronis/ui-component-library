---
description: ''
sidebar: 'docs'
prev: '/docs/components/label/'
next: '/docs/components/textarea/'
---

# Text

<ComponentWrapper>
<Txt>Lorem Ipsum</Txt>
</ComponentWrapper>

### Props

| Prop      | Type     | Default/Notes                                                             |
| :-------- | :------- | :------------------------------------------------------------------------ |
| `color`   | `String` | Default: `black8`; Pass the name of any color variable to this prop       |
| `size`    | `String` | Default: `xsmall`; Accepts `xsmall`, `small`, `large`, `xlarge`           |
| `weight`  | `String` | Default: `normal` ; Accepts `normal`, `medium`, `bold`                    |
| `inverse` | `String` | Default: `false`; Optimizes letter-spacing for light on dark applications |

### Example usage

```html
<template>
  <Txt>Lorem Ipsum</Txt>
</template>

<script>
  import { Txt } from '@acronis-platform/figma-ds-vue-plugin'

  export default {
    components: {
      Txt,
    },
  }
</script>
```
