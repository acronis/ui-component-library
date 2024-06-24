# Design system tokens

We use Figma to generate our design system tokens. 
You can find the tokens in the `packages/ui/src/styles/tokens` folder.

In source code we provide access to design tokens via css variables.
These variables can be redefined in order to customize the design system.
Css variables are defined in `packages/ui/src/styles/variables.css` file.
They can be redefined in your project's css file with custom theme.

## CSS Variables Theme

You can use predefined themes with css variables or create your own theme.
All css variables can be redefined:
- base (global) tokens that comes from Figma design system (color-palettes, brand colors, typography, etc.)
- top level tokens that create abstract layer for core of UI Kit components ();
- component tokens that are used in UI Kit components.
- theme tokens, specific for each theme that used in default and dark color schemes.

## List of token types

### Colors

- palette
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
    - warning
    - success
    - info
        - info-content
    - disabled
    - error
- base
- background
- text
- border
- shadow

### Typography

- font-size
  - base
- font-weight
    - thin
    - extra-light
    - light
    - regular
    - medium
    - semi-bold
    - bold
    - extra-bold
    - black
- font-stretch
    - default
    - italic
    - condensed
    - compressed
- line-height
- letter-spacing
- font-family
    - sans
    - serif
    - mono
- text-transform
    - button-text-case
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
    
### sizing
### screens
    - mobile
    - tablet
    - desktop
### borders
    - radius
        - rounded-box
        - rounded-circle
        - rounded-button
        - rounded-badge
    - width
        - button
        - tab
    - style
    - color
### opacity
### box-shadow
### z-index
### dimensions (use spacing tokens)
### animation
    - button
    - input

CSS variables example:

```css
:root {
    --acv-border-radius-sm: 1px;
    --acv-border-radius-md: 2px;
    --acv-border-radius-lg: 4px;
    --acv-border-radius-circle: 50%;
}
```

## Components anatomy
