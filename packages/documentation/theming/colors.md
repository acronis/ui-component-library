# Colors

Colors are the crucial part theming of the Acronis UI Component Library.
Each theme provides a set of colors that are used to style the components.

These colors are divided into basic colors, background colors, text colors and utility colors.

Each theme may provide light and dark color schemes.

If dark color scheme is not provided, the default dark color scheme is used.

```css
/* Example for light and dark color scheme */
html {
  --acv-text-1: var(--acv-color-gray-darkest);
  --text-2: var(--acv-color-gray-dark);

  @container style(--acv-os-dark: true) {
    --text-1: var(--acv-color-gray-lightest);
    --text-2: var(--acv-color-gray-light);
  }
}
```

## Accents

Accent colors are used to highlight interactive elements such as buttons, links, and other interactive elements.

<color name="--acv-color-brand-primary">
  Accent colors used on buttons, links and interactive elements
</color>
<color name="--acv-color-brand-secondary">
  Secondary colors used on non-important interactive elements
</color>
<color name="--acv-color-brand-tertiary"></color>

## Status colors

Status colors are used to focus attention on particular UI elements.

<color name="--acv-color-status-critical-primary"></color>

<color name="--acv-color-status-critical-secondary"></color>

<color name="--acv-color-status-danger-primary">
  Body color for error validation, alerts or toasts
</color>

<color name="--acv-color-status-danger-secondary">
  Status colors for error validation, alerts or toasts
</color>

<color name="--acv-color-status-info-primary"></color>

<color name="--acv-color-status-info-secondary"></color>

<color name="--acv-color-status-neutral-primary"></color>

<color name="--acv-color-status-neutral-secondary"></color>

<color name="--acv-color-status-success-primary">
  Body color for success validation, alerts or toasts
</color>

<color name="--acv-color-status-success-secondary">
   Status color for success validation, alerts or toasts
</color>

<color name="--acv-color-status-warning-primary">
  Body color for warning toasts or alerts
</color>

<color name="--acv-color-status-warning-secondary">
  Status color for warning toasts or alerts
</color>

## Background colors

Background colors are used to define the background of the page, cards, modals, dropdowns, and other elements.

<color name="--acv-color-surface-fixed-primary">
Page background
</color>
<color name="--acv-color-surface-fixed-secondary">
Input, switch, divider background colors
</color>
<color name="--acv-color-surface-inversed-primary"></color>
<color name="--acv-color-surface-inversed-secondary"></color>
<color name="--acv-color-surface-primary"></color>
<color name="--acv-color-surface-secondary">
Card, Modal, Dropdown background
</color>

## Text colors

Text colors are used to define the main and alternative text colors.
Usually correct text color will be applied based on background color.

<color name="--acv-color-text-disabled"></color>
<color name="--acv-color-text-error"></color>
<color name="--acv-color-text-highlight-result"></color>
<color name="--acv-color-text-inversed-primary"></color>
<color name="--acv-color-text-inversed-secondary"></color>
<color name="--acv-color-text-primary"></color>
<color name="--acv-color-text-secondary"></color>
<color name="--acv-color-text-status-critical"></color>
<color name="--acv-color-text-status-danger"></color>
<color name="--acv-color-text-status-info"></color>
<color name="--acv-color-text-status-neutral"></color>
<color name="--acv-color-text-status-success"></color>
<color name="--acv-color-text-status-warning"></color>

## Utility colors

Utility colors are used to define the colors of borders, dividers, shadows, and other elements.

<color name="--acv-color-effect-shadow-primary"></color>

## Component colors

Component colors are used to define the colors of specific components.

### Button colors

#### Danger

<color name="--acv-color-button-danger"></color>
<color name="--acv-color-button-active-danger"></color>
<color name="--acv-color-button-hover-danger"></color>
<color name="--acv-color-button-disabled-danger"></color>

#### Primary

<color name="--acv-color-button-primary"></color>
<color name="--acv-color-button-active-primary"></color>
<color name="--acv-color-button-hover-primary"></color>
<color name="--acv-color-button-disabled"></color>

#### Inversed

<color name="--acv-color-button-inversed"></color>
<color name="--acv-color-button-active-inversed"></color>
<color name="--acv-color-button-hover-inversed"></color>
<color name="--acv-color-button-disabled-inversed"></color>

#### Secondary

<color name="--acv-color-button-secondary"></color>
<color name="--acv-color-button-active-secondary"></color>
<color name="--acv-color-button-hover-secondary"></color>

#### Focus

<color name="--acv-color-button-focus"></color>

### Form colors

