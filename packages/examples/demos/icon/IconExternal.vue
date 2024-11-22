<script setup>
  import ElIcon from '@/components/icon/icon.vue';

  const svg = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" class="acv-icon"><g clip-path="url(#a)"><path fill="currentColor" fill-rule="evenodd" d="M.5 2.5v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-11a2 2 0 0 0-2-2h-11a2 2 0 0 0-2 2ZM7 5a1 1 0 0 1 2 0v2h2a1 1 0 1 1 0 2H9v2a1 1 0 1 1-2 0V9H5a1 1 0 1 1 0-2h2V5Z" clip-rule="evenodd"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h16v16H0z"/></clipPath></defs></svg>';
</script>

<template>
  <ElIcon :source="svg" />
</template>
