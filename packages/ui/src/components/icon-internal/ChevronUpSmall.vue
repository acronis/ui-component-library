<script lang="ts">
  import { defineComponent, markRaw } from 'vue';

  export default defineComponent(markRaw({ name: 'ChevronUpSmall' }));
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
      d="M10.375 10.28a1 1 0 0 0 1.25-1.56l-3-3a1 1 0 0 0-1.25 0l-3 3a1 1 0 0 0 1.25 1.56L8 7.78l2.375 2.5Z"
    />
  </svg>
</template>
