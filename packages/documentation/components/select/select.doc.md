Select component is used to select one or more values from a collection of options.
For select, as well as for Input, two modifications are available: default and small.

:::info Figma mockups
https://www.figma.com/file/AOtI028uCFzAmnADVCz872/Documentation?node-id=2%3A27
:::

## Features

    - Input element with a dropdown list of options.
    - Supports both single and multiple selection.
    - Toggle select dropdown visibility when clicking the "trigger" input
    - Update select value when clicking in an option
    - Navigate through options when using keyboard up/down
    - Pressing Enter or Space selects the current hovered option
    - Close the select dropdown when clicking outside of it

## Usage

<<< ../../../demos/src/select/SelectUsage.vue

## Basic usage

Select is a form control component with _v-model_ property to bind the value and _option_ collection.
Labels and values must be setup with the _label_ and _value_ properties of an _option_.
You can also pass a simple array as an option collection.

<SelectBasic />

::: details Source code
<<< ../../../demos/src/select/SelectBasic.vue
:::

## Select With Icon

s with left side icon in the variants of the Select component.

<SelectWithIcon />

::: details
<<< ../../../demos/src/select/SelectWithIcon.vue
:::

## Disabled

When disabled, the select component cannot be focused or changed.

<SelectDisabled />

::: details
<<< ../../../demos/src/select/SelectDisabled.vue
:::

## Max width

`popper-max-width` defines the maximum width of the dropdown popper.
Please note that select's dropdown popper will always has a minimum width equal to the input element.

<SelectMaxWidth />

::: details
<<< ../../../demos/src/select/SelectMaxWidth.vue
:::

## Placement

<SelectPlacement />

::: details
<<< ../../../demos/src/select/SelectPlacement.vue
:::

## Multiple

:::tip
When using v-model with Tree in Multiple Select, `node-key` is needed for correctly setting checked Tree Nodes from select.
:::

<SelectMultiple />

::: details
<<< ../../../demos/src/select/SelectMultiple.vue
:::

## Dynamic Options

The options can be added or removed for the select.

<SelectDynamicOptions />

::: details
<<< ../../../demos/src/select/SelectDynamicOptions.vue
:::

## Tree

<SelectTree />

::: details
<<< ../../../demos/src/select/SelectTree.vue
:::

## Filter

Set the value of `filterable` with true to enable build-in filtering.
Set the value of `clearable` with true to show _clear_ icon to reset select value.

<SelectFilter />

::: details
<<< ../../../demos/src/select/SelectFilter.vue
:::

## Loading state

Set the value of `loading` with true to show loading spinner.

<SelectLoading />

## Virtual scroll

Select supports virtual scroll for large data sets.
Set the value of `virtual-scroll` with true to enable virtual scroll.

## Validation status

Invalid and warning states can be set by using the `state` property with the values of `invalid` and `warning`.

## Server Search

Set the value of `filterable` and `remote` with true to enable remote search, and you should pass the `remote-method` and `remote-search-results-count`(optional).

- `remote-method` is a Function that gets called when the input value changes, and its parameter is the current input value.
- `remote-search-results-count` can be a Number which is total count for the search results, or a String which will directly render for the search results count(empty string for the case of 0 results), do not set any value to hide the result count option.
- Use `loading` to control the loading effect during `remote-method` call.

Search results support pagination by using infinite scroll, you should pass `remote-scroll-method` and `is-scroll-end`.

- `remote-scroll-method` is a Function that gets called when user scroll the dropdown to the end, and its parameter is the current input value.
- `is-scroll-end` can be used to control the whether end of the search result is reached and `remote-scroll-method` will not be called if `is-scroll-end` sets to true.
- Use `scroll-loading` to control the loading effect during `remote-scroll-method` call.

::: info
If `acv-option` is rendered with the v-for directive, you should add the key attribute for `acv-option`. Its value needs to be unique, such as item.value in the following . The `remote-method` need to handle empty query('') case, recommend to preload partial of the data.
:::

<SelectServerSearch />

::: details
<<< ../../../demos/src/select/SelectServerSearch.vue
:::

## Customization

### Custom icon

<SelectCustomIcon />

::: details
<<< ../../../demos/src/select/SelectCustomIcon.vue
:::

### Select customization using slots

<SelectCustomSlots />

::: details
<<< ../../../demos/src/select/SelectCustomSlots.vue
:::

### Option customization using slot

<SelectCustomOptionSlot />

::: details
<<< ../../../demos/src/select/SelectCustomOptionSlot.vue
:::

### Option Group customization using slot

Options can be grouped using nested data structure.
Also them you have to define _optionGroupLabel_ and _optionGroupChildren_.

<SelectCustomOptionGroupSlot />

::: details
<<< ../../../demos/src/select/SelectCustomOptionGroupSlot.vue
:::

### Select and Option customization using slots

Options can be customized using slots. Now we support **placeholder**, **option**, and **option group** slots.

<SelectCustomSelectAndOptionsSlots />

::: details
<<< ../../../demos/src/select/SelectCustomSelectAndOptionsSlots.vue
:::

### Custom text and hint

<SelectCustomTextAndHint />

::: details
<<< ../../../demos/src/select/SelectCustomTextAndHint.vue
:::

## Object or Array as a value

It is also possible to use objects or arrays as item values. Here is used deep object comparing and it is not matter how does current value's keys are sorted.

<SelectObjectArray />

::: details
<<< ../../../demos/src/select/SelectObjectArray.vue
:::

## Select with 100 options

<SelectWith100Options />

::: details
<<< ../../../demos/src/select/SelectWith100Options.vue
:::

## Select with 1000 options

<SelectWith1000Options />

::: details
<<< ../../../demos/src/select/SelectWith1000Options.vue
:::

## Multi line

<SelectMultiline />

::: details
<<< ../../../demos/src/select/SelectMultiline.vue
:::

## Accessibility

### Keyboard navigation

- <kbd>Tab</kbd> - move focus to the next focusable element
- <kbd>Up</kbd> - move active to the previous option
- <kbd>Down</kbd> - move active to the next option
- <kbd>Space</kbd> - select current active option as new value
- <kbd>Enter</kbd> - select current active option as new value

## Related components

- [Button](/components/button/button.doc)
