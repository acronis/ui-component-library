---
title: ACV Checkbox component
lang: en-US
editLink: true
---

# ACV Checkbox

Checkbox is a control that allows to select `binary` state, either checked or unchecked.
Also it can support `indeterminate` state, which is used to represent a checkbox with a state that is neither checked nor unchecked.
Used in cases where a list of two or more parameters is mutually exclusive,
that is, the user can select only one parameter.

:::info Figma mockups
https://www.figma.com/design/6nFlVmwDwvGloglQHxyElh/Tokens-test?node-id=56-4414
:::

## Basic usage

<CheckboxBasic />

::: details Source code
<<< @/demos/checkbox/CheckboxBasic.vue
:::

## Disabled

<CheckboxDisabled />

## Indeterminate

<CheckboxIndeterminate />

## Accessibility

Provided `AcvCheckbox` component must adapt to the list of
[WAI-ARIA button accessibility patterns](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/).

It should:

- able to navigate to the checkbox using the keyboard;
- clicking or tapping should change the state of the checkbox;
- it should be focusable;
- in multiple checkboxes, it should be clearly distinguishable from other checkboxes;

## Aldo

- [Checkbox](https://www.w3.org/TR/wai-aria-practices-1.1/examples/checkbox/checkbox-1/checkbox-1.html)
- [Checkbox group](https://www.w3.org/TR/wai-aria-practices-1.1/examples/checkbox/checkbox-2/checkbox-2.html)
- [Checkbox role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/checkbox_role)
- [Apple design checkboxes](https://developer.apple.com/design/human-interface-guidelines/macos/buttons/checkboxes/)

## Props

| Prop name           | Description                                          | Type               | Values                                                        | Default   |
| ------------------- | ---------------------------------------------------- | ------------------ | ------------------------------------------------------------- | --------- |
| cycleIndeterminate  | Enable cycling indeterminate state                   | boolean            | -                                                             |           |
| indeterminateValue  | Custom value for indeterminate state of the Checkbox | CheckboxModelValue | -                                                             | null      |
| uncheckedValue      | Value of the Checkbox if it's not checked            | CheckboxModelValue | -                                                             | false     |
| checkedValue        | Value of the Checkbox if it's checked                | CheckboxModelValue | -                                                             | true      |
| modelValue          | Bind v-model value                                   | CheckboxModelValue | -                                                             |           |
| id                  | Title of the Checkbox                                | string             | -                                                             |           |
| label               | Label text inside default slot                       | string             | -                                                             |           |
| disabled            | Whether the Checkbox is disabled                     | boolean            | -                                                             | false     |
| name                | Native `name` attribute                              | string             | -                                                             |           |
| showHint            | Show browser's default title hint                    | boolean            | -                                                             | false     |
| multilineLabel      | Enables multiline label                              | boolean            | -                                                             | false     |
| multilineLabelLimit | Limit the number of lines of the label               | number             | -                                                             |           |
| size                | Size of the Checkbox                                 | ComponentSize      | 'small', 'medium', 'large'                                    | 'medium'  |
| color               | Color of the Checkbox                                | ColorProp          | 'primary', 'secondary', 'success', 'info', 'warning', 'error' | 'primary' |
| invalid             |                                                      | boolean            | -                                                             |           |
| required            |                                                      | boolean            | -                                                             |           |
| iconClass           | Classes for the icon element                         | string             | -                                                             |           |

## Events

| Event name           | Properties                                                                                         | Description                                |
| -------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| update:modelValue    | **eventName** `string` - The name of the event<br/>**value** `any` - The updated value             | Triggered when binding value changes       |
| update:indeterminate | **eventName** `string` - The name of the event<br/>**value** `boolean` - Indeterminate state value | Triggered when indeterminate state changes |

## Slots

| Name    | Description                               | Bindings |
| ------- | ----------------------------------------- | -------- |
| icon    | Slot for checkbox icon                    |          |
| default | Default slot for rendering checkbox label |          |
