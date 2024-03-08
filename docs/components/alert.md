---
title: Alert
lang: en-US
editLink: true
---

# Alert

Shows a message that requires user's attention and may also prompt for action.

## Basic usage

<BasicAlert />

::: details Source code
<<< ../../examples/components/alert/BasicAlert.vue
:::

## Icons

To show an alert icon, include the `show-icon` attribute.

With the `icon` attribute you can configure which icon will be shown.

<IconsUsage />

::: details Source code
<<< ../../examples/components/alert/IconsUsage.vue
:::

## Border variants

To display the alert borders, the `border` attribute can be used to specify top, bottom or both borders.

<BorderVariant />

::: details Source code
<<< ../../examples/components/alert/BorderVariant.vue
:::

## Card variant

Setting the `card` attribute renders the alert in the card layout.

<CardVariant />

::: details Source code
<<< ../../examples/components/alert/CardVariant.vue
:::

## With title

Besides the required `description` attribute, you can add a `title` attribute to help you describe the alert with more details. Title can only store text string, and it will word wrap automatically.

<WithTitle />

::: details Source code
<<< ../../examples/components/alert/WithTitle.vue
:::

## With action

Use `actions` slot to render actions.

<WithAction />

::: details Source code
<<< ../../examples/components/alert/WithAction.vue
:::

## With actions-right

Use `actions-right` slot to render actions on the right side.

<WithActionRight />

::: details Source code
<<< ../../examples/components/alert/WithActionRight.vue
:::

## With title, description, subtitle and content

Use `content` and `subtitle` as property.

<WithDifferentOptionsTDSC />

::: details Source code
<<< ../../examples/components/alert/WithDifferentOptionsTDSC.vue
:::

## With description, subtitle, content and close button

Use `content` and `subtitle` and `actions` as slots.

<WithDifferentOptionsDSCC />

::: details Source code
<<< ../../examples/components/alert/WithDifferentOptionsDSCC.vue
:::

## With title, description, content and close button

Use `content` and `subtitle` as property.

<WithDifferentOptions />

::: details Source code
<<< ../../examples/components/alert/WithDifferentOptions.vue
:::

## Without close

Set `hide-close` to hide the close button.

<WithoutClose />

::: details Source code
<<< ../../examples/components/alert/WithoutClose.vue
:::

## Transparent background

<WithTransparentBackground />

::: details Source code
<<< ../../examples/components/alert/WithTransparentBackground.vue
:::

## Advanced mode

Setting `advanced` prop renders alert in advanced mode.

<WithAdvancedMode />

::: details Source code
<<< ../../examples/components/alert/WithAdvancedMode.vue
:::

## Custom content

Alert content is fully customizable. Provide the custom content with the default slot.

<WithCustomContent />

::: details Source code
<<< ../../examples/components/alert/WithCustomContent.vue
:::

## Attributes

| Attribute          | Description                                                                 | Type             | Accepted Values                                       | Default |
|--------------------|-----------------------------------------------------------------------------|------------------|-------------------------------------------------------|---------|
| advanced           | Whether to render in advanced mode.                                          | boolean          | —                                                     | false   |
| title              | Alert title. Can also be passed with the slot.                                     | string           | —                                                     | —       |
| border             | Displays top / bottom border. Only works when `card` is set to false.        | boolean / object | —                                                     | {}      |
| card               | Whether to render as a card.                                                 | boolean          | —                                                     | false   |
| description        | Descriptive text. Can also be passed with the default slot.                  | string           | —                                                     | —       |
| type               | Component type.                                                              | string           | info / success / warning / critical / error / unknown | info    |
| show-icon          | If a type icon is displayed.                                                 | boolean          | —                                                     | false   |
| hide-close         | Hide close button.                                                           | boolean          | —                                                     | false   |
| transparent        | Whether to use transparent background color.                                 | boolean          | —                                                     | false   |
| subtitle           | Subtitle. Can also be passed with the slot.                                  | string           | —                                                     | —       |
| content            | A block with a title and an array with texts. Can also be passed with a slot. | object           | —                                                     | —       |
| content-block-type | Content block type.                                                          | string           | success / warning / info / error                      | success |
| icon               | Icon to display.                                                             | string           | —                                                     | —       |

## Slots

| Name          | Description                                |
|---------------|--------------------------------------------|
| default       | Custom content.                             |
| title         | Content of the alert title.                 |
| description   | Content of the alert description.           |
| actions       | Content of the alert actions.               |
| subtitle      | Content of the alert subtitle.              |
| content       | Content of the alert special content block. |
| actions-right | Content of the alert right side actions.    |

## Events

| Event Name | Description                | Parameters |
|------------|----------------------------|------------|
| close      | Fires when alert is closed. | —          |

<script setup>
  import BasicAlert from 'examples/components/alert/BasicAlert.vue';
  import IconsUsage from 'examples/components/alert/IconsUsage.vue';
  import BorderVariant from 'examples/components/alert/BorderVariant.vue';
  import CardVariant from 'examples/components/alert/CardVariant.vue';
  import WithTitle from 'examples/components/alert/WithTitle.vue';
  import WithAction from 'examples/components/alert/WithAction.vue';
  import WithActionRight from 'examples/components/alert/WithActionRight.vue';
  import WithDifferentOptions from 'examples/components/alert/WithDifferentOptions.vue';
  import WithDifferentOptionsTDSC from 'examples/components/alert/WithDifferentOptionsTDSC.vue';
  import WithDifferentOptionsDSCC from 'examples/components/alert/WithDifferentOptionsDSCC.vue';
  import WithoutClose from 'examples/components/alert/WithoutClose.vue';
  import WithTransparentBackground from 'examples/components/alert/WithTransparentBackground.vue';
  import WithAdvancedMode from 'examples/components/alert/WithAdvancedMode.vue';
  import WithCustomContent from 'examples/components/alert/WithCustomContent.vue';
</script>
