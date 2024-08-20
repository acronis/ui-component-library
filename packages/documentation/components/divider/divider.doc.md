Used to group content in horizontal or vertical lists,
and also serves as a visual separator between logical blocks within the interface.

:::info Figma mockups
https://www.figma.com/design/6nFlVmwDwvGloglQHxyElh/Syntax-UI-3.0?node-id=123-8541&m=dev
:::

## Basic usage

<DividerBasic />

::: details Source code
<<< ../../../demos/src/divider/DividerBasic.vue
:::

[//]: # '## Colors'
[//]: #
[//]: # 'You can use `color` property to highlight the divider with a specific color.'
[//]: #
[//]: # '<DividerColors />'

## On backgrounds

<DividerBackground />

::: details Source code
<<< ../../../demos/src/divider/DividerBackground.vue
:::

## Accessibility

Separators must be ignored by the screenreader.
To achieve this, use `aria-hidden="true"` attribute.

It must provide `role=separator` that indicates the element is a divider that
separates and distinguishes sections of content or groups of elements.

Optionally, you can provide `aria-orientation` attribute to describe the separator direction.
