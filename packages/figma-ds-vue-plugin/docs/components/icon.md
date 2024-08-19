---
description: ''
sidebar: 'docs'
prev: '/docs/components/divider/'
next: '/docs/components/icon-button/'
---

# Icon

<ComponentWrapper>
<Icon icon="heart"/>
<Icon iconText="W"/>
</ComponentWrapper>

### Props

| Prop       | Type      | Default/Notes                                                       |
| :--------- | :-------- | :------------------------------------------------------------------ |
| `icon`     | `String`  | Default: `heart`; Pass an icon, refer to the icon list or guide     |
| `iconText` | `String`  | Pass a text character to use instead of an icon, ex: `iconText="W"` |
| `spinning` | `Boolean` | Default: `false`; Spinning icon (infinite animation)                |

### Example usage

```html
<template>
  <Icon icon="heart" />
</template>

<script>
  import { Icon } from '@acronis-platform/figma-ds-vue-plugin'

  export default {
    components: {
      Icon,
    },
  }
</script>
```

### Icons

::: details Available icons

|                     Icon                     | Name                            |
| :------------------------------------------: | :------------------------------ |
|            <Icon icon="adjust"/>             | `adjust`                        |
|             <Icon icon="alert"/>             | `alert`                         |
|             <Icon icon="angle"/>             | `angle`                         |
|       <Icon icon="arrow-left-right"/>        | `arrow-left-right`              |
|         <Icon icon="arrow-up-down"/>         | `arrow-up-down`                 |
|    <Icon icon="auto-layout-horizontal"/>     | `auto-layout-horizontal`        |
|     <Icon icon="auto-layout-vertical"/>      | `auto-layout-vertical`          |
|             <Icon icon="back"/>              | `back`                          |
|          <Icon icon="blend-empty"/>          | `blend-empty`                   |
|             <Icon icon="blend"/>             | `blend`                         |
|             <Icon icon="break"/>             | `break`                         |
|          <Icon icon="caret-left"/>           | `caret-left`                    |
|           <Icon icon="caret-up"/>            | `caret-up`                      |
|          <Icon icon="caret-right"/>          | `caret-right`                   |
|          <Icon icon="caret-down"/>           | `caret-down`                    |
|             <Icon icon="check"/>             | `check`                         |
|             <Icon icon="close"/>             | `close`                         |
|           <Icon icon="component"/>           | `component`                     |
|         <Icon icon="corner-radius"/>         | `corner-radius`                 |
|            <Icon icon="corners"/>            | `corners`                       |
| <Icon icon="distribute-horizontal-spacing"/> | `distribute-horizontal-spacing` |
|  <Icon icon="distribute-vertical-spacing"/>  | `distribute-vertical-spacing`   |
|             <Icon icon="draft"/>             | `draft`                         |
|            <Icon icon="effects"/>            | `effects`                       |
|           <Icon icon="ellipses"/>            | `ellipses`                      |
|          <Icon icon="eyedropper"/>           | `eyedropper`                    |
|            <Icon icon="forward"/>            | `forward`                       |
|             <Icon icon="frame"/>             | `frame`                         |
|             <Icon icon="group"/>             | `group`                         |
|             <Icon icon="heart"/>             | `heart`                         |
|          <Icon icon="heart-fill"/>           | `heart-fill`                    |
|            <Icon icon="hidden"/>             | `hidden`                        |
|      <Icon icon="horizontal-padding"/>       | `horizontal-padding`            |
|           <Icon icon="hyperlink"/>           | `hyperlink`                     |
|             <Icon icon="image"/>             | `image`                         |
|           <Icon icon="instance"/>            | `instance`                      |
|              <Icon icon="key"/>              | `key`                           |
|   <Icon icon="align-horizontal-centers"/>    | `align-horizontal-centers`      |
|    <Icon icon="align-vertical-centers"/>     | `align-vertical-centers`        |
|          <Icon icon="align-left"/>           | `align-left`                    |
|           <Icon icon="align-top"/>           | `align-top`                     |
|          <Icon icon="align-right"/>          | `align-right`                   |
|         <Icon icon="align-bottom"/>          | `align-bottom`                  |
|      <Icon icon="layout-grid-columns"/>      | `layout-grid-columns`           |
|       <Icon icon="layout-grid-rows"/>        | `layout-grid-rows`              |
|      <Icon icon="layout-grid-uniform"/>      | `layout-grid-uniform`           |
|            <Icon icon="library"/>            | `library`                       |
|          <Icon icon="link-broken"/>          | `link-broken`                   |
|        <Icon icon="link-connected"/>         | `link-connected`                |
|         <Icon icon="list-detailed"/>         | `list-detailed`                 |
|           <Icon icon="list-tile"/>           | `list-tile`                     |
|             <Icon icon="list"/>              | `list`                          |
|           <Icon icon="lock-off"/>            | `lock-off`                      |
|            <Icon icon="lock-on"/>            | `lock-on`                       |
|             <Icon icon="minus"/>             | `minus`                         |
|             <Icon icon="play"/>              | `play`                          |
|             <Icon icon="plus"/>              | `plus`                          |
|            <Icon icon="random"/>             | `random`                        |
|            <Icon icon="recent"/>             | `recent`                        |
|         <Icon icon="resize-to-fit"/>         | `resize-to-fit`                 |
|        <Icon icon="resolve-filled"/>         | `resolve-filled`                |
|            <Icon icon="resolve"/>            | `resolve`                       |
|         <Icon icon="search-large"/>          | `search-large`                  |
|            <Icon icon="search"/>             | `search`                        |
|           <Icon icon="settings"/>            | `settings`                      |
|             <Icon icon="share"/>             | `share`                         |
|            <Icon icon="smiley"/>             | `smiley`                        |
|        <Icon icon="sort-alpha-asc"/>         | `sort-alpha-asc`                |
|        <Icon icon="sort-alpha-dsc"/>         | `sort-alpha-dsc`                |
|        <Icon icon="sort-top-bottom"/>        | `sort-top-bottom`               |
|            <Icon icon="spacing"/>            | `spacing`                       |
|            <Icon icon="spinner"/>            | `spinner`                       |
|           <Icon icon="star-off"/>            | `star-off`                      |
|            <Icon icon="star-on"/>            | `star-on`                       |
|         <Icon icon="stroke-weight"/>         | `stroke-weight`                 |
|            <Icon icon="styles"/>             | `styles`                        |
|             <Icon icon="swap"/>              | `swap`                          |
|             <Icon icon="theme"/>             | `theme`                         |
|         <Icon icon="tidy-up-grid"/>          | `tidy-up-grid`                  |
|    <Icon icon="tidy-up-list-horizontal"/>    | `tidy-up-list-horizontal`       |
|     <Icon icon="tidy-up-list-vertical"/>     | `tidy-up-list-vertical`         |
|             <Icon icon="timer"/>             | `timer`                         |
|             <Icon icon="trash"/>             | `trash`                         |
|       <Icon icon="vertical-padding"/>        | `vertical-padding`              |
|         <Icon icon="warning-large"/>         | `warning-large`                 |
|            <Icon icon="warning"/>            | `warning`                       |

:::

::: details Use custom icons

To use a custom icon in your components, create a `.icon--[yourIconName]` CSS class and specify the SVG icon as a background-image. You then can pass your icon name to the `icon` prop.
<br/>

**Example**

_Style_ (make sure to prepend `icon--` to your custom icon name)

```css
.icon--yourIconName {
    background-image: url('<your_relative_path>/custom-icon.svg');
}
```

_Vue file_

```html
<Icon icon="yourIconName"> </Icon>
```

::: warning Heads up
You have to inline your icons when bundling for production, e.g. by base64 encoding. The reason is that Figma plugins [do not support any asset files](https://www.figma.com/plugin-docs/resource-links/).
<br/>
<br/>
When using Vue CLI or webpack for bundling, one strategy is to use [url-loader](https://webpack.js.org/loaders/url-loader/) to inline all image assets:

```js
module.exports = {
  chainWebpack: (config) => {
    // Inline svg icons since Figma doesn't support assets
    config.module.rule('svg').uses.clear();
    config.module
      .rule('svg')
      .test(/\.(svg)$/)
      .use('url-loader')
      .loader('url-loader');
  }
};
```

<br/>
✨ Icons that are included in figma-plugin-ds-vue are already inlined and do not need any further action.
:::
