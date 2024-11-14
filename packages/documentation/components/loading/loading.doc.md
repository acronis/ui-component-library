Used when the action takes a certain amount of time.

Loading can be global and override the entire interface or local, for example, show the status of an operation in a separate section or button.

Loading informs the user about the current status of the operation, but does not report when the process ends and is applied when the completion time of the operation is not known in advance.

In all other cases, circle progress is used.

## Basic usage

You can use the `acv-loading` component to add a loading to an element.

<LoadingBasic />

::: details Source code
<<< ../../../examples/demos/loading/LoadingBasic.vue
:::

## Sizes

You can specify the size of the loading spinner with `size` prop.

<LoadingSizes />

::: details Source code
<<< ../../../examples/demos/loading/LoadingSizes.vue
:::

## Spinner color

You can specify the color of the loading spinner with `color` prop.
Use brand colors(primary, secondary, inverted etc.) for the spinner.

<LoadingColors />

::: details Source code
<<< ../../../examples/demos/loading/LoadingColors.vue
:::

## Background color

You can specify the background color and opacity of the loading backdrop
with `backgroundColor` and `opacity` props.

<LoadingBackgroundColors />

::: details Source code
<<< ../../../examples/demos/loading/LoadingBackgroundColors.vue
:::

## Fullscreen loading

You can use the `fullscreen` prop to add a fullscreen loading.

<LoadingFullscreen />

::: details Source code
<<< ../../../examples/demos/loading/LoadingFullscreen.vue
:::

## Custom title and description

In addition to the spinner, you can add a title and description.

### With title and description

Use the `title` and `description` props to add a title and description.

<div class="acv-position--relative acv-bg-secondary" style="width:256px;height:256px;">
    <LoadingWithContent />
</div>

### With title

If you only want to add a title, use the `title` prop.

It will be displayed to the right side of the loading spinner.

<div class="acv-position--relative acv-bg-secondary" style="width:256px;height:256px;">
    <LoadingWithTitle />
</div>

### With description

If you only want to add a description, use the `description` prop.

It will be displayed below the loading spinner.

<div class="acv-position--relative acv-bg-secondary" style="width:256px;height:256px;">
    <LoadingWithDescription />
</div>

## Related components

- [Loading Directive](/directives/loading)
