<script lang="ts">
  import { defineComponent, markRaw } from 'vue';

  export default defineComponent(markRaw({ name: 'MinusSmall' }));
</script>

<template>
  <svg
    width="16"
    height="16"
    fill="currentColor"
    viewBox="-1 -7 16 16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M1 0h12a1 1 0 0 1 0 2H1a1 1 0 1 1 0-2Z" />
  </svg>
</template>
