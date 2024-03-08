---
title: Icon
lang: en-US
editLink: true
---

# Icon

## Basic usage

:::tip
Update (July 2021) : All icons in UI Kit will, henceforth, be implemented as SVG icons. The previous version, employing a mix of icon fonts and SVG icons will be supported for a few months before being completely removed. To use the previous version, please add `legacy` property as show in the example below. It is advisable to restrain use of `legacy` property unless absolutely required and make the necessary changes as soon as possible to allow for a smooth switchover to the use of the new version.

Additional details about the new icon system:

* The naming convention for monochrome icons will be retained with prefix 'i-'. The prefix for multicolor icons will be changed to 'clr-' from 'svg-'.
* It is currently not possible to use custom sprites from external sources but this may be possible in future releases.
:::

:::tip
Currently the monochrome icon is implemented with the font (`i-` prefixed), and multicolor icon is implemented with SVG (`clr-` prefixed).
If multicolor icon (SVG) is used in your project, the SVG Sprite need to be also included in your project. You can refer to this [page](/#/web/icon-svg) for more details.
:::

Using the full name (eg. i-check--16) of the icon in the [icons](/#/web/icons) page will automatically choose the correct font/svg icon to use. If short name (eg. synced-d--16) is used for the SVG icon, `use-svg` property need to be set true to load the correct icon.

<Basic />

## Disabled

<Disabled />

## State change

<StateChange />

## Sizes

<Sizes />

## Placeholders

<Placeholders />

## Alignment

<Alignments />

## Attributes

| Attribute | Description | Type | Accepted values | Default |
| --------- | ----------- | ---- | --------------- | ------- |
| name | Name of icon (e.g. `check` or `i-check--16`). | string | — | — |
| use-svg | Need to set to `true` for svg icon when short name (eg. `synced`) is used. Works only when `legacy` is set to `true`. | boolean | — | false |
| state | Name of state icon (e.g. `i-state-upload-d--16`). | string / boolean | — | false |
| size | Size of icon. | string | 16 / 24 / 32 / 64 / 72 / 96 | 16 |
| color | Icon color. Only applicable to monocolor icons. | string | brand-primary / brand-light / brand-secondary / brand-secondary-light / fixed-primary / fixed-secondary / fixed-light / fixed-lighter / fixed-lightest / fixed-success-dark / fixed-success-dark-accent / fixed-success / fixed-success-light / fixed-success-accent / fixed-danger-dark / fixed-danger / fixed-danger-light / fixed-danger-accent / fixed-critical-dark / fixed-critical / fixed-critical-light / fixed-critical-accent / fixed-warning-dark / fixed-warning / fixed-warning-light / fixed-warning-accent / fixed-info-dark / fixed-info / fixed-info-light / fixed-info-accent / fixed-neutral-dark / fixed-neutral / fixed-neutral-light / fixed-neutral-accent / fixed-white / fixed-link-dark / fixed-link / fixed-link-light / solid-brand-accent / solid-brand-lightest / solid-brand-secondary-accent / solid-brand-secondary-light / solid-fixed-success-accent / solid-fixed-warning-accent / solid-fixed-critical-accent / solid-fixed-danger-accent / solid-fixed-info-accent | — |
| svg-sprite-path | Complete path to the svg sprite, recommend to use file-loader and import to get file path. Works only when `legacy` is set to `true`. | string | — | '' |
| disabled | Whether icon is disabled. Only applicable to monocolor icons. | boolean | — | false |
| legacy | Whether to use the previous version of the icon system. | boolean | — | false |

<script setup>
  import Basic from 'examples/components/icon/Basic.vue';
  import Disabled from 'examples/components/icon/Disabled.vue';
  import StateChange from 'examples/components/icon/StateChange.vue';
  import Sizes from 'examples/components/icon/Sizes.vue';
  import Placeholders from 'examples/components/icon/Placeholders.vue';
  import Alignments from 'examples/components/icon/Alignments.vue';
</script>