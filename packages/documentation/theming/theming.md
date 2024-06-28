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

All the UI Kit components inside the `ThemeProvider` will apply the new theme.

<ThemeProviderNested />

## Color schemes

Color schemes are some presets of themed color combinations that can be used to change the look and feel of UI Kit components in application.
The color combinations are specially designed to apply a consistent and aesthetic tone to the application to meet specific needs of customer's brand.
We provide the color values for color schemes in CSS.

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
/* purple.color.css */
@import '@uikit/ui/styles/colors/css/purple';
@import '@/styles/index';
```

:::tip
If you only need one theme, and you would like to **remove the CSS variables**, you can use the same method to achieve it.
Please note that you will need to use the SCSS source code instead of the minimized CSS bundle.
:::

### Available color schemes

- blue (default)
- brown
- dark_gray
- deep_sky
- gray
- green
- light_blue
- light_gray
- orange
- purple
- red
- sand
- yellow

## Custom CSS variables

You can directly change UI Kit style and component variables to further customize the styles.

```css
:root{
  --acv-color-brand-primary: red;
}

@import '@/styles/index.css';
```

## APIs

### createTheme()

```typescript
createTheme: (source?: string, config?: ThemeConfig) => Ref<Theme>
```

Generate the theme based on the source color and configuration. Call it at the **root component** (e.g. `<App />`)

```vue
<script setup lang="ts">
createTheme()
</script>

<template>
  <div>
    <!-- Child components -->
  </div>
</template>
```

**Arguments**

* `source?: string`: The source color used to create theme schemes and palettes.

* `config?: ThemeConfig`: The optional configuration to override the results of dynamic theme.

### styled()

```typescript
styled(comp: Component | string, props?) =>
  ((
    style: TemplateStringsArray | ((theme: Theme) => CSSInterpolation),
    ...args: CSSInterpolation[]
  ) => Component)
```

The styled component function. Return a Vue component with specific props and styles.

**Arguments**

* `comp: Component | string`: A Vue component or html tag (e.g. 'div')

* `props?`: The properties and attributes of the component or html tag

* `style: TemplateStringsArray | ((theme: Theme) => CSSInterpolation)`: The string or call back function to generate CSS
