Basic sizes, rules for building and using icons. Work with the terminal and Gulp tasks.
Icons can be outlined or bold, it all depends on the specific case.
But, in most cases, they use outline icons.

:::info Figma mockups
https://www.figma.com/file/YDRlEkpDc1qcapabYuK5ID/Glyphs?node-id=0%3A1
:::

## Usage

TODO: Replace with real-world example from /demos

```vue
<script setup>
  import { AcvIcon } from '@acronis-platform/ui-component-library';
  // or
  import Icon from '@acronis-platform/ui-component-library/dist/components/icon/icon.vue';
</script>

<template>
  <AcvIcon
    name="i-info-circle-o--16"
    color="brand-primary"
  />
  <Icon name="chevron-up" />
</template>
```

## Basic usage

All icons in Acronis UI Component Library will, henceforth, be implemented as SVG icons.

:::tip
The naming convention

- `acv-icon` - the base class for the icon
- `acv-icon--size` - the size of the icon
- `acv-icon--color` - the color of the icon
- `acv-icon--bold` - the bold icon
  :::

<IconBasic />

::: details Source code
<<< @/demos/icons/IconBasic.vue
:::

## Monochrome icons

<IconMonochrome />

## States

<IconStates />

## Disabled

<IconDisabled />

## Sizes

<IconSizes />

## Alignment

<IconAlignment />

## Multicolor icons

<IconMulticolor />

## Tree-shaking

The icons are tree-shakable, so only the icons that are used in the project will be included in the final bundle.

```vue
<script setup>
// Tree-shaking import
import { IconSettings16 } from '@acronis-platform/icons/dist/acronis/settings';
</script>

<template>
  <IconSettings16 />
</template>
```

If your tooling does not support tree-shaking, you can import the icons directly from the package:

```vue
<script setup>
  // Tree-shaking deep import example
  import IconSettings16 from '@acronis-platform/icons/dist/acronis/settings/IconSettings16.vue';
</script>

<template>
  <IconSettings16 />
</template>
```