<color name="--acv-color-form-active"></color>
<color name="--acv-color-form-disabled-primary"></color>
<color name="--acv-color-form-disabled-secondary"></color>
<color name="--acv-color-form-disabled-tertiary"></color>
<color name="--acv-color-form-disabled-success"></color>
<color name="--acv-color-form-error"></color>
<color name="--acv-color-form-focus"></color>
<color name="--acv-color-form-hover"></color>
<color name="--acv-color-form-primary"></color>
<color name="--acv-color-form-secondary"></color>
<color name="--acv-color-form-success"></color>

### Icon colors

<color name="--acv-color-icon-active"></color>
<color name="--acv-color-icon-active-disabled"></color>
<color name="--acv-color-icon-disabled"></color>
<color name="--acv-color-icon-disabled-inversed"></color>
<color name="--acv-color-icon-inversed-primary"></color>
<color name="--acv-color-icon-inversed-secondary"></color>
<color name="--acv-color-icon-primary"></color>
<color name="--acv-color-icon-status-critical"></color>
<color name="--acv-color-icon-status-danger"></color>
<color name="--acv-color-icon-status-info"></color>
<color name="--acv-color-icon-status-neutral"></color>
<color name="--acv-color-icon-status-success"></color>
<color name="--acv-color-icon-status-warning"></color>

### Link colors

<color name="--acv-color-link-active"></color>
<color name="--acv-color-link-disabled"></color>
<color name="--acv-color-link-disabled-inversed"></color>
<color name="--acv-color-link-hover"></color>
<color name="--acv-color-link-inversed-primary"></color>
<color name="--acv-color-link-inversed-secondary"></color>
<color name="--acv-color-link-primary"></color>
<color name="--acv-color-link-secondary"></color>

### Divider colors

<color name="--acv-color-divider-primary"></color>
<color name="--acv-color-divider-secondary"></color>
<color name="--acv-color-divider-inversed-primary"></color>
<color name="--acv-color-divider-inversed-secondary"></color>

### Nav colors

<color name="--acv-color-nav-active-primary"></color>
<color name="--acv-color-nav-active-secondary"></color>
<color name="--acv-color-nav-focus-primary"></color>
<color name="--acv-color-nav-focus-secondary"></color>
<color name="--acv-color-nav-hover-primary"></color>
<color name="--acv-color-nav-hover-secondary"></color>
<color name="--acv-color-nav-label-primary"></color>
<color name="--acv-color-nav-label-secondary"></color>
<color name="--acv-color-nav-primary"></color>
<color name="--acv-color-nav-secondary"></color>
<color name="--acv-color-scroll-thumb"></color>
<color name="--acv-color-scroll-thumb-inversed"></color>
<color name="--acv-color-status-active"></color>
<color name="--acv-color-status-critical-primary"></color>
<color name="--acv-color-status-critical-secondary"></color>
<color name="--acv-color-status-critical-tertiary"></color>
<color name="--acv-color-status-danger-primary"></color>
<color name="--acv-color-status-danger-secondary"></color>
<color name="--acv-color-status-danger-tertiary"></color>
<color name="--acv-color-status-focus"></color>
<color name="--acv-color-status-hover"></color>
<color name="--acv-color-status-info-primary"></color>
<color name="--acv-color-status-info-secondary"></color>
<color name="--acv-color-status-info-tertiary"></color>
<color name="--acv-color-status-neutral-primary"></color>
<color name="--acv-color-status-neutral-secondary"></color>
<color name="--acv-color-status-neutral-tertiary"></color>
<color name="--acv-color-status-success-primary"></color>
<color name="--acv-color-status-success-secondary"></color>
<color name="--acv-color-status-success-tertiary"></color>
<color name="--acv-color-status-warning-primary"></color>
<color name="--acv-color-status-warning-secondary"></color>
<color name="--acv-color-status-warning-tertiary"></color>
<color name="--acv-color-surface-fixed-primary"></color>
<color name="--acv-color-surface-fixed-secondary"></color>
<color name="--acv-color-surface-inversed-dark-primary"></color>
<color name="--acv-color-surface-inversed-primary"></color>
<color name="--acv-color-surface-inversed-secondary"></color>
<color name="--acv-color-surface-primary"></color>
<color name="--acv-color-surface-secondary"></color>
<color name="--acv-color-text-disabled"></color>
<color name="--acv-color-text-error"></color>
<color name="--acv-color-text-highlight-result"></color>
<color name="--acv-color-text-inversed-primary"></color>
<color name="--acv-color-text-inversed-secondary"></color>
<color name="--acv-color-text-primary"></color>
<color name="--acv-color-text-secondary"></color>
<color name="--acv-color-text-status-critical"></color>
<color name="--acv-color-text-status-danger"></color>
<color name="--acv-color-text-status-info"></color>
<color name="--acv-color-text-status-neutral"></color>
<color name="--acv-color-text-status-success"></color>
<color name="--acv-color-text-status-warning"></color>

## Color palette

<ColorPalette />
