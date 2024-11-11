Use buttons for actions in forms, dialogs, and much more.

It supports multiple variants, sizes, and states.

## Overview

<ButtonDoc />

## Basic button

<ButtonBasic />

::: details Source code
<<< ../../../examples/demos/button/ButtonBasic.vue
:::

## Variants

The `AcvButton` comes with five variants: primary (default), secondary, ghost, status and inverted.

<ButtonDocTypes />

::: details Source code
<<< ../../../examples/demos/button/ButtonDocTypes.vue
:::

### Default state

Default state shows that button is clickable and user can perform a task on it

<ButtonBasic />

### Hovered state

Once button is hovered by mouse cursor, it enters hover state, and it changes its color to a darker shade.
This change indicates that user can interact with it.

<ButtonStateHovered />

### Focused state

Focused state is when button is selected by keyboard navigation.
It is indicated by a blue outline around the button.
It is like a hover state, but it is triggered by keyboard navigation.

<ButtonStateFocused />

### Disabled state

Disabled state is when button is not interactable with user.
Nothing happens when user clicks on it.

Disabled state is represented with a lighter shade of color.

<ButtonStateDisabled />

### Active, pressed state

Active state is when button is clicked and user is holding the mouse button.
It is represented by a darker shade of color and inner shadow.

<ButtonStatePressed />

### Selected state

Selected state normally is used for toggle buttons or with set of buttons to indicate selected button within grouping.
It is only applied when user has selected the button.

<ButtonStateSelected />

### Loading state

Use the `loading` prop to show a loading spinner inside the button.

Button content will be disabled and visually hidden while loading.

<ButtonWithLoading />

::: details Source code
<<< ../../../examples/demos/button/ButtonWithLoading.vue
:::

## Sizing

Use `size=large` to specify bigger buttons.

<ButtonDocSizes />

::: details Source code
<<< ../../../examples/demos/button/ButtonDocSizes.vue
:::

## With icons

Use `prepend` and `append` slots to add icons to buttons.
Also, you can use inline icons in default slot.

<ButtonDocWithIcons />

::: details Source code
<<< ../../../examples/demos/button/ButtonDocWithIcons.vue
:::

## Button types

By default `<acv-button>` renders a `<button>` element.
You can change the variant of the button by setting the `variant` prop.
Also, you can render a `<a>` element by setting the `href` prop.
You may generate router-links by setting the `to` prop.

:::tip
Variant prop is only available when the button is rendered as a `<button>` element.
It is ignored when either _href_ or _to_ props are set.
:::

<ButtonTypes />

::: details Source code
<<< ../../../examples/demos/button/ButtonTypes.vue
:::

## With single icon

<ButtonWithSingleIcon />

::: details Source code
<<< ../../../examples/demos/button/ButtonWithSingleIcon.vue
:::

## Block buttons

Create block buttons that use full width of the parent container.
Set up the `block` prop to make the button full width.

<ButtonBlock />

::: details Source code
<<< ../../../examples/demos/button/ButtonBlock.vue
:::

## Accessibility

Provided `AcvButton` component must adapt to the list of
[WAI-ARIA accessibility patterns](https://www.w3.org/WAI/ARIA/apg/patterns/button/).

### Overview

The button component is a simple button that allow users to trigger an action or event,
such as submitting a form, opening dialog or performing operations.

We provide the following features to make the button accessible:

- **Accessible label** (attribute to provide a label that describes the button's action): by default it will be text content inside the `AcvButton` component, but it can be provided by applying `aria-label` or `aria-labelledby` .
- **Accessible description** (attribute sets ID of the element that describes the button): it can be provided by applying `aria-describedby`.
- **Inaccessible button** (if button action is not available): by applying `aria-disabled` attribute.
- **Toggle button** (if button has a toggle state): by applying `aria-pressed` attribute.

### WAI-ARIA attributes

- `role="button"` attribute to make the button accessible.
- `aria-disabled` attribute to indicate that the button is disabled.
- `tabindex` attribute to make the button focusable.
- `aria-pressed` attribute to indicate the current state of the button.
- `aria-expanded` attribute to indicate the current state of the button.
- `aria-haspopup` attribute to indicate that the button has a popup.
- `aria-controls` attribute to indicate the element that the button controls.
- `aria-label` attribute to provide a label that describes the button's action.
  This is especially useful when the button contains only an icon.
- `aria-labelledby` attribute to indicate the element that labels the button.
- `aria-describedby` attribute to indicate the element that describes the button.
- `aria-owns` attribute to indicate the element that the button owns.
- `aria-haspopup` attribute to indicate that the button has a popup.
- `aria-haspopup` attribute to indicate that the button has a popup.

### Keyboard interaction

- `Enter` or `Space` key to activate the button.

### Router links

When `href` or `to` props are set, the button is rendered as an `<a>` element with `role="button"` attribute.

## See also

- [Button group](/components/button-group/buttonGroup.doc)
- [Link](/components/link/link.doc)
- [Color variants](/theming/colors)
- [Open UI Button Research](https://open-ui.org/components/button/)
