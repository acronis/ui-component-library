<script setup>
  import ElEmpty from '@/widgets/empty/empty.vue';

  const description = 'Data is loading...';
</script>

<template>
  <div class="qa-empty-screen-basic">
    <ElEmpty
      loading
      :description="description"
    />
  </div>
</template>
