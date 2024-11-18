<script setup lang="ts">
  import type {
    AcvThemeProviderProps,
    AcvThemeProviderSlots
  } from '@/components/__dev__/theme-provider/themeProvider.ts';
  import '@/components/__dev__/theme-provider/themeProvider.css';

  const props = withDefaults(defineProps<AcvThemeProviderProps>(), {
    tag: 'div',
    withBackground: true
  });
  defineSlots<AcvThemeProviderSlots>();
</script>

<template>
  <template
    v-if="!props.withBackground"
  >
    <slot />
  </template>
  <div
    v-else
    class="acv-theme-provider"
    :class="{
      [`acv-theme-${props.theme}`]: props.theme,
    }"
    :data-theme="props.theme"
  >
    <slot />
  </div>
</template>

<style scoped>
  .acv-theme-provider {
    background: var(--acv-theme-provider-background-color);
    display: contents;
  }
</style>
