<script lang="ts">
  import { defineComponent, markRaw } from 'vue';

  export default defineComponent(markRaw({ name: 'ChevronLeftSmall' }));
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
      d="M10.28 10.375a1 1 0 1 1-1.56 1.25l-3-3a1 1 0 0 1 0-1.25l3-3a1 1 0 0 1 1.56 1.25L7.78 8l2.5 2.375Z"
    />
  </svg>
</template>
