---
title: Form Label component
lang: en-US
editLink: true
---

# Form Label

FormLabel component is a part form layout components
It uses for showing label for form controls

```md
<pre>
Form
└── FormItem
    ├── FormLabel
    ├── FormControl
    ├── FormError
    └── FormHint
</pre>
```

## Basic usage

<FormLabelBasic />

::: details Source code
<<< @/demos/form-label/FormLabelBasic.vue
:::

## Float Label

Floating label appears on top of the form control when focused.

## Related components

- [Button](/components/button/button.doc)

## Props

| Prop name   | Description                  | Type           | Values                   | Default |
| ----------- | ---------------------------- | -------------- | ------------------------ | ------- |
| label       | Title of the FormLabel       | string         | -                        |         |
| description | Description of the FormLabel | string         | -                        |         |
| placement   | Placement of the label       | labelPlacement | left, right, top, bottom | right   |

## Slots

| Name        | Description                                       | Bindings |
| ----------- | ------------------------------------------------- | -------- |
| label       |                                                   |          |
| description |                                                   |          |
| default     | The default slot content for form control element |          |
