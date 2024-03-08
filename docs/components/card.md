---
title: Card
lang: en-US
editLink: true
---

# Card

Groups information into logical blocks. Any content (text blocks, form elements, buttons, collapses, icons, and illustrations) can be placed inside the card.

## Basic usage

<BasicCard />

::: details Source code
<<< ../../examples/components/card/Basic.vue
:::

## Variants

### Border colors

<BorderVariantCard  />

::: details Source code
<<< ../../examples/components/card/BorderVariant.vue
:::

### Background colors

<BackgroundVariantCard />

::: details Source code
<<< ../../examples/components/card/BackgroundVariant.vue
:::

## Attributes

| Attribute        | Description                      | Type    | Accepted Values                                               | Default     |
|------------------|----------------------------------|---------|---------------------------------------------------------------|-------------|
| body-style       | CSS style of body.                | object  | —                                                             | —           |
| border-color     | Set border-color of card.         | string  | fixed-success / fixed-warning / fixed-critical / fixed-danger | —           |
| background-color | Set background-color of card.     | string  | fixed-white / transparent                                     | fixed-white |
| focus            | Property that makes card focused. | boolean | —                                                             | false       |
| modal            | Property that makes card modal.   | boolean | —                                                             | false       |

<script setup>
  import BasicCard from 'examples/components/card/Basic.vue';
  import BorderVariantCard from 'examples/components/card/BorderVariant.vue';
  import BackgroundVariantCard from 'examples/components/card/BackgroundVariant.vue';
</script>
