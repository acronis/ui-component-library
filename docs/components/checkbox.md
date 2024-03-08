---
title: Checkbox
lang: en-US
editLink: true
---

# Checkbox

Lets the user to select zero or more options out of the limited number of choices.

## Basic usage

<BasicCheckbox />

::: details Source code
<<< ../../examples/components/checkbox/Basic.vue
:::

## Disabled

<DisabledCheckbox />

::: details Source code
<<< ../../examples/components/checkbox/Disabled.vue
:::

## Checkbox attributes

| Attribute              | Description                                                               | Type                      | Options | Default |
|------------------------|---------------------------------------------------------------------------|---------------------------|---------|---------|
| label                  | Value of the Checkbox when used inside a `checkbox-group`.                 | string / number / boolean | —       | —       |
| true-label             | Value of the Checkbox if it's checked.                                     | string / number           | —       | —       |
| false-label            | Value of the Checkbox if it's not checked.                                 | string / number           | —       | —       |
| indeterminate          | Same as `indeterminate` in native checkbox.                                | boolean                   | —       | false   |
| disabled               | Whether the Checkbox is disabled.                                          | boolean                   | —       | false   |
| checked                | If the Checkbox is checked.                                                | boolean                   | —       | false   |
| name                   | Native 'name' attribute.                                                   | string                    | —       | —       |
| show-hover-hint        | Whether to show browser default hint when hover.                           | boolean                   | —       | false   |
| multiline-label        | Enables multiline display of label.                                        | boolean                   | —       | false   |
| multiline-label-limit  | Limits the number of lines of the label when `multiline-label` is `true`. | number                    | 2, 3    | —       |

## Checkbox Events

| Event Name | Description                             | Parameters        |
|------------|-----------------------------------------|-------------------|
| change     | Triggers when the binding value changes. | the updated value |

<script setup>
  import BasicCheckbox from 'examples/components/checkbox/Basic.vue';
  import DisabledCheckbox from 'examples/components/checkbox/Disabled.vue';
</script>
