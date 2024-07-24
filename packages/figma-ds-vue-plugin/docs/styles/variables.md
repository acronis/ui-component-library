---
description: ''
sidebar: 'docs'
prev: '/docs/components/tooltip/'
next: '/docs/utils/style-utils/'
---

# Variables

## Colors

### Accent

<div class="rounded-md overflow-hidden">
<div class="flex justify-between items-center p-4 text-white " style="background-color: var(--blue)">
<code>--blue</code>
<span>Primary button, hyperlinks, focus/selected states</span>
</div>

<div class="flex justify-between items-center p-4 text-white " style="background-color: var(--green)">
<code>--green</code>
<span>Toolbar selections
</span>
</div>

<div class="flex justify-between items-center p-4" style="background-color: var(--yellow)">
<code>--yellow</code>
<span>Cautionary conditions/warnings</span>
</div>

<div class="flex justify-between items-center p-4 text-white " style="background-color: var(--red)">
<code>--red</code>
<span>Indicate error</span>
</div>

<div class="flex justify-between items-center p-4 text-white " style="background-color: var(--purple)">
<code>--purple</code>
<span>Indicate Component & Instance nodes</span>
</div>

<div class="flex justify-between items-center p-4 text-white " style="background-color: var(--hot-pink)">
<code>--hot-pink</code>
<span>Assistive UI canvas decorations</span>
</div>
</div>

### Basic foreground

<div class="rounded-md overflow-hidden">
<div class="flex justify-between items-center p-4" style="background-color: var(--white)">
<code>--white</code>
<span>Primary background for UI, text on menus</span>
</div>

<div class="flex justify-between items-center p-4" style="background-color: var(--white8)">
<code>--white8</code>
<span>Only used for Figma toolbar</span>
</div>

<div class="flex justify-between items-center p-4" style="background-color: var(--white4)">
<code>--white4</code>
<span>Used in same way as black3, Ex: option group headers in menus</span>
</div>

<div class="flex justify-between items-center p-4 text-white " style="background-color: var(--black)">
<code>--black</code>
<span>Active states</span>
</div>

<div class="flex justify-between items-center p-4 text-white " style="background-color: var(--black8)">
<code>--black8</code>
<span>80% black, ex: most common black used in UI text and icons</span>
</div>

<div class="flex justify-between items-center p-4 text-white " style="background-color: var(--black3)">
<code>--black3</code>
<span>30% black, ex: lower priority messages, disabled states</span>
</div>
</div>

### Basic background

<div class="rounded-md overflow-hidden">
<div class="flex justify-between items-center p-4" style="background-color: var(--bg-white)">
<code>--bg-white</code>
<span>Positive backgrounds, ex: property panels, sidebar</span>
</div>

<div class="flex justify-between items-center p-4" style="background-color: var(--bg-grey)">
<code>--bg-grey</code>
<span>Bg of ex: buttons, controls in active state</span>
</div>

<div class="flex justify-between items-center p-4" style="background-color: var(--bg-silver)">
<code>--bg-silver</code>
<span>Sidebar seperator lines & default canvas bg</span>
</div>

<div class="flex justify-between items-center p-4 text-white " style="background-color: var(--bg-black)">
<code>--bg-black</code>
<span>Tabstrip bg in desktop app (Fullscreen mode)</span>
</div>

<div class="flex justify-between items-center p-4 text-white " style="background-color: var(--bg-hud)">
<code>--bg-hud</code>
<span>Heads-up display elements, ex: menus</span>
</div>

<div class="flex justify-between items-center p-4 text-white " style="background-color: var(--bg-toolbar)">
<code>--bg-toolbar</code>
<span>Background for Figma toolbar</span>
</div>
</div>

### Special

<div class="rounded-md overflow-hidden">
<div class="flex justify-between items-center p-4" style="background-color: var(--black1)">
<code>--black1</code>
<span>Outline of UI controls</span>
</div>

