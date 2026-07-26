# CSS utility classes

Library provides a set of utility classes to help you style your components. These classes are designed to be used in combination with other classes to create a wide range of layouts and designs.

## Display

```html
<div class="ui-display--block">...</div>

<div class="ui-display--inline-block">...</div>

<div class="ui-display--flex">...</div>

<div class="ui-display--inline-flex">...</div>

<div class="ui-display--inline">...</div>

<div class="ui-display--none">...</div>
```

## Position

```html
<div class="acv-position--static">...</div>

<div class="acv-position--relative">...</div>

<div class="acv-position--absolute">...</div>

<div class="acv-position--fixed">...</div>
```

## Size

```html
<div class="acv-size--height-100">...</div>

<div class="acv-size--height-100vh">...</div>

<div class="acv-size--height-auto">...</div>

<div class="acv-size--width-100">...</div>

<div class="acv-size--width-100vw">...</div>

<div class="acv-size--width-auto">...</div>
```

## Spacing

These classes can be applied with the usage of the following format: `{property}{direction}-{size}`

The **property** applies the type of spacing:

- **m** - applies **margin**
- **p** - applies **padding**

The **direction** designates the side, which identation property is applied to:

- **t** - applies the property for **margin-top** or **padding-top**
- **b** - applies the property for **margin-bottom** or **padding-bottom**
- **l** - applies the property for **margin-left** or **padding-left**
- **r** - applies the property for **margin-right** or **padding-right**
- **x** - applies properties for both **\*-left** and **\*-right**
- **y** - applies properties for both **\*-top** and **\*-bottom**
- **a** - applies the property for **\*margin** and **\*padding** in all directions

The **size** controls the propery's increment: </br>

- **0** - removes margin or padding by setting it to **0**
- **8** - sets **margin** or **padding** as **8**
- **16** - sets **margin** or **padding** as **16**
- **24** - sets **margin** or **padding** as **24**

For block elements with a designated width, you can apply `.mx-auto` to horizontally center the content.

## Overflow

<TextOverflow />

## Text

### Ellipsis

Text ellipsis styling does not work with `inline` elements. You can use `acv-display--inline-block` class to overwrite the display property if needed.

<Ellipsis />

::: details Source code
<<< ../../examples/demos/utilities/Ellipsis.vue
:::

### Text-Middle-Ellipsis

If the text content is an invalid windows/mac/linux path, the path would not be hidden, and a warning would appear in the console.

The text has to be enclosed an `element` that specifies the width of the path.

<TextMiddleEllipsis />

::: details Source code
<<< ../../examples/demos/utilities/TextMiddleEllipsis.vue
:::

### Text align

<TextAlign />

### White space

<TextWhiteSpace />

### Word break

<TextWorkBreak />

## Background

<BackgroundUtility />

## Grid

### Rows / Columns

Use the acv-grid--rows-{n} utilities to create grids with n equally sized rows.
Use the acv-grid--cols-{n} utilities to create grids with n equally sized columns.

<GridRows />

### Spans

Use the acv-grid--row-span-{n} utilities to make an element span n rows.
Use the acv-grid--col-span-{n} utilities to make an element span n columns.

<GridSpans />

### Start / End

Use the acv-grid--col-start-{n} and acv-grid--col-end-{n} utilities to make an element start or end at the nth grid line. These can also be combined with the acv-grid--col-span-{n} utilities to span a specific number of columns.
Use the acv-grid--row-start-{n} and acv-grid--row-end-{n} utilities to make an element start or end at the nth grid line. These can also be combined with the acv-grid--row-span-{n} utilities to span a specific number of rows.

<GridStartEnd />

### Grid flow

Use the acv-grid--flow-{keyword} utilities to control how the auto-placement algorithm works for a grid layout.

<GridFlow />
