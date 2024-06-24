---
title: Combobox component
lang: en-US
editLink: true
---

# Combobox

It allows not only to enter a value, but also to choose from a dropdown list of predefined values.
The combo box consists of two parts, a field for entering a value and a button with a dropdown list.
The input field inherits the behavior of the Input component, and a click on the button causes dropdown.
The dropdown list inherits the dropdown behavior logic for the select component.

:::info Figma component anatomy
https://www.figma.com/file/
:::

## Basic usage

<ComboboxBasic />

::: details Source code
<<< @/demos/combobox/ComboboxBasic.vue
:::

## Disabled

<ComboboxDisabled />

## Types

<ComboboxTypes />

## Sizes

<ComboboxSizes />

## Combobox with search

<ComboboxFilterable />

## With Icon

<ComboboxWithIcon />

## With scrollbar

<ComboboxWithScrollbar />

## Accessibility ♿️

Provided `AcvCombobox` component must adapt to the list of
[WAI-ARIA button accessibility patterns](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/).

## Related components

- [Button](/components/button/button.doc)

## Props

| Prop name   | Description                 | Type   | Values | Default |
| ----------- | --------------------------- | ------ | ------ | ------- |
| title       | Title of the Combobox       | string | -      |         |
| description | Description of the Combobox | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
