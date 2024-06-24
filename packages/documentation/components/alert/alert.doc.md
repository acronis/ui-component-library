---
title: Alert component
lang: en-US
editLink: true
---

# Alert

Notifies the user about the status of the system,
from information with the ability to hide alert,
to global errors or limitations within the system or a separate section without the ability to clear the message.

:::info Figma mockups
https://www.figma.com/file/JVXL1xmeaGoj3glTMwoJnl/01-UI-Kits---Syntax-UI?type=design&node-id=212-489&mode=design&t=rStlC7KttZJJBUc1-4
:::

:::info Figma component anatomy
https://www.figma.com/file/LTyCXsL7eUj5fHmMMGcEUj/Components-anatomy?type=design&node-id=2-193&mode=design&t=rStlC7KttZJJBUc1-4
:::

## Basic usage

`Alert` provides four severity levels and sets unique icons and colors.

<AlertBasic />

::: details Source code
<<< @/demos/alert/AlertBasic.vue
:::

## States

<AlertStates />

## Icons

Setting the `icon` attribute allows you to configure the icon to be shown.

<AlertIconsExample />

## Border variants

Setting the `border` attribute accordingly as shown below can be used to selective display top and bottom borders.

<AlertBorderVariantsExample />

## Card variant

Setting the `card` attribute renders the Alert within a card layout

<AlertCardVariantExample />

## With title

Besides the required `title` attribute, you can add a `description` attribute to help you describe the alert with more details. Description can only store text string, and it will word wrap automatically.

<AlertWithTitleExample />

## With action

Use `actions` slot to render actions

<AlertWithActionExample />

## With right slot

Use `right` slot to render actions on the right side

<AlertWithActionsRightExample />

## With Title, description, subtitle and content

Use `content` and `subtitle` as property

<AlertWithTitleDescriptionSubtitleContentExample />

## With description, subtitle, content and close button

Use `content` and `subtitle` and `actions` as slots

<AlertWithDescriptionSubtitleContentCloseExample />

## With title, description, content and close button

Use `content` and `subtitle` as property

<AlertWithTitleDescriptionContentCloseExample />

## Without close

Set `hide-close` to hide the close button

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

## Props

| Prop name   | Description                                                | Type         | Values | Default |
| ----------- | ---------------------------------------------------------- | ------------ | ------ | ------- |
| description | Descriptive text. Can also be passed with the default slot | string       | -      |         |
| showBorder  | Displays border                                            | boolean      | -      |         |
| showClose   | Is close icon visible                                      | boolean      | -      | false   |
| showIcon    | If a variant icon is displayed                             | boolean      | -      |         |
| title       | Title, can also be passed with the slot                    | string       | -      |         |
| subtitle    | Subtitle, can also be passed with the slot                 | string       | -      |         |
| variant     | Alert variant                                              | AlertVariant | -      | 'info'  |

## Events

| Event name | Properties | Description                               |
| ---------- | ---------- | ----------------------------------------- |
| close      |            | Emitted when the close button is clicked. |

## Slots

| Name        | Description                 | Bindings |
| ----------- | --------------------------- | -------- |
| icon        |                             |          |
| title       | Title                       |          |
| description |                             |          |
| default     | Custom content              |          |
| actions     | Content for the actions     |          |
| right       | Content for the right block |          |
