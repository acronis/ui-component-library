---
title: ACV Popover component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# ACV Popover

<!--@include: ./popover.doc.md-->

## Props

| Prop name    | Description                                                                                                            | Type                             | Values           | Default        |
| ------------ | ---------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ---------------- | -------------- |
| popperClass  |                                                                                                                        | string                           | -                |                |
| flip         | Changes the placement of the floating element to keep it in view.<br/>[Floating UI](https://floating-ui.com/docs/flip) | boolean                          | -                | false          |
| arrow        | Whether to show the arrow                                                                                              | boolean                          | -                | false          |
| offset       | Offset of the Popper<br/>[Floating UI](https://floating-ui.com/docs/offset)                                            | number                           | -                | 32             |
| middleware   | Whether to use transform for positioning<br/>[Floating UI](https://floating-ui.com/docs/tutorial#middleware)           | Middleware                       | -                |                |
| strategy     | Strategy of the appearance of the Popper                                                                               | "absolute" \| "fixed"            | -                |                |
| placement    | Placement of the Popper<br/>[Floating UI](https://floating-ui.com/docs/computePosition#placement)                      | PopperPlacement                  | -                | 'bottom-start' |
| disabled     | Whether the Popper is disabled                                                                                         | boolean                          | -                | false          |
| teleport     | Whether the Popper is teleported                                                                                       | boolean                          | -                | false          |
| transition   | Transition to add while showing/hiding Popper                                                                          | AcvPopperTransitions             | -                | 'fade'         |
| hideDelay    | Delay before hiding Popper                                                                                             | number                           | -                | 0              |
| delay        | Delay before showing Popper<br/>in milliseconds                                                                        | number                           | -                | 0              |
| trigger      | Trigger event to open the Popper                                                                                       | "click" \| "hover"               | 'click', 'hover' | 'click'        |
| persist      | Persistence of Popper when clicked outside of reference element                                                        | boolean \| "content"             | -                | false          |
| modelValue   | Show/Hide Popper base on v-model value                                                                                 | boolean                          | -                | undefined      |
| referenceEl  | Reference element for the Popper<br/>By default, it is the parent element or default slot element                      | HTMLElement \| null \| undefined | -                |                |
| block        |                                                                                                                        | boolean                          | -                |                |
| contentClass |                                                                                                                        | string                           | -                |                |
| loading      | Whether the popover is loading                                                                                         | boolean                          | -                |                |
| keepAlive    |                                                                                                                        | boolean                          | -                |                |
| color        |                                                                                                                        | string                           | -                |                |
| width        | The width of the popover                                                                                               | number \| string                 | -                | '150'          |

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
