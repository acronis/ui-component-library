## Features

- The accordion has two basic vertical sizes: 48px and 64px.
  If the content does not fit into any of the basic sizes,
  the vertical accordion item size becomes dependent on the amount of content.
- Hidden content is displayed by clicking on the arrow or throughout the entire block.

## Basic usage

<AccordionBasic />

::: details Source code
<<< ../../../examples/demos/accordion/AccordionBasic.vue
:::

## Sizes

<AccordionSizes />

## Colors

<AccordionColors />

## Paddings

<AccordionPaddings />

## Expand all items

:::info
When `multiple` sets to true, you can use `expanded` props to set all accordion item to be expanded by default.
Otherwise, you can use `v-model` to control the individual Expand/Collapse state of each accordion item.
:::

<AccordionExpanded />

## Expand by v-model

<AccordionModel />

## Multiple/Single modes

<AccordionMultiple />

## Background colors

<AccordionBackground />

## Accessibility

Provided `AcvAccordion` component must adapt to the list of
[WAI-ARIA accessibility patterns](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/).

### Overview

Accordion is a design pattern that allows users to expand and collapse sections of content.
It is especially useful when the content is organized in a way that makes it difficult to scan quickly.
The accordion is a vertically stacked list of headers that can be clicked to reveal or hide content associated with them.
The accordion typically has a single select mode, where only one section can be expanded at a time, and the opening of a new section closes the previously open section.

It consists of these elements:

- Accordion header: The element that is clicked to expand or collapse the associated panel.
- Accordion panel: The element that contains the content revealed when the associated header is expanded.

### Keyboard interaction

- Enter or Space:
  - When focus is on the accordion header for a collapsed panel, expands the associated panel. If the implementation allows only one panel to be expanded, and if another panel is expanded, collapses that panel.
  - When focus is on the accordion header for an expanded panel, collapses the panel if the implementation supports collapsing. Some implementations require one panel to be expanded at all times and allow only one panel to be expanded; so, they do not support a collapse function.
- Tab: Moves focus to the next focusable element; all focusable elements in the accordion are included in the page Tab sequence.
- Shift + Tab: Moves focus to the previous focusable element; all focusable elements in the accordion are included in the page Tab sequence.
- Down Arrow (Optional): If focus is on an accordion header, moves focus to the next accordion header. If focus is on the last accordion header, either does nothing or moves focus to the first accordion header.
- Up Arrow (Optional): If focus is on an accordion header, moves focus to the previous accordion header. If focus is on the first accordion header, either does nothing or moves focus to the last accordion header.
- Home (Optional): When focus is on an accordion header, moves focus to the first accordion header.
- End (Optional): When focus is on an accordion header, moves focus to the last accordion header.

### WAI-ARIA attributes

## Related components

- [AccordionPanel](/components/accordion/accordionPanel.doc)
