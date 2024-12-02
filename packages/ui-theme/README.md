# UI theme package

This package contains the UI theme(tokens and utility styles) for the UI component library.

Source code for tokens is represented in Style dictionary format and CSS for utility classes.

## What's included

The package includes the following:

- CSS files with branded theme styles (light, dark color scheme and global variables)
- SCSS files with branded theme styles
- JavaScript files with branded theme variables
- UI Syntax Design system Figma tokens with aliases
- Css utility classes that can be used in the project

## How to use

To use the UI theme in your project, you need to install the package first:

```bash
npm install @acronis-platform/ui-theme
```

Then, you can import the theme in your project:

```js

// Import the all tokens, utilities and theme styles
import '@acronis-platform/ui-theme/css/index.css';
// Import all css utilities
import '@acronis-platform/ui-theme/styles/utilities.css';
// Import all theme styles for the light and dark themes
import '@acronis-platform/ui-theme/css/acronis/acronis.css';
// Figma base tokens
import '@acronis-platform/ui-theme/css/globals.css';
```

## Development

To build the UI theme package, run the following command:

```bash
pnpm run build
```

## Tokens

The tokens are defined in the `tokens` directory. 
The tokens are defined in the Style Dictionary format.

We suggest to use Category - Type - Item structure for tokens.

```json
{
  "color": {
    "background": {
      "primary": { "value": "{color.core.neutral.0.value}" }
    }
  }
}
```

Full taxonomy of tokens:

- Prefix - **acv**
  - Category - **color**
    - Type - **background**, **text**, **border**
      - Item - **button**, **input**, **card**, **table**
        - Optional subitem - **primary**, **secondary**, **tertiary**
            - Interactive state - **hover**, **focus**, **active**, **disabled**, **base** 

## Type of tokens

Tokens are divide into several categories:

- base: tokens from figma ui syntax design system, reusable primitive values, should not be used directly
- globals: semantic aliases for base tokens, palettes for brands, components sets, prepared for direct usage in styled components
- brands: theme and color scheme tokens, color type mostly
- assets: fonts and icon tokens

## Utility classes

The utility classes are defined in the `styles` directory.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
