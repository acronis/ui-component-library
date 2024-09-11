---
title: Theming
lang: en
---

# Theming

Acronis UI Component Library is a components library based on Vue 3 that implements [System Design](link to System design).

The theme design aims to provide a set of development specifications to ensure that components developed by different developers have the same styles.

The theme dictates component colors, surface darkness, shadow intensity, ink element opacity, and more.

Themes provide a uniform tone for your app, enabling customization of all design elements to align with your business or brand requirements.

To enhance consistency across apps, you can choose between light and dark theme modes.

The default setting is the light theme mode for components.

## Core of Design

### Color system

To provide a flexible way to customize the theme,
we use the fixed customizable colors to create the theme schemes by passing the source color.

### Nested theme

You can use the nested theme with the `ThemeProvider` component.

All the Acronis UI Component Library components inside the `ThemeProvider` will apply the new theme.

<ThemeProviderNested />

## Color schemes

Color schemes are some presets of themed color combinations that can be used to change the look and feel of Acronis UI Component Library components in application.
The color combinations are specially designed to apply a consistent and aesthetic tone to the application to meet specific needs of customer's brand.
We provide the color values for color schemes in CSS.

```css
/* Default preference */
:root {
    --acv-brand: var(--acv-color-brand-light);

    --acv-text-1: var(--acv-color-text-1-light);
    --acv-text-2: var(--acv-color-text-2-light);

    --acv-surface-1: var(--acv-color-surface-1-light);
    --acv-surface-2: var(--acv-color-surface-2-light);
    --acv-surface-3: var(--acv-color-surface-3-light);
    --acv-surface-4: var(--acv-color-surface-4-light);
}

/* Dark */
@media (prefers-color-scheme: dark) {
    :root {
        --acv-brand: var(--acv-color-brand-dark);

        --acv-text-1: var(--acv-color-text-1-dark);
        --acv-text-2: var(--acv-color-text-2-dark);

        --acv-surface-1: var(--acv-color-surface-1-dark);
        --acv-surface-2: var(--acv-color-surface-2-dark);
        --acv-surface-3: var(--acv-color-surface-3-dark);
        --acv-surface-4: var(--acv-color-surface-4-dark);
    }
}

/* Dim */
@media (prefers-contrast: less) {
    :root {
        --acv-brand: var(--acv-color-brand-dim);

        --acv-text-1: var(--acv-color-text-1-dim);
        --acv-text-2: var(--acv-color-text-2-dim);

        --acv-urface-1: var(--acv-color-surface-1-dim);
        --acv-urface-2: var(--acv-color-surface-2-dim);
        --acv-urface-3: var(--acv-color-surface-3-dim);
        --acv-urface-4: var(--acv-color-surface-4-dim);
    }
}

/* Color scheme */
[color-scheme="constructor"] {
    --acv-brand: var(--acv-color-purple);

    --acv-text-1: var(--acv-color-text-1-purple);
    --acv-text-2: var(--acv-color-text-2-purple);

    --acv-surface-1: var(--acv-color-surface-1-purple);
    --acv-surface-2: var(--acv-color-surface-2-purple);
    --acv-surface-3: var(--acv-color-surface-3-purple);
    --acv-surface-4: var(--acv-color-surface-4-purple);
}
```

```css
html {
  background-color: var(--acv-surface-1);
  color: var(--acv-text-1);
  accent-color: var(--acv-link);
}
```

### Switching color scheme with CSS variables

We use CSS variables by default to support theme switching.

```javascript
// Example of code
```

### Build separate CSS file for each scheme

We only ship one CSS bundle with the CSS variables present.
You can choose to build separate CSS for each scheme.
To achieve this, import the scss colors for each scheme:

```css
/* acronis theme */
@import '@acronis-platform/ui-component-library/dist/styles/acronis.css';
```

:::tip
If you only need one theme, and you would like to **remove the CSS variables**, you can use the same method to achieve it.
Please note that you will need to use the SCSS source code instead of the minimized CSS bundle.
:::

### Available color schemes

- acronis (default)
- constructor
- virtuozzo
- dark, default for dark preferred mode

## Custom CSS variables

You can directly change Acronis UI Component Library style and component variables to further customize the styles.

```css
@import '@acronis-platform/ui-component-library/dist/styles/acronis.css';

:root {
    --acv-color-brand-primary: red;
}
```
