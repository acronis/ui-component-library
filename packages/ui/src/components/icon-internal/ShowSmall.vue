<script lang="ts">
  import { defineComponent, markRaw } from 'vue';

  export default defineComponent(markRaw({ name: 'ShowSmall' }));
</script>

<template>
  <svg
    width="16"
    height="16"
    fill="currentColor"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.529 7.385c1.128.364 2.07.969 2.696 1.736a1 1 0 0 0 1.55-1.263C13.323 6.075 10.797 5 8 5 5.24 5 2.698 6.045 1.237 7.768a1 1 0 1 0 1.526 1.293c.628-.741 1.582-1.33 2.714-1.684a3 3 0 1 0 5.052.008Z"
    />
  </svg>
</template>
