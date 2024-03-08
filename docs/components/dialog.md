---
title: Dialog
lang: en-US
---

# Dialog

Informs users while preserving the current page state.

## Basic usage

The dialog consists of three parts:

* `title` - Displays the title in the dialog's header. If not specified, the header will not be displayed.
* `body` - Displays the dialog's content.
* `footer` - Displays the footer text and/or actions buttons. If not specified, the footer will not be displayed. Requires a `slot` named `footer`.

Setting the `visible` attribute to true pops up the dialog box.

Based on design recommendation, the dialog should have minimal sizes: width 512px and height 184px.

<DialogBasicExample />

::: details Source code
<<< ../../examples/components/dialog/basic/DialogBasicUsage.vue
<<< ../../examples/components/dialog/basic/DialogWithoutFooter.vue
<<< ../../examples/components/dialog/basic/DialogWithoutHeader.vue
<<< ../../examples/components/dialog/basic/DialogWithMinimalHeight.vue
:::

## Dialog Size

By default, dialog will use `width-size: 'small'` and `height-size: 'auto'`.
However, both width and height can be customized.

### Height

Two types of height is accepted by `height-size` attribute:

* **fixed-auto**: The dialog height will auto adjusted based on the content of the dialog.
No scrollbar will be rendered in the dialog, when the dialog is larger than the viewport,
an outer scrollbar will display.
* **fixed-medium**: Fix height of 640px will be used for dialog,
when the content of dialog is more than 640px, inner scrollbar will display.
When the dialog is larger than the viewport, an outer scrollbar will display.

<DialogSizeHeight />

::: details Source code
<<< ../../examples/components/dialog/height/DialogHeightWrapContent.vue
<<< ../../examples/components/dialog/height/DialogHeightWrapLongContent.vue
<<< ../../examples/components/dialog/height/DialogHeightFixedMedium.vue
:::

### Width

Three fixed width size can be used for dialog through `width-size` attribute:
small (512px) / medium (672px) / large (832px).

<DialogSizeWidth />

::: details Source code
<<< ../../examples/components/dialog/width/DialogWidthSmall.vue
<<< ../../examples/components/dialog/width/DialogWidthMedium.vue
<<< ../../examples/components/dialog/width/DialogWidthLarge.vue
:::

## Dialog Content

The content of dialog can be anything, even a table or a form.

This example shows how to use table and form components with dialog.

## Fullscreen

To open a dialog in full screen, set the `variant` attribute to `fullscreen`.

<DialogFullscreenExample />

::: details Source code
<<< ../../examples/components/dialog/DialogFullscreenExample.vue
:::

## Clean dialog

Clean dialogs don't not contain header and footer.

It is usually used with simple constructions from the text, icons, small lists, with one or a small numbers of possible actions.
Some example usages are: welcome screen, onboarding with pagination or stepper, summary of the properties of a device, etc.

### Size variants

Clean dialogs support all the size variants of basic dialog by using `width-size` and `height-size` props.

### Height

<DialogCleanHeightExample />

::: details Source code
<<< ../../examples/components/dialog/clean/DialogWrapContentHeight.vue
<<< ../../examples/components/dialog/clean/DialogFixedHeight.vue
:::

### Width

<DialogCleanWidthExample />

::: details Source code
<<< ../../examples/components/dialog/clean/DialogSmallWidth.vue
<<< ../../examples/components/dialog/clean/DialogMediumWidth.vue
<<< ../../examples/components/dialog/clean/DialogLargeWidth.vue
:::

### Basic clean dialog

Basic clean dialog is the same as clean dialog, but without preset paddings and fade edges.

<DialogBasicCleanExample />

::: details Source code
<<< ../../examples/components/dialog/DialogBasicCleanExample.vue
:::

## Other layout options

Use `aside` slot for rendering a side panel.

Use `body-header` slot for rendering elements above body scrollbar.

<DialogLayoutExample />

::: details Source code
<<< ../../examples/components/dialog/layout/DialogLayoutAsideWithFooter.vue
<<< ../../examples/components/dialog/layout/DialogLayoutAsideWithoutFooter.vue
<<< ../../examples/components/dialog/layout/DialogLayoutBodyHeader.vue
:::

:::tip
If the variable bound to `visible` is managed in Vuex store, the `.sync` can not work properly. In this case, please remove the `.sync` modifier, listen to `open` and `close` events of dialog, and commit Vuex mutations to update the value of that variable in the event handlers.
:::

## Before close

Dialog will require a confirm before close.

This example demonstrates how `before-close` is used.

<DialogBeforeCloseExample />

::: details Source code
<<< ../../examples/components/dialog/DialogBeforeCloseExample.vue
:::

:::tip
`before-close` only works when user clicks the close icon or the backdrop.
If you have buttons that close the dialog in the `footer` named slot,
you can add what you would do with `before-close` in the buttons' click event handler.
:::

