<script setup>
  import AcvEmpty from '@/widgets/empty/empty.vue';

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
