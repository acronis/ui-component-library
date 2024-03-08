---
title: Tooltip
lang: en-US
---

# Tooltip

A pop-up that shows additional information when you hover or focus on an element using the keyboard. The tooltip is text only. No links, icons or form elements are allowed in the tooltip. Do not confuse tooltip and popover components. Tooltip is called by hover or focus state, and popover is called by clicking.

## Basic usage

<BasicTooltip />

::: details Source code
<<< ../../examples/components/tooltip/BasicTooltip.vue
:::

## Placement

Use attribute `content` to set the display content when hover. The attribute `placement` determines the position of the tooltip. Its value is `[orientation]-[alignment]` with four orientations `top`, `left`, `right`, `bottom` and three alignments `start`, `end`, `null`, and the default alignment is null. Take `placement="left-end"` for example, Tooltip will display on the left of the element which you are hovering and the bottom of the tooltip aligns with the bottom of the element.

<Placement />

::: details Source code
<<< ../../examples/components/tooltip/Placement.vue
:::

## Disabled Button

Tooltip uses mouse events as trigger. Disabled button won't emit these events natively. In order to show a tooltip over a disabled button, we recommand to put the disabled button within a `<div>` or `<span>` and use the container as the trigger of tooltip. This applies to `Popover` as well.

<Disabled />

::: details Source code
<<< ../../examples/components/tooltip/Disabled.vue
:::

## Tooltip width

Width is calculated automatically. But, you can define the maximum size of the width by setting `max-width` property. `max-width` property can be a number (in pixels) or a keyword such as `auto-width`. The default value is the `default` keyword and is approximate 300px

<TooltipWithWidth />

::: details Source code
<<< ../../examples/components/tooltip/TooltipWithWidth.vue
:::

## Attributes

| Attribute | Description | Type | Accepted Values | Default |
| --------- | ----------- | ---- | --------------- | ------- |
| content | Display content, can be overridden by `slot#content`. | String | — | — |
| placement | Position of Tooltip. | string | top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end | bottom |
| value(v-model) | Visibility of Tooltip. | boolean | — | false |
| disabled | Whether Tooltip is disabled. | boolean | — | false |
| offset | Offset of the Tooltip. | number | — | 0 |
| max-width | Defines the behavior for maximum width of tooltip. | number / string | default / auto-width | default |
| transition | Animation name. | string             | — | el-fade-in-linear |
| visible-arrow | Whether an arrow is displayed. For more information, check <a href="https://github.com/element-component/vue-popper" target="_blank">Vue-popper</a> page. | boolean | — | true |
| popper-options | <a href="https://popper.js.org" target="_blank">popper.js</a> parameters. | Object            | refer to <a href="https://popper.js.org" target="_blank">popper.js</a> doc | `{ boundariesElement: 'body', gpuAcceleration: false }` |
| open-delay | Delay of appearance, in millisecond. | number | — | 500 |
| manual | Whether to control Tooltip manually. `mouseenter` and `mouseleave` won't have effects if set to `true`. | boolean | — | false |
| popper-class  | Custom class name for Tooltip's popper. | string | — | — |
| enterable | Whether the mouse can enter the tooltip. | Boolean | — | true |
| hide-after | Timeout in milliseconds to hide tooltip. | number | — | 0 |
| trigger | Whether to show tooltip on hover or on click. | string | hover/click | hover |

<script setup>
  import BasicTooltip from 'examples/components/tooltip/BasicTooltip.vue';
  import Placement from 'examples/components/tooltip/Placement.vue';
  import Disabled from 'examples/components/tooltip/Disabled.vue';
  import TooltipWithWidth from 'examples/components/tooltip/TooltipWithWidth.vue';
</script>
