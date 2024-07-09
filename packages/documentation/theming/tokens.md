# Design system tokens

We use Figma local variables to generate our design system tokens.
You can find the tokens in the `packages/ui/src/styles/tokens` folder.

In source code we provide access to design tokens via css variables.
These variables can be redefined in order to customize the design system.
Sets with css variables are defined in `packages/ui/src/styles/public` directory.
They can be redefined in your project's css file with custom theme.

## CSS Variables Theme

You can use predefined themes with css variables or create your own theme.
All css variables can be redefined.

Here are the main sets of tokens:

- `base` (global), tokens that comes from Figma design system (fonts, typography, dimensions, etc.), used in _theme_ tokens;
- `theme`, tokens from Figma design system that are used to define color schemes, color definitions mostly;
- `component`, top level tokens that create abstract layer for core of Acronis UI Component Library components;
- `palette`, tokens that organize and form the basis of the color system of the library;
- `internal component tokens`, specific component tokens, basis of extension points, must be used in final components css styles.

## List of token types

### Colors

    - base
    - neutral
    - base-100
    - base-200
    - base-300
    - semantic
      - primary
        - focus
        - hover
        - content
      - secondary
      - tertiary
      - accent
    - status
      - danger
      - critical
      - warning
      - success
      - info
      - disabled
    - background
    - text
    - border
    - shadow

### Typography

    - font-size
    - font-weight
    - font-stretch
    - line-height
    - letter-spacing
    - font-family
    - text-transform
    - text-decoration
    - paragraph-spacing
    - heading-spacing
    - caption-spacing
    - paragraph-indent

### Spacing

    - padding
    - margin
    - width
    - height
    - max-height
    - gap
    - inset
    - space

### Sizing

### Screens

    - mobile
    - tablet
    - desktop

### Borders

    - radius
    - width
    - style
    - color

### Opacity

### Box-shadow

### Z-index

### Dimensions (using spacing tokens)

### Animation

CSS variables example:

```css
:root {
    --acv-border-radius-sm: 1px;
    --acv-border-radius-md: 2px;
    --acv-border-radius-lg: 4px;
    --acv-border-radius-circle: 50%;
}
```

## Components extension points

TBD
