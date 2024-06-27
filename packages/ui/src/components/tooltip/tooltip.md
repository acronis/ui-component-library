A pop-up that shows additional information when you hover or focus on an element using the keyboard.
The tooltip is text only.
No links, icons or form elements are allowed in the tooltip. Do not confuse tooltip and popover components.
Tooltip is called by hover or focus state, and popover is called by clicking.

:::info Figma component mockups
https://www.figma.com/file/AOtI028uCFzAmnADVCz872/Documentation?node-id=2%3A35
:::

## Basic usage

<TooltipBasic />

::: details Source code
<<< @/demos/tooltip/TooltipBasic.vue
:::

## Placement

::: tip
Use attribute `content` to set the display content when hovered. 
The attribute `placement` determines the position of the tooltip.
Its value is `[orientation]-[alignment]` with four orientations `top`, `left`, `right`, `bottom` and two alignments `start`, `end`, and the default alignment is null. 
Take `placement="left-end"` for example, Tooltip will display on the left of the element which you are hovering and the bottom of the tooltip aligns with the bottom of the element.
:::

<TooltipPlacement />

## Disabled Button

Tooltip uses mouse events as trigger. Disabled button won't emit these events natively.
In order to show a tooltip over a disabled button, we recommend to put the disabled button within a `<div>` or `<span>` and use the container as the trigger of tooltip.
This applies to `Popover` as well.

<TooltipDisabledButton />

## Tooltip width

Width is calculated automatically. But, you can define the maximum size of the width by setting `max-width` property. `max-width` property can be a number (in pixels) or a keyword such as `auto-width`. The default value is the `default` keyword and is approximate 300px

<TooltipWidth />

## Related components

- [Popper](/components/popper/popper.doc)
- [Popover](/components/popover/popover.doc)
