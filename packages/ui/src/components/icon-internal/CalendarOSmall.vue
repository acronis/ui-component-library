<script lang="ts">
  import { defineComponent, markRaw } from 'vue';

  export default defineComponent(markRaw({ name: 'CalendarOSmall' }));
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
      d="M2 14h12V3H2v11ZM1 1h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Zm3 10h2v2H4v-2Zm3 0h2v2H7v-2Zm3 0h2v2h-2v-2ZM7 8h2v2H7V8ZM4 8h2v2H4V8Zm6 0h2v2h-2V8ZM0 5h16v2H0V5Zm11-5a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0V1a1 1 0 0 1 1-1ZM5 0a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V1a1 1 0 0 1 1-1Z"
    />
  </svg>
</template>
