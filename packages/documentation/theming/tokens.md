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

## Components extension points

Components can be extended with css variables(aka component tokens).
While creating component we can define them in separate css file and use them in component styles. (ie _AcvButton.css_)
