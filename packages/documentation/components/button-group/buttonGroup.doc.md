---
title: Button Group component
lang: en-US
editLink: true
---

# Button Group

Button group inherits the behavior of the Checkbox or Radio button and is a form element, not a navigation element.
There are two behaviors for Button group.
Multiple choice, which is equivalent to selecting multiple Checkbox and single selection, which is equivalent to selecting from several Radio button.
In the default state, none of the parameters are selected.

:::info Figma component anatomy
https://www.figma.com/file/AOtI028uCFzAmnADVCz872/Documentation?node-id=2%3A4
:::

## Basic usage

<ButtonGroupBasic />

::: details Source code
<<< @/demos/button-group/ButtonGroupBasic.vue
:::

## Related components

- [Button](/components/button/button.doc)
- [Checkbox](/components/checkbox/checkbox.doc)
- [Radio](/components/radio/radio.doc)

## Usage

```javascript
import { AcvButtonGroup } from "@acronis-platform/ui-component-library";
// or
import ButtonGroup from "@acronis-platform/components/buttonGroup/buttonGroup.vue";
```

## Props

| Prop name | Description                                   | Type    | Values               | Default |
| --------- | --------------------------------------------- | ------- | -------------------- | ------- |
| size      | Size of the component                         | union   | small, medium, large |         |
| vertical  | Set of buttons that appear vertically stacked | boolean | -                    |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name    | Description              | Bindings |
| ------- | ------------------------ | -------- |
| default | The default slot content |          |
