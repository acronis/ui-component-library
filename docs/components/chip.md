---
title: Chip
lang: en-US
editLink: true
---

# Chip

Compact elements that represent an input, attribute, or action.

## Basic usage

<Basic />

::: details Source code
<<< ../../examples/components/chip/Basic.vue
:::

### Multiline

<Multiline />

::: details Source code
<<< ../../examples/components/chip/Multiline.vue
:::

## Attributes

| Attribute        | Description                                     | Type    | Accepted Values | Default |
|------------------|-------------------------------------------------|---------|-----------------|---------|
| icon             | Icon name.                                       | string  | —               | —       |
| show-close       | Whether to show a close button.                  | boolean | —               | true    |
| show-hover-hint  | Whether to show browser default hint when hover. | boolean | —               | false   |

## Events

| Event Name | Description                           | Parameters |
|------------|---------------------------------------|------------|
| click      | Triggers when close button is clicked. | —          |

<script setup>
  import Basic from 'examples/components/chip/Basic.vue';
  import Multiline from 'examples/components/chip/Multiline.vue';
</script>
