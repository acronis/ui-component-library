# CSS variables

Acronis UI Component Library is using [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
to define colors, typography, spacing, and other design tokens according used theme.

## Naming convention

--acv-_\<**category**\>_-_\<**name**\>_

- _\<**category**\>_ - category of the token (base, color, font, spacing, component name etc.)
- _\<**name**\>_ - name of the token, usually describes the CSS property or the purpose of the token (border, display, color, etc.)

::: tip
[List of CSS variables](#list-of-basic-variables) is available at the bottom of this page.
:::

## Types of CSS variables

### Tokens

These are global values, named objectively, following a strict naming convention.
They are used atomically and can not be overridden later.

```css
:root {
  --acv-size--4px: 4px;
}
```

### UI internal variables

These are values that are used internally in the UI components.
They created for project reusability, can be used in project dictionary, and can be overridden later.

```css
:root {
  --acv-color-primary: var(--acv-color-blue);
  --acv-card-padding: var(--acv-spacing-large);
  --acv-surface: red;

  @media (prefers-color-scheme: dark) {
    --surface: blue;
  }
}
```

### Adaptive variables

These are dynamic css properties, expected to change.

```css
:root {
  --text: var(--acv-color-gray);
}

@media (prefers-color-scheme: dark) {
  :root {
    --text: var(--acv-color-white);
  }
}
```

### Private variables

[Lea Verou calls these pseudo-private custom properties](https://lea.verou.me/2021/10/custom-properties-with-defaults/.

```css
.card {
  --_acv-card-radius: 10px;
}
```

Which makes them like static tokens or internal props, but scoped instead of global.

### Partial props

Parts of a full usable prop. Here, brand color channels as partial props.

```css
:root {
    --h: 200;
    --s: 50%;
    --l: 50%;
}
```

### Mixin props

Basic mixin props are collection of partial props placed on shorthands
(background-image, border, border-image, mask-image, etc).
This makes the partial props like params into a greater "mixin" prop, function thing.

```css
* {
  --input-1: 1px;
  --input-2: var(--acv-color-blue);
  --border-mixin: var(--input-1) solid var(--input-2);
}
```

### Container query props

Could be used as enums for theming, state machines, you name it.

```css
button {
    @container style(--vibe: primary) {
        --_bg: var(--acv-color-indigo);
        --_border: var(--acv-color-indigo-light);
    }

    @container style(--vibe: rad) {
        --_bg: var(--acv-gradient-11);
        border: none;
    }

    @container style(--size: large) {
        font-size: var(--acv-font-size-title);
    }
}
```

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
```
