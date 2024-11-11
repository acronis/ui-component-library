# Tooltip

You can use the `v-tooltip` directive to add a tooltip to an element.

## Basic usage

<TooltipDirectiveBasic />

::: details Source code
<<< ../../examples/demos/tooltip/TooltipDirectiveBasic.vue
:::

## Placement modifiers

You can specify tooltip placement as a modifier.

<TooltipDirectivePlacement />

## Object notation

You can specify tooltip placement as an object.

In this object, you can put any component props plus the additional options below.

<TooltipDirectiveObjectNotation />

<<< ../../examples/demos/tooltip/TooltipDirectiveObjectNotation.vue

## Async content

The content _option_ accepts a function that returns a promise:

```vue
<button v-tooltip="{
    content: asyncContent,
    loadingContent: 'Loading...'
}"
>
Hover me
</button>
```
