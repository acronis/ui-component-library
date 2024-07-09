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
like `--acv-color-primary`, `--acv-color-black`, `--acv-color-gray`, `--acv-color-gray-light-10`, `--acv-color-gray-shade-10`, etc.

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
<color name="--acv-color-gray"></color>

## Shades of gray

<color name="--acv-color-white"></color>
<color name="--acv-color-whitesmoke"></color>
<color name="--acv-color-gainsboro"></color>
<color name="--acv-color-lightgray"></color>
<color name="--acv-color-darkgray"></color>
<color name="--acv-color-gray"></color>
<color name="--acv-color-dimgray"></color>
<color name="--acv-color-black"></color>

## Shades of red

<color name="--acv-color-red-shade-40"></color>
<color name="--acv-color-red-shade-30"></color>
<color name="--acv-color-red-shade-20"></color>
<color name="--acv-color-red-shade-10"></color>
<color name="--acv-color-red-light-10"></color>
<color name="--acv-color-red-light-20"></color>
<color name="--acv-color-red-light-30"></color>
<color name="--acv-color-red-light-40"></color>

## Shades of pink

<color name="--acv-color-pink-shade-40"></color>
<color name="--acv-color-pink-shade-30"></color>
<color name="--acv-color-pink-shade-20"></color>
<color name="--acv-color-pink-shade-10"></color>
<color name="--acv-color-pink-light-10"></color>
<color name="--acv-color-pink-light-20"></color>
<color name="--acv-color-pink-light-30"></color>
<color name="--acv-color-pink-light-40"></color>

## Shades of purple

<color name="--acv-color-purple-shade-40"></color>
<color name="--acv-color-purple-shade-30"></color>
<color name="--acv-color-purple-shade-20"></color>
<color name="--acv-color-purple-shade-10"></color>
<color name="--acv-color-purple-light-10"></color>
<color name="--acv-color-purple-light-20"></color>
<color name="--acv-color-purple-light-30"></color>
<color name="--acv-color-purple-light-40"></color>

## Shades of deep purple

<color name="--acv-color-deep-purple-shade-40"></color>
<color name="--acv-color-deep-purple-shade-30"></color>
<color name="--acv-color-deep-purple-shade-20"></color>
<color name="--acv-color-deep-purple-shade-10"></color>
<color name="--acv-color-deep-purple-light-10"></color>
<color name="--acv-color-deep-purple-light-20"></color>
<color name="--acv-color-deep-purple-light-30"></color>
<color name="--acv-color-deep-purple-light-40"></color>

## Shades of blue

<color name="--acv-color-blue-shade-40"></color>
<color name="--acv-color-blue-shade-30"></color>
<color name="--acv-color-blue-shade-20"></color>
<color name="--acv-color-blue-shade-10"></color>
<color name="--acv-color-blue-light-10"></color>
<color name="--acv-color-blue-light-20"></color>
<color name="--acv-color-blue-light-30"></color>
<color name="--acv-color-blue-light-40"></color>

## Shades of indigo

<color name="--acv-color-indigo-shade-40"></color>
<color name="--acv-color-indigo-shade-30"></color>
<color name="--acv-color-indigo-shade-20"></color>
<color name="--acv-color-indigo-shade-10"></color>
<color name="--acv-color-indigo-light-10"></color>
<color name="--acv-color-indigo-light-20"></color>
<color name="--acv-color-indigo-light-30"></color>
<color name="--acv-color-indigo-light-40"></color>

## Shades of dodge blue

<color name="--acv-color-dodge-blue-shade-40"></color>
<color name="--acv-color-dodge-blue-shade-30"></color>
<color name="--acv-color-dodge-blue-shade-20"></color>
<color name="--acv-color-dodge-blue-shade-10"></color>
<color name="--acv-color-dodge-blue-light-10"></color>
<color name="--acv-color-dodge-blue-light-20"></color>
<color name="--acv-color-dodge-blue-light-30"></color>
<color name="--acv-color-dodge-blue-light-40"></color>

## Shades of blue gray

<color name="--acv-color-blue-gray-shade-40"></color>
<color name="--acv-color-blue-gray-shade-30"></color>
<color name="--acv-color-blue-gray-shade-20"></color>
<color name="--acv-color-blue-gray-shade-10"></color>
<color name="--acv-color-blue-gray-light-10"></color>
<color name="--acv-color-blue-gray-light-20"></color>
<color name="--acv-color-blue-gray-light-30"></color>
<color name="--acv-color-blue-gray-light-40"></color>

## Shades of light-blue

<color name="--acv-color-light-blue-shade-40"></color>
<color name="--acv-color-light-blue-shade-30"></color>
<color name="--acv-color-light-blue-shade-20"></color>
<color name="--acv-color-light-blue-shade-10"></color>
<color name="--acv-color-light-blue-light-10"></color>
<color name="--acv-color-light-blue-light-20"></color>
<color name="--acv-color-light-blue-light-30"></color>
<color name="--acv-color-light-blue-light-40"></color>

## Shades of cyan

<color name="--acv-color-cyan-shade-40"></color>
<color name="--acv-color-cyan-shade-30"></color>
<color name="--acv-color-cyan-shade-20"></color>
<color name="--acv-color-cyan-shade-10"></color>
<color name="--acv-color-cyan-light-10"></color>
<color name="--acv-color-cyan-light-20"></color>
<color name="--acv-color-cyan-light-30"></color>
<color name="--acv-color-cyan-light-40"></color>

