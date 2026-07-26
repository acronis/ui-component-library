<script setup>
  import AcvButton from '@/components/button/button.vue';
  import AcvTooltip from '@/components/tooltip/tooltip.vue';
  import { ref } from 'vue';

  const visible = ref(false);
</script>

<template>
  <AcvTooltip
    v-model="visible"
  >
    <AcvButton>
      Hover me
    </AcvButton>
    <template #content>
      <div>Tooltip content</div>
    </template>
  </AcvTooltip>
</template>
