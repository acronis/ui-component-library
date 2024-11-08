# CSS variables

Acronis UI Component Library is using [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) to define colors, typography, spacing,
and other design tokens according used theme.

## Syntax

--acv-_\<**category**\>_-_\<**name**\>_

- _\<**category**\>_ - category of the token (base, color, font, spacing, component name etc.)
- _\<**name**\>_ - name of the token, usually describes the CSS property or the purpose of the token (border, display, color, etc.)

::: tip
[List of CSS variables](#list-of-basic-variables) is available at the bottom of this page.
:::

## List of UI-syntax 3.0 global styles

Basic variables are used to define the basic design tokens like colors, typography, spacing, etc.

Theme variables are used to define the theme-specific design tokens like colors, spacing, components, etc.

::: code-group
<<< ../../ui/src/styles/reset.css
:::

## List of UI-syntax 3.0 theme styles

::: code-group
<<< ../../ui/src/styles/themes/acronis/acronis.pcss [Acronis theme]
:::

## Shadows

<ShadowTokens />
