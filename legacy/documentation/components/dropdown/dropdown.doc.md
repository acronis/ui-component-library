Sets general layout and positioning rules for button, split button, select, date picker and Icon. Maximum dropdown height is determined by the number of values, but not more than 8 visible. If the value is greater than 8, a vertical scroll appears in the dropdown. The minimum height is 128px, except when there are 1 or 2 values in the list. The minimum width is 128px, and the maximum width is determined by the content inside. All values in dropdown are links. Exception - use of dropdown for select, in select values are not links.

## Basic usage

:::tip
A `.is-selected` class will be added to the trigger element in the dropdown default slot when dropdown menu is visible,
to enable trigger element keep the selected state when cursor/focus moved away.
:::

<DropdownBasic />

::: details Source code
<<< ../../../examples/demos/dropdown/DropdownBasic.vue
:::

## Placement

Use the `placement` attribute to set the position of the dropdown. The value is a string with two parts: `orientation` and `alignment`. The orientation can be `top`, `left`, `right`, or `bottom`. The alignment can be `start`, `end`, or `null`. The default alignment is `null`. For example, `placement="left-end"` will display the dropdown to the left of the trigger element, with the bottom of the dropdown aligned with the bottom of the trigger element.

<DropdownPlacement />

## With search

Use the `search` attribute to add a search input to the dropdown. The search input will filter the dropdown items based on the text entered.

<DropdownSearch />

## With Icon

:::tip
`el-dropdown-item` default slot is wrapped under parent with `display:flex`.
Use flex supported styles in the slot.
:::

## Related components

- [Popover](/components/UiPopover/UiPopover.doc)
