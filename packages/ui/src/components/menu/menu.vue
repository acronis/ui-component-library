<script setup lang="ts">
  import './menu.css';
  import type { MenuProps } from './menu.ts';

  const { title, description } = defineProps<MenuProps>();

  defineEmits<{
    /**
     * Triggered when the component is closed
     * @arg {string} payload - The first argument
     */
    close: []
  }>();
</script>

<template>
  <div class="acv-menu">
    <slot>{{ title }}</slot>

    <slot name="description">
      {{ description }}
    </slot>
  </div>
</template>

<style scoped>
  .acv-menu {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-menu-color);
  }
</style>
