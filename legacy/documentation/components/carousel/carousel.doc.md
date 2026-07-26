A carousel presents a set of items, referred to as slides,
by sequentially displaying a subset of one or more slides.

## Basic usage

<CarouselBasic />

::: details Source code
<<< ../../../examples/demos/carousel/CarouselBasic.vue
:::

## Variants

## Auto play

<CarouselAutoPlay />

## Accessibility

Provided `AcvButton` component must adapt to the list of
[WAI-ARIA accessibility patterns](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/).

### Overview

A carousel presents a set of items, referred to as slides, by sequentially displaying a subset of one or more slides. Typically, one slide is displayed at a time, and users can activate a next or previous slide control that hides the current slide and "rotates" the next or previous slide into view. In some implementations, rotation automatically starts when the page loads, and it may also automatically stop once all the slides have been displayed. While a slide may contain any type of content, image carousels where each slide contains nothing more than a single image are common.

Provided features:

- Buttons for displaying the previous and next slides.
- Optionally, a control, or group of controls, for choosing a specific slide to display. For example, slide picker controls can be marked up as tabs in a tablist with the slide represented by a tabpanel element.
- If the carousel can automatically rotate, it also:
  - Has a button for stopping and restarting rotation. This is particularly important for supporting assistive technologies operating in a mode that does not move either keyboard focus or the mouse.
  - Stops rotating when keyboard focus enters the carousel. It does not restart unless the user explicitly requests it to do so.
  - Stops rotating whenever the mouse is hovering over the carousel.

Provided elements:

- Slide
  A single content container within a set of content containers that hold the content to be presented by the carousel.
- Rotation Control
  An interactive element that stops and starts automatic slide rotation.
- Next Slide Control
  An interactive element, often styled as an arrow, that displays the next slide in the rotation sequence.
- Previous Slide Control
  An interactive element, often styled as an arrow, that displays the previous slide in the rotation sequence.
- Slide Picker Controls
  A group of elements, often styled as small dots, that enable the user to pick a specific slide in the rotation sequence to display.

### Keyboard interaction

- If the carousel has an auto-rotate feature, automatic slide rotation stops when any element in the carousel receives keyboard focus. It does not resume unless the user activates the rotation control.
- Tab and Shift + Tab: Move focus through the interactive elements of the carousel as specified by the page tab sequence -- scripting for Tab is not necessary.
- Button elements implement the keyboard interaction defined in the button pattern. Note: Activating the rotation control, next slide, and previous slide do not move focus, so users may easily repetitively activate them as many times as desired.
- If present, the rotation control is the first element in the Tab sequence inside the carousel. It is essential that it precede the rotating content so it can be easily located.
- If tab elements are used for slide picker controls, they implement the keyboard interaction defined in the Tabs Pattern.

### WAI-ARIA Roles, States, and Properties

Existing three types od carousel:

- **Basic**: has rotation, next slide, and previous slide controls, but no slide picker control.
- **Tabbed**: has rotation, next slide, and previous slide controls, and slide picker controls.
- **Grouped**: has basic controls plus a series of tab stops in a group of slide picker controls where each control implements the button pattern.

Because each slide selector button adds an element to the page tab sequence, this style is the least friendly for keyboard users

## Related components

- [Button](/components/button/button.doc)
