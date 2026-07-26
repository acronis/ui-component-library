<script setup>
  import AcvEmpty from '@/components/empty/empty.vue';

  const description = 'Data is loading...';
</script>

<template>
  <div class="qa-empty-screen-basic">
    <AcvEmpty
      loading
      :description="description"
    />
  </div>
</template>
