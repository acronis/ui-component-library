## Features

- Notifies the user about the status of the system;
- Can be closable, not available to hide alert automatically;
- Severity of alert message can be set with _color_ property;

## Basic usage

`Alert` provides four severity levels and sets unique icons and colors.

<AlertBasic />

::: details Source code
<<< ../../../examples/demos/alert/AlertBasic.vue
:::

## States

<AlertStates />

## Icons

Setting the `icon` attribute allows you to configure the icon to be shown.

<AlertIcons />

## Border variants

Setting the `border` attribute accordingly as shown below can be used to selective display top and bottom borders.

<AlertBorderVariants />

## Card variant

Setting the `card` attribute renders the Alert within a card layout

<AlertCardVariant />

## With title

Besides the required `title` attribute, you can add a `description` attribute to help you describe the alert with more details. Description can only store text string, and it will word wrap automatically.

<AlertWithTitle />

## With action

Use `actions` slot to render actions

<AlertWithAction />

## With right slot

Use `right` slot to render actions on the right side

<AlertWithActionsRight />

## With Title, description, subtitle and content

Use `content` and `subtitle` as property

<AlertWithTitleDescriptionSubtitleContent />

## With description, subtitle, content and close button

Use `content` and `subtitle` and `actions` as slots

<AlertWithDescriptionSubtitleContentClose />

## With title, description, content and close button

Use `content` and `subtitle` as property

<AlertWithTitleDescriptionContentClose />

## Without close

Set `show-close`=_false_ to hide the **close** button

## Transparent background

<AlertTransparentBackgroundExample />

## Advanced mode

Setting `advanced` prop renders Alert in advanced mode.

<AlertAdvancedModeExample />

## Custom content

Alert content is fully customizable. Provide the custom content with the default slot.

<AlertCustomContentExample />

## Accessibility

`AcvAlert` component must adapt to the list of
[WAI-ARIA alert accessibility patterns](https://www.w3.org/WAI/ARIA/apg/patterns/alert/).

### Overview

Alert is a component that provides feedback messages to the user.

Usually alerts provide important and time-sensitive information without interfering ability of user to interact.

### WAI-ARIA attributes

- `role="alert"`: to indicate that the element contains an alert message.
