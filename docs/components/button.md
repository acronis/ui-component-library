---
title: Button
lang: en-US
editLink: true
---

# Button

Highlights key actions and uniquely tell the user what will happen after the interaction.

## Basic usage

<BasicButton />

::: details Source code
<<< ../../examples/components/button/Basic.vue
:::

## Primary

<PrimaryButton />

::: details Source code
<<< ../../examples/components/button/Primary.vue
:::

## Primary states

<PrimaryStatesButton />

::: details Source code
<<< ../../examples/components/button/PrimaryStates.vue
:::

## Secondary

<SecondaryButton />

::: details Source code
<<< ../../examples/components/button/Secondary.vue
:::

## Secondary states

<SecondaryStatesButton />

::: details Source code
<<< ../../examples/components/button/SecondaryStates.vue
:::

## Ghost

<GhostButton />

::: details Source code
<<< ../../examples/components/button/Ghost.vue
:::

## Ghost states

<GhostStatesButton />

::: details Source code
<<< ../../examples/components/button/GhostStates.vue
:::

## States

<StatesButton />

::: details Source code
<<< ../../examples/components/button/States.vue
:::

## Sizes

<SizesButton />

::: details Source code
<<< ../../examples/components/button/Sizes.vue
:::

## Multiline

<MultilineButton />

::: details Source code
<<< ../../examples/components/button/Multiline.vue
:::

## Custom content using slots

<CustomContentButton />

::: details Source code
<<< ../../examples/components/button/CustomContent.vue
:::

## Attributes

| Attribute       | Description                                               | Type    | Accepted values                                                      | Default |
| --------------- | --------------------------------------------------------- | ------- | -------------------------------------------------------------------- | ------- |
| type            | Button type.                                               | string  | primary / secondary / success / danger / ghost / promo / translucent | primary |
| native-type     | Same as native button's `type`.                            | string  | button / submit / reset                                              | button  |
| size            | Button size.                                               | string  | small / large / ''                                                   | ''      |
| height          | Height for fluid variant.                                  | string  | 32 / 48                                                              | 32      |
| icon            | Icon name.                                                 | string  | —                                                                    | —       |
| autofocus       | Same as native button's `autofocus`.                       | boolean | —                                                                    | false   |
| disabled        | Disable the button.                                        | boolean | —                                                                    | false   |
| loading         | Determine whether it's loading.                            | boolean | —                                                                    | false   |
| fluid           | Determine whether it's may take all free width.            | boolean | —                                                                    | false   |
| inverse         | Inverse button colors.                                     | boolean | —                                                                    | false   |
| show-hover-hint | Whether to show browser default hint when hover.           | boolean | —                                                                    | false   |
| right-icon      | To determine if icon is on left or right for ghost button. | boolean | —                                                                    | false   |

## Slots

| Slot name | Description                                                   |
| --------- | ------------------------------------------------------------- |
| default   | Default slot to render the contents to show inside the button. |

<script setup>
  import BasicButton from 'examples/components/button/Basic.vue';
  import PrimaryButton from 'examples/components/button/Primary.vue';
  import PrimaryStatesButton from 'examples/components/button/PrimaryStates.vue';
  import SecondaryButton from 'examples/components/button/Secondary.vue';
  import SecondaryStatesButton from 'examples/components/button/SecondaryStates.vue';
  import GhostButton from 'examples/components/button/Ghost.vue';
  import GhostStatesButton from 'examples/components/button/GhostStates.vue';
  import StatesButton from 'examples/components/button/States.vue';
  import SizesButton from 'examples/components/button/Sizes.vue';
  import MultilineButton from 'examples/components/button/Multiline.vue';
  import CustomContentButton from 'examples/components/button/CustomContent.vue';
</script>
