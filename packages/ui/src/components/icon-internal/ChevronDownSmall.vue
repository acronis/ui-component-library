<script lang="ts">
  import { defineComponent, markRaw } from 'vue';

  export default defineComponent(markRaw({ name: 'ChevronDownSmall' }));
</script>

<template>
  <svg
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="currentColor"
      d="M5.625 5.72a1 1 0 1 0-1.25 1.56l3 3a1 1 0 0 0 1.25 0l3-3a1 1 0 1 0-1.25-1.56L8 8.22l-2.375-2.5Z"
    />
  </svg>
</template>
