Switch is a component used to toggle between two states, such as on and off.
It is a visual representation of a checkbox that allows the user to switch between two states.

- It used for actions that occur immediately after the user switches the toggle switch to one of the positions.
- Switch has two basic states - On / Off.
- Like checkboxes, a switch also has several states: focused, disabled, hover and active.

## Basic usage

Bind `v-model` to a `Boolean` typed variable.

<SwitchBasic />

::: details Source code
<<< ../../../examples/demos/switch/SwitchBasic.vue
:::

## Label

You can add a label to the switch component using the `label` prop.

<SwitchLabel />

:::tip
You can also use default slot to render the label.
:::

## Array

You can use an array to bind multiple switches to a single variable.

<SwitchArray />

::: details Source code
<<< ../../../examples/demos/switch/SwitchArray.vue
:::

## Sizes

You can switch between different sizes using the `size` prop.

<SwitchSizes />

## See also

- [Checkbox](/components/checkbox/checkbox.doc)
- [Radio](/components/radio/radio.doc)
- [Open UI Switch](https://open-ui.org/components/switch/)
- [WAI-ARIA Switch pattern](https://www.w3.org/WAI/ARIA/apg/patterns/switch/)
