<script lang="ts">
  import { defineComponent, markRaw } from 'vue';

  export default defineComponent(markRaw({ name: 'CheckSquareSmall' }));
</script>

<template>
  <svg
    width="16"
    height="16"
    fill="currentColor"
    viewBox="-3 -4 16 16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.707 4.293A1 1 0 0 0 .293 5.707l2 2a1 1 0 0 0 1.414 0l6-6A1 1 0 1 0 8.293.293L3 5.586 1.707 4.293Z"
    />
  </svg>
</template>
