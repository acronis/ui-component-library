Used as feedback to the user's actions inside the interface.
Notification can contain general information,
inform the user of the successful completion of the operation,
display warnings, report errors or display the progress of an operation performed earlier.

## Basic usage

<NotificationBasic />

::: details Source code
<<< ../../../examples/demos/notification/NotificationBasic.vue
:::

## Types

We provide six types of notifications: info, success, warning, critical, error and progress.

<NotificationTypes />

## Custom position

Notification can emerge from any corner you like.

:::tip
The `position` attribute defines which corner Notification slides in.
It can be `top-right`, `top-left`, `bottom-right` or `bottom-left`.

Defaults to `top-right`.
:::

<NotificationPosition />

## Use component

`message` supports component.

<NotificationMessageComponent />

## Use notification component

Use `acv-notification` component in markup

<NotificationComponent />

## Notify plugin with composition API

Acronis UI Kit has composable `$notify` that can be used with composition API
and added a global method `$notify` for the options API.

<NotificationTest />

```vue
import {useNotify} from '@acronis-platform/ui-component-library';

const notify = Notify();
let instance = notify.success('You did it!');

// Force dismiss specific toast
instance.dismiss();

// Dismiss all opened toast immediately
notify.clear();
```

## Local import

Import `AcvNotification`:

```javascript
import { AcvNotification } from '@acronis-platform/ui-component-library';
```

In this case you should call `Notification(options)`.
We have also registered methods for different types, e.g. `Notification.success(options)`.

## Global method

Acronis UI Component Library has added a global method `$notify` for VueJs App.
So in a vue instance you can call `Notification` like what we did in this page.
