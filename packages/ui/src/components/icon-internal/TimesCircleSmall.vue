<script lang="ts">
  import { defineComponent, markRaw } from 'vue';

  export default defineComponent(markRaw({ name: 'TimesCircleSmall' }));
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
      d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16ZM5.295 9.278a1.008 1.008 0 0 0 1.427 1.427L8 9.426l1.278 1.279a1.008 1.008 0 0 0 1.427-1.427L9.426 8l1.279-1.278a1.008 1.008 0 0 0-1.427-1.427L8 6.574 6.722 5.295a1.008 1.008 0 0 0-1.427 1.427L6.574 8 5.295 9.278Z"
    />
  </svg>
</template>
