---
description: ''
sidebar: 'docs'
prev: '/docs/utils/variables/'
next: '/docs/library/changelog/'
---

# Style utilities

## Padding

| Class         | Property  | Value                                      |
|:--------------|:----------|:-------------------------------------------|
| `.p-xxxsmall` | `padding` | [var(--size-xxxsmall)](variables#size)     |
| `.p-xxsmall`  | `padding` | [var(--size-xxsmall)](variables#size)      |
| `.p-xsmall`   | `padding` | [var(--size-xsmall)](variables#size)       |
| `.p-small`    | `padding` | [var(--size-small)](variables#size)        |
| `.p-medium`   | `padding` | [var(--size-medium)](variables#size)       |
| `.p-large`    | `padding` | [var(--size-large)](variables#size)        |
| `.p-xlarge`   | `padding` | [var(--size-xlarge)](variables#size)       |
| `.p-xxlarge`  | `padding` | [var(--size-xxlarge`](variables#size)      |
| `.p-xxxlarge` | `padding` | [var(--size-xxxlarge)](variables#size)     |

## Margin

| Class         | Property | Value                                   |
| :------------ | :------- |:----------------------------------------|
| `.m-xxxsmall` | `margin` | [var(--size-xxxsmall)](variables#size)  |
| `.m-xxsmall`  | `margin` | [var(--size-xxsmall)](variables#size)   |
| `.m-xsmall`   | `margin` | [var(--size-xsmall)](variables#size)    |
| `.m-small`    | `margin` | [var(--size-small)](variables#size)     |
| `.m-medium`   | `margin` | [var(--size-medium`](variables#size)    |
| `.m-large`    | `margin` | [var(--size-large)](variables#size)     |
| `.m-xlarge`   | `margin` | [var(--size-xlarge)](variables#size)    |
| `.m-xxlarge`  | `margin` | [var(--size-xxlarge)](variables#size)   |
| `.m-xxxlarge` | `margin` | [var(--size-xxxlarge)](variables#size)  |

::: tip Top, right, bottom and left margin

To specify an explicit top, right, bottom or left margin, append a `t`, `r`, `b` or `l` to
the `.m` class.<br/>For example, `.mb-xsmall` will apply a `var(--size-xsmall)` bottom margin. The respective remaining sizes are shown in the table above.

:::

## Layout

| Class           | Property  | Value          |
| :-------------- | :-------- | :------------- |
| `.hidden`       | `display` | `none`         |
| `.inline`       | `display` | `inline`       |
| `.block`        | `display` | `block`        |
| `.inline-block` | `display` | `inline-block` |
| `.flex`         | `display` | `flex`         |
| `.inline-flex`  | `display` | `inline-flex`  |

### Flex

| Class                      | Property          | Value            |
| :------------------------- | :---------------- | :--------------- |
| **Direction**              |                   |                  |
| `.row`                     | `flex-direction`  | `row`            |
| `.row-reverse`             | `flex-direction`  | `row-reverse`    |
| `.column`                  | `flex-direction`  | `column`         |
| `.column-reverse`          | `flex-direction`  | `column-reverse` |
| **Wrap**                   |                   |                  |
| `.flex-wrap`               | `flex-wrap`       | `wrap`           |
| `.flex-wrap-reverse`       | `flex-wrap`       | `wrap-reverse`   |
| `.flex-no-wrap`            | `flex-wrap`       | `nowrap`         |
| **Shrink**                 |                   |                  |
| `.flex-shrink`             | `flex-shrink`     | `1`              |
| `.flex-no-shrink`          | `flex-shrink`     | `0`              |
| **Grow**                   |                   |                  |
| `.flex-grow`               | `flex-grow`       | `1`              |
| `.flex-no-wrap`            | `flex-grow`       | `0`              |
| **Justify**                |                   |                  |
| `.justify-content-start`   | `justify-content` | `flex-start`     |
| `.justify-content-end`     | `justify-content` | `flex-end`       |
| `.justify-content-center`  | `justify-content` | `center`         |
| `.justify-content-between` | `justify-content` | `space-between`  |
| `.justify-content-around`  | `justify-content` | `space-around`   |
| **Align**                  |                   |                  |
| `.align-items-start`       | `align-items`     | `flex-start`     |
| `.align-items-end`         | `align-items`     | `flex-end`       |
| `.align-items-center`      | `align-items`     | `center`         |
| `.align-items-stretch`     | `align-items`     | `stretch`        |
|                            |                   |                  |
| `.align-content-start`     | `align-content`   | `flex-start`     |
| `.align-content-end`       | `align-content`   | `flex-end`       |
| `.align-content-center`    | `align-content`   | `center`         |
| `.align-content-stretch`   | `align-content`   | `stretch`        |
|                            |                   |                  |
| `.align-self-start`        | `align-self`      | `flex-start`     |
| `.align-self-end`          | `align-self`      | `flex-end`       |
| `.align-self-center`       | `align-self`      | `center`         |
| `.align-self-stretch`      | `align-self`      | `stretch`        |
