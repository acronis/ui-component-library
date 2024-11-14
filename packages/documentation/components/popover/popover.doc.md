A pop-up element that can contain text, links, form elements, and any other content.
Do not confuse popover and tooltip components.
Popover is called by clicking, and it can contain any content, and tooltip is called by hover or focus state and contains only text.
You can close the popover by clicking on the primary or secondary button, using the Esc key or clicking outside the component.

## Basic usage

<PopoverBasic />

::: tip
Sometimes designer will have style requirement for the trigger element when popover is visible.
It can be easily triggered by show/hide event of Popover.
Please confirm with designer for the style requirement.
:::

::: details Source code
<<< ../../../examples/demos/popover/PopoverBasic.vue
:::

## Placement

:::tip
Replace the `content` attribute with a default `slot`.
:::

<PopoverPlacement />

## Visible on first load

<PopoverVisibleOnFirstLoad />

## Loading

<PopoverLoading />

## Reference

<PopoverReference />

## Trigger

<PopoverTrigger />

## Width

<PopoverWidth />

## Popover with Tooltip

You can use both a popover and a tooltip on the same element.
However, it is advisable to disable the tooltip whenever the popover is opened.
Achieve this by using the element's click event (to disable tooltip) & popover's hide event (to enable tooltip).

<PopoverWithTooltip />

## Popover with Dialog

You can use both a popover and a dialog on the same element.

<PopoverWithDialog />

## Popover with action which change height of it

<PopoverWithAction />

## Related components

- [Tooltip](/components/tooltip/tooltip.doc)
- [Popper](/components/popper/popper.doc)