## Shades of teal

<color name="--acv-color-teal-shade-40"></color>
<color name="--acv-color-teal-shade-30"></color>
<color name="--acv-color-teal-shade-20"></color>
<color name="--acv-color-teal-shade-10"></color>
<color name="--acv-color-teal-light-10"></color>
<color name="--acv-color-teal-light-20"></color>
<color name="--acv-color-teal-light-30"></color>
<color name="--acv-color-teal-light-40"></color>

## Shades of green

<color name="--acv-color-green-shade-40"></color>
<color name="--acv-color-green-shade-30"></color>
<color name="--acv-color-green-shade-20"></color>
<color name="--acv-color-green-shade-10"></color>
<color name="--acv-color-green-light-10"></color>
<color name="--acv-color-green-light-20"></color>
<color name="--acv-color-green-light-30"></color>
<color name="--acv-color-green-light-40"></color>

## Shades of light-green

<color name="--acv-color-light-green-shade-40"></color>
<color name="--acv-color-light-green-shade-30"></color>
<color name="--acv-color-light-green-shade-20"></color>
<color name="--acv-color-light-green-shade-10"></color>
<color name="--acv-color-light-green-light-10"></color>
<color name="--acv-color-light-green-light-20"></color>
<color name="--acv-color-light-green-light-30"></color>
<color name="--acv-color-light-green-light-40"></color>

## Shades of lime

<color name="--acv-color-lime-shade-40"></color>
<color name="--acv-color-lime-shade-30"></color>
<color name="--acv-color-lime-shade-20"></color>
<color name="--acv-color-lime-shade-10"></color>
<color name="--acv-color-lime-light-10"></color>
<color name="--acv-color-lime-light-20"></color>
<color name="--acv-color-lime-light-30"></color>
<color name="--acv-color-lime-light-40"></color>

## Shades of yellow

<color name="--acv-color-yellow-shade-40"></color>
<color name="--acv-color-yellow-shade-30"></color>
<color name="--acv-color-yellow-shade-20"></color>
<color name="--acv-color-yellow-shade-10"></color>
<color name="--acv-color-yellow-light-10"></color>
<color name="--acv-color-yellow-light-20"></color>
<color name="--acv-color-yellow-light-30"></color>
<color name="--acv-color-yellow-light-40"></color>

## Shades of amber

<color name="--acv-color-amber-shade-40"></color>
<color name="--acv-color-amber-shade-30"></color>
<color name="--acv-color-amber-shade-20"></color>
<color name="--acv-color-amber-shade-10"></color>
<color name="--acv-color-amber-light-10"></color>
<color name="--acv-color-amber-light-20"></color>
<color name="--acv-color-amber-light-30"></color>
<color name="--acv-color-amber-light-40"></color>

## Shades of orange

<color name="--acv-color-orange-shade-40"></color>
<color name="--acv-color-orange-shade-30"></color>
<color name="--acv-color-orange-shade-20"></color>
<color name="--acv-color-orange-shade-10"></color>
<color name="--acv-color-orange-light-10"></color>
<color name="--acv-color-orange-light-20"></color>
<color name="--acv-color-orange-light-30"></color>
<color name="--acv-color-orange-light-40"></color>

## Shades of deep orange

<color name="--acv-color-deep-orange-shade-40"></color>
<color name="--acv-color-deep-orange-shade-30"></color>
<color name="--acv-color-deep-orange-shade-20"></color>
<color name="--acv-color-deep-orange-shade-10"></color>
<color name="--acv-color-deep-orange-light-10"></color>
<color name="--acv-color-deep-orange-light-20"></color>
<color name="--acv-color-deep-orange-light-30"></color>
<color name="--acv-color-deep-orange-light-40"></color>

## Shades of brown

<color name="--acv-color-brown-shade-40"></color>
<color name="--acv-color-brown-shade-30"></color>
<color name="--acv-color-brown-shade-20"></color>
<color name="--acv-color-brown-shade-10"></color>
<color name="--acv-color-brown-light-10"></color>
<color name="--acv-color-brown-light-20"></color>
<color name="--acv-color-brown-light-30"></color>
<color name="--acv-color-brown-light-40"></color>

## Shades of gray

<color name="--acv-color-gray-shade-40"></color>
<color name="--acv-color-gray-shade-30"></color>
<color name="--acv-color-gray-shade-20"></color>
<color name="--acv-color-gray-shade-10"></color>
<color name="--acv-color-gray-light-10"></color>
<color name="--acv-color-gray-light-20"></color>
<color name="--acv-color-gray-light-30"></color>
<color name="--acv-color-gray-light-40"></color>

## Shades of white

<color name="--acv-color-white-100"></color>
<color name="--acv-color-white-90"></color>
<color name="--acv-color-white-80"></color>
<color name="--acv-color-white-70"></color>
<color name="--acv-color-white-60"></color>
<color name="--acv-color-white-50"></color>
<color name="--acv-color-white-40"></color>
<color name="--acv-color-white-30"></color>
<color name="--acv-color-white-20"></color>
<color name="--acv-color-white-10"></color>
<color name="--acv-color-white-0"></color>