<div class="flex justify-between items-center p-4" style="background-color: var(--hover-fill)">
<code>--hover-fill</code>
<span>Hover state for items without borders, ex: icon button</span>
</div>

<div class="flex justify-between items-center p-4" style="background-color: var(--white2)">
<code>--white2</code>
<span>Menu separators</span>
</div>

<div class="flex justify-between items-center p-4 " style="background-color: var(--blue3)">
<code>--blue3</code>
<span>Text range selection</span>
</div>

<div class="flex justify-between items-center p-4 " style="background-color: var(--selection-a)">
<code>--selection-a</code>
<span>Selected cells, ex: selected top level layer</span>
</div>

<div class="flex justify-between items-center p-4 " style="background-color: var(--selection-b)">
<code>--selection-b</code>
<span>Selected cells, ex: selected child layers</span>
</div>
</div>

## Typography

| Property         | Var                                | Value                 |
| :--------------- | :--------------------------------- | :-------------------- |
| `font-family`    | `--font-stack`                     | _'Inter', sans-serif_ |
| `font-size`      | `--font-size-xsmall`               | _11px_                |
| `font-size`      | `--font-size-small`                | _12px_                |
| `font-size`      | `--font-size-large`                | _13px_                |
| `font-size`      | `--font-size-xlarge`               | _14px_                |
| `font-weight`    | `--font-weight-normal`             | _400_                 |
| `font-weight`    | `--font-weight-medium`             | _500_                 |
| `font-weight`    | `--font-weight-bold`               | _600_                 |
| `line-height`    | `--font-line-height`               | _16px_                |
| `line-height`    | `--font-line-height-large`         | _24px_                |
| `letter-spacing` | `--font-letter-spacing-pos-xsmall` | _.005em_              |
| `letter-spacing` | `--font-letter-spacing-neg-xsmall` | _.01em_               |
| `letter-spacing` | `--font-letter-spacing-pos-small`  | _0_                   |
| `letter-spacing` | `--font-letter-spacing-neg-small`  | _.005em_              |
| `letter-spacing` | `--font-letter-spacing-pos-large`  | _-0.0025em_           |
| `letter-spacing` | `--font-letter-spacing-neg-large`  | _.0025em_             |
| `letter-spacing` | `--font-letter-spacing-pos-xlarge` | _-.001em_             |
| `letter-spacing` | `--font-letter-spacing-neg-xlarge` | _-.001em_             |

::: tip Letter-spacing

The letter-spacing vars are used to optimize legibility of certain font sizes on certain background colors. Ex: `--font-letter-spacing-neg-small` improves the legibility of light `--font-size-small` text on a dark background.

:::

## Size

| Var               | Value  |
| :---------------- | :----- |
| `--size-xxxsmall` | _4px_  |
| `--size-xxsmall`  | _8px_  |
| `--size-xsmall`   | _16px_ |
| `--size-small`    | _24px_ |
| `--size-medium`   | _32px_ |
| `--size-large`    | _40px_ |
| `--size-xlarge`   | _48px_ |
| `--size-xxlarge`  | _64px_ |
| `--size-xxxlarge` | _80px_ |

## Border radius

| Var                     | Value | Notes                                 |
| :---------------------- | :---- | :------------------------------------ |
| `--border-radius-small` | _2px_ | Ex: menus, input borders, icon button |
| `--border-radius-med`   | _5px_ | Ex: visual bell, toasts               |
| `--border-radius-large` | _6px_ | Ex: buttons                           |

## Shadows

| Var                        | Value                                                               | Notes                       |
| :------------------------- | :------------------------------------------------------------------ | :-------------------------- |
| `--shadow-hud`             | _0 5px 17px rgba(0, 0, 0, 0.2),<br/> 0 2px 7px rgba(0, 0, 0, 0.15)_ | Ex: menus, tooltips, toasts |
| `--shadow-floating-window` | _0 2px 14px rgba(0, 0, 0, 0.15)_                                    | Ex: modal, dialog           |
