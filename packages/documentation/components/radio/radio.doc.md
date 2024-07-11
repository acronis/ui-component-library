---
title: Acv Radio component
lang: en-US
editLink: true
---

# Acv Radio

Radio button allows to select one option from a set.
Used in cases where a list of two or more parameters is mutually exclusive,
that is, the user can select only one parameter.
Radio buttons should have one selected option by default.

:::info Figma mockups
https://www.figma.com/design/6nFlVmwDwvGloglQHxyElh/Tokens-test?node-id=0-1
:::

## Basic usage

Use <AcvRadio /> component with <FormLabel /> component to display the label.
Radio button value binds with `v-model` and `value` as the selected value.

<RadioBasic />

::: details Source code
<<< @/demos/radio/RadioBasic.vue
:::

## Without labels

Radio button can be used alone without the <FormLabel /> component.

<RadioSimple />

## Disabled

<RadioDisabled />

## States

<RadioStates />

## Accessibility

Provided `AcvRadio` component must adapt to the list of
[WAI-ARIA button accessibility patterns](https://www.w3.org/WAI/ARIA/apg/patterns/radio/).

### Keyboard interaction

- `Tab` key: Moves focus to the next focusable element.
- `Shift + Tab` keys: Moves focus to the previous focusable element.
- `Space` or `Enter` key: Selects the focused radio button.

### WAIA-ARIA roles, states, and properties

- `role="radiogroup"`: Indicates the radio group role.
- `role="radio"`: Indicates the radio button role.
- `aria-checked`: Indicates the state of the radio button.
- `aria-disabled`: Indicates the disabled state of the radio button.
- `aria-labelledby`: Identifies the element that provides a label for the radio button.
- `aria-describedby`: Identifies the element that provides a description for the radio button.
- `aria-required`: Indicates that the radio button is required for form submission.
- `aria-invalid`: Indicates that the radio button has an error.

## Props

| Prop name  | Description                  | Type                        | Values | Default |
| ---------- | ---------------------------- | --------------------------- | ------ | ------- |
| modelValue | Binding value of the Radio   | string \| number \| boolean | -      |         |
| size       | Radio size                   | ComponentSize               | -      | medium  |
| color      | Custom color of the Radio    | ColorProp                   | -      | primary |
| label      | Label text                   | string                      | -      |         |
| disabled   | Disable radio                | boolean                     | -      |         |
| invalid    | Whether the Radio is invalid | boolean                     | -      |         |

## Events

| Event name        | Properties                                                                                | Description                          |
| ----------------- | ----------------------------------------------------------------------------------------- | ------------------------------------ |
| update:modelValue | **eventName** `string` - The name of the event<br/>**value** `string` - The updated value | Triggered when binding value changes |

## Slots

| Name    | Description              | Bindings |
| ------- | ------------------------ | -------- |
| default | The default slot content |          |
