---
title: Alert
lang: en-US
editLink: true
---

# Switch

Used to turn an individual option on or off. It is usually used to activate or deactivate a specific setting.

## Basic usage

<BasicSwitch />

::: details Source code
<<< ../../examples/components/switch/Basic.vue
:::

## Disabled

<DisabledSwitch />

::: details Source code
<<< ../../examples/components/switch/Disabled.vue
:::

## Switch sizes

<SwitchSizes />

::: details Source code
<<< ../../examples/components/switch/Sizes.vue
:::

## Attributes

| Attribute       | Description                                     | Type                      | Accepted Values | Default |
|-----------------|-------------------------------------------------|---------------------------|-----------------|---------|
| name            | Input name of Switch.                            | string                    | —               | —       |
| active-value    | Switch value when in `on` state.                 | boolean / string / number | —               | true    |
| inactive-value  | Switch value when in `off` state.                | boolean / string / number | —               | false   |
| disabled        | Whether Switch is disabled.                      | boolean                   | —               | false   |
| reverse         | Swap icon and label.                             | boolean                   | —               | false   |
| show-hover-hint | Whether to show browser default hint when hover. | boolean                   | —               | false   |
| size            | Button size.                                     | string                    | small / ''      | ''      |

## Slots

| Name | Description |
|------|-------------|
| —    | label       |

## Events

| Event Name | Description                 | Parameters           |
|------------|-----------------------------|----------------------|
| change     | Triggers when value changes. | value after changing |

## Methods

| Method | Description                | Parameters |
|--------|----------------------------|------------|
| focus  | Focus the Switch component. | —          |

<script setup>
  import BasicSwitch from 'examples/components/switch/Basic.vue';
  import DisabledSwitch from 'examples/components/switch/Disabled.vue';
  import SwitchSizes from 'examples/components/switch/Sizes.vue';
</script>
