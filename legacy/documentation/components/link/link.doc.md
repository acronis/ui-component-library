Links are used to embedding actions or pathways to more information in a sentence or used in tables with the possibility to drill down to the deeper level.

In other cases preferable to use ghost buttons.

## Basic usage

<LinkBasic/>

::: details Source code
<<< ../../../examples/demos/link/LinkBasic.vue
:::

## Adding click handlers

:::info
If there are both href and click handler, it would trigger both.
:::

<LinkHandlers/>

::: details Source code
<<< ../../../examples/demos/link/LinkHandlers.vue
:::

## Link with path

If the text content is an invalid windows/mac/linux path, the path would not be hidden, and a warning would appear in the console.

:::info
The `link` has to specify the width of the path.
:::

<LinkWithPath />

::: details Source code
<<< ../../../examples/demos/link/LinkWithPath.vue
:::

## Disabled link

<LinkDisabled />

::: details Source code
<<< ../../../examples/demos/link/LinkDisabled.vue
:::

## Link with icon

<LinkWithIcon />

::: details Source code
<<< ../../../examples/demos/link/LinkWithIcon.vue
:::

## Accessibility

Provided `AcvLink` component must adapt to the list of
[WAI-ARIA link accessibility patterns](https://www.w3.org/WAI/ARIA/apg/patterns/link/).

### Descriptive Link text

    - write link text so that it describes the content of the link target;
    - avoid using generic text like "click here" or "more" as it is not descriptive;
    - use unique link text for each link on the page;

## Keyboard Interaction

    - `Enter` or `Space` key activates the link;

## Roles and properties

Link text should provide enough information about the target of the link.
