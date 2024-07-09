# Icons

The icons are used to represent actions or objects in the user interface.
They are used in buttons, menus, and other UI elements.

## Usage

We use small common set of icons in Acronis UI Component Library.
They can be redefined via components props, slots or config provider.

In components content areas you can use icons from your custom sets.

```vue
<script setup>
  import { CustomIcon } from '@constructor-lab/icons';
</script>

<template>
  <AcvButton>
    <CustomIcon name="close" />
    Close button
  </AcvButton>
</template>
```

## Acronis

<IconsAcronis />

## Constructor

<IconsConstructor />

<script setup>
import IconsAcronis from '../.vitepress/components/IconsAcronis.vue';
import IconsConstructor from '../.vitepress/components/IconsConstructor.vue';
</script>
