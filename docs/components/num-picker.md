---
title: Password
lang: en-US
editLink: true
---

# Num picker

Behaves like Input, but has controls to increase or decrease the entered value. The user has two options for use, entering the value through the keyboard or changing the value using the buttons.

## Basic usage

Bind a variable to `v-model` in `<el-num-picker>` element.

<NumPicker />

## Integer only

The `integer-only` attribute accepts a `boolean`, and if the value is `true`, the component accepts only integer values(for example, 10,50 etc).

<NumPicker isIntegerOnly/>

## Step Strictly

The `step-strictly` attribute accepts a `boolean`, and if the value is `true`, the component accepts only multiples of step values(for example, 10, 20, 30 etc if step=10).

<NumPicker isStrict/>

## Disabled

The `disabled` attribute accepts a `boolean`, and if the value is `true`, the component is disabled. If you just need to control the value within a range, you can add `min` attribute to set the minimum value and `max` to set the maximum value. By default, the minimum value is `0`.

<NumPicker isDisabled/>

## Infinity

The `infinity` attribute accepts a `boolean`, and if the value is `true`, the component is disabled and an infinity sign is displayed in place of the editor.

<NumPicker isInfinity/>

## Attributes

| Attribute | Description | Type | Accepted Values | Default |
| --------- | ----------- | ---- | --------------- | ------- |
| value | Binding value. | number | — | — |
| min | The minimum allowed value. | number | — | 0 |
| max | The maximum allowed value. | number | — | `Infinity` |
| step | Incremental step. | number | — | 1 |
| prefix | String before value. | string | — | '' |
| suffix | String after value. | string | — | '' |
| disabled| Whether the component is disabled. | boolean | — | false |
| debounce| Debounce delay when typing, in milliseconds. | number | — | 500 |
| name | Same as `name` in native input. | string | — | — |
| label | Label text. | string | — | — |
| integer-only | Whether the component accepts integer only or not. | boolean | — | false |
| step-strictly | Whether the component accepts multiples of step value only or not. | boolean | — | false |
| infinity | Whether infinity sign is shown. | boolean | — |false |

## Events

| Event Name | Description | Parameters |
| ---------- | ----------- | ---------- |
| change | Triggers when the value changes. | value after change |
| focus | Triggers when Input focuses. | (event: Event) |
| blur | Triggers when Input blurs. | (event: Event) |

## Methods

| Method | Description | Parameters |
| ------ | ----------- | ---------- |
| focus | Focus the Input component. | - |

<script setup>
  import NumPicker from 'examples/components/num-picker/Basic.vue';
</script>
