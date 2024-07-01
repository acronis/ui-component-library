<script setup>
  import { ref } from 'vue';
  import AcvTooltip from '@/components/tooltip/tooltip.vue';
  import AcvButton from '@/components/button/button.vue';

  const visible = ref(true);
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
