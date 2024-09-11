# Base colors

We will define all colors in the `:root` selector of the `:host` element.
This way, we can use the colors in the shadow DOM of the components.
Usually we define colors in hsl format, but we can also use hex or rgb format.
We provide predefined themes, but also you can define your own theme.
You can redefine any of base(theme) colors in your application in oreder to get custom theme.

Colors are semantically divided into the following categories:

- base palette, like primary, secondary, etc. (we use palletes to unify colors in the library with figma design system)
- shades and lights (used in states, like hover, focus, etc.)
- brand colors (provided by figma design system)
- states colors (base colors for states, like success, error, etc., provided by figma design system)
- chart colors (provided by figma design system)

These colors will be used accordingly in the library components.
In some components colors will be calculated depending on environment variables,
like `--acv-color-primary`, `--acv-color-black`, `--acv-color-gray`, `--acv-color-gray-lightest`, etc.

<color name="--acv-color-white"></color>
<color name="--acv-color-black"></color>
<color name="--acv-color-red"></color>
<color name="--acv-color-pink"></color>
<color name="--acv-color-purple"></color>
<color name="--acv-color-deep-purple"></color>
<color name="--acv-color-indigo"></color>
<color name="--acv-color-blue"></color>
<color name="--acv-color-dodge-blue"></color>
<color name="--acv-color-blue-gray"></color>
<color name="--acv-color-light-blue"></color>
<color name="--acv-color-cyan"></color>
<color name="--acv-color-teal"></color>
<color name="--acv-color-green"></color>
<color name="--acv-color-light-green"></color>
<color name="--acv-color-lime"></color>
<color name="--acv-color-yellow"></color>
<color name="--acv-color-amber"></color>
<color name="--acv-color-orange"></color>
<color name="--acv-color-deep-orange"></color>
<color name="--acv-color-brown"></color>
<color name="--acv-color-grey"></color>

## Shades of red

<color name="--acv-color-red-darkest"></color>
<color name="--acv-color-red-darker"></color>
<color name="--acv-color-red-dark"></color>
<color name="--acv-color-red"></color>
<color name="--acv-color-red-light"></color>
<color name="--acv-color-red-lighter"></color>
<color name="--acv-color-red-lightest"></color>

## Shades of blue

<color name="--acv-color-blue-shade-40"></color>
<color name="--acv-color-blue-shade-30"></color>
<color name="--acv-color-blue-shade-20"></color>
<color name="--acv-color-blue-shade-10"></color>
<color name="--acv-color-blue-light-10"></color>
<color name="--acv-color-blue-light-20"></color>
<color name="--acv-color-blue-light-30"></color>
<color name="--acv-color-blue-light-40"></color>

## Shades of green

<color name="--acv-color-green-shade-40"></color>
<color name="--acv-color-green-shade-30"></color>
<color name="--acv-color-green-shade-20"></color>
<color name="--acv-color-green-shade-10"></color>
<color name="--acv-color-green-light-10"></color>
<color name="--acv-color-green-light-20"></color>
<color name="--acv-color-green-light-30"></color>
<color name="--acv-color-green-light-40"></color>

## Shades of yellow

<color name="--acv-color-yellow-shade-40"></color>
<color name="--acv-color-yellow-shade-30"></color>
<color name="--acv-color-yellow-shade-20"></color>
<color name="--acv-color-yellow-shade-10"></color>
<color name="--acv-color-yellow-light-10"></color>
<color name="--acv-color-yellow-light-20"></color>
<color name="--acv-color-yellow-light-30"></color>
<color name="--acv-color-yellow-light-40"></color>

## Shades of orange

<color name="--acv-color-orange-shade-40"></color>
<color name="--acv-color-orange-shade-30"></color>
<color name="--acv-color-orange-shade-20"></color>
<color name="--acv-color-orange-shade-10"></color>
<color name="--acv-color-orange-light-10"></color>
<color name="--acv-color-orange-light-20"></color>
<color name="--acv-color-orange-light-30"></color>
<color name="--acv-color-orange-light-40"></color>

## Shades of gray

<color name="--acv-color-gray-shade-40"></color>
<color name="--acv-color-gray-shade-30"></color>
<color name="--acv-color-gray-shade-20"></color>
<color name="--acv-color-gray-shade-10"></color>
<color name="--acv-color-gray-light-10"></color>
<color name="--acv-color-gray-light-20"></color>
<color name="--acv-color-gray-light-30"></color>
<color name="--acv-color-gray-light-40"></color>
