The 'AcvFooter' component is a structured and customizable terminating section of an interface.

It offers two sections — 'side' and 'actions' — for tailored content and aims to enhance usability with flexbox layout,
a clean divider, and encapsulated styles.

It's an ideal option for placing additional information or call-to-action elements
at the end of a page or a modal in a Vue application.

## Basic usage

<FooterBasic />

::: details Source code
<<< ../../../examples/demos/footer/FooterBasic.vue
:::

## Link usage

<FooterLink />

## Text usage

<FooterText />

## Primary and Link

<FooterPrimaryLink />

## Primary and Text

<FooterPrimaryText />

## Related components

- [Button](/components/button/button.doc)
- [Link](/components/link/link.doc)

## Slots

| Name    | Description                                                 | Bindings |
| ------- | ----------------------------------------------------------- | -------- |
| side    | Used to pass a custom side content (text or link by design) |          |
| default | The default slot content (for buttons by design)            |          |
