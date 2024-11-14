It allows not only to enter a value, but also to choose from a dropdown list of predefined values.
The combo box consists of two parts, a field for entering a value and a button with a dropdown list.
The input field inherits the behavior of the Input component, and a click on the button causes dropdown.
The dropdown list inherits the dropdown behavior logic for the select component.

## Basic usage

<ComboboxBasic />

::: details Source code
<<< ../../../examples/demos/combobox/ComboboxBasic.vue
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

## Accessibility

Provided `AcvCombobox` component must adapt to the list of
[WAI-ARIA accessibility patterns](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/).

## Related components

- [Button](/components/button/button.doc)
