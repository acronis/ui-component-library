# Styles Guide

## Styles in Vue.js components

- use simple methodology for CSS class naming, i.e. prefixed class name with component name,
  one-word class names for states and modifiers;
- use scoped styles;
- top-level styles should be in the component file;
- top-level class name must be prefixed with `acv-`;
- top-level class name must be unique-enough to avoid conflicts and side effects;
- use css and native css nesting;

```vue
<template>
  <button class="acv-button large primary">
    <slot />
  </button>
</template>

<style scoped>
  .acv-button {
    background-color: #000;

    &.large {
      font-size: 20px;
    }

    &.primary {
      background-color: #f00;
    }
  }
</style>
```
