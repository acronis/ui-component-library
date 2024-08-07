Button is used to highlight key actions and clearly inform user of what will happen after the interaction.

Use buttons for actions in forms, dialogs, and much more.

It supports multiple variants, sizes, and states.

## Overview

<ButtonBasic />

::: details Source code
<<< ../../../demos/src/button/ButtonBasic.vue
:::

## Types

<ButtonDocTypes />

## States

<ButtonDocStates />

## Sizing

Specify the size(small, large) of the button using the `size` prop.

<ButtonDocSizes />

## With icons

<ButtonDocWithIcons />

## Button types

By default `<acv-button>` renders a `<button>` element.
You can change the type of the button by setting the `type` prop.
Also, you can render a `<a>` element by setting the `href` prop.
You may generate router-links by setting the `to` prop.

:::tip
Type prop is only available when the button is rendered as a `<button>` element.
It is ignored when either _href_ or _to_ props are set.
:::

<ButtonTypes />

## With single icon

<ButtonWithSingleIcon />

## Loading

<ButtonWithLoading />

## Block buttons

Create block buttons that use full width of the parent container.
Set up the `block` prop to make the button full width.

<ButtonBlock />

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
