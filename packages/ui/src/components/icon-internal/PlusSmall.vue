<script lang="ts">
  import { defineComponent, markRaw } from 'vue';

  export default defineComponent(markRaw({ name: 'PlusSmall' }));
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
      d="M9 7V2a1 1 0 0 0-2 0v5H2a1 1 0 0 0 0 2h5v5a1 1 0 1 0 2 0V9h5a1 1 0 1 0 0-2H9Z"
    />
  </svg>
</template>
