---
title: Form
lang: en-US
editLink: true
---

# Form

Groups related input controls that allows users to provide data or configure options.

<!--- ## Basic usage
It includes all kinds of input items, such as `input`, `select`, `radio` and `checkbox`.
These examples demonstrates 4 types of forms with modal `dialog`.
<BasicForm />

## Form validation
Use `rules` for client side validation.
Use `el-form-error` to display server validation errors and `error` prop to manually indicate field error.
Just add the `rules` attribute for `Form` component, pass validation rules, and set `prop` attribute for `Form-Item` as a specific key that needs to be validated.

See more information at [async-validator](https://github.com/yiminghe/async-validator).
<ValidationForm />
-->
## Validation triggers

Use the `trigger` property in `rules` to set the triggering method. You can use `blur`, `change`, `debounce-input` (500ms) or a combination of them separated by whitespace (e.g., `debounce-input blur`). If the `trigger` property is not set, `debounce-input blur` is used by default. Regardless of the trigger value, form validation will always be performed when submitting, so if you only need validation on submit, set `trigger` is set to any other value (for example `submit`). Submitting will clear the last `debounce-input` validation if it's not completed.

<ValidationTrigger />

::: details Source code
<<< ../../examples/components/form/ValidationTrigger.vue
:::

## Custom validation

### Compare passwords

<CustomValidation />

::: details Source code
<<< ../../examples/components/form/CustomValidation.vue
:::

## Validation error variations

<ValidationError />

::: details Source code
<<< ../../examples/components/form/ValidationError.vue
:::

## Multiple error

Try enter invalid email with a length of more than 10 characters.

<MultipleError />

::: details Source code
<<< ../../examples/components/form/MultipleError.vue
:::

## Manual validation

Set validation errors manually.

<ManualError />

::: details Source code
<<< ../../examples/components/form/ManualError.vue
:::

## Nested form item validation

[async-validator](https://github.com/yiminghe/async-validator) rules are supported for nested `form-item` validation.

<NestedForm />

::: details Source code
<<< ../../examples/components/form/NestedForm.vue
:::

## Dynamic form items

<DynamicForm />

The form items can be changed dynamically and you can trigger validation through the `validate` method of the form.

**Note**: Form has implemented watcher for `rules` prop, which will automatically trigger validation when `rules` change.

::: details Source code
<<< ../../examples/components/form/DynamicForm.vue
:::

## Form validation status

Form state is described by statuses:

<ValidationStatus />

::: details Source code
<<< ../../examples/components/form/ValidationStatus.vue
:::

## Always display error

The div containing the error validation by default is always taking up space.
You can set display-error-always as false to make the error validation to only take up space when validation is invalid.
This feature is useful when you want to add a form with validation in a table.

## Form attributes

| Attribute | Description | Type | Accepted Values | Default |
| --------- | ----------- | ---- | --------------- | ------- |
| model | Data of form component. | object | — | — |
| rules | Validation rules of form. | object | — | — |
| inline-message | Whether to display the error message inline with the form item. | boolean | — | true |
| show-message | Whether to show the error message. | boolean | — | true |
| hints | Instruction hints for form items. | object | — | — |

## Form events

| Event Name | Description | Parameters |
|---------- |-------- |---------- |
| status | Event Stream of statuses that describe state of the form. | Object<name: enum[touched, untouched, valid, invalid, dirty, pristine, isValidating, isSubmitting], value: Boolean> |

## Form slots

| Name | Description |
| ---- | ----------- |
| — | Content of form. |

## Form methods

| Method | Description | Parameters |
| ------ | ----------- | ---------- |
| validate | The method to validate the whole form. Returns a promise if callback is omitted. | Function(callback: Function(boolean)) |
| validateField | The method to validate a certain form item. | Function(prop: string, callback: Function(errorMessage: string)) |
| resetFields | Reset all the fields and remove validation result. | — |
| clearValidate | Clear validation message for all fields. | — |
| resetInitialValue | Reset `initialValue` in all fields, after that the property 'dirty' becomes false. | — |

## form-item attributes

| Attribute | Description | Type | Accepted Values | Default |
| --------- | ----------- | ---- | --------------- | ------- |
| prop | A key of `model`. In the use of validate and resetFields method, the attribute is required. | string | keys of model that passed to `form` |
| label | Label. | string | — | — |
| required | Whether the field is required or not, will be determined by validation rules if omitted. | string | — | false |
| rules | Validation rules of form. | object | — | — |
| error | Field error message, set its value and the field will validate error and show this message immediately. | string/array/boolean | — | — |
| inline-message | Inline style validate message, overrides form inline-message. | boolean | — | false |
| show-message  | How to show the error message. | boolean | - | true |
| dynamic  | Mark field as dynamic to validate it in spare mode. | boolean | - | false |
| display-error-always  | Whether the error message would take up space regardless if valid. | boolean | - | true |
| hint | Instruction hint for item field. | string | — | — |

## Form-Item events

| Event Name | Description | Parameters |
|---------- |-------- |---------- |
| status | Event Stream of statuses that describe state of the form-item. | Object<name: enum[touched, untouched, valid, invalid, dirty, pristine, isValidating, isSubmitting], value: Boolean> |

## Form-Item slots

| Name | Description |
| ---- | ----------- |
| — | Content of form Item. |
| label | Content of label. |

## Form-Item methods

| Method | Description | Parameters |
| ------ | ----------- | ---------- |
| resetField | Reset current field and remove validation result. | — |
| resetInitialValue | Reset 'initialValue' field, after that the property 'dirty' becomes false. | — |

## Form-Error attributes

| Attribute | Description | Type | Accepted Values | Default |
| --------- | ----------- | ---- | --------------- | ------- |
| show-icon | Whether icon is visible. | boolean | — | false |
| size | Size of error message. | string | small/large | small |

## Form-Error slots

| Name | Description |
| ---- | ----------- |
| — | Content of form error |

<script setup>
import BasicForm from 'examples/components/form/Basic.vue';
import ValidationForm from 'examples/components/form/Validation.vue';
import ValidationTrigger from 'examples/components/form/ValidationTrigger.vue';
import CustomValidation from 'examples/components/form/CustomValidation.vue';
import ValidationError from 'examples/components/form/ValidationError.vue';
import MultipleError from 'examples/components/form/MultipleError.vue';
import ManualError from 'examples/components/form/ManualError.vue';
import NestedForm from 'examples/components/form/NestedForm.vue';
import DynamicForm from 'examples/components/form/DynamicForm.vue';
import ValidationStatus from 'examples/components/form/ValidationStatus.vue';
</script>
