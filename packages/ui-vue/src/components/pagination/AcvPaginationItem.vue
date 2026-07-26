<script lang="ts" setup>
  import type { AcvPaginationItemEvents, AcvPaginationItemProps } from './acvPagination.ts';
  import AcvButton from '@/components/button/button.vue';

  defineProps<AcvPaginationItemProps>();
  defineEmits<AcvPaginationItemEvents>();
</script>

<template>
  <AcvButton
    :selected="active"
    :disabled="disabled"
    variant="ghost"
    size="medium"
    @click="$emit('select', page)"
  >
    <slot>{{ page }}</slot>
  </AcvButton>
</template>

<style scoped></style>
