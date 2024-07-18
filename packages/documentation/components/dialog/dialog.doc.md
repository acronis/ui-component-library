---
title: Dialog component
lang: en-US
editLink: true
---

# Dialog

Informs users while preserving the current page state.

:::info Figma component anatomy
https://www.figma.com/file/AOtI028uCFzAmnADVCz872/Documentation?node-id=2%3A9
:::

## Basic usage

Dialog pops up a dialog box, and it's quite customizable.
Set the `visible` attribute with a `Boolean`, and Dialog shows when it is `true`.
Dialog has two parts: `body` and `footer`, and the latter requires a `slot` named `footer`.
The optional `title` attribute (empty by default) is for defining a title.
Based on design recommendation, the dialog should have minimal sizes: width 512px and height 184px.

<DialogBasic />

::: details Source code
<<< @/demos/dialog/DialogBasic.vue
:::

## Dialog Size

Dialog by default will use `width: 'small'` and `height: 'small'`.
However, both Width and Height can be customized as per below:

### Height

Height is changing by applying `height` prop:

**auto**: The dialog height will auto adjusted based on the boundaries of the viewport.
When the dialog is larger than the viewport, an inner scrollbar will display.

<DialogHeightAuto />

**fit**: The dialog height will auto adjusted based on the content of the dialog.
No scrollbar will be rendered in the dialog, when the dialog is larger than the viewport,
an outer scrollbar will display.

<DialogHeightFit />

**large**: Fix height of 832px will be used for dialog,
when the content of dialog is more than 640px, inner scrollbar will display.
When the dialog is larger than the viewport, dialog will stop at viewport boundaries.

<DialogHeightLarge />

**medium**: Fix height of 640px will be used for dialog,
when the content of dialog is more than 640px, inner scrollbar will display.
When the dialog is larger than the viewport, dialog will stop at viewport boundaries.

<DialogHeightMedium />

**small**: Fix height of 512px will be used for dialog,
when the content of dialog is more than 640px, inner scrollbar will display.
When the dialog is larger than the viewport, dialog will stop at viewport boundaries.

<DialogHeightSmall />

### Width

Four fixed width size can be used for dialog through `width-size` prop:
small (512px) / medium (672px) / large (832px) / x-large (1184px)

<DialogWidthSmall />

## Dialog Content

The content of Dialog can be anything, even a table or a form.
This example shows how to use Acronis UI Component Library Table and Form with Dialog.

<DialogWithTable />

## Clean dialog

Clean dialogs does not contain header and footer.
It is usually used with simple constructions from the text, icons, small lists, with one or a small numbers of possible actions.
Some example usages are: welcome screen, onboarding with pagination or stepper, summary of the properties of a device, etc.

<DialogClean />

## Layout options

You can use any layout components in the main body of the Dialog.
Split content into grid section, aplly custom scrolling areas and more.

:::tip
Use `AcvAside` component for rendering a side panel.
:::

## Before close

Dialog will require a confirm before close
This example demonstrates how `before-close` is used.

## Nested Dialog

You can nest Dialogs and trigger them sequentially, order of placement is important.

:::tip
Normally we do not recommend using nested Dialog.
If you need multiple Dialogs rendered on the page,
you can simply flat them so that they're siblings to each other.
If you want to nest a Dialog inside another Dialog and get proper behaviour of opening and closing dialogs,
put nested dialog into parents body.
If you want independent behaviour of opening and closing dialogs, and trigger events for all dialog at the same time,
just put it anywhere.
:::

<DialogNested />

## Accessibility

Provided `AcvDialog` component must adapt to the list of
[WAI-ARIA accessibility patterns](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).

### Overview

Dialog is a overlaid window that appears over viewport, we use modal dialog pattern.

### Keyboard interaction

- Dialog can contain any number of tabbable elements, that has tabindex grater than zero.
- Initial focus placement - After opening focus must move to element inside dialog
- Tab
  - Moves focus to the next focusable element inside the dialog.
  - Lock focus - If focus is on the last tabbable element inside the dialog, moves focus to the first tabbable element inside the dialog
- Shift + Tab
  - Moves focus to the previous focusable element inside the dialog.
  - Lock focus - If focus is on the first tabbable element inside the dialog, moves focus to the last tabbable element inside the dialog
- Esc
  - Closes the dialog and returns focus to the element that triggered the dialog to open.

### WAI-ARIA roles, states, and properties

- `role="dialog"` - The dialog element has a role of dialog.
- `aria-modal="true"` - The dialog element has aria-modal set to true.
- `aria-labelledby` - The dialog element has aria-labelledby set to the id of the element that contains the dialog title.
- `aria-describedby` - The dialog element has aria-describedby set to the id of the element that contains the dialog description.
- `aria-hidden` - The dialog element has aria-hidden set to true when the dialog is not displayed.

## Props

| Prop name           | Description                                                       | Type                                              | Values | Default |
| ------------------- | ----------------------------------------------------------------- | ------------------------------------------------- | ------ | ------- |
| locale              | Locale object                                                     | object                                            | -      |         |
| width               | Width of Dialog default to wrap content width                     | "small" \| "medium" \| "large" \| "x-large"       | -      | 'small' |
| height              | Height of Dialog default to wrap content height                   | "auto" \| "fit" \| "small" \| "medium" \| "large" | -      | 'small' |
| title               | Title of the Dialog,<br/>can also be passed with the slot         | string                                            | -      |         |
| closable            | Whether the Dialog is closable,<br/>shows close icon on top right | boolean                                           | -      | true    |
| draggable           | Whether the Dialog is draggable                                   | boolean                                           | -      | false   |
| type                | Type of the Dialog                                                | "default" \| "clean"                              | -      |         |
| backdrop            | Whether modal mask is displayed                                   | boolean                                           | -      | true    |
| lockScroll          | Whether scroll is locked                                          | boolean                                           | -      |         |
| closeOnEscape       | Whether to close the Dialog when escape key is pressed            | boolean                                           | -      | true    |
| closeOnClickOutside | Whether to close the Dialog when the mask is clicked              | boolean                                           | -      | true    |

## Events

| Event name        | Properties                                                                                                      | Description                              |
| ----------------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| close             | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed   |
| open              | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is opened   |
| update:modelValue | **eventName** `string` - The name of the event<br/>**value** `string` - The new value of the model              | Triggered when the modelValue is updated |

## Slots

| Name    | Description           | Bindings |
| ------- | --------------------- | -------- |
| title   | Title of the Dialog   |          |
| default | Content of the Dialog |          |
| footer  |                       |          |
