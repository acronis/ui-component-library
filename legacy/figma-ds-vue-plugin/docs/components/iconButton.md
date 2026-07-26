---
description: ''
sidebar: 'docs'
prev: '/docs/components/icon/'
next: '/docs/components/input/'
---

<script>
export default {
    data: () => ({
        iconModel: false
    }),
}
</script>

# Icon Button

<ComponentWrapper>
<IconButton @click="iconModel = !iconModel" :icon="iconModel ? 'heart' : 'heart-fill'"/>
<IconButton iconText="W"/>
</ComponentWrapper>

### Props

| Prop       | Type      | Default/Notes                                                    |
| :--------- | :-------- | :--------------------------------------------------------------- |
| `@click`   | `Func()`  | Handle event emitted from the component, ex: `@click={funcName}` |
| `icon`     | `String`  | _See [Icon](/components/icon#props) component for usage_         |
| `iconText` | `String`  | _See [Icon](/components/icon#props) component for usage_         |
| `selected` | `Boolean` | Default: `false`                                                 |
| `spinning` | `Boolean` | _See [Icon](/components/icon#props) component for usage_         |
| `disabled` | `Boolean` | Default: `false`                                                 |

### Example usage

```html
<template>
  <IconButton @click="iconState = !iconState" :icon="iconState ? 'heart-fill' : 'heart'" />
</template>

<script>
  import { IconButton } from '@acronis-platform/figma-ds-vue-plugin'

  export default {
         data: () => ({
        iconState: // Boolean
      }),
    components: {
            IconButton
    }
  }
</script>
```
