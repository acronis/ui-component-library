---
description: ''
sidebar: 'docs'
prev: '/docs/components/title/'
next: '/docs/components/tooltip/'
---

# Toggle

<ComponentWrapper>
<Toggle> Check me </Toggle>
</ComponentWrapper>

### Props

| Prop       | Type      | Default/Notes                                                    |
| :--------- | :-------- | :--------------------------------------------------------------- |
| `@input`   | `Func()`  | Handle event emitted from the component, ex: `@input={funcName}` |
| `value`    | `Boolean` | Default: `false`                                                 |
| `checked`  | `Boolean` | Default: `undefined`                                             |
| `disabled` | `Boolean` | Default: `false`                                                 |

### Example usage

```html
<template>
  <Toggle v-model="toggleModel">Toggle me</Toggle>
</template>

<script>
  import { Toggle } from '@acronis-platform/figma-ds-vue-plugin'

  export default {
    data: () => ({
        toggleModel: // Boolean
    }),
    components: {
        Toggle
    }
  }
</script>
```
