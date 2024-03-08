---
title: Button group
lang: en-US
editLink: true
---

# Button group

Button group inherits the behavior of the Checkbox or Radio button and is a form element, not a navigation element. There are two behaviors for Button group. Multiple choice, which is equivalent to selecting multiple Checkbox and single selection, which is equivalent to selecting from several Radio button. In the default state, none of the parameters are selected.

## Checkbox-group

<CheckboxGroup />

::: details Source code
<<< ../../examples/components/button-group/CheckboxGroup.vue
:::

## Radio-group

<RadioGroup />

::: details Source code
<<< ../../examples/components/button-group/RadioGroup.vue
:::

## Checkbox-group Attributes

| Attribute | Description | Type | Options | Default |
| --------- | ----------- | ---- | ------- | ------- |
| disabled | Whether the nesting checkboxes are disabled. | boolean | — | false |
| size | Size of checkbox buttons or bordered checkboxes. | string | small | — |
| min | Minimum number of checkboxes checked. | number | — | — |
| max | Maximum number of checkboxes checked. | number | — | — |

## Checkbox-group Events

| Event Name | Description | Parameters |
| ---------- | ----------- | ---------- |
| change | Triggers when the binding value changes. | the updated value |

## Checkbox-button Attributes

| Attribute | Description | Type | Options | Default |
| --------- | ----------- | ---- | ------- | ------- |
| label | Value of the checkbox when used inside a `checkbox-group`. | string / number / boolean | — | — |
| true-label | Value of the checkbox if it's checked. | string / number | — | — |
| false-label | Value of the checkbox if it's not checked. | string / number | — | — |
| disabled | Whether the checkbox is disabled. | boolean | — | false |
| checked | If the checkbox is checked. | boolean | — | false |
| name | Native 'name' attribute. | string | — | — |
| show-hover-hint | Whether to show browser default hint when hover. | boolean | — | false |

## Radio-group Attributes

| Attribute | Description | Type | Accepted Values | Default |
| --------- | ----------- | ---- | --------------- | ------- |
| disabled | Whether the nesting radios are disabled. | boolean | — | false |
| size | The size of radio buttons or bordered radios. | string | medium / small / mini | — |

## Radio-group Events

| Event Name | Description | Parameters |
| ---------- | ----------- | ---------- |
| change | Triggers when the bound value changes. | the label value of the chosen radio |

## Radio-button Attributes

| Attribute | Description | Type | Accepted Values | Default |
| --------- | ----------- | ---- | --------------- | ------- |
| label | The value of radio. | string / number | — | — |
| disabled | Whether radio is disabled. | boolean | — | false |
| name | Native 'name' attribute. | string | — | — |
| show-hover-hint | Whether to show browser default hint when hover. | boolean | — | false |

<script setup>
  import CheckboxGroup from 'examples/components/button-group/CheckboxGroup.vue';
  import RadioGroup from 'examples/components/button-group/RadioGroup.vue';
</script>
