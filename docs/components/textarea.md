---
title: Textarea
lang: en-US
---

# Textarea

Used to enter values by the user.
The label in the Input default should clearly and briefly describe the information that you need to enter.
In the case of the text area Input default can be multi-line and the height of the input field may depend on the number of text entered.

## Basic usage

<BasicTextarea />

::: details Source code
<<< ../../examples/components/textarea/Basic.vue
:::

### Disabled

<DisabledTextarea />

::: details Source code
<<< ../../examples/components/textarea/Disabled.vue
:::

### Autosize

<AutosizeTextarea />

::: details Source code
<<< ../../examples/components/textarea/Autosize.vue
:::

## Number

Note: input will not be able to store the number precisely if larger/smaller than 9007199254740991 (2^53-1).

<NumberTextarea />

::: details Source code
<<< ../../examples/components/textarea/Number.vue
:::

## Input Attributes

| Attribute             | Description                                                                                                                               | Type             | Accepted Values                  | Default |
|-----------------------|-------------------------------------------------------------------------------------------------------------------------------------------|------------------|----------------------------------|---------|
| auto-complete         | Same as `auto-complete` in native input.                                                                                                   | string           | on/off                           | off     |
| autofocus             | Same as `autofocus` in native input.                                                                                                       | boolean          | —                                | false   |
| autosize              | Whether textarea has an adaptive height, only works when `type` is 'textarea'. Can accept an object, e.g. `{ minRows: _2_, maxRows: _6_ }`.| boolean / object | —                                | true    |
| clearable             | Whether to show clear button.                                                                                                              | boolean          | —                                | false   |
| debounceProcessMask   | Debounce delay when typing in mask input, in milliseconds.                                                                                 | number           | —                                | 0       |
| debounceProcessNumber | Debounce delay when typing in number input, in milliseconds.                                                                               | number           | —                                | 500     |
| disabled              | Whether Input is disabled.                                                                                                                 | boolean          | —                                | false   |
| embedded              | Input without borders.                                                                                                                     | boolean          | —                                | false   |
| form                  | Same as `form` in native input.                                                                                                            | string           | —                                | —       |
| freeze-focus          | Whether to freeze focus on input.                                                                                                          | boolean          | —                                | false   |
| icon-color            | Color class for either prefix/suffix-icon.                                                                                                 | string           | —                                | —       |
| label                 | Label text.                                                                                                                                | string           | —                                | —       |
| mask                  | Masked input. Works only when `type` is `text`.                                                                                            | object           | —                                | {}      |
| max                   | Same as `max` in native input.                                                                                                             | —                | —                                | —       |
| maxlength             | Maximum Input text length.                                                                                                                 | number           | —                                | —       |
| min                   | Same as `min` in native input.                                                                                                             | —                | —                                | —       |
| minlength             | Minimum Input text length.                                                                                                                 | number           | —                                | —       |
| modelValue            | Binding value.                                                                                                                             | string / number  | —                                | —       |
| name                  | Same as `name` in native input.                                                                                                            | string           | —                                | —       |
| on-icon-click         | Callback function when icon is clicked.                                                                                                    | function         | —                                | —       |
| placeholder           | Placeholder of Input.                                                                                                                      | string           | —                                | —       |
| precision             | Set the allowed number of digits after decimal point. Only works when `type` is 'number'.                                                  | number           | integer >= 0                     | —       |
| prefix-icon           | Prefix icon class.                                                                                                                         | string           | —                                | —       |
| prefix-value          | Static prefix for mask.                                                                                                                    | string           | —                                | —       |
| readonly              | Same as `readonly` in native input.                                                                                                        | boolean          | —                                | false   |
| required              | Whether Input is required                                                                                                                 | boolean          | —                                | false   |
| resize                | Control the resizability.                                                                                                                  | string           | none, both, horizontal, vertical | —       |
| rows                  | Number of rows of textarea, only works when `type` is 'textarea'                                                                          | number           | —                                | 2       |
| size                  | Size of Input, works when `type` is not 'textarea'.                                                                                        | string           | default / small                  | default |
| step                  | Same as `step` in native input.                                                                                                            | —                | —                                | —       |
| suffix-icon           | Suffix icon class.                                                                                                                         | string           | —                                | —       |
| type                  | Type of input.                                                                                                                             | string           | text / textarea / number         | text    |

## Input slots

| Name   | Description                                               |
|--------|-----------------------------------------------------------|
| prefix | Content as Input prefix, only works when `type` is 'text'. |
| suffix | Content as Input suffix, only works when `type` is 'text'. |

## Input Events

| Event Name | Description                                      | Parameters               |
|------------|--------------------------------------------------|--------------------------|
| focus      | Triggers when Input focuses.                      | (event: Event)           |
| blur       | Triggers when Input blurs.                        | (event: Event)           |
| change     | Triggers when the icon inside Input value change. | (value: string / number) |
| clear      | Triggers when clear is pressed.                   | -                        |

## Input Methods

| Method     | Description                                                             | Parameters |
|------------|-------------------------------------------------------------------------|------------|
| injectText | Inject specific text where cursor is currently located in the component. | text       |

<script setup>
  import BasicTextarea from 'examples/components/textarea/Basic.vue';
  import DisabledTextarea from 'examples/components/textarea/Disabled.vue';
  import AutosizeTextarea from 'examples/components/textarea/Autosize.vue';
  import NumberTextarea from 'examples/components/textarea/Number.vue';
</script>
