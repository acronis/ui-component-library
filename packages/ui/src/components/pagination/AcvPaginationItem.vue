<script lang="ts" setup>
  import AcvButton from '@/components/button/button.vue';
  import type { AcvPaginationItemEvents, AcvPaginationItemProps } from '@/components';

  defineProps<AcvPaginationItemProps>();
  defineEmits<AcvPaginationItemEvents>();
</script>

<template>
  <AcvButton
    :selected="active"
    :disabled="disabled"
    type="ghost"
    size="medium"
    @click="$emit('select', page)"
  >
    <slot>{{ page }}</slot>
  </AcvButton>
</template>

<style scoped></style>
