---
title: Button
lang: en-US
editLink: true
---

<script setup>
import ComponentWrapper from "components/markdownPage/ComponentWrapper.vue";
import { Button } from "@/components";
import '../../dist/figma-ds-vue-plugin.css'
</script>

# Button

<ComponentWrapper>
<Button>Default</Button>
<Button secondary> Secondary </Button>
<Button tertiary> Tertiary </Button>
<Button primary destructive> Destructive </Button>
<Button primary disabled> Disabled </Button>

</ComponentWrapper>

### Props

| Prop          | Type      | Default/Notes                                                    |
| :------------ | :-------- | :--------------------------------------------------------------- |
| `@click`      | `Func()`  | Handle event emitted from the component. Ex: `@click={funcName}` |
| `secondary`   | `Boolean` | Default: `false`                                                 |
| `tertiary`    | `Boolean` | Default: `false`                                                 |
| `destructive` | `Boolean` | Default: `false`                                                 |
| `disabled`    | `Boolean` | Default: `false`                                                 |

### Example usage

```html
<template>
  <button @click="apply">Apply</button>
  <button @click="cancel" secondary>Cancel</button>
</template>

<script>
  import { Button } from '@acronis-platform/figma-ds-vue-plugin'

  export default {
    components: {
      Button,
    },
    methods: {
      apply() {
        // do something
      },
      cancel() {
        // do something
      },
    },
  }
</script>
```
