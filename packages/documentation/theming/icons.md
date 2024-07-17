# Icons

The icons are used to represent actions or objects in the user interface.
They are used in buttons, menus, and other UI elements.

## Usage

We use small common set of icons in Acronis UI Component Library.
They can be redefined via components props, slots or config provider.

In components content areas you can use icons from your custom sets.

```vue
<script setup>
  import { IconChevronDown16 } from '@acronis-platform/icons/dist/acronis/chevron';
</script>

<template>
  <AcvButton>
    <IconChevronDown16 />
    Close button
  </AcvButton>
</template>
```

## Common icons

Internally components can use icons from Acronis and Constructor icon sets.
We provide base set of icons. They can be redefined via components props, slots or config provider.

<IconInternalBasic />

## Acronis collection of icons

<IconAcronis />
