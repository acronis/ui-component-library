---
title: Input
lang: en-US
---

# Input

Accepts the user input.

The label provided in the `input` attribute should clearly and briefly describe the information that the user needs to enter.

In case if input is `textarea`, the input may accept multiple lines and the height of the input field may depend on the amount of entered text.

## Basic usage

<BasicInput />

::: details Source code
<<< ../../examples/components/input/Basic.vue
:::

## Size

<SizeInput />

::: details Source code
<<< ../../examples/components/input/Size.vue
:::

## Disabled

<DisabledInput />

::: details Source code
<<< ../../examples/components/input/Disabled.vue
:::

## With icon

<IconInput/>

**Note**: The date and search icon below are for demo purposes only.

[Click here](../components/date-picker) to see the fully functioning date picker component.

[Click here](../components/search) to see the fully functioning search component.

::: details Source code
<<< ../../examples/components/input/Icon.vue
:::

## With prefix value

<PrefixInput />

::: details Source code
<<< ../../examples/components/input/Prefix.vue
:::

## With mask

<MaskInput />

::: details Source code
<<< ../../examples/components/input/Masking.vue
:::

:::tip
[W3C](https://imask.js.org/guide.html) More information and examples with mask
:::

## Clearable

<ClearableInput />

::: details Source code
<<< ../../examples/components/input/Clearable.vue
:::

## Variable injection

<VariableInjectionInput />

::: details Source code
<<< ../../examples/components/input/VariableInjection.vue
:::

## With slot

<SlotInput />

::: details Source code
<<< ../../examples/components/input/Slot.vue
:::

## Input attributes

| Attribute             | Description                                                                                                                               | Type             | Accepted Values                  | Default |
|-----------------------|-------------------------------------------------------------------------------------------------------------------------------------------|------------------|----------------------------------|---------|
| auto-complete         | Same as `auto-complete` in native input.                                                                                                   | string           | on/off                           | off     |
| autofocus             | Same as `autofocus` in native input.                                                                                                       | boolean          | —                                | false   |
| autosize              | Whether textarea has an adaptive height, only works when `type` is 'textarea'. Can accept an object, e.g. `{ minRows: _2_, maxRows: _6_ }`.  | boolean / object | —                                | true    |
| clearable             | Whether to show clear button.                                                                                                              | boolean          | —                                | false   |
| debounceProcessMask   | Debounce delay when typing in mask input, in milliseconds.                                                                                 | number           | —                                | 0       |
| debounceProcessNumber | Debounce delay when typing in number input, in milliseconds.                                                                               | number           | —                                | 500     |
| disabled              | Whether input is disabled.                                                                                                                 | boolean          | —                                | false   |
| embedded              | Input without borders.                                                                                                                     | boolean          | —                                | false   |
| form                  | Same as `form` in native input.                                                                                                            | string           | —                                | —       |
| freeze-focus          | Whether to freeze focus on input.                                                                                                          | boolean          | —                                | false   |
| icon-color            | Color class for either prefix/suffix-icon.                                                                                                 | string           | —                                | —       |
| label                 | Label text.                                                                                                                                | string           | —                                | —       |
| mask                  | Masked input. Works only when `type` is `text`.                                                                                            | object           | —                                | {}      |
| max                   | Same as `max` in native input.                                                                                                             | —                | —                                | —       |
| maxlength             | Maximum input text length.                                                                                                                 | number           | —                                | —       |
| min                   | Same as `min` in native input.                                                                                                             | —                | —                                | —       |
| minlength             | Minimum input text length.                                                                                                                 | number           | —                                | —       |
| modelValue            | Binding value.                                                                                                                             | string / number  | —                                | —       |
| name                  | Same as `name` in native input.                                                                                                            | string           | —                                | —       |
| on-icon-click         | Callback function when icon is clicked.                                                                                                    | function         | —                                | —       |
| placeholder           | Placeholder of input.                                                                                                                      | string           | —                                | —       |
| precision             | Set the allowed number of digits after decimal point. Only works when `type` is 'number'.                                                  | number           | integer >= 0                     | —       |
| prefix-icon           | Prefix icon class.                                                                                                                         | string           | —                                | —       |
| prefix-value          | Static prefix for mask.                                                                                                                    | string           | —                                | —       |
| readonly              | Same as `readonly` in native input.                                                                                                        | boolean          | —                                | false   |
| required              | Whether input is required.                                                                                                                 | boolean          | —                                | false   |
| resize                | Control the resizability.                                                                                                                  | string           | none, both, horizontal, vertical | —       |
| rows                  | Number of rows of textarea, only works when `type` is 'textarea'.                                                                          | number           | —                                | 2       |
| size                  | Size of input, works when `type` is not 'textarea'.                                                                                        | string           | default / small                  | default |
| step                  | Same as `step` in native input.                                                                                                            | —                | —                                | —       |
| suffix-icon           | Suffix icon class.                                                                                                                         | string           | —                                | —       |
| type                  | Type of input.                                                                                                                             | string           | text / textarea / number         | text    |

## Input slots

| Name   | Description                                               |
|--------|-----------------------------------------------------------|
| prefix | Content as input prefix, only works when `type` is 'text'. |
| suffix | Content as input suffix, only works when `type` is 'text'. |

## Input Events

| Event Name | Description                                      | Parameters               |
|------------|--------------------------------------------------|--------------------------|
| focus      | Triggers when input focuses.                      | (event: Event)           |
| blur       | Triggers when input blurs.                        | (event: Event)           |
| change     | Triggers when the icon inside input value change. | (value: string / number) |
| clear      | Triggers when clear is pressed.                   | -                        |

## Input Methods

| Method     | Description                                                             | Parameters |
|------------|-------------------------------------------------------------------------|------------|
| injectText | Inject specific text where cursor is currently located in the component. | text       |

<script setup>
  import BasicInput from 'examples/components/input/Basic.vue';
  import SizeInput from 'examples/components/input/Size.vue';
  import DisabledInput from 'examples/components/input/Disabled.vue';
  import IconInput from 'examples/components/input/Icon.vue';
  import PrefixInput from 'examples/components/input/Prefix.vue';
  import MaskInput from 'examples/components/input/Masking.vue';
  import ClearableInput from 'examples/components/input/Clearable.vue';
  import VariableInjectionInput from 'examples/components/input/VariableInjection.vue';
  import SlotInput from 'examples/components/input/Slot.vue';
</script>
