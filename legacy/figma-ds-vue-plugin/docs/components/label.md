---
description: ''
sidebar: 'docs'
prev: '/docs/components/select-menu/'
next: '/docs/components/text/'
---

# Label

<ComponentWrapper>
<Label style="width: auto">Lorem ipsum</Label>
</ComponentWrapper>

### Example usage

```html
<template>
  <label>Box title</label>
  <input v-model="inputModel" placeholder="Text" />
</template>

<script>
  import { Label, Input } from '@acronis-platform/figma-ds-vue-plugin'

  export default {
      data: () => ({
        inputModel: // String || Number
      }),
    components: {
            Label,
          Input
    }
  }
</script>
```
