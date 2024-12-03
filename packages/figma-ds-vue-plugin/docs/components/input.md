---
description: ''
sidebar: 'docs'
prev: '/docs/components/icon-button/'
next: '/docs/components/num-input/'
---

# Input

<ComponentWrapper>
 <Input icon="heart" placeholder="Placeholder"/>
</ComponentWrapper>

### Props

| Prop          | Type            | Default/Notes                                                                                                                                                  |
| :------------ | :-------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@input`      | `Func()`        | Handle event emitted from the component, ex: `@input={funcName}`                                                                                               |
| `@change`     | `Func()`        | Handle event emitted from the component, ex: `@change={funcName}`                                                                                              |
| `value`       | `String/Number` | Default: `undefined`                                                                                                                                           |
| `placeholder` | `String`        | Default: `undefined`                                                                                                                                           |
| `border`      | `Boolean`       | Default: `false`; Force border around input field. Border usually appears when element is hovered, active or focused. _A set placeholder also forces a border_ |
| `disabled`    | `Boolean`       | Default: `false`                                                                                                                                               |
| `icon`        | `String`        | _See [Icon](/components/icon#props) component for usage_                                                                                                       |
| `iconText`    | `String`        | _See [Icon](/components/icon#props) component for usage_                                                                                                       |
| `spinning`    | `Boolean`       | _See [Icon](/components/icon#props) component for usage_                                                                                                       |

### Example usage

```html
<template>
  <input icon="heart" placeholder="Placeholder" v-model="inputModel" />
</template>

<script>
  import { Input } from '@acronis-platform/figma-ds-vue-plugin'

  export default {
    data: () => ({
        inputModel: // String || Number
      }),
    components: {
            Input
    }
  }
</script>
```
