Grids are used to layout content in a consistent way
They are made up of columns and rows that can be used to create a variety of layouts.

## Basic usage

Create basic grid layout using columns.

With `row` and `col`, we can easily manipulate the layout using the `span` attribute.

<GridBasic />

::: details Source code
<<< ../../../examples/demos/grid/GridBasic.vue
:::

## Column spacing

Column spacing is supported.

Row provides `gutter` attribute to specify spacings between columns, and its default value is 0.

<RowColumnSpacing />

::: details Source code
<<< ../../../examples/demos/row/RowColumnSpacing.vue
:::

## Hybrid layout

Form a more complex hybrid layout by combining the basic 1/24 columns.

<GridHybridLayout />

## Column offset

You can specify column offsets.

:::tip
You can specify the number of column offset by setting the value of `offset` attribute of Col.
:::

<GridColumnOffset />

## Alignment

Use the flex layout to make flexible alignment of columns.

:::tip
You can enable flex layout by setting `type` attribute to 'flex', and define the layout of child elements by setting `justify` attribute with start, center, end, space-between or space-around.
:::

<GridAlignment />

## Grid Layout

Use grid layout to provide row- and col-spans.
Define row and col properties in acv-col component to provide support of gris in older browsers.

<GridLayout />

## Responsive Layout

Taking example by Bootstrap's responsive design, five breakpoints are preset: xs, sm, md, lg and xl.

<GridResponsive />

## Related components

- [Row](/components/Row/Row.doc)
- [Col](/components/Col/Col.doc)
