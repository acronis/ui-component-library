Used as feedback to the user's actions inside the interface.
Notification can contain general information, inform the user of the successful completion of the operation,
display warnings, report errors or display the progress of an operation performed earlier.

## Basic usage

<NotificationBasic />

::: details Source code
<<< ../../../examples/demos/notification/NotificationBasic.vue
:::

## Types

We provide six types: success, warning, error, info and progress.

## Custom position

Notification can emerge from any corner you like.

## Use component

`message` supports component.

## Global method

Acronis UI Component Library has added a global method `$notify` for Vue.prototype. So in a vue instance you can call `Notification` like what we did in this page.
