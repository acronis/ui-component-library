<script lang="ts">
  import { defineComponent, markRaw } from 'vue';

  export default defineComponent(markRaw({ name: 'ChevronRightSmall' }));
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
      d="M5.72 5.625a1 1 0 1 1 1.56-1.25l3 3a1 1 0 0 1 0 1.25l-3 3a1 1 0 1 1-1.56-1.25L8.22 8l-2.5-2.375Z"
    />
  </svg>
</template>
