---
title: Acv Popover component
lang: en-US
editLink: true
---

# Acv Popover

A pop-up element that can contain text, links, form elements, and any other content.
Do not confuse popover and tooltip components.
Popover is called by clicking, and it can contain any content, and tooltip is called by hover or focus state and contains only text.
You can close the popover by clicking on the primary or secondary button, using the Esc key or clicking outside the component.

:::info Figma mockups
https://www.figma.com/design/6nFlVmwDwvGloglQHxyElh/Tokens-test?node-id=612-341&m=dev
:::

## Basic usage

<PopoverBasic />

::: tip
Sometimes designer will have style requirement for the trigger element when popover is visible.
It can be easily triggered by show/hide event of Popover.
Please confirm with designer for the style requirement.
:::

::: details Source code
<<< @/demos/popover/PopoverBasic.vue
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

## Props

| Prop name    | Description                                                                                             | Type                 | Values           | Default        |
| ------------ | ------------------------------------------------------------------------------------------------------- | -------------------- | ---------------- | -------------- |
| popperClass  |                                                                                                         | string               | -                |                |
| flip         | Changes the placement of the floating element to keep it in view.<br/>https://floating-ui.com/docs/flip | boolean              | -                | false          |
| arrow        | Whether to show the arrow                                                                               | boolean              | -                | false          |
| offset       | Offset of the Popper<br/>https://floating-ui.com/docs/offset                                            | number               | -                | 32             |
| middleware   | Whether to use transform for positioning<br/>https://floating-ui.com/docs/tutorial#middleware           | Middleware           | -                |                |
| strategy     | Strategy of the appearance of the Popper                                                                | union                | -                |                |
| placement    | Placement of the Popper<br/>https://floating-ui.com/docs/computePosition#placement                      | PopperPlacement      | -                | 'bottom-start' |
| disabled     | Whether the Popper is disabled                                                                          | boolean              | -                | false          |
| teleport     | Whether the Popper is teleported                                                                        | boolean              | -                | false          |
| transition   | Transition to add while showing/hiding Popper                                                           | AcvPopperTransitions | -                | 'fade'         |
| hideDelay    | Delay before hiding Popper                                                                              | number               | -                | 0              |
| delay        | Delay before showing Popper<br/>in milliseconds                                                         | number               | -                | 0              |
| trigger      | Trigger event to open the Popper                                                                        | union                | 'click', 'hover' | 'click'        |
| persist      | Persistence of Popper when clicked outside of reference element                                         | union                | -                | false          |
| modelValue   | Show/Hide Popper base on v-model value                                                                  | boolean              | -                | undefined      |
| referenceEl  | Reference element for the Popper<br/>By default, it is the parent element or default slot element       | union                | -                |                |
| block        |                                                                                                         | boolean              | -                |                |
| contentClass |                                                                                                         | string               | -                |                |
| loading      | Whether the popover is loading                                                                          | boolean              | -                |                |
| keepAlive    |                                                                                                         | boolean              | -                |                |
| color        |                                                                                                         | string               | -                |                |
| width        | The width of the popover                                                                                | union                | -                | '150'          |

## Events

| Event name        | Properties                                                                                                     | Description                             |
| ----------------- | -------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| update:modelValue | **eventName** `string` - The name of the event<br/>**value** `boolean` - The visibility state of the component | Triggered when the component is toggled |
| hide              | **eventName** `string` - The name of the event                                                                 | Triggered when the component is hidden  |
| show              | **eventName** `string` - The name of the event                                                                 | Triggered when the component is shown   |

## Slots

| Name      | Description                           | Bindings |
| --------- | ------------------------------------- | -------- |
| reference | HTML element with the popover trigger |          |
| default   | The default slot for floating content |          |
| actions   | HTML element with the popover actions |          |
