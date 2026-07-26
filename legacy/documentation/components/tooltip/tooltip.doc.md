Tooltip is a popup that displays additional information related to an element
when you hover or focus on an element using the keyboard.
It typically appears after small delay and disappears when mouse out.
The tooltip is text only.
No links, icons or form elements are allowed in the tooltip.
Do not confuse tooltip and popover components.
Tooltips do not receive focus, and they are not keyboard accessible.
Tooltip is called by hover state, and popover is called by clicking.

## Basic usage

<TooltipBasic />

::: details Source code
<<< ../../../examples/demos/tooltip/TooltipBasic.vue
:::

## Placement

::: tip
Use attribute `content` to set the display content when hovered.
The attribute `placement` determines the position of the tooltip.
Its value is `[orientation]-[alignment]` with four orientations `top`, `left`, `right`, `bottom`
and two alignments `start`, `end`, and the default alignment is null.
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

## Accessibility

Provided `AcvTooltip` component must adapt to the list of
[WAI-ARIA accessibility patterns](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/).

## Interaction

- on hover over the element to show the tooltip
- on blur or mouse out, the tooltip will hide
- `Escape` key to hide the tooltip

### WAI-ARIA roles

- tooltip has role `tooltip`
- tooltip trigger has `aria-describedby` attribute that references the element with the tooltip content

## Related components

- [Popper](/components/popper/popper.doc)
- [Popover](/components/popover/popover.doc)
