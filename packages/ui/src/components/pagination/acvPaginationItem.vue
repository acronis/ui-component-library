<script lang="ts" setup>
  import { computed } from 'vue';
  import { RouterLink, useRoute } from 'vue-router';
  import AcvButton from '@/components/button/button.vue';
  import { getPaginationQuery } from '@/components/pagination/pagination-service.ts';

  const props = defineProps<{
    page: number
    active?: boolean
    disabled?: boolean
  }>();

  const route = useRoute();
  const query = computed(() => getPaginationQuery(route.query, props.page));
</script>

<template>
  <AcvButton
    :tag="RouterLink"
    :to="{ query }"
    :active="active"
    :disabled="disabled"
    type="ghost"
    size="medium"
  >
    <slot>{{ page }}</slot>
  </AcvButton>
</template>

<style scoped>

</style>
