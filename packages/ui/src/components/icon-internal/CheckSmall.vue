<script lang="ts">
  import { defineComponent, markRaw } from 'vue';

  export default defineComponent(markRaw({ name: 'CheckSmall' }));
</script>

<template>
  <svg
    width="16"
    height="16"
    fill="currentColor"
    viewBox="0 -2 16 16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.707 6.293A1 1 0 0 0 .293 7.707l4 4a1 1 0 0 0 1.414 0l10-10A1 1 0 1 0 14.293.293L5 9.586 1.707 6.293Z"
    />
  </svg>
</template>
