<script lang="ts">
  import { defineComponent, markRaw } from 'vue';

  export default defineComponent(markRaw({ name: 'TimesMedium' }));
</script>

<template>
  <svg
    width="24"
    height="24"
    fill="currentColor"
    viewBox="-4 -4 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.606 8 .29 14.317a.986.986 0 0 0 1.393 1.394L8 9.394l6.318 6.317a.986.986 0 1 0 1.393-1.394L9.394 8l6.317-6.317A.986.986 0 0 0 14.318.289L8 6.606 1.682.29A.986.986 0 1 0 .29 1.683L6.606 8Z"
    />
  </svg>
</template>
