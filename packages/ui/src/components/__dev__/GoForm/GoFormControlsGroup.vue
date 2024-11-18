<script lang="ts" setup>
  import GoFormRow from '@/components/__dev__/GoForm/GoFormRow.vue';
</script>

<template>
  <GoFormRow>
    <div class="content">
      <slot />
    </div>
  </GoFormRow>
</template>

<style scoped>
  .content {
    --control-max-width: none;
    --control-offset: none;
    display: grid;
    align-items: var(--form-group-align-items, flex-end);
    gap: 12px;
    grid-template-columns: var(--form-group-template-column, 1fr 1fr);
  }
</style>
