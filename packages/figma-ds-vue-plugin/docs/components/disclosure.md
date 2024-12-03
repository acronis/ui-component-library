---
description: ''
sidebar: 'docs'
prev: '/docs/components/checkbox/'
next: '/docs/components/divider/'
---

<script setup>
import { Disclosure, DisclosureItem } from '@/components'
</script>

# Disclosure

<ComponentWrapper>
<Disclosure style="width: 50%">
<DisclosureItem>lol</DisclosureItem>
<DisclosureItem>lol</DisclosureItem>
</Disclosure>
</ComponentWrapper>

### Props for Disclosure parent

| Prop      | Type      | Default/Notes                                                                                                            |
| :-------- | :-------- | :----------------------------------------------------------------------------------------------------------------------- |
| `concede` | `Boolean` | Default: `false`; Prevent wrapper from controlling open/close state and allow multiple items to stay open simultaneously |

### Props for DisclosureItem

| Prop    | Type      | Default/Notes                           |
| :------ | :-------- | :-------------------------------------- |
| `title` | `String`  | Title of disclosure item                |
| `bold`  | `Boolean` | Default: `false`; Bold disclosure title |

### Example usage

```html
<template>
  <Disclosure>
    <DisclosureItem>lol</DisclosureItem>
    <DisclosureItem>lol</DisclosureItem>
  </Disclosure>
</template>

<script>
  import { Disclosure, DisclosureItem } from '@acronis-platform/figma-ds-vue-plugin'

  export default {
    components: {
      Disclosure,
      DisclosureItem,
    },
  }
</script>
```
