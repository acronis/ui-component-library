<script lang="ts">
  import { defineComponent, markRaw } from 'vue';

  export default defineComponent(markRaw({ name: 'UploadSmall' }));
</script>

<template>
  <svg
    width="16"
    height="16"
    fill="currentColor"
    viewBox="-1 -1 16 16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 12h10v-1a1 1 0 0 1 2 0v2a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1v-2a1 1 0 0 1 2 0v1Zm6-8.586V10a1 1 0 0 1-2 0V3.414L4.707 4.707a1 1 0 0 1-1.414-1.414l3-3a1 1 0 0 1 1.414 0l3 3a1 1 0 1 1-1.414 1.414L8 3.414Z"
    />
  </svg>
</template>
