<script lang="ts">
  import { defineComponent, markRaw } from 'vue';

  export default defineComponent(markRaw({ name: 'ArrowSortDownSmall' }));
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
      d="M9 10.586V4a1 1 0 0 0-2 0v6.586L5.707 9.293a1 1 0 0 0-1.414 1.414l3 3a1 1 0 0 0 1.414 0l3-3a1 1 0 0 0-1.414-1.414L9 10.586Z"
    />
  </svg>
</template>
