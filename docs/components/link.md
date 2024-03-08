---
title: Link
lang: en-US
editLink: true
---

# Link

Links are used to embedding actions or pathways to more information in a sentence or used in tables with the possibility to drill-down to the deeper level. In other cases preferable to use ghost buttons.

## Basic usage

<BasicLink />

::: details Source code
<<< ../../examples/components/link/Basic.vue
:::

## Adding click handlers

<ClickHandlersLink />

::: details Source code
<<< ../../examples/components/link/ClickHandlers.vue
:::

<!--- ## Link with path 

If the text content is an invalid windows/mac/linux path, the path would not be hidden, and a warning would appear in the console.
The `link` has to specify the width of the path.

<LinkWithPath />

::: details Source code
<<< ../../examples/components/link/LinkWithPath.vue
:::
-->

## Link Attributes

| Attribute      | Description          | Type      | Accepted Values       | Default  |
| --------- | ----------- | ---- | --------------- | ------- |
| disabled | Whether link is disabled. | boolean    | — | — |

## Slots

| Name | Description |
| ---- | ----------- |
| default | Link content. |

<script setup>
  import BasicLink from 'examples/components/link/Basic.vue';
  import ClickHandlersLink from 'examples/components/link/ClickHandlers.vue';
  import LinkWithPath from 'examples/components/link/LinkWithPath.vue';
</script>