## Nested dialog

If a dialog is nested in another dialog, `append-to-body` is required.

:::tip
Normally we do not recommend using nested dialog.
If you need multiple dialogs rendered on the page,
you can simply flat them so that they're siblings to each other.
If you must nest a dialog inside another dialog, set `append-to-body` of the nested dialog to true,
and it will append to body instead of its parent node, so both dialogs can be correctly rendered.
:::

<DialogNestedExample />

::: details Source code
<<< ../../examples/components/dialog/DialogNestedExample.vue
:::

::: warning
Attribute width-size `x-large` is deprecated.
:::

## Attributes

| Attribute              | Description                                                                                              | Type                                                | Accepted Values                                | Default |
|------------------------|----------------------------------------------------------------------------------------------------------|-----------------------------------------------------|------------------------------------------------|---------|
| variant                | Dialog variant.                                                                                           | string                                              | default / clean / clean-basic / fullscreen     | —       |
| visible                | Visibility of dialog, supports the .sync modifier.                                                        | boolean                                             | —                                              | false   |
| title                  | Title of dialog. Can also be passed with a named slot (see the following table).                          | string                                              | —                                              | —       |
| color                  | Color of the content, excludes aside content.                                                             | string                                              | brand-light / brand-accent / brand-lightest    | -       |
| width-size             | Size of dialog (predefined widths).                                                                       | string                                              | small / medium / large / x-large (deprecated)  | small   |
| height-size            | Size of dialog (predefined heights) default to wrap content height.                                       | string                                              | fixed-auto / fixed-medium / auto               | auto    |
| modal                  | Whether a mask is displayed.                                                                              | boolean                                             | —                                              | true    |
| modal-append-to-body   | Whether to append modal to body element. If false, the modal will be appended to dialog's parent element. | boolean                                             | —                                              | true    |
| append-to-body         | Whether to append dialog itself to body. A nested dialog should have this attribute set to `true`.        | boolean                                             | —                                              | false   |
| lock-scroll            | Whether scroll of body is disabled while dialog is displayed.                                             | boolean                                             | —                                              | true    |
| custom-class           | Custom class names for dialog.                                                                            | string                                              | —                                              | —       |
| close-on-click-modal   | Whether the dialog can be closed by clicking the mask.                                                    | boolean                                             | —                                              | true    |
| close-on-press-escape  | Whether the dialog can be closed by pressing ESC.                                                         | boolean                                             | —                                              | true    |
| show-close             | Whether to show a close button.                                                                           | boolean                                             | —                                              | true    |
| before-close           | Callback before dialog closes, and it will prevent dialog from closing.                                   | callback function，that is used to close the dialog  | —                                              | —       |
| center                 | Whether to align the footer in center.                                                                    | boolean                                             | —                                              | false   |
| position               | Whether to align the dialog at the top or center.                                                         | string                                              | top / center                                   | top     |
| hide-footer-when-empty | Whether to hide footer when it is empty while retaining occupied space.                                   | boolean                                             | —                                              | false   |

## Slots

| Name         | Description                                       |
|--------------|---------------------------------------------------|
| default      | Content of dialog.                                 |
| title        | Content of the dialog title.                       |
| aside        | Content to the left of default content and footer. |
| footer       | Content of the dialog footer.                      |
| footer-aside | Content of the dialog aside footer.                |
| body-header  | Content above dialog body scrollbar.               |
| body-footer  | Content below dialog body scrollbar.               |

## Events

| Event Name | Description                     | Parameters |
|------------|---------------------------------|------------|
| open       | Triggers when the dialog opens.  | —          |
| close      | Triggers when the dialog closes. | —          |

<script setup>
  import DialogBasicExample from 'examples/components/dialog/DialogBasicExample.vue';
  import DialogSizeHeight from 'examples/components/dialog/DialogSizeHeight.vue';
  import DialogSizeWidth from 'examples/components/dialog/DialogSizeWidth.vue';
  import DialogFullscreenExample from 'examples/components/dialog/DialogFullscreenExample.vue';
  import DialogCleanHeightExample from 'examples/components/dialog/DialogCleanHeightExample.vue';
  import DialogCleanWidthExample from 'examples/components/dialog/DialogCleanWidthExample.vue';
  import DialogBasicCleanExample from 'examples/components/dialog/DialogBasicCleanExample.vue';
  import DialogLayoutExample from 'examples/components/dialog/DialogLayoutExample.vue';
  import DialogBeforeCloseExample from 'examples/components/dialog/DialogBeforeCloseExample.vue';
  import DialogNestedExample from 'examples/components/dialog/DialogNestedExample.vue';
  import PreviewGroup from 'examples/components/preview-group.vue';
  import Preview from 'examples/components/preview.vue';
</script>
