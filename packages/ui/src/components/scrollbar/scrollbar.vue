<script setup lang="ts">
  import './scrollbar.css';
  import type { AcvScrollbarProps } from './scrollbar.ts';

  const { title, description } = defineProps<AcvScrollbarProps>();

  defineEmits<{
    /**
     * Triggered when the component is closed
     * @arg {string} payload - The first argument
     */
    close: []
  }>();
</script>

<template>
  <div class="acv-scrollbar">
    <slot>{{ title }}</slot>

    <slot name="description">
      {{ description }}
    </slot>
  </div>
</template>

<style scoped>
body::-webkit-scrollbar {
  width: var(--acv-scrollbar-size);
}

body::-webkit-scrollbar-track {
  background: var(--acv-scrollbar-track-color);
  border-radius: 3px;
}

body::-webkit-scrollbar-thumb {
  background: var(--acv-scrollbar-thumb-color);
  border-radius: 3px;
}

@supports not selector(::-webkit-scrollbar) {
  body {
    scrollbar-color: var(--acv-scrollbar-thumb-color)
    var(--acv-scrollbar-track-color);
  }
}

  .acv-scrollbar {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-scrollbar-track-color);
  }
</style>
