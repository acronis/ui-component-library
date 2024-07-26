---
title: ACV Popper component
lang: en-US
editLink: true
---

# ACV Popper

Short description for Popper component...

:::info Floating UI
https://www.floating-ui.com/docs
:::

## Basic usage

<PopperBasic />

::: details Source code
<<< @/demos/popper/PopperBasic.vue
:::

## Props

| Prop name   | Description                                                                                                            | Type                             | Values           | Default        |
| ----------- | ---------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ---------------- | -------------- |
| referenceEl | Reference element for the Popper<br/>By default, it is the parent element or default slot element                      | HTMLElement \| null \| undefined | -                |                |
| modelValue  | Show/Hide Popper base on v-model value                                                                                 | boolean                          | -                | undefined      |
| persist     | Persistence of Popper when clicked outside of reference element                                                        | boolean \| "content"             | -                | false          |
| trigger     | Trigger event to open the Popper                                                                                       | "click" \| "hover"               | 'click', 'hover' | 'click'        |
| delay       | Delay before showing Popper<br/>in milliseconds                                                                        | number                           | -                | 0              |
| hideDelay   | Delay before hiding Popper                                                                                             | number                           | -                | 0              |
| transition  | Transition to add while showing/hiding Popper                                                                          | AcvPopperTransitions             | -                | 'fade'         |
| teleport    | Whether the Popper is teleported                                                                                       | boolean                          | -                | false          |
| disabled    | Whether the Popper is disabled                                                                                         | boolean                          | -                | false          |
| width       | Width of the Popper                                                                                                    | string \| number                 | -                |                |
| placement   | Placement of the Popper<br/>[Floating UI](https://floating-ui.com/docs/computePosition#placement)                      | PopperPlacement                  | -                | 'bottom-start' |
| strategy    | Strategy of the appearance of the Popper                                                                               | "absolute" \| "fixed"            | -                |                |
| middleware  | Whether to use transform for positioning<br/>[Floating UI](https://floating-ui.com/docs/tutorial#middleware)           | Middleware                       | -                |                |
| offset      | Offset of the Popper<br/>[Floating UI](https://floating-ui.com/docs/offset)                                            | number                           | -                | 0              |
| arrow       | Whether to show the arrow                                                                                              | boolean                          | -                | false          |
| flip        | Changes the placement of the floating element to keep it in view.<br/>[Floating UI](https://floating-ui.com/docs/flip) | boolean                          | -                | false          |
| popperClass |                                                                                                                        | string                           | -                |                |

## Events

| Event name        | Properties                                                                                                     | Description                             |
| ----------------- | -------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| update:modelValue | **eventName** `string` - The name of the event<br/>**value** `boolean` - The visibility state of the component | Triggered when the component is toggled |
| hide              | **eventName** `string` - undefined                                                                             | Triggered when the component is hidden  |
| show              | **eventName** `mixed` - undefined                                                                              | Triggered when the component is shown   |

## Slots

| Name    | Description                                         | Bindings |
| ------- | --------------------------------------------------- | -------- |
| default | The default slot content, reference, anchor element |          |
| content | The content slot                                    |          |
| arrow   | Arrow slot content                                  |          |
