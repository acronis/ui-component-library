<script lang="ts">
  import { defineComponent, markRaw } from 'vue';

  export default defineComponent(markRaw({ name: 'TimesSmall' }));
</script>

<template>
  <svg
    width="16"
    height="16"
    fill="currentColor"
    viewBox="-2 -2 16 16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M.295 10.278a1.008 1.008 0 0 0 1.427 1.427L6 7.426l4.278 4.279a1.008 1.008 0 0 0 1.427-1.427L7.426 6l4.279-4.278A1.008 1.008 0 0 0 10.278.295L6 4.574 1.722.295A1.008 1.008 0 0 0 .295 1.722L4.574 6 .295 10.278Z"
    />
  </svg>
</template>
