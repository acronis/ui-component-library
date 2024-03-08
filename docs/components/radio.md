---
title: Radio
lang: en-US
editLink: true
---

# Radio

Used when a group of options is mutually exclusive and only one option can be selected from that group.

## Basic usage

<BasicRadio />

::: details Source code
<<< ../../examples/components/radio/Basic.vue
:::

## Disabled

<DisabledRadio />

::: details Source code
<<< ../../examples/components/radio/Disabled.vue
:::

## Radio Attributes

| Attribute | Description | Type | Accepted Values | Default |
| --------- | ----------- | ---- | --------------- | ------- |
| label | The value of Radio. | string / number / boolean | — | — |
| disabled | Whether Radio is disabled. | boolean | — | false |
| name | Native 'name' attribute. | string | — | — |
| show-hover-hint | Whether to show browser default hint when hover. | boolean | — | false |

## Radio Events

| Event Name | Description | Parameters |
| ---------- | ----------- | ---------- |
| change | Triggers when the bound value changes. | the label value of the chosen radio |

<script setup>
  import BasicRadio from 'examples/components/radio/Basic.vue';
  import DisabledRadio from 'examples/components/radio/Disabled.vue';
</script>
