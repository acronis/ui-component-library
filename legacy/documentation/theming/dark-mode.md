# Light/Dark Dual Themes

Acronis UI Component Library supports outputting light/dark dual or multiple themes.
Ui kit's dual themes approach uses CSS variables to store the colors on each token.

## Query-based Dark Mode

```css
@media (prefers-color-scheme: dark) {
  .ui-kit,
  .ui-kit span {
    color: var(--acv-dark-color) !important;
    background-color: var(--acv-dark-bg) !important;
    /* Optional, if you also want font styles */
    font-style: var(--acv-dark-font-style) !important;
    font-weight: var(--acv-dark-font-weight) !important;
    text-decoration: var(--acv-dark-text-decoration) !important;
  }
}
```

# Class-based Dark Mode

```css
html.dark .ui-kit,
html.dark .ui-kit span {
  color: var(--acv-dark-color) !important;
  background-color: var(--acv-dark-bg) !important;
  /* Optional, if you also want font styles */
  font-style: var(--acv-dark-font-style) !important;
  font-weight: var(--acv-dark-font-weight) !important;
  text-decoration: var(--acv-dark-text-decoration) !important;
}
```

# Multiple Themes

It's also possible to support more than two themes.
In the themes object, you can have an arbitrary number of themes,
and specify the default theme with defaultColor option.

```html
<span style="--acv-dark: #d8dee9; --acv-dim: #566575">console</span>
```
