<script setup lang="ts">
  import type {
    AcvSubmenuEvents,
    AcvSubmenuProps,
    AcvSubmenuSlots
  } from './submenu.ts';
  import './submenu.css';

  const { title, description } = defineProps<AcvSubmenuProps>();

  defineEmits<AcvSubmenuEvents>();
  defineSlots<AcvSubmenuSlots>();
</script>

<template>
  <div class="acv-submenu">
    <slot>{{ title }}</slot>
    <slot
      name="description"
      :description="description"
    >
      {{ description }}
    </slot>
  </div>
</template>

<style scoped>
  .acv-submenu {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-submenu-color);
  }
</style>
