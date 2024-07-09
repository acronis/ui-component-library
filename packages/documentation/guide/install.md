# Installation & Usage

How to properly install and use an Acronis UI Component Library

## Install Package

::: code-group

```shell [npm]
npm i @acronis-platform/ui-component-library
```

```shell [yarn]
yarn add @acronis-platform/ui-component-library
```

```shell [pnpm]
pnpm add @acronis-platform/ui-component-library
```

:::

## Full Import

By fully importing Acronis UI Component Library components, the package size will increase.

`main.ts`

```ts
import { createApp } from 'vue';
import UIKit from '@acronis-platform/ui-component-library';
import '@acronis-platform/ui-component-library/styles/acronis.css';
import App from './App.vue';

const app = createApp(App);

app.use(UIKit);
app.mount('#app');
```

## On-demand Import

- You can use the import statement to import the components you use.

```vue
<script setup>
  import { AcvButton } from '@acronis-platform/ui-component-library';
</script>

<template>
  <AcvButton>Button</AcvButton>
</template>
```
