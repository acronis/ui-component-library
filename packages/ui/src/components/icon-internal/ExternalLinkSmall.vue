<script lang="ts">
  import { defineComponent, markRaw } from 'vue';

  export default defineComponent(markRaw({ name: 'ExternalLinkSmall' }));
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
      d="M15.5 2h-3.293a.5.5 0 0 0-.354.854l.94.939-3.5 3.5a1 1 0 0 0 1.414 1.414l3.5-3.5.94.94A.5.5 0 0 0 16 5.792V2.5a.5.5 0 0 0-.5-.5Z"
    />
    <path
      fill="currentColor"
      d="M6.5 3A1.5 1.5 0 0 0 5 4.5v7A1.5 1.5 0 0 0 6.5 13h7a1.5 1.5 0 0 0 1.5-1.5V9a1 1 0 1 0-2 0v2H7V5h2a1 1 0 0 0 0-2H6.5Z"
    />
  </svg>
</template>
