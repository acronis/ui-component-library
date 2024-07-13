# `useSelection` composable

## Basic

<UseSelectionBasic />

`useSelection` allows you to create `v-model` like binding for a group.

You can use `multi` property to enable selecting multiple values from options.

:::code DemoUseSelectionBasic
<<< @/demos/composables/UseSelectionBasic.vue{6-9}
:::

::::

## Indexed

<UseSelectionIndexed />

You can also create options without predefined value. Pass any positive number to `options` property and it will create index based options.

:::code DemoUseSelectionIndexed
<<< @/demos/composables/UseSelectionIndexed.vue{4}
:::

::::

## Object

<UseSelectionObject />

description

:::code DemoUseSelectionObject
<<< @/demos/composables/UseSelectionObject.vue{4-11}
:::

::::

## Initial Value

<UseSelectionInitialValue />

You can set initial value for selection by passing it to `initialValue` property.

::::code DemoUseSelectionInitialValue
<<< @/demos/composables/UseSelectionInitialValue.vue
::::

:::info
`useSelection` will watch for changes in `initialValue` and update selection.
:::
