Checkbox is a control that allows to select `binary` state, either checked or unchecked.
Also, it can support `indeterminate` state, which is used to represent a checkbox with a state that is neither checked nor unchecked.
Used in cases where a list of two or more parameters is mutually exclusive,
that is, the user can select only one parameter.

## Basic usage

<CheckboxBasic />

::: details Source code
<<< ../../../examples/demos/checkbox/CheckboxBasic.vue
:::

## Disabled

<CheckboxDisabled />

## Indeterminate

<CheckboxIndeterminate />

## Accessibility

Provided `AcvCheckbox` component must adapt to the list of
[WAI-ARIA accessibility patterns](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/).

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
