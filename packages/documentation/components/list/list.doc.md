List is a component that displays a group of sequential items.
List items can also be base for content, which can include images, text, and links.
It can be used to display a list of items, such as a list of products, services, or other items.
List can support basic selection, draggability, sorting and other features.

## Basic usage

<ListBasic />

::: details Source code
<<< ../../../examples/demos/list/ListBasic.vue
:::

## Inside a card

<ListInsideCard />

## Card

Set `card` prop to use card variant.

<ListWithCards />

## With sorting

<ListSortable />

## With animation

<ListWithAnimation />

## Variants

<ListVariants />

## Clickable

If you want to make list item clickable (have cursor pointer),
you can pass `value` property other than `undefined`.

## Slots

Use `before` & `after` slot to add custom content before and after list items. There's also `prepend` & `append` slot for list item to append & prepend custom content.

<ListSlots />

## V-model support

`AcvList` also support `v-model`.
Use any value other than `undefined` to enable the `v-model` support.

If you are using `AcvListItem` in default slot of `AcvList` you can use `handleListItemClick` slot prop function to select the item value.
`handleListItemClick` accepts option item as parameter.

<ListVModel />

## Selection

For selection, `AcvList` uses [`useSelection`](/composables/useSelection) composable.
Hence, you can also use the `multi` prop to allow multiple selection.

## Variants

`AcvList` also accepts layer props like `variant`, `color` & `states` to change the appearance of list.

<ListVariants />

## CSS variables

`AcvList` comes with various CSS variables to customize the UI according to your need.
You can check them in this here.

## Related components

- [List Item](/components/list-item/listItem.doc)
